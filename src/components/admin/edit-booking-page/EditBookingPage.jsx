import { useNavigate, useParams } from "react-router";
import style from "./EditBookingPage.module.css";
import { useEffect, useState } from "react";
import {
  cancelBooking,
  getBookingByConfirmationCode,
} from "../../../service/ApiService";

function EditBookingPage() {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    async function fetchBookingDetails() {
      try {
        const response = await getBookingByConfirmationCode(bookingCode);
        setBookingDetails(response.booking);
      } catch (err) {
        setError(
          "Foglalás adatainak lekérése sikertelen: " +
            (err.response?.data?.message || err.message),
        );
      }
    }
    fetchBookingDetails();
  }, [bookingCode]);

  async function achieveBooking(bookingId) {
    if (
      !window.confirm(
        "Biztosan teljesítettnek jelölöd a foglalást? Ez a művelet visszafordíthatatlan!",
      )
    ) {
      return;
    }
    try {
      const response = await cancelBooking(bookingId);
      if (response.status === 200) {
        setSuccessMessage("Foglalás teljesítése sikeres!");
        setTimeout(() => {
          navigate("/admin/manage-bookings");
        }, 2000);
      }
    } catch (err) {
      setError(
        "Foglalás teljesítése sikertelen: " +
          (err.response?.data?.message || err.message),
      );
      setTimeout(() => setError(""), 5000);
    }
  }

  return (
    <div className={style.editBookingPage}>
      <h2>Foglalás Szerkesztése</h2>
      {error && <p className={style.error}>{error}</p>}
      {successMessage && <p className={style.success}>{successMessage}</p>}
      {bookingDetails && (
        <div>
          <div className={style.bookingDetails}>
            <h3>Foglalás részletei</h3>
            <p>
              <strong>Foglalási kód:</strong>{" "}
              {bookingDetails.bookingConfirmationCode}
            </p>
            <p>
              <strong>Felnőttek:</strong> {bookingDetails.numOfAdults}
            </p>
            <p>
              <strong>Gyerekek:</strong> {bookingDetails.numOfChildren}
            </p>
            <p>
              <strong>Érkezés:</strong> {bookingDetails.checkInDate}
            </p>
            <p>
              <strong>Távozás:</strong> {bookingDetails.checkOutDate}
            </p>
          </div>

          <br />
          <hr />
          <br />

          <h3>Foglaló adatai</h3>
          <div className={style.bookerDetails}>
            <p>
              <strong>Név:</strong> {bookingDetails.users?.name}
            </p>
            <p>
              <strong>Telefonszám:</strong> {bookingDetails.users?.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {bookingDetails.users?.email}
            </p>
          </div>

          <br />
          <hr />
          <br />

          <h3>Szoba adatai</h3>
          <div className={style.roomDetails}>
            <p>
              <strong>Szoba típus:</strong> {bookingDetails.room?.roomType}
            </p>
            <p>
              <strong>Ár:</strong> {bookingDetails.room?.roomPrice}
            </p>
            <p>
              <strong>Leírás:</strong> {bookingDetails.room?.roomDescription}
            </p>
            <img
              src={bookingDetails.room?.roomPhotoUrl}
              alt={bookingDetails.room?.roomType}
            />
          </div>
          <button onClick={() => achieveBooking(bookingDetails.id)}>
            Foglalás teljesítése
          </button>
        </div>
      )}
    </div>
  );
}

export default EditBookingPage;
