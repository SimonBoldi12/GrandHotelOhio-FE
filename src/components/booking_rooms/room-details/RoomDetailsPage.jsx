import style from "./RoomDetailsPage.module.css";
import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  bookRoom,
  getRoomById,
  getUserProfile,
} from "../../../service/ApiService";
import DatePicker from "react-datepicker";
import { hu } from "date-fns/locale";

function RoomDetailsPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numOfAdults, setNumOfAdults] = useState(1);
  const [numOfChildren, setNumOfChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await getUserProfile();
        setUserId(userProfile.users.id);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [roomId]);

  async function handleConfirmBooking() {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Kérem válassza ki a be- és kijelentkezési dátumot.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (isNaN(numOfAdults) || numOfAdults < 1 || isNaN(numOfChildren) || numOfChildren < 0) {
      setErrorMessage("Kérem válassza ki a felnőttek és gyermekek számát.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (checkInDate && checkOutDate && checkInDate > checkOutDate) {
      setErrorMessage(
        "A kijelentkezési dátum nem lehet korábbi, mint a bejelentkezési dátum.",
      );
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    const totalGuests = numOfAdults + numOfChildren;

    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = totalDays * roomPricePerNight;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  }

  async function acceptBooking() {
    try {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      const formattedCheckInDate = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split("T")[0];
      const formattedCheckOutDate = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split("T")[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numOfAdults,
        numOfChildren: numOfChildren,
      };

      const response = await bookRoom(roomId, userId, booking);
      if (response.status === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate("/rooms");
        }, 5000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  }

  if (isLoading) {
    return <div className={style.loading}>Szoba adatok betöltése...</div>;
  }

  if (error) {
    return <div className={style.error}>Hiba történt: {error}</div>;
  }

  const { roomType, roomPrice, roomPhotoUrl, description, bookings } = roomDetails;

  return (
    <div className={style.roomDetailsContainer}>
      {showMessage && (
        <p className={style.bookingSuccessMessage}>
          Sikeres foglalás! Foglalási kód: {confirmationCode}.
        </p>
      )}
      {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
      <h2>Szoba adatai</h2>
      <br />
      <img src={roomPhotoUrl} alt={roomType} className={style.roomDetailsImage} />
      <div className={style.roomDetailsInfo}>
        <h3>{roomType}</h3>
        <p>Ár: ${roomPrice} / éjszaka</p>
        <p>{description}</p>
      </div>
      <div className={style.bookingInfo}>
        <button
          className={style.bookNowButton} 
          onClick={() => setShowDatePicker(true)}
        >
          Foglalj most
        </button>
        <button
          className={style.goBackButton}
          onClick={() => setShowDatePicker(false)}
        >
          Vissza
        </button>
        {showDatePicker && (
          <div className={style.datePickerContainer}>
            <DatePicker
              className={style.detailSearchField}
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Érkezés dátuma"
              dateFormat="dd/MM/yyyy"
              locale={hu}
            />
            <DatePicker
              className={style.detailSearchField}
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Távozás dátuma"
              dateFormat="dd/MM/yyyy"
              locale={hu}
            />

            <div className={style.guestContainer}>
              <div className={style.guestDiv}>
                <label>Felnőttek:</label>
                <input
                  type="number"
                  min="1"
                  value={numOfAdults}
                  onChange={(e) => setNumOfAdults(parseInt(e.target.value))}
                />
              </div>
              <div className={style.guestDiv}>
                <label>Gyerekek:</label>
                <input
                  type="number"
                  min="0"
                  value={numOfChildren}
                  onChange={(e) => setNumOfChildren(parseInt(e.target.value))}
                />
              </div>
              <button
                className={style.confirmBookingButton}
                onClick={handleConfirmBooking}
              >
                Foglalás megerősítése
              </button>
            </div>
          </div>
        )}
        {totalPrice > 0 && (
          <div className={style.totalPriceContainer}>
            <p>Összes ár: ${totalPrice}</p>
            <p>Összes vendég: {totalGuests}</p>
            <button onClick={acceptBooking} className={style.acceptBookingButton}>
              Foglalás elfogadása
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomDetailsPage;
