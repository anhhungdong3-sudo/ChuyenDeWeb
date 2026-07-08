import axiosClient from "../api/axiosClient";

// Xác định nguồn API gốc để xử lý đường dẫn ảnh tuyệt đối
const API_ORIGIN = (
  process.env.REACT_APP_API_URL || "http://localhost:8080/api"
).replace(/\/api\/?$/, "");

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VND)
 * @param {number|string} value - Số tiền cần định dạng
 * @returns {string} Chuỗi định dạng (Ví dụ: 150.000 ₫)
 */
export const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

/**
 * Ánh xạ và chuyển đổi dữ liệu Sách từ Backend sang nhãn hiển thị cho người dùng
 * @param {Object} book - Đối tượng sách nguyên bản từ Backend
 * @returns {Object} Đối tượng sách đã được chuẩn hóa nhãn (Label)
 */
export const mapBook = (book) => ({
  ...book,
  categoryName:
    book.category?.name || book.categoryName || book.category || "Sách cũ",
  statusLabel:
    book.status === "APPROVED" || book.status === "AVAILABLE"
      ? "Đang bán"
      : book.status === "SOLD"
        ? "Đã bán"
        : book.status === "REJECTED"
          ? "Bị từ chối"
          : "Chờ duyệt",
  conditionLabel:
    {
      NEW: "Mới",
      LIKE_NEW: "Như mới",
      GOOD: "Tốt",
      FAIR: "Khá",
      POOR: "Cần phục hồi",
    }[book.bookCondition || book.condition] || "Tốt",
});

/**
 * Dịch vụ xử lý tất cả các tác vụ liên quan đến Sách (Book)
 */
export const bookService = {
  // Lấy toàn bộ danh sách sách (có hỗ trợ bộ lọc params)
  getAll: async (params = {}) => {
    const response = await axiosClient.get("/books", { params });
    return response.data.map(mapBook);
  },

  // Tìm kiếm sách theo từ khóa
  search: async (query) => {
    const response = await axiosClient.get("/books/search", {
      params: { query },
    });
    return response.data.map(mapBook);
  },

  // Lấy thông tin chi tiết của một cuốn sách theo ID
  getById: async (id) => {
    const response = await axiosClient.get(`/books/${id}`);
    return mapBook(response.data);
  },

  // Đăng tin bán một cuốn sách mới (User)
  create: async (payload) => {
    const response = await axiosClient.post("/books/sell", payload);
    return response.data;
  },

  // Cập nhật thông tin cuốn sách (Admin)
  update: async (id, payload) => {
    const response = await axiosClient.put(`/books/admin/${id}`, payload);
    return response.data;
  },

  // Xóa bỏ một cuốn sách khỏi hệ thống (Admin)
  remove: async (id) => {
    const response = await axiosClient.delete(`/books/admin/${id}`);
    return response.data;
  },

  // Lấy danh mục tất cả các thể loại sách
  getCategories: async () => {
    const response = await axiosClient.get("/books/categories");
    return response.data;
  },

  // Tải hình ảnh sách lên máy chủ và trả về đường dẫn ảnh tuyệt đối
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post("/books/upload-image", formData, {
      headers: { "Content-Type": undefined },
    });
    const relativeUrl = response.data.imageUrl || "";
    return { ...response.data, imageUrl: `${API_ORIGIN}${relativeUrl}` };
  },

  // Lấy danh sách các cuốn sách đang chờ phê duyệt (Admin)
  getPending: async () => {
    const response = await axiosClient.get("/books/admin/pending");
    return response.data.map(mapBook);
  },

  // Duyệt chấp thuận cho phép cuốn sách được hiển thị bán công khai (Admin)
  approve: async (id) => {
    const response = await axiosClient.put(`/books/admin/approve/${id}`);
    return response.data;
  },

  // Từ chối phê duyệt cuốn sách đăng tải (Admin)
  reject: async (id) => {
    const response = await axiosClient.put(`/books/admin/reject/${id}`);
    return response.data;
  },
};

/**
 * Dịch vụ sản phẩm (Bọc lại từ dịch vụ sách để tương thích hệ thống cũ)
 */
export const productService = {
  getAllProducts: bookService.getAll,
  getProductById: bookService.getById,
  createProduct: bookService.create,
  getCategories: bookService.getCategories,
};

/**
 * Dịch vụ xử lý Xác thực & Phân quyền tài khoản (Authentication)
 */
export const authService = {
  // Đăng ký thông tin tài khoản ban đầu để nhận mã OTP qua email
  registerPending: async (formData) => {
    const response = await axiosClient.post("/auth/register-pending", formData);
    return response.data;
  },

  // Xác nhận đăng ký tài khoản thành công bằng mã OTP
  registerConfirm: async (email, otpCode) => {
    const response = await axiosClient.post("/auth/register-confirm", {
      email,
      otpCode,
    });
    return response.data;
  },

  // Đăng nhập vào hệ thống
  login: async (loginData) => {
    const response = await axiosClient.post("/auth/login", loginData);
    return response.data;
  },

  // --- Bổ sung thêm hàm kiểm tra bất đồng bộ ngầm dưới cơ sở dữ liệu ---

  // Gọi API kiểm tra trùng tên đăng nhập
  checkUsername: async (username) => {
    const response = await axiosClient.get(
      `/auth/check-username?username=${encodeURIComponent(username)}`,
    );
    return response.data; // Server trả về dữ liệu mẫu dạng { exists: true / false }
  },

  // Gọi API kiểm tra trùng Email
  checkEmail: async (email) => {
    const response = await axiosClient.get(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
    );
    return response.data; // Server trả về dữ liệu mẫu dạng { exists: true / false }
  },
};

/**
 * SỬA ĐỔI CHÍNH TẠI ĐÂY: Dịch vụ xử lý thông tin Giỏ hàng (Cart)
 */
export const cartService = {
  // Lấy thông tin chi tiết giỏ hàng hiện tại của người dùng đăng nhập
  getCart: async () => {
    const response = await axiosClient.get("/cart");
    return response.data;
  },

  // Thêm một cuốn sách vào giỏ hàng
  addToCart: async (bookId) => {
    const response = await axiosClient.post(`/cart/add/${bookId}`);
    return response.data;
  },

  // Cập nhật số lượng của một mục sản phẩm trong giỏ hàng (Tăng/Giảm)
  updateQuantity: async (cartItemId, quantity) => {
    const response = await axiosClient.put(`/cart/update/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  // Xóa đơn lẻ một mục ra khỏi giỏ hàng khi nhấn biểu tượng thùng rác
  removeFromCart: async (cartItemId) => {
    const response = await axiosClient.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },

  // Xóa sạch hoàn toàn tất cả các mục sách có trong giỏ hàng hiện tại
  clearCart: async () => {
    const response = await axiosClient.delete("/cart/clear");
    return response.data;
  },

  // BỔ SUNG: Xóa hàng loạt các mục sách được đánh dấu tích chọn (Checkbox) trên giao diện
  removeMultiple: async (cartItemIds) => {
    const response = await axiosClient.post("/cart/remove-multiple", {
      cartItemIds: cartItemIds,
    });
    return response.data;
  },
};

// Định nghĩa nhãn ngôn ngữ tiếng Việt tương ứng cho các trạng thái đơn hàng
export const ORDER_STATUS_LABELS = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  COMPLETED: "Đã giao",
  CANCELLED: "Đã hủy",
};

/**
 * Ánh xạ dữ liệu đơn hàng từ Backend sang nhãn hiển thị trực quan
 * @param {Object} order - Dữ liệu đơn hàng nguyên bản
 */
export const mapOrder = (order) => ({
  ...order,
  statusLabel: ORDER_STATUS_LABELS[order.orderStatus] || "Chờ xử lý",
});

/**
 * Dịch vụ xử lý Đơn hàng & Thống kê doanh thu (Order)
 */
export const orderService = {
  // Thực hiện đặt hàng (Thanh toán COD hoặc tạo liên kết VNPay)
  placeOrder: async (payload) => {
    const response = await axiosClient.post("/orders/place", payload);
    return response.data;
  },

  // Xử lý phản hồi kết quả trả về từ cổng thanh toán VNPay
  vnPayReturn: async (params) => {
    const response = await axiosClient.get("/orders/vnpay-return", { params });
    return response.data;
  },

  // Lấy danh sách lịch sử mua hàng cá nhân của tài khoản hiện tại (User)
  getMyOrders: async () => {
    const response = await axiosClient.get("/orders/my-orders");
    return response.data.map(mapOrder);
  },

  // ================= CHỈNH SỬA TẠI 2 ĐƯỜNG DẪN ADMIN NÀY =================

  // Lấy toàn bộ danh sách đơn hàng toàn hệ thống để quản lý (Admin)
  getAllOrders: async () => {
    // Nếu axiosClient của bạn đã bọc sẵn tiền tố "/api/orders" -> Hãy sửa thành "/admin"
    // Nếu axiosClient của bạn chỉ bọc sẵn tiền tố "/api" -> Hãy giữ nguyên "/orders/admin"
    // Tuy nhiên theo lỗi 400 bạn gặp, axiosClient của bạn đang bọc sẵn hệ thống /api/orders.

    const response = await axiosClient.get("/orders/admin");
    return response.data.map(mapOrder);
  },

  // Cập nhật trạng thái xử lý giao nhận của đơn hàng (Admin)
  updateOrderStatus: async (id, orderStatus) => {
    // Tương tự, hãy kiểm tra kỹ đường dẫn này trùng khớp với cấu trúc axiosClient
    const response = await axiosClient.put(`/orders/admin/${id}/status`, {
      orderStatus,
    });
    return response.data;
  },

  // Lấy số liệu thống kê doanh thu bán hàng theo số ngày chỉ định (Admin Dashboard)
  getRevenueStats: async (days = 7) => {
    const response = await axiosClient.get("/orders/admin/revenue-stats", {
      params: { days },
    });
    return response.data;
  },
};

/**
 * Dịch vụ xử lý tin nhắn đàm thoại trực tuyến công khai (Chat)
 */
export const chatService = {
  // Tải lại lịch sử hội thoại chat giữa người dùng và chủ cửa hàng
  getHistory: async (userId, shopId) => {
    const response = await axiosClient.get("/chat/history", {
      params: { userId, shopId },
    });
    return response.data;
  },

  // Gửi nội dung tin nhắn chat mới đi
  sendMessage: async (userId, shopId, senderType, text) => {
    const response = await axiosClient.post("/chat/send", {
      userId,
      shopId,
      senderType,
      text,
    });
    return response.data;
  },
};

/**
 * Ánh xạ dữ liệu người dùng sang nhãn hiển thị giao diện phân quyền sạch
 * @param {Object} user - Đối tượng người dùng nguyên bản từ Database
 */
export const mapUser = (user) => ({
  ...user,
  roleLabel: user.role === "ADMIN" ? "Quản trị viên" : "Người dùng",
  statusLabel: user.enabled === false ? "Đã khóa" : "Hoạt động",
});

/**
 * Dịch vụ quản trị thông tin danh sách Người dùng hệ thống (Admin)
 */
export const userService = {
  // Lấy danh sách tất cả các tài khoản có trên hệ thống
  getAllUsers: async () => {
    const response = await axiosClient.get("/users/admin");
    return response.data.map(mapUser);
  },

  // Thay đổi quyền hạn phân vai của tài khoản (USER <-> ADMIN)
  updateUserRole: async (id, role) => {
    const response = await axiosClient.put(`/users/admin/${id}/role`, { role });
    return response.data;
  },

  // Khóa hoặc Mở khóa trạng thái hoạt động của tài khoản người dùng
  updateUserStatus: async (id, enabled) => {
    const response = await axiosClient.put(`/users/admin/${id}/status`, {
      enabled,
    });
    return response.data;
  },

  // Xóa tài khoản người dùng vĩnh viễn khỏi hệ thống
  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/users/admin/${id}`);
    return response.data;
  },
};
