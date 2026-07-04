package com.exam.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {

    @NotBlank(message = "Tiêu đề sách không được để trống")
    private String title;

    @NotBlank(message = "Tên tác giả không được để trống")
    private String author;

    @NotBlank(message = "Nhà xuất bản không được để trống")
    private String publisher;

    @NotNull(message = "Năm xuất bản không được để trống")
    @Min(value = 1000, message = "Năm xuất bản không hợp lệ")
    private Integer publishYear;

    @NotNull(message = "Số trang không được để trống")
    @Min(value = 1, message = "Số trang phải lớn hơn 0")
    private Integer pages;

    @NotNull(message = "Giá bán không được để trống")
    @Min(value = 1, message = "Giá bán phải lớn hơn 0")
    private Double price;

    private String imageUrl;

    @NotBlank(message = "Tình trạng sách không được để trống")
    private String bookCondition; // NEW, LIKE_NEW, GOOD, FAIR, POOR

    @NotNull(message = "Mã danh mục không được để trống")
    private Long categoryId;
}
