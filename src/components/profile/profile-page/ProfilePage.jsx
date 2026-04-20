import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserBookings, getUserProfile, logout, cancelBooking } from '../../../service/ApiService';
import style from './ProfilePage.module.css';
import Toast from '../../common/toast/Toast';
import { useConfirm } from '../../../hooks/useConfirm';
import ConfirmDialog from '../../common/confirm-dialog/ConfirmDialog';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "error" });
    const navigate = useNavigate();
    const { confirm, config } = useConfirm();

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

    async function handleCancel(bookingId) {
        const ok = await confirm({
            title: "Foglalás törlése",
            message: `Biztosan törölni szeretnéd a foglalást? Ez a művelet visszafordíthatatlan!`,
            confirmText: "Törlés",
            cancelText: "Mégse",
            confirmVariant: "danger",
        });
        if (!ok) return;
        try {
            const response = await cancelBooking(bookingId);
            if (response.status === 200) {
                setUser(prev => ({
                    ...prev,
                    bookings: prev.bookings.filter(b => b.id !== bookingId)
                }));
                setToast({ message: "Foglalás sikeresen törölve!", type: "success" });
            }
        } catch (error) {
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        }
    }

    return (
        <div className={style.profilePage}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />

            <div className={style.header}>
                <div className={style.headerLeft}>
                    <p className={style.welcomeLabel}>Üdvözlünk</p>
                    <h2 className={style.title}>{user?.name || "..."}</h2>
                </div>
                <div className={style.profileActions}>
                    <button className={style.editProfileBtn} onClick={() => navigate("/edit-profile")}>Profil szerkesztése</button>
                    <button className={style.logoutBtn} onClick={handleLogout}>Kijelentkezés</button>
                </div>
            </div>

            <div className={style.contentGrid}>

                {user && (
                    <div className={style.profileDetails}>
                        <div className={style.sectionHeader}>
                            <span className={style.sectionIcon}>👤</span>
                            <h3 className={style.sectionTitle}>Profil adatai</h3>
                        </div>
                        <div className={style.profileFields}>
                            <div className={style.profileField}>
                                <span className={style.fieldLabel}>Email</span>
                                <span className={style.fieldValue}>{user.email}</span>
                            </div>
                            <div className={style.profileField}>
                                <span className={style.fieldLabel}>Telefonszám</span>
                                <span className={style.fieldValue}>{user.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className={style.bookingsSection}>
                    <div className={style.sectionHeader}>
                        <span className={style.sectionIcon}>🛎️</span>
                        <h3 className={style.sectionTitle}>Foglalásaim</h3>
                    </div>
                    <div className={style.bookingList}>
                        {user && user.bookings && user.bookings.length > 0 ? (
                            user.bookings.map((booking) => (
                                <div key={booking.id} className={style.bookingItem}>
                                    <div className={style.bookingItemContent}>
                                        <img src={booking.room?.roomPhotoUrl} alt={booking.room?.roomType} className={style.roomPhoto} />
                                        <div className={style.bookingInfo}>
                                            <span className={style.bookingCode}>{booking.bookingConfirmationCode}</span>
                                            <div className={style.bookingFields}>
                                                <div className={style.bookingField}>
                                                    <span className={style.fieldLabel}>Szoba típusa</span>
                                                    <span className={style.fieldValue}>{booking.room?.roomType}</span>
                                                </div>
                                                <div className={style.bookingField}>
                                                    <span className={style.fieldLabel}>Összes vendég</span>
                                                    <span className={style.fieldValue}>{booking.totalNumOfGuests} fő</span>
                                                </div>
                                                <div className={style.bookingField}>
                                                    <span className={style.fieldLabel}>Érkezés</span>
                                                    <span className={style.fieldValue}>{booking.checkInDate}</span>
                                                </div>
                                                <div className={style.bookingField}>
                                                    <span className={style.fieldLabel}>Távozás</span>
                                                    <span className={style.fieldValue}>{booking.checkOutDate}</span>
                                                </div>
                                            </div>
                                            <div className={style.cancelZone}>
                                                <div className={style.cancelInfo}>
                                                    <span className={style.cancelTitle}>Foglalás lemondása</span>
                                                    <span className={style.cancelSubtitle}>Ez a művelet visszafordíthatatlan.</span>
                                                </div>
                                                <button className={style.cancelButton} onClick={() => handleCancel(booking.id)}>
                                                    Lemondás
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={style.noBookings}>Még nincs foglalásod.</p>
                        )}
                    </div>
                </div>

            </div>
            {config && <ConfirmDialog {...config} />}
        </div>
    );
}

export default ProfilePage;