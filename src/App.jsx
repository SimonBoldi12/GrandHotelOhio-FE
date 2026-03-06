import "./App.css";
import Navbar from "./components/common/navbar/Navbar";
import Footer from "./components/common/footer/Footer";
import HomePage from "./components/home/HomePage";
import { Navigate, Route, Routes } from "react-router";
import AllRoomsPage from "./components/booking_rooms/all-rooms/AllRoomsPage";
import FindBookingPage from "./components/booking_rooms/find-bookings/FindBookingPage";
import RoomDetailsPage from "./components/booking_rooms/room-details/RoomDetailsPage";
import LoginPage from "./components/auth/login/LoginPage";
import RegisterPage from "./components/auth/register/RegisterPage";
import ProfilePage from "./components/profile/profile-page/ProfilePage";
import EditProfile from "./components/profile/edit-profile/EditProfile";
import { ProtectedRoute, AdminRoute} from "./service/Guard"
import AdminPage from "./components/admin/admin-page/AdminPage";

function App() {
  return (
    <div className="appCont">
      <Navbar />
      <main className="main">
        <Routes>
          {/* Public routes */ }
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<AllRoomsPage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated users routes */ }
          <Route path="/room-details-book/:roomId" element={ <ProtectedRoute element={<RoomDetailsPage />} /> } />
          <Route path="/profile" element={ <ProtectedRoute element={<ProfilePage />} /> } />
          <Route path="/edit-profile" element={ <ProtectedRoute element={<EditProfile />} /> } />
          <Route path="/find-booking" element={ <ProtectedRoute element={<FindBookingPage />} /> } />

          {/* Admin routes */ }
          <Route path="/admin" element={ <AdminRoute element={<AdminPage />} /> } />
          <Route path="*" element={<Navigate to="/home" />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
