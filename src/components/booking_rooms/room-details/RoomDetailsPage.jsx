import style from "./RoomDetailsPage.module.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookRoom, getRoomById, getUserProfile } from "../../../service/ApiService";
import DatePicker from "react-datepicker";
import { hu } from "date-fns/locale";
import Toast from "../../common/toast/Toast";
import Carousel from "../../common/carousel/Carousel";

function RoomDetailsPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numOfAdults, setNumOfAdults] = useState(1);
  const [numOfChildren, setNumOfChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await getUserProfile();
        setUserId(userProfile.users.id);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [roomId]);

  async function handleConfirmBooking() {
    if (!checkInDate || !checkOutDate) {
      setToast({ message: "Kérem válassza ki a be- és kijelentkezési dátumot.", type: "warning" });
      return;
    }
    if (isNaN(numOfAdults) || numOfAdults < 1 || isNaN(numOfChildren) || numOfChildren < 0) {
      setToast({ message: "Kérem válassza ki a felnőttek és gyermekek számát.", type: "warning" });
      return;
    }
    if (checkInDate > checkOutDate) {
      setToast({ message: "A kijelentkezési dátum nem lehet korábbi, mint a bejelentkezési dátum.", type: "error" });
      return;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round(Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)) + 1;
    setTotalPrice(totalDays * roomDetails.roomPrice);
    setTotalGuests(numOfAdults + numOfChildren);
  }

  async function acceptBooking() {
    try {
      const fmt = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      const booking = {
        checkInDate: fmt(new Date(checkInDate)),
        checkOutDate: fmt(new Date(checkOutDate)),
        numOfAdults,
        numOfChildren,
      };
      const response = await bookRoom(roomId, userId, booking);
      if (response.status === 200) {
        setToast({ message: `Sikeres foglalás! Foglalási kód: ${response.bookingConfirmationCode}`, type: "success" });
        setTimeout(() => navigate("/rooms"), 5000);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message, type: "error" });
    }
  }

  if (isLoading) return <div className={style.loading}>Szoba adatok betöltése...</div>;
  if (error) return <div className={style.error}>Hiba történt: {error}</div>;

  const { roomType: roomTypeName, roomPrice, roomPhotoUrl, roomDescription, imageUrls } = roomDetails;
  const allImages = [roomPhotoUrl, ...(imageUrls || [])].filter(Boolean);

  return (
    <div className={style.pageWrapper}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />

      <div className={style.roomDetailsContainer}>

        {/* HERO HEADER */}
        <div className={style.heroHeader}>
          <div className={style.heroLeft}>
            <p className={style.heroLabel}>Szoba részletei</p>
            <h2 className={style.roomTitle}>{roomTypeName}</h2>
            <div className={style.priceTag}>
              <span className={style.priceAmount}>${roomPrice}</span>
              <span className={style.priceUnit}>/ éjszaka</span>
            </div>
          </div>
          <div className={style.heroActions}>
            <button className={style.bookNowButton} onClick={() => setShowDatePicker(true)}>
              Foglalj most
            </button>
            <button className={style.goBackButton} onClick={() => navigate(-1)}>
              ← Vissza
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className={style.contentGrid}>

          {/* BAL: CAROUSEL + LEÍRÁS */}
          <div className={style.carouselCard}>
            <div className={style.carouselWrapper}>
              <span className={style.imageBadge}>{roomTypeName}</span>
              <Carousel images={allImages} />
            </div>
            {roomDescription && (
              <div className={style.descriptionSection}>
                <p className={style.descriptionLabel}>Leírás</p>
                <p className={style.description}>{roomDescription}</p>
              </div>
            )}
          </div>

          {/* JOBB: FOGLALÁS PANEL */}
          {showDatePicker && (
            <div className={style.bookingCard}>
              <h3 className={style.bookingCardTitle}>Foglalás részletei</h3>

              <div className={style.sectionHeader}>
                <span className={style.sectionIcon}>📅</span>
                <span className={style.sectionLabel}>Dátumok</span>
              </div>
              <div className={style.datePickerContainer}>
                <div className={style.dateField}>
                  <label>Érkezés dátuma</label>
                  <DatePicker
                    className={style.detailSearchField}
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    selectsStart
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    placeholderText="Válasszon dátumot"
                    dateFormat="dd/MM/yyyy"
                    locale={hu}
                  />
                </div>
                <div className={style.dateField}>
                  <label>Távozás dátuma</label>
                  <DatePicker
                    className={style.detailSearchField}
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    selectsEnd
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={checkInDate}
                    placeholderText="Válasszon dátumot"
                    dateFormat="dd/MM/yyyy"
                    locale={hu}
                  />
                </div>
              </div>

              <div className={style.divider} />

              <div className={style.sectionHeader}>
                <span className={style.sectionIcon}>👥</span>
                <span className={style.sectionLabel}>Vendégek</span>
              </div>
              <div className={style.guestContainer}>
                <div className={style.guestDiv}>
                  <label>Felnőttek</label>
                  <input
                    type="number"
                    min="1"
                    value={numOfAdults}
                    onChange={(e) => setNumOfAdults(parseInt(e.target.value))}
                  />
                </div>
                <div className={style.guestDiv}>
                  <label>Gyerekek</label>
                  <input
                    type="number"
                    min="0"
                    value={numOfChildren}
                    onChange={(e) => setNumOfChildren(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <button className={style.confirmBookingButton} onClick={handleConfirmBooking}>
                Foglalás megerősítése
              </button>

              {totalPrice > 0 && (
                <div className={style.totalPriceContainer}>
                  <div className={style.totalPriceInfo}>
                    <p>Összes vendég: <strong>{totalGuests} fő</strong></p>
                    <p>Végösszeg: <strong>${totalPrice}</strong></p>
                  </div>
                  <button onClick={acceptBooking} className={style.acceptBookingButton}>
                    Foglalás elfogadása ✓
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default RoomDetailsPage;