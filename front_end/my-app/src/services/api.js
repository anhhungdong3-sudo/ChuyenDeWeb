import axios from "axios";

// Định nghĩa một URL gốc duy nhất cho toàn bộ Backend để dễ quản lý
const BASE_URL = "http://localhost:8080/api";

// 1. Quản lý các API liên quan đến sản phẩm
export const productService = {
  // Hàm lấy tất cả sản phẩm (Trang danh sách đã dùng)
  getAllProducts: async () => {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  },

  // CẢI TIẾN: Lấy chi tiết sản phẩm theo ID
  getProductById: async (id) => {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data; // Trả về object dữ liệu sản phẩm từ ProductDetailController
  },

  // Hàm đăng bán sản phẩm mới
  createProduct: async (productData) => {
    const response = await axios.post(`${BASE_URL}/products/add`, productData);
    return response.data;
  },
};

// 2. Quản lý các API liên quan đến chat
export const chatService = {
  // Lấy lịch sử tin nhắn
  getHistory: async (userId, shopId) => {
    const response = await axios.get(`${BASE_URL}/chat/history`, {
      params: { userId, shopId },
    });
    return response.data;
  },

  // Gửi tin nhắn mới
  sendMessage: async (userId, shopId, senderType, text) => {
    const response = await axios.post(`${BASE_URL}/chat/send`, {
      userId,
      shopId,
      senderType,
      text,
    });
    return response.data;
  },
};

// 3. Quản lý các API liên quan đến xác thực người dùng
export const authService = {
  // Bước 1: Gửi thông tin đăng ký để hệ thống tạo OTP và gửi về Gmail
  registerPending: async (formData) => {
    const response = await axios.post(
      `${BASE_URL}/auth/register-pending`,
      formData,
    );
    return response.data;
  },

  // Bước 2: Gửi mã OTP lên để xác thực và tạo tài khoản chính thức vào DB
  registerConfirm: async (email, otpCode) => {
    const response = await axios.post(`${BASE_URL}/auth/register-confirm`, {
      email: email,
      otpCode: otpCode,
    });
    return response.data;
  },

  // Hàm đăng nhập hệ thống
  login: async (loginData) => {
    // loginData gồm: { username, password }
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    if (response.data) {
      // Đăng nhập thành công thì lưu thông tin user vào localStorage để duy trì trạng thái đăng nhập
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },
};
