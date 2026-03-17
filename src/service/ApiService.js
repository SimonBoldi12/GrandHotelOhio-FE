import axios from "axios";
import Cookies from "js-cookie";

const parseJwt = (token) => {
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(payload);
    } catch {
        return null;
    }
};

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── AUTH ──
export const registerUser = async (registration) => {
    const { data } = await api.post("/auth/register", registration);
    return data;
};

export const loginUser = async (loginDetails) => {
    const { data } = await api.post("/auth/login", loginDetails);
    if (data.token) {
        Cookies.set("token", data.token, { expires: 7, sameSite: "Strict" });
    }
    return data;
};

export const logout = () => {
    Cookies.remove("token");
};

export const isAuthenticated = () => !!Cookies.get("token");

export const isAdmin = () => {
    const token = Cookies.get("token");
    if (!token) return false;
    return parseJwt(token)?.role === "ADMIN";
};

export const isUser = () => {
    const token = Cookies.get("token");
    if (!token) return false;
    return parseJwt(token)?.role === "USER";
};

export const isStaff = () => {
    const token = Cookies.get("token");
    if (!token) return false;
    return parseJwt(token)?.role === "STAFF";
};

export const getLoggedInUserName = () => {
    const token = Cookies.get("token");
    if (!token) return "";
    return parseJwt(token)?.sub || "";
};

export const getLoggedInUserEmail = () => {
    const token = Cookies.get("token");
    if (!token) return "";
    return parseJwt(token)?.sub || "";
};

// ── USERS ──
export const getAllUsers = async () => {
    const { data } = await api.get("/users/all");
    return data;
};

export const getUserProfile = async () => {
    const { data } = await api.get("/users/get-logged-in-profile-info");
    return data;
};

export const getUser = async (userId) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
};

export const getUserBookings = async (userId) => {
    const { data } = await api.get(`/users/get-user-bookings/${userId}`);
    return data;
};

export const deleteUser = async (userId) => {
    const { data } = await api.delete(`/users/delete/${userId}`);
    return data;
};

// ── ROOMS ──
export const addRoom = async (roomData) => {
    const { data } = await api.post("/rooms/add", roomData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

export const getAllAvailableRooms = async () => {
    const { data } = await api.get("/rooms/all-available-rooms");
    return data;
};

export const getAvailableRoomsByDateAndType = async (checkInDate, checkOutDate, roomType) => {
    const { data } = await api.get("/rooms/available-rooms-by-date-and-type", {
        params: { checkInDate, checkOutDate, roomType },
    });
    return data;
};

export const getRoomTypes = async () => {
    const { data } = await api.get("/rooms/types");
    return data;
};

export const getAllRooms = async () => {
    const { data } = await api.get("/rooms/all");
    return data;
};

export const getRoomById = async (roomId) => {
    const { data } = await api.get(`/rooms/room-by-id/${roomId}`);
    return data;
};

export const deleteRoom = async (roomId) => {
    const { data } = await api.delete(`/rooms/delete/${roomId}`);
    return data;
};

export const updateRoom = async (roomId, roomData) => {
    const { data } = await api.put(`/rooms/update/${roomId}`, roomData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

export const addImageToRoom = async (roomId, photo) => {
    const formData = new FormData();
    formData.append("photo", photo);
    const { data } = await api.post(`/rooms/${roomId}/add-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

// ── AMENITIES ──
export const addAmenityToRoom = async (roomId, name, icon) => {
    const { data } = await api.post(`/rooms/${roomId}/add-amenity`, null, {
        params: { name, icon }
    });
    return data;
};

export const deleteAmenity = async (amenityId) => {
    const { data } = await api.delete(`/rooms/amenity/delete/${amenityId}`);
    return data;
};

export const deleteAmenityFromRoom = async (amenityId) => {
    const { data } = await api.delete(`/rooms/amenity/delete/${amenityId}`);
    return data;
};

// ── MEAL PLANS ──
export const getAllMealPlans = async () => {
    const { data } = await api.get("/meal-plans/all");
    return data;
};

export const addMealPlan = async (type, name, pricePerNight) => {
    const { data } = await api.post("/meal-plans/add", null, {
        params: { type, name, pricePerNight }
    });
    return data;
};

export const updateMealPlan = async (id, name, pricePerNight) => {
    const { data } = await api.put(`/meal-plans/update/${id}`, null, {
        params: { name, pricePerNight }
    });
    return data;
};

export const deleteMealPlan = async (id) => {
    const { data } = await api.delete(`/meal-plans/delete/${id}`);
    return data;
};

export const addMealPlanToRoom = async (roomId, mealPlanId) => {
    const { data } = await api.post(`/rooms/${roomId}/meal-plan/${mealPlanId}`);
    return data;
};

export const removeMealPlanFromRoom = async (roomId, mealPlanId) => {
    const { data } = await api.delete(`/rooms/${roomId}/meal-plan/${mealPlanId}`);
    return data;
};

// ── SERVICES ──
export const getAllServices = async () => {
    const { data } = await api.get("/services/all");
    return data;
};

export const addService = async (category, name, description, price, photo) => {
    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if (photo) formData.append("photo", photo);
    const { data } = await api.post("/services/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

export const getServicesByCategory = async (category) => {
    const { data } = await api.get(`/services/category/${category}`);
    return data;
};

export const updateService = async (id, params) => {
    const { data } = await api.put(`/services/update/${id}`, null, { params });
    return data;
};

export const deleteService = async (id) => {
    const { data } = await api.delete(`/services/delete/${id}`);
    return data;
};

export const addServiceToBooking = async (bookingId, serviceId) => {
    const { data } = await api.post(`/bookings/${bookingId}/add-service/${serviceId}`);
    return data;
};

// ── GALLERY ──
export const getAllGallery = async () => {
    const { data } = await api.get("/gallery/all");
    return data;
};

export const getGalleryByCategory = async (category) => {
    const { data } = await api.get(`/gallery/category/${category}`);
    return data;
};

export const addGalleryImage = async (formData) => {
    const { data } = await api.post("/gallery/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
};

export const deleteGalleryImage = async (id) => {
    const { data } = await api.delete(`/gallery/delete/${id}`);
    return data;
};

// ── BOOKINGS ──
export const bookRoom = async (roomId, userId, booking, mealPlanId) => {
    const { data } = await api.post(
        `/bookings/book-room/${roomId}/${userId}`,
        booking,
        { params: mealPlanId ? { mealPlanId } : {} }
    );
    return data;
};

export const getAllBookings = async () => {
    const { data } = await api.get("/bookings/all");
    return data;
};

export const getBookingByConfirmationCode = async (bookingCode) => {
    const { data } = await api.get(`/bookings/get-by-confirmation-code/${bookingCode}`);
    return data;
};

export const cancelBooking = async (bookingId) => {
    const { data } = await api.delete(`/bookings/cancel/${bookingId}`);
    return data;
};