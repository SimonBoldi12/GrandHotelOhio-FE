import { useNavigate, useParams } from "react-router";
import style from "./EditBookingPage.module.css";
import { useEffect, useState } from "react";
import { cancelBooking, getBookingByConfirmationCode } from "../../../service/ApiService";
import Toast from "../../common/toast/Toast";

function EditBookingPage() {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "success" });

    useEffect(() => {
        async function fetchBookingDetails() {
            try {
                const response = await getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (err) {
                setToast({ message: "Foglalás adatainak lekérése sikertelen: " + (err.response?.data?.message || err.message), type: "error" });
            }
        }
        fetchBookingDetails();
    }, [bookingCode]);

    async function achieveBooking(bookingId) {
        if (!window.confirm("Biztosan teljesítettnek jelölöd a foglalást? Ez a művelet visszafordíthatatlan!")) return;
        try {
            const response = await cancelBooking(bookingId);
            if (response.status === 200) {
                setToast({ message: "Foglalás teljesítése sikeres!", type: "success" });
                setTimeout(() => navigate("/admin/manage-bookings"), 2000);
            }
        } catch (err) {
            setToast({ message: "Foglalás teljesítése sikertelen: " + (err.response?.data?.message || err.message), type: "error" });
        }
    }

    return (
        <div className={style.editBookingPage}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <h2>Foglalás Szerkesztése</h2>
            {bookingDetails && (
                <div>
                    <div className={style.bookingDetails}>
                        <h3>Foglalás részletei</h3>
                        <p><strong>Foglalási kód:</strong> {bookingDetails.bookingConfirmationCode}</p>
                        <p><strong>Felnőttek:</strong> {bookingDetails.numOfAdults}</p>
                        <p><strong>Gyerekek:</strong> {bookingDetails.numOfChildren}</p>
                        <p><strong>Érkezés:</strong> {bookingDetails.checkInDate}</p>
                        <p><strong>Távozás:</strong> {bookingDetails.checkOutDate}</p>
                    </div>
                    <br /><hr /><br />
                    <h3>Foglaló adatai</h3>
                    <div className={style.bookerDetails}>
                        <p><strong>Név:</strong> {bookingDetails.users?.name}</p>
                        <p><strong>Telefonszám:</strong> {bookingDetails.users?.phoneNumber}</p>
                        <p><strong>Email:</strong> {bookingDetails.users?.email}</p>
                    </div>
                    <br /><hr /><br />
                    <h3>Szoba adatai</h3>
                    <div className={style.roomDetails}>
                        <p><strong>Szoba típus:</strong> {bookingDetails.room?.roomType}</p>
                        <p><strong>Ár:</strong> {bookingDetails.room?.roomPrice}</p>
                        <p><strong>Leírás:</strong> {bookingDetails.room?.roomDescription}</p>
                        <img src={bookingDetails.room?.roomPhotoUrl} alt={bookingDetails.room?.roomType} />
                    </div>
                    <button onClick={() => achieveBooking(bookingDetails.id)}>Foglalás törlése</button>
                </div>
            )}
        </div>
    );
}

export default EditBookingPage;