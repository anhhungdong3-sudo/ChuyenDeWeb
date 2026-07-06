package com.exam.service.impl;

import com.exam.dto.BookDTO;
import com.exam.entity.Book;
import com.exam.entity.BookCondition;
import com.exam.entity.Category;
import com.exam.repository.BookRepository;
import com.exam.repository.CategoryRepository;
import com.exam.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Book> getApprovedBooks() {
        return bookRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
    }

    @Override
    public List<Book> searchBooks(String query) {
        if (query == null || query.isBlank()) return getApprovedBooks();
        return bookRepository.searchApprovedBooks(query.trim());
    }

    @Override
    public List<Book> getApprovedBooksByCondition(String condition) {
        try {
            BookCondition bookCondition = BookCondition.valueOf(condition.toUpperCase());
            return bookRepository.findByStatusAndBookConditionOrderByCreatedAtDesc("APPROVED", bookCondition);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Tình trạng sách không hợp lệ: " + condition);
        }
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + id));
    }

    @Override
    public Book sellBook(BookDTO dto, Long userId) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại!"));

        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setPublisher(dto.getPublisher());
        book.setPublishYear(dto.getPublishYear());
        book.setPages(dto.getPages());
        book.setPrice(dto.getPrice());
        book.setQuantity(dto.getQuantity());
        book.setImageUrl(dto.getImageUrl());
        book.setStatus("PENDING_APPROVAL");
        book.setBookCondition(BookCondition.valueOf(dto.getBookCondition().toUpperCase()));
        book.setCategory(category);
        book.setShopId(userId);
        return bookRepository.save(book);
    }

    @Override
    public Book approveBook(Long id) {
        Book book = getBookById(id);
        book.setStatus("APPROVED");
        return bookRepository.save(book);
    }

    @Override
    public Book rejectBook(Long id) {
        Book book = getBookById(id);
        book.setStatus("REJECTED");
        return bookRepository.save(book);
    }

    @Override
    public List<Book> getPendingBooks() {
        return bookRepository.findByStatusOrderByCreatedAtAsc("PENDING_APPROVAL");
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

   @Override
    public Book createBook(BookDTO dto) {
    Category category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

    Book book = new Book();

    book.setTitle(dto.getTitle());
    book.setAuthor(dto.getAuthor());
    book.setPublisher(dto.getPublisher());
    book.setPublishYear(dto.getPublishYear());
    book.setPages(dto.getPages());
    book.setPrice(dto.getPrice());
    book.setQuantity(dto.getQuantity());
    book.setImageUrl(dto.getImageUrl());
    book.setCategory(category);
    book.setBookCondition(BookCondition.valueOf(dto.getBookCondition()));
    book.setStatus("APPROVED");
    book.setShopId(1L);
    return bookRepository.save(book);
}

    @Override
    public Book updateBook(Long id, BookDTO dto) {
        Book book = getBookById(id);

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại!"));

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setPublisher(dto.getPublisher());
        book.setPublishYear(dto.getPublishYear());
        book.setPages(dto.getPages());
        book.setPrice(dto.getPrice());
        book.setQuantity(dto.getQuantity());
        book.setImageUrl(dto.getImageUrl());
        book.setCategory(category);
        book.setBookCondition(BookCondition.valueOf(dto.getBookCondition().toUpperCase()));

        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        Book book = getBookById(id);
        bookRepository.delete(book);
    }
}
