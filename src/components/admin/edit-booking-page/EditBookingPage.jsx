import { useNavigate, useParams } from "react-router";
import style from "./EditBookingPage.module.css";
import { useEffect, useState } from "react";
import {
  cancelBooking,
  getBookingByConfirmationCode,
} from "../../../service/ApiService";
import Toast from "../../common/toast/Toast";
import { useConfirm } from "../../../hooks/useConfirm";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";

function EditBookingPage() {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const { confirm, config } = useConfirm();
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    async function fetchBookingDetails() {
      try {
        const response = await getBookingByConfirmationCode(bookingCode);
        setBookingDetails(response.booking);
      } catch (err) {
        setToast({
          message:
            "Foglalás adatainak lekérése sikertelen: " +
            (err.response?.data?.message || err.message),
          type: "error",
        });
      }
    }
    fetchBookingDetails();
  }, [bookingCode]);

  async function achieveBooking(bookingId) {
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
        setToast({ message: "Foglalás sikeresen törölve!", type: "success" });
        setTimeout(() => navigate("/admin/manage-bookings"), 2000);
      }
    } catch (err) {
      setToast({
        message:
          "Foglalás törlése sikertelen: " +
          (err.response?.data?.message || err.message),
        type: "error",
      });
    }
  }

  const MEAL_TYPE_LABEL = {
    BREAKFAST: "Csak reggeli",
    HALF_BOARD: "Félpanzió",
    ALL_INCLUSIVE: "All inclusive",
    NONE: "Nincs étkezés",
  };

  function calcTotal() {
    if (!bookingDetails) return 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const days =
      Math.round(
        Math.abs(
          (new Date(bookingDetails.checkOutDate) -
            new Date(bookingDetails.checkInDate)) /
            oneDay,
        ),
      ) + 1;
    const roomPrice = bookingDetails.room?.roomPrice || 0;
    const mealPrice = bookingDetails.selectedMealPlan?.pricePerNight || 0;
    const servicesPrice = (bookingDetails.selectedServices || []).reduce(
      (sum, s) => sum + (s.price || 0),
      0,
    );
    return days * (roomPrice + mealPrice + servicesPrice);
  }


  return (
    <div className={style.editBookingWrapper}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      <div className={style.editBookingPage}>
        <button
          className={style.backButton}
          onClick={() => navigate("/admin/manage-bookings")}
        >
          ← Vissza a foglalásokhoz
        </button>

        <div className={style.header}>
          <span className={style.badge}>Admin / Foglalások</span>
          <h2 className={style.title}>
            Foglalás <span>szerkesztése</span>
          </h2>
          <p className={style.subtitle}>
            Foglalás részleteinek megtekintése és kezelése.
          </p>
        </div>

        {bookingDetails && (
          <>
            <div className={style.contentGrid}>
              {/* FOGLALÁS ADATAI */}
              <div className={style.card}>
                <div className={style.cardHeader}>
                  <span className={style.cardIcon}>📋</span>
                  <h3 className={style.cardTitle}>Foglalás adatai</h3>
                </div>
                <div className={style.fields}>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>
                      Visszaigazolási kód
                    </span>
                    <span className={style.confirmationBadge}>
                      {bookingDetails.bookingConfirmationCode}
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Érkezés</span>
                    <span className={style.fieldValue}>
                      {bookingDetails.checkInDate}
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Távozás</span>
                    <span className={style.fieldValue}>
                      {bookingDetails.checkOutDate}
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Felnőttek</span>
                    <span className={style.fieldValue}>
                      {bookingDetails.numOfAdults} fő
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Gyerekek</span>
                    <span className={style.fieldValue}>
                      {bookingDetails.numOfChildren} fő
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Végösszeg</span>
                    <span className={`${style.fieldValue} ${style.totalPrice}`}>
                      ${calcTotal()}
                    </span>
                  </div>
                </div>
              </div>

              {/* FOGLALÓ ADATAI */}
              <div className={style.card}>
                <div className={style.cardHeader}>
                  <span className={style.cardIcon}>👤</span>
                  <h3 className={style.cardTitle}>Foglaló adatai</h3>
                </div>
                <div className={style.fields}>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Név</span>
                    <span className={style.fieldValue}>
                      {bookingDetails.users?.name}
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Email</span>
                    <span className={style.fieldValue}>
                      {bookingDetails.users?.email}
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.fieldLabel}>Telefonszám</span>
                    <span className={style.fieldValue}>
                      {bookingDetails.users?.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* SZOBA ADATAI */}
              <div className={style.roomCard}>
                <img
                  src={bookingDetails.room?.roomPhotoUrl}
                  alt={bookingDetails.room?.roomType}
                  className={style.roomImage}
                />
                <div className={style.roomInfo}>
                  <div className={style.cardHeader}>
                    <span className={style.cardIcon}>🛏️</span>
                    <h3 className={style.cardTitle}>Szoba adatai</h3>
                  </div>
                  <div className={style.fields}>
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Típus</span>
                      <span className={style.fieldValue}>
                        {bookingDetails.room?.roomType}
                      </span>
                    </div>
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Ár / éjszaka</span>
                      <span className={style.fieldValue}>
                        ${bookingDetails.room?.roomPrice}
                      </span>
                    </div>
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Leírás</span>
                      <span className={style.fieldValue}>
                        {bookingDetails.room?.roomDescription}
                      </span>
                    </div>

                    {/* FELSZERELTSÉG */}
                    {bookingDetails.room?.amenities?.length > 0 && (
                      <div className={style.field}>
                        <span className={style.fieldLabel}>
                          🛋️ Felszereltség
                        </span>
                        <div className={style.amenityRow}>
                          {bookingDetails.room.amenities.map((a) => (
                            <span key={a.id} className={style.amenityChip}>
                              {a.icon} {a.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* KIVÁLASZTOTT ÉTKEZÉSI CSOMAG */}
              <div className={style.card}>
                <div className={style.cardHeader}>
                  <span className={style.cardIcon}>🍽️</span>
                  <h3 className={style.cardTitle}>Étkezési csomag</h3>
                </div>
                <div className={style.fields}>
                  {bookingDetails.selectedMealPlan ? (
                    <>
                      <div className={style.field}>
                        <span className={style.fieldLabel}>Típus</span>
                        <span className={style.fieldValue}>
                          {MEAL_TYPE_LABEL[
                            bookingDetails.selectedMealPlan.type
                          ] || bookingDetails.selectedMealPlan.type}
                        </span>
                      </div>
                      <div className={style.field}>
                        <span className={style.fieldLabel}>Csomag neve</span>
                        <span className={style.fieldValue}>
                          {bookingDetails.selectedMealPlan.name}
                        </span>
                      </div>
                      <div className={style.field}>
                        <span className={style.fieldLabel}>Ár / éjszaka</span>
                        <span
                          className={`${style.fieldValue} ${style.priceBlue}`}
                        >
                          +${bookingDetails.selectedMealPlan.pricePerNight}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Típus</span>
                      <span className={style.fieldValue}>Nincs étkezés</span>
                    </div>
                  )}
                </div>
              </div>

              {/* EXTRA SZOLGÁLTATÁSOK */}
              {bookingDetails.selectedServices?.length > 0 && (
                <div className={style.card}>
                  <div className={style.cardHeader}>
                    <span className={style.cardIcon}>🏨</span>
                    <h3 className={style.cardTitle}>Extra szolgáltatások</h3>
                  </div>
                  <div className={style.fields}>
                    {bookingDetails.selectedServices.map((s) => (
                      <div key={s.id} className={style.serviceRow}>
                        <div>
                          <span className={style.serviceCategoryBadge}>
                            {s.category}
                          </span>
                          <span className={style.fieldValue}> {s.name}</span>
                        </div>
                        <span className={style.priceBlue}>+${s.price}/éj</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DANGER ZONE */}
            <div className={style.dangerZone}>
              <div className={style.dangerInfo}>
                <h4>Foglalás törlése</h4>
                <p>
                  Ez a művelet visszafordíthatatlan. A foglalás véglegesen
                  törlésre kerül.
                </p>
              </div>
              <button
                className={style.deleteButton}
                onClick={() => achieveBooking(bookingDetails.id)}
              >
                Foglalás törlése
              </button>
            </div>
          </>
        )}
      </div>
      {config && <ConfirmDialog {...config} />}
    </div>
  );
}

export default EditBookingPage;
