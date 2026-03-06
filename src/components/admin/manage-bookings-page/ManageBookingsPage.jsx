import style from "./ManageBookingsPage.module.css";
import { useEffect, useState } from "react";
import { getAllBookings } from "../../../service/ApiService";
import Pagination from "../../common/pagination/Pagination";
import { useNavigate } from "react-router";


function ManageBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(6);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await getAllBookings();
                const allBookings = response.bookings || [];
                setBookings(allBookings);
                setFilteredBookings(allBookings);
            } catch (error) {
                console.error("Error fetching bookings:", error.message);
            }
        }

        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings(searchTerm)
    }, [searchTerm, bookings]);

    function filterBookings(term) {
        if (term === "") {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter((booking) => 
                booking.bookingConfirmationCode && 
                booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredBookings(filtered);
        }

        setCurrentPage(1);
    }

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    console.log(currentBookings[0]);
    
    return ( 
        <div className={style.manageBookingsPage}>
            <h2 className={style.title}>Foglalások kezelése</h2>
            <div className={style.searchContainer}>
                <input 
                    type="text" 
                    placeholder="Keresés visszaigazolási kód alapján..." 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    className={style.searchInput}
                />
            </div>
            <div className={style.bookingList}>
                {currentBookings.map((booking) => (
                    <div key={booking.id} className={style.bookingItem}>
                        <p><strong>Visszaigazolási kód:</strong> {booking.bookingConfirmationCode}</p>
                        <p><strong>Vendég neve:</strong> {booking.users?.name}</p>
                        <p><strong>Szoba típusa:</strong> {booking.room?.roomType}</p>
                        <p><strong>Bejelentkezés:</strong> {booking.checkInDate}</p>
                        <p><strong>Kijelentkezés:</strong> {booking.checkOutDate}</p>
                        <p><strong>Összes Vendég:</strong> {booking.totalNumOfGuests}</p>
                        <button className={style.editButton} onClick={() => navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)}>Foglalás szerkesztése</button>
                    </div>
                 )
                )}
            </div>

            <Pagination
                roomsPerPage={bookingsPerPage}
                totalRooms={filteredBookings.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
               
     );
}

export default ManageBookingsPage;