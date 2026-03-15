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

// Auth
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

// Users
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

// Rooms
export const addRoom = async (roomData) => {
    const { data } = await api.post("/rooms/add", roomData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
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
        headers: {
            "Content-Type": "multipart/form-data"
        }
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

// Bookings
export const bookRoom = async (roomId, userId, booking) => {
    const { data } = await api.post(`/bookings/book-room/${roomId}/${userId}`, booking);
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

// Auth helpers
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