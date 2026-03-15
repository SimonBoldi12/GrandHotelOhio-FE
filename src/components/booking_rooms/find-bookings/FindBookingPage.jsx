import style from "./FindBookingPage.module.css";
import { getBookingByConfirmationCode } from "../../../service/ApiService";
import { useState } from "react";
import Toast from "../../common/toast/Toast";

function FindBookingPage() {
    const [confirmationCode, setConfirmationCode] = useState("");
    const [bookingDetails, setBookingDetails] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "error" });

    async function handleSearch() {
        if (!confirmationCode) {
            setToast({ message: "Kérem adja meg a foglalási kódot!", type: "warning" });
            return;
        }
        try {
            const response = await getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
        } catch (error) {
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        }
    }

    return (
        <div className={style.findBookingContainer}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />
            <h2>Keresés foglalás alapján</h2>
            <div className={style.searchContainer}>
                <input required type="text" placeholder="Foglalási kód" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
                <button onClick={handleSearch}>Keresés</button>
            </div>
            {bookingDetails && (
                <div className={style.bookingDetailsContainer}>
                    <h3>Foglalás részletei</h3>
                    <p>Kód: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Érkezés: {bookingDetails.checkInDate}</p>
                    <p>Távozás: {bookingDetails.checkOutDate}</p>
                    <p>Felnőttek száma: {bookingDetails.numOfAdults}</p>
                    <p>Gyerekek száma: {bookingDetails.numOfChildren}</p>
                    <br /><hr /><br />
                    <h3>Foglaló adatai</h3>
                    <p>Név: {bookingDetails.users.name}</p>
                    <p>Email: {bookingDetails.users.email}</p>
                    <p>Telefon: {bookingDetails.users.phoneNumber}</p>
                    <br /><hr /><br />
                    <h3>Szoba adatai</h3>
                    <p>Szoba típus: {bookingDetails.room.roomType}</p>
                    <img src={bookingDetails.room.roomPhotoUrl} alt="Szoba kép" />
                </div>
            )}
        </div>
    );
}

export default FindBookingPage;