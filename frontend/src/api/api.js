import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});
API.interceptors.request.use((c) => {
    const t = localStorage.getItem("token");
    if (t) c.headers.Authorization = `Token ${t}`;
    return c;
});

export const loginUser = (d) => API.post("/auth/login/", d);
export const registerUser = (d) => API.post("/auth/register/", d);
export const getProfile = () => API.get("/auth/profile/");
export const deleteAccount = () => API.delete("/auth/delete-account/");
export const getProducts = (p) => API.get("/products/", { params: p });
export const createProduct = (fd) =>
    API.post("/products/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const getTags = () => API.get("/tags/");
export const getOrders = () => API.get("/orders/");
export const createOrder = (d) => API.post("/orders/", d);
export const getDashboardStats = () => API.get("/dashboard/stats/");
export const updateOrderStatus = (id, d) =>
    API.patch(`/orders/${id}/update_status/`, d);
export const getMyProducts = () => API.get("/my-products/");
export const editProduct = (id, d) => API.patch(`/my-products/${id}/edit/`, d);
export const deleteProduct = (id) => API.delete(`/my-products/${id}/delete/`);
export default API;
