import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserBookings, getUserProfile, logout } from '../../../service/ApiService';
import style from './ProfilePage.module.css';
import Toast from '../../common/toast/Toast';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "error" });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await getUserProfile();
                const userPlusBookings = await getUserBookings(response.users.id);
                setUser(userPlusBookings.users);
            } catch (err) {
                setToast({ message: err.response?.data?.message || err.message, type: "error" });
            }
        }
        fetchUserProfile();
    }, []);

    function handleLogout() {
        logout();
        navigate("/home");
    }

    return (
        <div className={style.profilePage}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />
            <div className={style.header}>
                {user && <h2 className={style.title}>Üdvözlünk, {user.name}!</h2>}
                <div className={style.profileActions}>
                    <button className={style.editProfileBtn} onClick={() => navigate("/edit-profile")}>Profil szerkesztése</button>
                    <button className={style.logoutBtn} onClick={handleLogout}>Kijelentkezés</button>
                </div>
            </div>
            {user && (
                <div className={style.profileDetails}>
                    <h3>Profil adatai</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Telefonszám:</strong> {user.phoneNumber}</p>
                </div>
            )}
            <div className={style.bookingsSection}>
                <h3>Foglalásaim</h3>
                <div className={style.bookingList}>
                    {user && user.bookings && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                            <div key={booking.id} className={style.bookingItem}>
                                <p><strong>Foglalási kód:</strong> {booking.bookingConfirmationCode}</p>
                                <p><strong>Érkezés:</strong> {booking.checkInDate}</p>
                                <p><strong>Távozás:</strong> {booking.checkOutDate}</p>
                                <p><strong>Összes vendég:</strong> {booking.totalNumOfGuests}</p>
                                <p><strong>Szoba típusa:</strong> {booking.room?.roomType}</p>
                                <img src={booking.room?.roomPhotoUrl} alt={booking.room?.roomType} className={style.roomPhoto} />
                            </div>
                        ))
                    ) : (
                        <p className={style.noBookings}>Nincs foglalás.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;