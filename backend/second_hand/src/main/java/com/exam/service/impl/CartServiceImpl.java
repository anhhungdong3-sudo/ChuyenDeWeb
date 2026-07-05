package com.exam.service.impl;

import com.exam.entity.Book;
import com.exam.entity.Cart;
import com.exam.entity.CartItem;
import com.exam.entity.User;
import com.exam.repository.BookRepository;
import com.exam.repository.CartItemRepository;
import com.exam.repository.CartRepository;
import com.exam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // Lấy hoặc tạo giỏ hàng cho user
    private Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    // Lấy giỏ hàng hiện tại của user
    public Cart getCart(Long userId) {
        return getOrCreateCart(userId);
    }

    // Thêm sách vào giỏ hoặc tăng số lượng nếu đã có
    @Transactional
    public Cart addToCart(Long userId, Long bookId) {
        Book book = bookRepository.findByIdForUpdate(bookId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách!"));
        if (!"APPROVED".equals(book.getStatus())) {
            throw new RuntimeException("Sách này hiện không còn bán!");
        }

        Cart cart = getOrCreateCart(userId);
        CartItem existingItem = cartItemRepository.findByCartIdAndBookIdForUpdate(cart.getId(), bookId).orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + 1);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setBook(book);
            newItem.setQuantity(1);
            cartItemRepository.save(newItem);
        }

        return cartRepository.findById(cart.getId()).orElseThrow();
    }

    // Cập nhật số lượng sách trong giỏ (đồng bộ với DB để tránh race condition)
    @Transactional
    public Cart updateQuantity(Long userId, Long cartItemId, int newQuantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByIdForUpdate(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng!"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Không có quyền chỉnh sửa giỏ hàng này!");
        }

        if (newQuantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        }

        return cartRepository.findById(cart.getId()).orElseThrow();
    }

    // Xóa một mục khỏi giỏ hàng
    @Transactional
    public Cart removeFromCart(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByIdForUpdate(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng!"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Không có quyền xóa mục này!");
        }

        cartItemRepository.delete(item);
        return cartRepository.findById(cart.getId()).orElseThrow();
    }
}
