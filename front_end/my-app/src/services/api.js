import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const authHeaders = () => {
  const userString = localStorage.getItem("user");
  if (!userString) return {};
  const user = JSON.parse(userString);
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const mapBookToProduct = (book) => ({
  ...book,
  category: book.category?.name || book.category || "",
  status: book.status === "APPROVED" ? "AVAILABLE" : book.status,
  condition: book.bookCondition || book.condition,
});

export const productService = {
  getAllProducts: async () => {
    const response = await axios.get(`${BASE_URL}/books`);
    return response.data.map(mapBookToProduct);
  },

  getProductById: async (id) => {
    const response = await axios.get(`${BASE_URL}/books/${id}`);
    return mapBookToProduct(response.data);
  },

  createProduct: async (productData) => {
    const response = await axios.post(`${BASE_URL}/books/sell`, productData, {
      headers: authHeaders(),
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${BASE_URL}/books/categories`);
    return response.data;
  },
};

export const chatService = {
  getHistory: async (userId, shopId) => {
    const response = await axios.get(`${BASE_URL}/chat/history`, {
      params: { userId, shopId },
      headers: authHeaders(),
    });
    return response.data;
  },

  sendMessage: async (userId, shopId, senderType, text) => {
    const response = await axios.post(
      `${BASE_URL}/chat/send`,
      { userId, shopId, senderType, text },
      { headers: authHeaders() },
    );
    return response.data;
  },
};

export const authService = {
  registerPending: async (formData) => {
    const response = await axios.post(`${BASE_URL}/auth/register-pending`, formData);
    return response.data;
  },

  registerConfirm: async (email, otpCode) => {
    const response = await axios.post(`${BASE_URL}/auth/register-confirm`, {
      email,
      otpCode,
    });
    return response.data;
  },

  login: async (loginData) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },
};
