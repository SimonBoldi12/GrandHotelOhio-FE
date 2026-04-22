import { useState, useEffect } from "react";
import style from "./RoomSearch.module.css";
import {
  getRoomTypes,
  getAvailableRoomsByDateAndType,
  getAllRooms,
} from "../../../service/ApiService";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { hu } from "date-fns/locale";
import Toast from "../toast/Toast";
import { useNavigate } from "react-router";

function RoomSearch({ handleSearchResult }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "error" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error("Hiba a szobatípusok lekérésekor:", error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleInternalSearch = async () => {
    if (!startDate || !endDate) {
      setToast({
        message: "Kérem válassza ki az érkezési és távozási dátumot.",
        type: "warning",
      });
      return;
    }
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      let response;
      if (!roomType || roomType === "") {
        response = await getAvailableRoomsByDateAndType(
          formattedStartDate,
          formattedEndDate,
          "",
        );
      } else {
        response = await getAvailableRoomsByDateAndType(
          formattedStartDate,
          formattedEndDate,
          roomType,
        );
      }

      if (response.status === 200) {
        if (response.roomList.length === 0) {
          setToast({ message: "Nem található elérhető szoba.", type: "info" });
          return;
        }
        const s = startDate.toISOString().split("T")[0];
        const e = endDate.toISOString().split("T")[0];
        handleSearchResult(response.roomList, s, e);
      }
    } catch (error) {
      setToast({
        message:
          "Ismeretlen hiba történt: " +
          (error.response?.data?.message || error.message),
        type: "error",
      });
    }
  };

  const getDateParams = () => {
    if (!startDate || !endDate) return "";
    const s = startDate.toISOString().split("T")[0];
    const e = endDate.toISOString().split("T")[0];
    return `?checkIn=${s}&checkOut=${e}`;
  };

  return (
    <section className={style.section}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
      <div className={style.searchContainer}>
        <div className={style.searchField}>
          <label>Érkezés dátuma</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Érkezés dátuma"
            className={style.dateInput}
            locale={hu}
          />
        </div>

        <div className={style.searchField}>
          <label>Távozás dátuma</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Távozás dátuma"
            className={style.dateInput}
            locale={hu}
          />
        </div>

        <div className={style.searchField}>
          <label>Szobatípus</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="">Összes szobatípus</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button className={style.searchButton} onClick={handleInternalSearch}>
          Szobák keresése
        </button>
      </div>
    </section>
  );
}

export default RoomSearch;
