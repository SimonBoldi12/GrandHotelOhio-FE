import { useState, useEffect } from "react";
import style from "./RoomSearch.module.css";
import {
  getRoomTypes,
  getAvailableRoomsByDateAndType,
} from "../../../service/ApiService";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { hu } from "date-fns/locale";

function RoomSearch({ handleSearchResult }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error("Error fetching room types:", error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, timeout);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError("Minden mező kitöltése kötelező.");
      return false;
    }
    try {
      const formattedStartDate = startDate
        ? startDate.toISOString().split("T")[0]
        : null;
      const formattedEndDate = endDate
        ? endDate.toISOString().split("T")[0]
        : null;

      const response = await getAvailableRoomsByDateAndType(
        formattedStartDate,
        formattedEndDate,
        roomType,
      );
      console.log(response);

      if (response.status === 200) {
        if (response.roomList.length === 0) {
          showError(
            "A kiválasztott szobatípus nem érhető el a megadott időszakra.",
          );
          return;
        }
        handleSearchResult(response.roomList);
        setError("");
      }
    } catch (error) {
      showError(
        "Ismeretlen hiba történt: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <section className={style.section}>
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
            <option disabled value="">
              Szobatípus kiválasztása
            </option>
            {roomTypes.map((roomType) => (
              <option key={roomType} value={roomType}>
                {roomType}
              </option>
            ))}
          </select>
        </div>

        <button className={style.searchButton} onClick={handleInternalSearch}>
          Szobák keresése
        </button>
      </div>

      {error && <p className={style.errorMessage}>{error}</p>}
    </section>
  );
}

export default RoomSearch;
