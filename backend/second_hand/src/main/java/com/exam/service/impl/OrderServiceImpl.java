package com.exam.service.impl;

import com.exam.dto.OrderRequest;
import com.exam.dto.RevenueStatsResponse;
import com.exam.entity.*;
import com.exam.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Value("${vnp.payUrl}")
    private String vnpPayUrl;

    @Value("${vnp.tmnCode}")
    private String vnpTmnCode;

    @Value("${vnp.hashSecret}")
    private String vnpHashSecret;

    @Value("${vnp.returnUrl}")
    private String vnpReturnUrl;

    // Đặt hàng COD - lưu đơn hàng trực tiếp
    @Transactional
    public Order placeOrder(Long userId, OrderRequest dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        Cart cart = cartRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống hoặc không tồn tại!"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống. Vui lòng thêm sách trước khi đặt hàng!");
        }

        Order order = new Order();
        order.setUser(user);
        order.setFullName(dto.getFullName());
        order.setPhone(dto.getPhone());
        order.setEmail(dto.getEmail());
        order.setCity(dto.getCity());
        order.setAddress(dto.getAddress());
        order.setNote(dto.getNote());
        order.setPaymentMethod(dto.getPaymentMethod());

        double totalAmount = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(cartItem.getBook());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getBook().getPrice());
            totalAmount += cartItem.getBook().getPrice() * cartItem.getQuantity();
            orderItems.add(orderItem);

            // Đánh dấu sách đã bán
            Book book = bookRepository.findByIdForUpdate(cartItem.getBook().getId())
                    .orElseThrow(() -> new RuntimeException("Sách không tồn tại!"));
            if (!"APPROVED".equals(book.getStatus())) {
                throw new RuntimeException("Sách \"" + book.getTitle() + "\" không còn sẵn sàng để đặt hàng!");
            }
            book.setStatus("SOLD");
            bookRepository.save(book);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setPaymentStatus("PENDING");
        order.setOrderStatus("PENDING");

        Order savedOrder = orderRepository.save(order);

        // Xóa giỏ hàng sau khi đặt hàng thành công
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    // Sinh URL chuyển hướng đến VNPAY
    public String createVnPayUrl(Long orderId, double amount, String ipAddr) {
        try {
            String vnpVersion = "2.1.0";
            String vnpCommand = "pay";
            String orderType = "other";
            long amountInVnd = (long) (amount * 100);

            String vnpTxnRef = String.valueOf(orderId);
            String vnpOrderInfo = "Thanh toan don hang OldBookstore #" + orderId;

            String vnpCreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String vnpExpireDate = new SimpleDateFormat("yyyyMMddHHmmss")
                    .format(new Date(System.currentTimeMillis() + 15 * 60 * 1000));

            Map<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", vnpVersion);
            vnpParams.put("vnp_Command", vnpCommand);
            vnpParams.put("vnp_TmnCode", vnpTmnCode);
            vnpParams.put("vnp_Amount", String.valueOf(amountInVnd));
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_TxnRef", vnpTxnRef);
            vnpParams.put("vnp_OrderInfo", vnpOrderInfo);
            vnpParams.put("vnp_OrderType", orderType);
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
            vnpParams.put("vnp_IpAddr", ipAddr);
            vnpParams.put("vnp_CreateDate", vnpCreateDate);
            vnpParams.put("vnp_ExpireDate", vnpExpireDate);

            // Xây dựng chuỗi hash data
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<Map.Entry<String, String>> itr = vnpParams.entrySet().iterator();
            while (itr.hasNext()) {
                Map.Entry<String, String> entry = itr.next();
                hashData.append(entry.getKey()).append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                        .append("=").append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append("&");
                    query.append("&");
                }
            }

            String secureHash = hmacSHA512(vnpHashSecret, hashData.toString());
            return vnpPayUrl + "?" + query + "&vnp_SecureHash=" + secureHash;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo URL thanh toán VNPAY: " + e.getMessage());
        }
    }

    // Xử lý kết quả trả về từ VNPAY sau khi người dùng thanh toán
    @Transactional
    public Map<String, Object> handleVnPayReturn(Map<String, String> vnpParams) {
        String vnpSecureHash = vnpParams.remove("vnp_SecureHash");

        // Sắp xếp và xây dựng chuỗi để xác thực
        Map<String, String> sortedParams = new TreeMap<>(vnpParams);
        StringBuilder signData = new StringBuilder();
        Iterator<Map.Entry<String, String>> itr = sortedParams.entrySet().iterator();
        while (itr.hasNext()) {
            Map.Entry<String, String> entry = itr.next();
            signData.append(entry.getKey()).append("=")
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            if (itr.hasNext())
                signData.append("&");
        }

        String checkHash = hmacSHA512(vnpHashSecret, signData.toString());

        Map<String, Object> result = new HashMap<>();
        if (checkHash.equals(vnpSecureHash)) {
            String responseCode = vnpParams.get("vnp_ResponseCode");
            String txnRef = vnpParams.get("vnp_TxnRef");

            if ("00".equals(responseCode)) {
                // Thanh toán thành công - cập nhật trạng thái đơn hàng
                orderRepository.findById(Long.parseLong(txnRef)).ifPresent(order -> {
                    order.setPaymentStatus("PAID");
                    order.setOrderStatus("PROCESSING");
                    orderRepository.save(order);
                });
                result.put("success", true);
                result.put("message", "Thanh toán thành công!");
            } else {
                result.put("success", false);
                result.put("message", "Thanh toán thất bại. Mã lỗi: " + responseCode);
            }
        } else {
            result.put("success", false);
            result.put("message", "Chữ ký không hợp lệ - giao dịch bị từ chối!");
        }
        return result;
    }

    // Lấy lịch sử đơn hàng của User
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Danh sách trạng thái đơn hàng hợp lệ
    private static final List<String> VALID_ORDER_STATUSES = List.of("PENDING", "PROCESSING", "SHIPPING", "COMPLETED",
            "CANCELLED");

    // Lấy tất cả đơn hàng (Chỉ ADMIN)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public RevenueStatsResponse getRevenueStats(int days) {
        int rangeDays = List.of(7, 15, 30).contains(days) ? days : 7;
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(rangeDays - 1L);
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDate firstDayOfYear = today.withDayOfYear(1);

        List<Order> completedOrders = orderRepository.findCompletedOrdersForRevenueStats("COMPLETED");

        Map<LocalDate, RevenueStatsResponse.DailyRevenue> dailyRevenueMap = new LinkedHashMap<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE;
        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("dd/MM");

        for (int i = 0; i < rangeDays; i++) {
            LocalDate date = startDate.plusDays(i);
            dailyRevenueMap.put(date, new RevenueStatsResponse.DailyRevenue(
                    date.format(dateFormatter),
                    date.format(labelFormatter),
                    0D,
                    0L
            ));
        }

        Map<String, CategoryAccumulator> categoryRevenue = new LinkedHashMap<>();
        double todayRevenue = 0D;
        double monthRevenue = 0D;
        double yearRevenue = 0D;
        long booksSold = 0L;

        for (Order order : completedOrders) {
            LocalDate deliveredDate = order.getDeliveredAt().toLocalDate();
            double orderRevenue = order.getTotalAmount() == null ? 0D : order.getTotalAmount();

            if (deliveredDate.equals(today)) {
                todayRevenue += orderRevenue;
            }
            if (!deliveredDate.isBefore(firstDayOfMonth) && !deliveredDate.isAfter(today)) {
                monthRevenue += orderRevenue;
            }
            if (!deliveredDate.isBefore(firstDayOfYear) && !deliveredDate.isAfter(today)) {
                yearRevenue += orderRevenue;
            }

            RevenueStatsResponse.DailyRevenue dailyRevenue = dailyRevenueMap.get(deliveredDate);
            if (dailyRevenue != null) {
                dailyRevenue.setRevenue(dailyRevenue.getRevenue() + orderRevenue);
                dailyRevenue.setOrders(dailyRevenue.getOrders() + 1);
            }

            for (OrderItem item : order.getItems()) {
                int quantity = item.getQuantity() == null ? 0 : item.getQuantity();
                booksSold += quantity;

                if (!deliveredDate.isBefore(startDate) && !deliveredDate.isAfter(today)) {
                    double itemRevenue = (item.getPrice() == null ? 0D : item.getPrice()) * quantity;
                    Book book = item.getBook();
                    String categoryName = book != null && book.getCategory() != null
                            ? book.getCategory().getName()
                            : "Chua phan loai";
                    CategoryAccumulator accumulator = categoryRevenue.computeIfAbsent(categoryName, key -> new CategoryAccumulator());
                    accumulator.revenue += itemRevenue;
                    accumulator.booksSold += quantity;
                }
            }
        }

        double totalCategoryRevenue = categoryRevenue.values().stream()
                .mapToDouble(accumulator -> accumulator.revenue)
                .sum();

        List<RevenueStatsResponse.CategoryRevenue> categoryRevenueList = categoryRevenue.entrySet().stream()
                .map(entry -> new RevenueStatsResponse.CategoryRevenue(
                        entry.getKey(),
                        entry.getValue().revenue,
                        entry.getValue().booksSold,
                        totalCategoryRevenue == 0D ? 0D : entry.getValue().revenue * 100D / totalCategoryRevenue
                ))
                .sorted(Comparator.comparing(RevenueStatsResponse.CategoryRevenue::getRevenue).reversed())
                .collect(Collectors.toList());

        return new RevenueStatsResponse(
                todayRevenue,
                monthRevenue,
                yearRevenue,
                (long) completedOrders.size(),
                booksSold,
                new ArrayList<>(dailyRevenueMap.values()),
                categoryRevenueList
        );
    }

    // Cập nhật trạng thái đơn hàng (Chỉ ADMIN)
    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        if (newStatus == null || !VALID_ORDER_STATUSES.contains(newStatus.toUpperCase())) {
            throw new RuntimeException("Trạng thái đơn hàng không hợp lệ!");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));

        // Không cho phép cập nhật nếu đơn hàng đã hoàn thành
        if ("COMPLETED".equals(order.getOrderStatus())) {
            throw new RuntimeException("Đơn hàng đã giao, không thể thay đổi trạng thái!");
        }

        newStatus = newStatus.toUpperCase();
        order.setOrderStatus(newStatus);

        // Khi chuyển sang COMPLETED lần đầu
        if ("COMPLETED".equals(newStatus)) {
            if (order.getDeliveredAt() == null) {
                order.setDeliveredAt(LocalDateTime.now());
            }
            // Nếu COD thì tự động thanh toán
            if ("cod".equalsIgnoreCase(order.getPaymentMethod())) {
                order.setPaymentStatus("PAID");
            }
        }
        return orderRepository.save(order);
    }

    // Thuật toán HMAC-SHA512 để ký dữ liệu VNPAY
    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : result)
                sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi tính toán HMAC: " + ex.getMessage());
        }
    }

    private static class CategoryAccumulator {
        private double revenue = 0D;
        private long booksSold = 0L;
    }
}
