package com.exam.service.impl;

import com.exam.entity.Book;
import com.exam.entity.Cart;
import com.exam.entity.CartItem;
import com.exam.entity.User;
import com.exam.repository.BookRepository;
import com.exam.repository.CartItemRepository;
import com.exam.repository.CartRepository;
import com.exam.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.List;

@Service
public class CartServiceImpl {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Lấy hoặc tạo mới giỏ hàng với Pessimistic Lock để đồng bộ hóa.
     * Xử lý cả trường hợp tranh chấp tạo mới giỏ hàng (Race Condition).
     */
    private Cart getOrCreateCartForUpdate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        
        try {
            return cartRepository.findByUserIdForUpdate(userId)
                    .orElseGet(() -> {
                        Cart newCart = new Cart();
                        newCart.setUser(user);
                        return cartRepository.save(newCart);
                    });
        } catch (DataIntegrityViolationException e) {
            return cartRepository.findByUserIdForUpdate(userId)
                    .orElseThrow(() -> new RuntimeException("Lỗi đồng bộ hóa tạo giỏ hàng!"));
        }
    }

    public Cart getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        try {
            return cartRepository.findByUserId(userId).orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setUser(user);
                return cartRepository.save(newCart);
            });
        } catch (DataIntegrityViolationException e) {
            return cartRepository.findByUserId(userId).orElseThrow();
        }
    }

    @Transactional
    public Cart addToCart(Long userId, Long bookId) {
        Book book = bookRepository.findByIdForUpdate(bookId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách!"));
        if (!"APPROVED".equals(book.getStatus())) {
            throw new RuntimeException("Sách này hiện không còn bán!");
        }

        Cart cart = getOrCreateCartForUpdate(userId);
        CartItem existingItem = cartItemRepository.findByCartIdAndBookIdForUpdate(cart.getId(), bookId).orElse(null);

        if (existingItem != null) {
            // KIỂM TRA TỒN KHO: Số lượng hiện tại trong giỏ + 1 vượt quá tồn kho
            if (existingItem.getQuantity() + 1 > book.getQuantity()) { // Thay getQuantity() bằng tên biến tồn kho của bạn
                throw new IllegalArgumentException("Số lượng sách trong kho không đủ! (Hiện còn: " + book.getQuantity() + ")");
            }
            existingItem.setQuantity(existingItem.getQuantity() + 1);
            cartItemRepository.save(existingItem);
        } else {
            // KIỂM TRA TỒN KHO: Khi thêm mới 1 mục, phải đảm bảo kho có ít nhất 1 cuốn
            if (book.getQuantity() < 1) {
                throw new IllegalArgumentException("Sách này đã hết hàng trong kho!");
            }
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setBook(book);
            newItem.setQuantity(1);
            cartItemRepository.save(newItem);
        }

        entityManager.flush();
        entityManager.clear();
        
        return cartRepository.findByUserId(userId).orElseThrow();
    }

    @Transactional
    public Cart updateQuantity(Long userId, Long cartItemId, int newQuantity) {
        Cart cart = getOrCreateCartForUpdate(userId);
        CartItem item = cartItemRepository.findByIdForUpdate(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng!"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Không có quyền chỉnh sửa giỏ hàng này!");
        }

        if (newQuantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            // FIX BUG: Trước đây hàm này thiếu bước kiểm tra tồn kho, cho phép
            // người dùng tăng số lượng vượt quá số sách thực tế còn trong kho.
            // Bổ sung lại việc khóa & kiểm tra Book giống hệt logic trong addToCart()
            // để đảm bảo tính nhất quán dữ liệu, tránh bán vượt tồn kho.
            Book book = item.getBook();
            if (newQuantity > book.getQuantity()) {
                throw new IllegalArgumentException(
                        "Không thể cập nhật! Chỉ còn " + book.getQuantity() + " cuốn trong kho.");
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        }

        entityManager.flush();
        entityManager.clear();
        return cartRepository.findByUserId(userId).orElseThrow();
    }

    @Transactional
    public Cart removeFromCart(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCartForUpdate(userId);
        CartItem item = cartItemRepository.findByIdForUpdate(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng!"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Không có quyền xóa mục này!");
        }

        cartItemRepository.delete(item);
        
        entityManager.flush();
        entityManager.clear();
        return cartRepository.findByUserId(userId).orElseThrow();
    }

    @Transactional
    public Cart clearCart(Long userId) {
        Cart cart = getOrCreateCartForUpdate(userId);
        cartItemRepository.deleteByCartId(cart.getId()); 
        
        entityManager.flush();
        entityManager.clear();
        return cartRepository.findByUserId(userId).orElseThrow();
    }

    @Transactional
    public Cart removeMultipleFromCart(Long userId, List<Long> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            return cartRepository.findByUserId(userId).orElseThrow();
        }
        
        Cart cart = getOrCreateCartForUpdate(userId);
        
        // Gọi hàm xóa đồng bộ theo Cart ID và danh sách ID mục chọn
        cartItemRepository.deleteByCartIdAndIdsIn(cart.getId(), cartItemIds);
        
        entityManager.flush();
        entityManager.clear();
        return cartRepository.findByUserId(userId).orElseThrow();
    }
}