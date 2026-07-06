import axiosClient from "../api/axiosClient";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:8080/api").replace(/\/api\/?$/, "");

export const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const mapBook = (book) => ({
  ...book,
  categoryName: book.category?.name || book.categoryName || book.category || "Sách cũ",
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

export const bookService = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get("/books", { params });
    return response.data.map(mapBook);
  },

  search: async (query) => {
    const response = await axiosClient.get("/books/search", { params: { query } });
    return response.data.map(mapBook);
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/books/${id}`);
    return mapBook(response.data);
  },

  create: async (payload) => {
    const response = await axiosClient.post("/books/sell", payload);
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosClient.get("/books/categories");
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post("/books/upload-image", formData, {
      headers: { "Content-Type": undefined },
    });
    const relativeUrl = response.data.imageUrl || "";
    return { ...response.data, imageUrl: `${API_ORIGIN}${relativeUrl}` };
  },

  getPending: async () => {
    const response = await axiosClient.get("/books/admin/pending");
    return response.data.map(mapBook);
  },

  approve: async (id) => {
    const response = await axiosClient.put(`/books/admin/approve/${id}`);
    return response.data;
  },

  reject: async (id) => {
    const response = await axiosClient.put(`/books/admin/reject/${id}`);
    return response.data;
  },
};

export const productService = {
  getAllProducts: bookService.getAll,
  getProductById: bookService.getById,
  createProduct: bookService.create,
  getCategories: bookService.getCategories,
};

export const authService = {
  registerPending: async (formData) => {
    const response = await axiosClient.post("/auth/register-pending", formData);
    return response.data;
  },

  registerConfirm: async (email, otpCode) => {
    const response = await axiosClient.post("/auth/register-confirm", { email, otpCode });
    return response.data;
  },

  login: async (loginData) => {
    const response = await axiosClient.post("/auth/login", loginData);
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await axiosClient.get("/cart");
    return response.data;
  },

  addToCart: async (bookId) => {
    const response = await axiosClient.post(`/cart/add/${bookId}`);
    return response.data;
  },

  updateQuantity: async (cartItemId, quantity) => {
    const response = await axiosClient.put(`/cart/update/${cartItemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (cartItemId) => {
    const response = await axiosClient.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },
};

export const orderService = {
  placeOrder: async (payload) => {
    const response = await axiosClient.post("/orders/place", payload);
    return response.data;
  },

  vnPayReturn: async (params) => {
    const response = await axiosClient.get("/orders/vnpay-return", { params });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await axiosClient.get("/orders/my-orders");
    return response.data;
  },
};

export const chatService = {
  getHistory: async (userId, shopId) => {
    const response = await axiosClient.get("/chat/history", { params: { userId, shopId } });
    return response.data;
  },

  sendMessage: async (userId, shopId, senderType, text) => {
    const response = await axiosClient.post("/chat/send", { userId, shopId, senderType, text });
    return response.data;
  },
};
