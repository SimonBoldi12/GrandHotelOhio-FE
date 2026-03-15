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
            <h2 className={style.title}>Profil szerkesztése</h2>
            {user && (
                <div className={style.profileDetails}>
                    <p><strong>Név:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Telefonszám:</strong> {user.phoneNumber}</p>
                    <button className={style.deleteButton} onClick={handleDeleteProfile}>Profil törlése</button>
                </div>
            )}
        </div>
    );
}

export default EditProfile;