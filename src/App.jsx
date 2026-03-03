import "./App.css";
import Navbar from "./components/common/navbar/Navbar";
import Footer from "./components/common/footer/Footer";
import HomePage from "./components/home/HomePage";
import { Route, Routes } from "react-router";
import AllRoomsPage from "./components/booking_rooms/all-rooms/AllRoomsPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<AllRoomsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
