import style from "./FindBookingPage.module.css";
import { getBookingByConfirmationCode } from "../../../service/ApiService";
import { set } from "react-datepicker/dist/dist/date_utils.js";

function FindBookingPage() {
    const [confirmationCode, setConfirmationCode] = useState("");
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState("");

    async function handleSearch() {
        if (!confirmationCode) {
            setError("Kérem adja meg a foglalási kódot!");
            setTimeout(() => setError(""), 5000);
            return;
        }
        try {
            const response = await getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(""), 5000);
        }
    }

    return ( 
        <div className={style.findBookingContainer}>
            <h2>Keresés foglalás alapján</h2>
            <div className={style.searchContainer}>
                <input 
                required
                type="text" 
                placeholder="Foglalási kód" 
                value={confirmationCode} 
                onChange={(e) => setConfirmationCode(e.target.value)} />
                <button onClick={handleSearch}>Keresés</button>
            </div>

            {error && <p className={style.error}>{error}</p>}
            {bookingDetails && (
                <div>
                    <h3>Foglalás részletei</h3>
                    <p>Kód: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Dátum: {bookingDetails.date}</p>
                    <p>Ár: {bookingDetails.price}</p>
                </div>
            )}
        </div>
        
     );
}

export default FindBookingPage;