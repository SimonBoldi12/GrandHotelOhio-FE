import { useNavigate } from "react-router";
import style from "./EditProfile.module.css";
import { deleteUser, getUserProfile } from "../../../service/ApiService";
import { useEffect, useState } from "react";
import Toast from "../../common/toast/Toast";

function EditProfile() {
    const [user, setUser] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "error" });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await getUserProfile();
                setUser(response.users);
            } catch (err) {
                setToast({ message: err.response?.data?.message || err.message, type: "error" });
            }
        }
        fetchUserProfile();
    }, []);

    async function handleDeleteProfile() {
        if (!window.confirm("Biztosan törölni szeretnéd a profilodat? Ez a művelet visszafordíthatatlan!")) return;
        try {
            await deleteUser(user.id);
            navigate("/register");
        } catch (error) {
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        }
    }

    return (
        <div className={style.editProfilePage}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />

            <div className={style.header}>
                <button className={style.backButton} onClick={() => navigate("/profile")}>
                    ← Vissza a profilhoz
                </button>
                <h2 className={style.title}>Profil szerkesztése</h2>
                <p className={style.subtitle}>Fiókod adatainak megtekintése és kezelése.</p>
            </div>

            {user && (
                <>
                    <div className={style.profileCard}>
                        <div className={style.avatarSection}>
                            <div className={style.avatar}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className={style.avatarInfo}>
                                <h3 className={style.avatarName}>{user.name}</h3>
                                <span className={style.avatarRole}>Felhasználó</span>
                            </div>
                        </div>
                        <div className={style.profileFields}>
                            <div className={style.profileField}>
                                <span className={style.fieldLabel}>Email cím</span>
                                <span className={style.fieldValue}>{user.email}</span>
                            </div>
                            <div className={style.profileField}>
                                <span className={style.fieldLabel}>Telefonszám</span>
                                <span className={style.fieldValue}>{user.phoneNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className={style.dangerZone}>
                        <div className={style.dangerInfo}>
                            <h4>Fiók törlése</h4>
                            <p>Ez a művelet visszafordíthatatlan. Minden adatod és foglalásod törlésre kerül.</p>
                        </div>
                        <button className={style.deleteButton} onClick={handleDeleteProfile}>
                            Profil törlése
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default EditProfile;