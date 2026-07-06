package com.exam.service;

import com.exam.dto.BookDTO;
import com.exam.entity.Book;
import java.util.List;

public interface BookService {
    List<Book> getApprovedBooks();
    List<Book> searchBooks(String query);
    List<Book> getApprovedBooksByCondition(String condition);
    Book getBookById(Long id);
    Book sellBook(BookDTO dto, Long userId);
    Book approveBook(Long id);
    Book rejectBook(Long id);
    List<Book> getPendingBooks();
    List<Book> getAllBooks();
    Book createBook(BookDTO dto);
}
