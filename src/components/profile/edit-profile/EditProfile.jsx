import { useNavigate } from "react-router";
import style from "./EditProfile.module.css";
import { deleteUser, getUserProfile } from "../../../service/ApiService";
import { useEffect, useState } from "react";

function EditProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
            async function fetchUserProfile() {
                try {
                    const response = await getUserProfile();
                    setUser(response.users);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                }
            }
            fetchUserProfile();
        }, []);

    async function handleDeleteProfile() {
        if (!window.confirm("Biztosan törölni szeretnéd a profilodat? Ez a művelet visszafordíthatatlan!")){
            return
        }
        try {
            await deleteUser(user.id);
            navigate("/register");
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    }

    return ( 
        <div className={style.editProfilePage}>
            <h2 className={style.title}>Profil szerkesztése</h2>
            {error && <p className={style.error}>{error}</p>}
            {user && (
                <div className={style.profileDetails}>
                    <p><strong>Név:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Telefonszám:</strong> {user.phoneNumber}</p>
                    <button className={style.deleteButton} onClick={handleDeleteProfile}>
                        Profil törlése
                    </button>
                </div>
            )}
        </div>
     );
}

export default EditProfile;