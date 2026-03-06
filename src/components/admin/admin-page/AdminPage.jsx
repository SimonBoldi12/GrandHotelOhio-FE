import { useNavigate } from "react-router";
import style from "./AdminPage.module.css";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../../service/ApiService";


function AdminPage() {
    const [adminName, setAdminName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAdminName() {
            try {
                const response = await getUserProfile();
                setAdminName(response.users.name);
            } catch (err) {
                console.error("Admin profil lekérése sikertelen:", err.message);
            }
        }        fetchAdminName();
    }, []);


    return ( 
        <div className={style.adminPage}>
            <h2 className={style.title}>Üdvözlünk, {adminName}!</h2>
            <p>Ez az adminisztrációs oldal. Itt kezelheted a szobákat, foglalásokat és felhasználókat.</p>
            <div className={style.adminActions}>
                <button className={style.manageRoomsBtn} onClick={() => navigate("/admin/manage-rooms")}>
                    Szobák kezelése
                </button>
                <button className={style.manageBookingsBtn} onClick={() => navigate("/admin/manage-bookings")}>
                    Foglalások kezelése
                </button>
            </div>
        </div>
     );
}

export default AdminPage;