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
        }
        fetchAdminName();
    }, []);

    return (
        <div className={style.adminWrapper}>
            <div className={style.adminPage}>

                <div className={style.header}>
                    <div className={style.headerTop}>
                        <span className={style.badge}>Admin Panel</span>
                    </div>
                    <h2 className={style.title}>
                        Üdvözlünk, <span>{adminName}!</span>
                    </h2>
                    <p className={style.subtitle}>Kezelj mindent egy helyen – szobák, foglalások, felhasználók.</p>
                </div>

                <div className={style.adminActions}>
                    <div className={`${style.actionCard} ${style.rooms}`} onClick={() => navigate("/admin/manage-rooms")}>
                        <div className={style.cardIcon}>🛏️</div>
                        <h3 className={style.cardTitle}>Szobák kezelése</h3>
                        <p className={style.cardDesc}>Szobák hozzáadása, szerkesztése, törlése és típusok kezelése.</p>
                        <span className={style.cardArrow}>Megnyitás →</span>
                    </div>

                    <div className={`${style.actionCard} ${style.bookings}`} onClick={() => navigate("/admin/manage-bookings")}>
                        <div className={style.cardIcon}>📋</div>
                        <h3 className={style.cardTitle}>Foglalások kezelése</h3>
                        <p className={style.cardDesc}>Összes foglalás megtekintése, szerkesztése és teljesítése.</p>
                        <span className={style.cardArrow}>Megnyitás →</span>
                    </div>

                    <div className={`${style.actionCard} ${style.users}`} onClick={() => navigate("/admin/manage-users")}>
                        <div className={style.cardIcon}>👥</div>
                        <h3 className={style.cardTitle}>Felhasználók kezelése</h3>
                        <p className={style.cardDesc}>Felhasználók listázása, keresése és törlése.</p>
                        <span className={style.cardArrow}>Megnyitás →</span>
                    </div>

                    <div className={`${style.actionCard} ${style.services}`} onClick={() => navigate("/admin/manage-services")}>
                        <div className={style.cardIcon}>🏨</div>
                        <h3 className={style.cardTitle}>Szolgáltatások kezelése</h3>
                        <p className={style.cardDesc}>Étkezési csomagok és szoba felszereltség kezelése.</p>
                        <span className={style.cardArrow}>Megnyitás →</span>
                    </div>

                    <div className={`${style.actionCard} ${style.gallery}`} onClick={() => navigate("/admin/manage-gallery")}>
                        <div className={style.cardIcon}>🖼️</div>
                        <h3 className={style.cardTitle}>Galéria szerkesztése</h3>
                        <p className={style.cardDesc}>Képek feltöltése, törlése és kategóriák kezelése.</p>
                        <span className={style.cardArrow}>Megnyitás →</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;