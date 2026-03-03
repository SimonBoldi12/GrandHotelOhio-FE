import "./App.css";
import Navbar from "./components/common/navbar/Navbar";
import Footer from "./components/common/footer/Footer";
import HomePage from "./components/home/HomePage";
import { Route, Routes } from "react-router";
import AllRoomsPage from "./components/booking_rooms/all-rooms/AllRoomsPage";
import FindBookingPage from "./components/booking_rooms/find-bookings/FindBookingPage";
import RoomDetailsPage from "./components/booking_rooms/room-details/RoomDetailsPage";
import LoginPage from "./components/auth/login/LoginPage";
import RegisterPage from "./components/auth/register/RegisterPage";

function App() {
  return (
    <div className="appCont">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<AllRoomsPage />} />
          <Route path="/find-booking" element={<FindBookingPage />} />
          <Route path="/room-details-book/:roomId" element={<RoomDetailsPage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
