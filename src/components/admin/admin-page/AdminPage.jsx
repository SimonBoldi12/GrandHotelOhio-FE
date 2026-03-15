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

                {/* HEADER */}
                <div className={style.header}>
                    <div className={style.headerTop}>
                        <span className={style.badge}>Admin Panel</span>
                    </div>
                    <h2 className={style.title}>
                        Üdvözlünk, <span>{adminName}!</span>
                    </h2>
                    <p className={style.subtitle}>Kezelj mindent egy helyen – szobák, foglalások, felhasználók.</p>
                </div>

                {/* STAT SÁV */}
                <div className={style.statsRow}>
                    <div className={style.statCard}>
                        <div className={`${style.statIcon} ${style.blue}`}>🏨</div>
                        <div className={style.statInfo}>
                            <span className={style.statLabel}>Rendszer</span>
                            <span className={style.statValue}>Online</span>
                        </div>
                    </div>
                    <div className={style.statCard}>
                        <div className={`${style.statIcon} ${style.purple}`}>🔐</div>
                        <div className={style.statInfo}>
                            <span className={style.statLabel}>Hozzáférés</span>
                            <span className={style.statValue}>Admin</span>
                        </div>
                    </div>
                    <div className={style.statCard}>
                        <div className={`${style.statIcon} ${style.green}`}>✅</div>
                        <div className={style.statInfo}>
                            <span className={style.statLabel}>Státusz</span>
                            <span className={style.statValue}>Aktív</span>
                        </div>
                    </div>
                </div>

                {/* ACTION KÁRTYÁK */}
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
                </div>

            </div>
        </div>
    );
}

export default AdminPage;