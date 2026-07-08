package com.exam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotBlank(message = "Họ và tên người nhận không được để trống")
    private String fullName;

    @NotBlank(message = "Số điện thoại nhận hàng không được để trống")
    private String phone;

    private String email;

    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String city;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String address;

    private String note;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod; // cod, vnpay

    // === THÊM TRƯỜNG NÀY ===
    private List<Long> cartItemIds;
}
