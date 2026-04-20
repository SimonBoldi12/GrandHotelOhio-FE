import style from "./FindBookingPage.module.css";
import { getUserBookings, getUserProfile, cancelBooking } from "../../../service/ApiService";
import { useState, useEffect } from "react";
import Toast from "../../common/toast/Toast";
import { useConfirm } from "../../../hooks/useConfirm";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";

const MEAL_TYPE_LABEL = {
  BREAKFAST: "Csak reggeli",
  HALF_BOARD: "Félpanzió",
  ALL_INCLUSIVE: "All inclusive",
  NONE: "Nincs étkezés",
};

function FindBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "error" });
  const { confirm, config } = useConfirm();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const profile = await getUserProfile();
        const response = await getUserBookings(profile.users.id);
        setBookings(response.users.bookings || []);
      } catch (error) {
        setToast({ message: error.response?.data?.message || error.message, type: "error" });
      }
    }
    fetchBookings();
  }, []);

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
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        setToast({ message: "Foglalás sikeresen törölve!", type: "success" });
      }
    } catch (error) {
      setToast({ message: error.response?.data?.message || error.message, type: "error" });
    }
  }

  function calcTotal(booking) {
    const oneDay = 24 * 60 * 60 * 1000;
    const days = Math.round(Math.abs((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / oneDay)) + 1;
    const roomPrice = booking.room?.roomPrice || 0;
    const mealPrice = booking.selectedMealPlan?.pricePerNight || 0;
    const servicesPrice = (booking.selectedServices || []).reduce((sum, s) => sum + (s.price || 0), 0);
    return { days, total: days * (roomPrice + mealPrice + servicesPrice) };
  }

  return (
    <div className={style.findBookingContainer}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />

      <div className={style.header}>
        <p className={style.headerLabel}>Fiókom</p>
        <h2 className={style.title}>Foglalásaim</h2>
      </div>

      {bookings.length === 0 ? (
        <div className={style.emptyState}>
          <div className={style.emptyIcon}>🛎️</div>
          <h3>Még nincs foglalásod</h3>
          <p>Ha lefoglalsz egy szobát, itt fognak megjelenni a foglalásaid.</p>
        </div>
      ) : (
        <div className={style.bookingList}>
          {bookings.map((booking) => {
            const { days, total } = calcTotal(booking);
            const mealPlan = booking.selectedMealPlan;
            const amenities = booking.room?.amenities || [];
            const services = booking.selectedServices || [];

            return (
              <div key={booking.id} className={style.bookingDetailsContainer}>
                <img src={booking.room?.roomPhotoUrl} alt={booking.room?.roomType} className={style.bookingImage} />
                <div className={style.bookingContent}>
                  <div className={style.bookingHeader}>
                    <h3 className={style.roomType}>{booking.room?.roomType}</h3>
                    <span className={style.confirmationBadge}>{booking.bookingConfirmationCode}</span>
                  </div>
                  <div className={style.divider} />

                  {/* ALAP ADATOK */}
                  <div className={style.bookingGrid}>
                    <div className={style.bookingField}>
                      <span>Érkezés</span>
                      <span>{booking.checkInDate}</span>
                    </div>
                    <div className={style.bookingField}>
                      <span>Távozás</span>
                      <span>{booking.checkOutDate}</span>
                    </div>
                    <div className={style.bookingField}>
                      <span>Felnőttek</span>
                      <span>{booking.numOfAdults} fő</span>
                    </div>
                    <div className={style.bookingField}>
                      <span>Gyerekek</span>
                      <span>{booking.numOfChildren} fő</span>
                    </div>
                    <div className={style.bookingField}>
                      <span>Éjszakák</span>
                      <span>{days} éj</span>
                    </div>
                    <div className={`${style.bookingField} ${style.highlight}`}>
                      <span>Végösszeg</span>
                      <span>${total}</span>
                    </div>
                  </div>

                  {/* FELSZERELTSÉG */}
                  {amenities.length > 0 && (
                    <>
                      <div className={style.divider} />
                      <div className={style.sectionLabel}>🛋️ Felszereltség</div>
                      <div className={style.amenityRow}>
                        {amenities.map(a => (
                          <span key={a.id} className={style.amenityChip}>
                            {a.icon} {a.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* KIVÁLASZTOTT ÉTKEZÉSI CSOMAG */}
                  {mealPlan && (
                    <>
                      <div className={style.divider} />
                      <div className={style.sectionLabel}>🍽️ Étkezési csomag</div>
                      <div className={style.mealPlanRow}>
                        <span className={style.mealPlanBadge}>
                          {MEAL_TYPE_LABEL[mealPlan.type] || mealPlan.type}
                        </span>
                        <span className={style.mealPlanName}>{mealPlan.name}</span>
                        <span className={style.mealPlanPrice}>+${mealPlan.pricePerNight}/éj</span>
                      </div>
                    </>
                  )}

                  {/* EXTRA SZOLGÁLTATÁSOK */}
                  {services.length > 0 && (
                    <>
                      <div className={style.divider} />
                      <div className={style.sectionLabel}>🏨 Extra szolgáltatások</div>
                      <div className={style.servicesList}>
                        {services.map(s => (
                          <div key={s.id} className={style.serviceRow}>
                            <span className={style.serviceName}>{s.name}</span>
                            <span className={style.servicePrice}>+${s.price}/éj</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className={style.divider} />
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
            );
          })}
        </div>
      )}
      {config && <ConfirmDialog {...config} />}
    </div>
  );
}

export default FindBookingPage;