package com.exam.controller;

import com.exam.dto.BookDTO;
import com.exam.entity.Book;
import com.exam.entity.Category;
import com.exam.repository.CategoryRepository;
import com.exam.security.JwtTokenProvider;
import com.exam.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Lấy danh sách tất cả sách đã được phê duyệt (Công khai)
    @GetMapping
    public ResponseEntity<List<Book>> getAllApprovedBooks(
            @RequestParam(required = false) String condition) {
        if (condition != null && !condition.isBlank()) {
            return ResponseEntity.ok(bookService.getApprovedBooksByCondition(condition));
        }
        return ResponseEntity.ok(bookService.getApprovedBooks());
    }

    // Tìm kiếm AJAX theo tiêu đề/tác giả với debounce từ Frontend (Công khai)
    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.searchBooks(query));
    }

    // Lấy danh sách tất cả danh mục sách (Công khai)
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // Lấy chi tiết một cuốn sách theo ID (Công khai)
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    // Đăng bán sách mới - trạng thái ban đầu PENDING_APPROVAL (Cần đăng nhập)
    @PostMapping("/sell")
    public ResponseEntity<?> sellBook(
            @Valid @RequestBody BookDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtTokenProvider.getUserIdFromJWT(token);
        Book savedBook = bookService.sellBook(dto, userId);
        return ResponseEntity.ok(Map.of(
            "message", "Đăng sách thành công! Sách đang chờ Admin phê duyệt.",
            "book", savedBook
        ));
    }

    // === ADMIN ENDPOINTS ===

    // Lấy danh sách sách đang chờ duyệt (Chỉ ADMIN)
    @GetMapping("/admin/pending")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<List<Book>> getPendingBooks() {
        return ResponseEntity.ok(bookService.getPendingBooks());
    }

    // Phê duyệt sách (Chỉ ADMIN)
    @PutMapping("/admin/approve/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> approveBook(@PathVariable Long id) {
        Book book = bookService.approveBook(id);
        return ResponseEntity.ok(Map.of("message", "Sách đã được phê duyệt thành công!", "book", book));
    }

    // Từ chối sách (Chỉ ADMIN)
    @PutMapping("/admin/reject/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> rejectBook(@PathVariable Long id) {
        Book book = bookService.rejectBook(id);
        return ResponseEntity.ok(Map.of("message", "Sách đã bị từ chối.", "book", book));
    }
}
