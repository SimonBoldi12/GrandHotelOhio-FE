import style from "./RoomDetailsPage.module.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  bookRoom,
  getRoomById,
  getUserProfile,
  getAllServices,
} from "../../../service/ApiService";
import DatePicker from "react-datepicker";
import { hu } from "date-fns/locale";
import Toast from "../../common/toast/Toast";
import Carousel from "../../common/carousel/Carousel";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await getUserProfile();
        setUserId(userProfile.users.id);
        const servicesRes = await getAllServices();
        setAvailableServices(servicesRes.serviceList || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [roomId]);

  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    if (checkIn) setCheckInDate(new Date(checkIn));
    if (checkOut) setCheckOutDate(new Date(checkOut));
    if (checkIn && checkOut) setShowDatePicker(true);
  }, []);

  useEffect(() => {
    if (!checkInDate || !checkOutDate || !roomDetails) return;
    const oneDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round(Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)) + 1;
    const mealPlanPrice = selectedMealPlan ? selectedMealPlan.pricePerNight : 0;
    const servicesPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    setTotalPrice(totalDays * (roomDetails.roomPrice + mealPlanPrice + servicesPrice));
    setTotalGuests(numOfAdults + numOfChildren);
  }, [checkInDate, checkOutDate, selectedMealPlan, selectedServices, numOfAdults, numOfChildren, roomDetails]);

  function toggleService(service) {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  }

  const serviceExtraPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);

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

    const mealPlanId = selectedMealPlan ? selectedMealPlan.id : null;

    const response = await bookRoom(roomId, userId, booking, mealPlanId);

    if (response.status === 200) {
      if (selectedServices.length > 0) {
        const { addServiceToBooking, getBookingByConfirmationCode } = await import("../../../service/ApiService");
        const bookingRes = await getBookingByConfirmationCode(response.bookingConfirmationCode);
        const bookingId = bookingRes.booking.id;
        for (const s of selectedServices) {
          await addServiceToBooking(bookingId, s.id);
        }
      }
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
  const roomMealPlans = roomDetails.mealPlans || [];

  const MEAL_TYPE_LABEL = {
    BREAKFAST: "Reggeli",
    HALF_BOARD: "Félpanzió",
    ALL_INCLUSIVE: "All inclusive",
    NONE: "Alap",
  };

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

          {/* BAL: CAROUSEL + LEÍRÁS + AMENITY + ÉTKEZÉS + SZOLGÁLTATÁSOK */}
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

            {/* FELSZERELTSÉG */}
            {roomDetails.amenities && roomDetails.amenities.length > 0 && (
              <div className={style.amenitiesSection}>
                <p className={style.descriptionLabel}>Felszereltség</p>
                <div className={style.amenitiesGrid}>
                  {roomDetails.amenities.map((a) => (
                    <div key={a.id} className={style.amenityItem}>
                      <span className={style.amenityIcon}>{a.icon}</span>
                      <span className={style.amenityName}>{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ÉTKEZÉSI CSOMAGOK - több opcióból választhat */}
            {roomMealPlans.length > 0 && (
              <div className={style.mealPlanSection}>
                <p className={style.descriptionLabel}>Étkezési csomag</p>
                <p className={style.servicesSubtitle}>Válassz étkezési csomagot a tartózkodásodhoz</p>
                <div className={style.mealPlanGrid}>
                  {/* NINCS ÉTKEZÉS OPCIÓ */}
                  <div
                    className={`${style.mealPlanCard} ${selectedMealPlan === null ? style.mealPlanCardActive : ""}`}
                    onClick={() => setSelectedMealPlan(null)}
                  >
                    <div className={style.mealPlanInfo}>
                      <div className={style.mealPlanTop}>
                        <span className={style.mealPlanTypeBadge}>Alap</span>
                        {selectedMealPlan === null && <span className={style.serviceCheckmark}>✓</span>}
                      </div>
                      <p className={style.mealPlanName}>Nincs étkezés</p>
                      <p className={style.mealPlanPrice}>+$0 / éjszaka</p>
                    </div>
                  </div>

                  {/* ELÉRHETŐ CSOMAGOK */}
                  {roomMealPlans.map(plan => (
                    <div
                      key={plan.id}
                      className={`${style.mealPlanCard} ${selectedMealPlan?.id === plan.id ? style.mealPlanCardActive : ""}`}
                      onClick={() => setSelectedMealPlan(plan)}
                    >
                      <div className={style.mealPlanInfo}>
                        <div className={style.mealPlanTop}>
                          <span className={style.mealPlanTypeBadge}>
                            {MEAL_TYPE_LABEL[plan.type] || plan.type}
                          </span>
                          {selectedMealPlan?.id === plan.id && (
                            <span className={style.serviceCheckmark}>✓</span>
                          )}
                        </div>
                        <p className={style.mealPlanName}>{plan.name}</p>
                        <p className={style.mealPlanPrice}>+${plan.pricePerNight} / éjszaka</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXTRA SZOLGÁLTATÁSOK */}
            {availableServices.length > 0 && (
              <div className={style.servicesSection}>
                <p className={style.descriptionLabel}>Extra szolgáltatások</p>
                <p className={style.servicesSubtitle}>Válassz kiegészítő szolgáltatásokat a tartózkodásodhoz</p>
                <div className={style.servicesGrid}>
                  {availableServices.map((s) => {
                    const isSelected = selectedServices.find((sel) => sel.id === s.id);
                    return (
                      <div
                        key={s.id}
                        className={`${style.serviceCard} ${isSelected ? style.serviceCardActive : ""}`}
                        onClick={() => toggleService(s)}
                      >
                        {s.photoUrl && (
                          <img src={s.photoUrl} alt={s.name} className={style.serviceImg} />
                        )}
                        <div className={style.serviceInfo}>
                          <div className={style.serviceTop}>
                            <span className={style.serviceCategoryBadge}>{s.category}</span>
                            {isSelected && <span className={style.serviceCheckmark}>✓</span>}
                          </div>
                          <p className={style.serviceName}>{s.name}</p>
                          {s.description && <p className={style.serviceDesc}>{s.description}</p>}
                          <p className={style.servicePrice}>+${s.price} / éjszaka</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedServices.length > 0 && (
                  <div className={style.servicesSummary}>
                    <span>Kiválasztott szolgáltatások extra díja:</span>
                    <strong>+${serviceExtraPrice} / éjszaka</strong>
                  </div>
                )}
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
                  <input type="number" min="1" value={numOfAdults} onChange={(e) => setNumOfAdults(parseInt(e.target.value))} />
                </div>
                <div className={style.guestDiv}>
                  <label>Gyerekek</label>
                  <input type="number" min="0" value={numOfChildren} onChange={(e) => setNumOfChildren(parseInt(e.target.value))} />
                </div>
              </div>

              {selectedMealPlan && (
                <>
                  <div className={style.divider} />
                  <div className={style.sectionHeader}>
                    <span className={style.sectionIcon}>🍽️</span>
                    <span className={style.sectionLabel}>Étkezési csomag</span>
                  </div>
                  <div className={style.selectedServiceRow}>
                    <span>{selectedMealPlan.name}</span>
                    <span>+${selectedMealPlan.pricePerNight}/éj</span>
                  </div>
                </>
              )}

              {selectedServices.length > 0 && (
                <>
                  <div className={style.divider} />
                  <div className={style.sectionHeader}>
                    <span className={style.sectionIcon}>🏨</span>
                    <span className={style.sectionLabel}>Extra szolgáltatások</span>
                  </div>
                  <div className={style.selectedServicesList}>
                    {selectedServices.map((s) => (
                      <div key={s.id} className={style.selectedServiceRow}>
                        <span>{s.name}</span>
                        <span>+${s.price}/éj</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <button className={style.confirmBookingButton} onClick={handleConfirmBooking}>
                Foglalás megerősítése
              </button>

              {totalPrice > 0 && (
                <div className={style.totalPriceContainer}>
                  <div className={style.totalPriceInfo}>
                    <p>Összes vendég: <strong>{totalGuests} fő</strong></p>
                    {selectedMealPlan && (
                      <p>{selectedMealPlan.name}: <strong>+${selectedMealPlan.pricePerNight}/éj</strong></p>
                    )}
                    {selectedServices.length > 0 && (
                      <p>Extra szolgáltatások: <strong>+${serviceExtraPrice}/éj</strong></p>
                    )}
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