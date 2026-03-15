import style from "./FindBookingPage.module.css";
import { getUserBookings, getUserProfile } from "../../../service/ApiService";
import { useState, useEffect } from "react";
import Toast from "../../common/toast/Toast";

function FindBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "error" });

  useEffect(() => {
    async function fetchBookings() {
      try {
        const profile = await getUserProfile();
        const response = await getUserBookings(profile.users.id);
        setBookings(response.users.bookings || []);
      } catch (error) {
        setToast({
          message: error.response?.data?.message || error.message,
          type: "error",
        });
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className={style.findBookingContainer}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
      <h2>Foglalásaim</h2>
      {bookings.length === 0 ? (
        <div className={style.emptyState}>
          <div className={style.emptyIcon}>🛎️</div>
          <h3>Még nincs foglalásod</h3>
          <p>Ha lefoglalsz egy szobát, itt fognak megjelenni a foglalásaid.</p>
        </div>
      ) : (
        <div className={style.bookingList}>
          {bookings.map((booking) => (
            <div key={booking.id} className={style.bookingDetailsContainer}>
              <img
                src={booking.room?.roomPhotoUrl}
                alt={booking.room?.roomType}
                className={style.bookingImage}
              />
              <div className={style.bookingContent}>
                <div>
                  <div className={style.bookingHeader}>
                    <h3 className={style.roomType}>{booking.room?.roomType}</h3>
                    <span className={style.confirmationBadge}>
                      {booking.bookingConfirmationCode}
                    </span>
                  </div>
                  <div className={style.divider} />
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
                      <span>Végösszeg</span>
                      <span>
                        $
                        {(() => {
                          const oneDay = 24 * 60 * 60 * 1000;
                          const days =
                            Math.round(
                              Math.abs(
                                (new Date(booking.checkOutDate) -
                                  new Date(booking.checkInDate)) /
                                  oneDay,
                              ),
                            ) + 1;
                          return days * booking.room?.roomPrice;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FindBookingPage;
