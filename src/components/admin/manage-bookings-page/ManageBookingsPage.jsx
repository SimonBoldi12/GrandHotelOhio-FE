import style from "./ManageBookingsPage.module.css";
import { useEffect, useState } from "react";
import { getAllBookings } from "../../../service/ApiService";
import Pagination from "../../common/pagination/Pagination";
import { useNavigate } from "react-router";
import Toast from "../../common/toast/Toast";

function ManageBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(6);
  const [toast, setToast] = useState({ message: "", type: "error" });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await getAllBookings();
        const allBookings = response.bookings || [];
        setBookings(allBookings);
        setFilteredBookings(allBookings);
      } catch (error) {
        setToast({
          message: "Foglalások lekérése sikertelen: " + error.message,
          type: "error",
        });
      }
    }
    fetchBookings();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(
          (b) =>
            b.bookingConfirmationCode
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            b.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
    setCurrentPage(1);
  }, [searchTerm, bookings]);

  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage,
  );

  return (
    <div className={style.manageBookingsWrapper}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
      <div className={style.manageBookingsPage}>
        {/* HEADER */}
        <div className={style.header}>
          <div>
            <span className={style.badge}>Admin / Foglalások</span>
            <h2 className={style.title}>
              Foglalások <span>kezelése</span>
            </h2>
            <p className={style.subtitle}>
              Összes foglalás megtekintése, keresése és szerkesztése.
            </p>
          </div>
          <span className={style.bookingCount}>
            Találat: <strong>{filteredBookings.length} foglalás</strong>
          </span>
        </div>

        {/* KERESÉS */}
        <div className={style.searchContainer}>
          <span className={style.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Keresés kód vagy vendég neve alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchInput}
          />
        </div>

        {/* LISTA */}
        {currentBookings.length > 0 ? (
          <div className={style.bookingList}>
            {currentBookings.map((booking) => (
              <div key={booking.id} className={style.bookingItem}>
                <div className={style.bookingItemInner}>
                  <div className={style.bookingHeader}>
                    <span className={style.confirmationCode}>
                      {booking.bookingConfirmationCode}
                    </span>
                    <span className={style.roomTypeBadge}>
                      {booking.room?.roomType}
                    </span>
                  </div>
                  <div className={style.bookingFields}>
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Vendég</span>
                      <span className={style.fieldValue}>
                        {booking.users?.name}
                      </span>
                    </div>
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Vendégek</span>
                      <span className={style.fieldValue}>
                        {booking.totalNumOfGuests} fő
                      </span>
                    </div>
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Érkezés</span>
                      <span className={style.fieldValue}>
                        {booking.checkInDate}
                      </span>
                    </div>
                    <div className={style.field}>
                      <span className={style.fieldLabel}>Távozás</span>
                      <span className={style.fieldValue}>
                        {booking.checkOutDate}
                      </span>
                    </div>
                  </div>
                  <div className={style.divider} />
                  <button
                    className={style.editButton}
                    onClick={() =>
                      navigate(
                        `/admin/edit-booking/${booking.bookingConfirmationCode}`,
                      )
                    }
                  >
                    Foglalás szerkesztése →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={style.emptyState}>
            <div className={style.emptyIcon}>📋</div>
            <p>Nem található foglalás.</p>
          </div>
        )}

        <div className={style.paginationWrapper}>
          <Pagination
            roomsPerPage={bookingsPerPage}
            totalRooms={filteredBookings.length}
            currentPage={currentPage}
            paginate={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageBookingsPage;
