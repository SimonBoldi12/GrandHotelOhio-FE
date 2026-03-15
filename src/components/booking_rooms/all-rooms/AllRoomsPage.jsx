import style from "./AllRoomsPage.module.css";
import { getAllRooms, getRoomTypes } from "../../../service/ApiService";
import RoomSearch from "../../common/room-search/RoomSearch";
import RoomResult from "../../common/room-result/RoomResult";
import Pagination from "../../common/pagination/Pagination";
import { useEffect, useState } from "react";

function AllRoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [roomsPerPage] = useState(5);

    function handleSearchResults(results) {
        setRooms(results);
        setFilteredRooms(results);
        setCurrentPage(1);
    }

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await getAllRooms();
                const allRooms = response.roomList;
                setRooms(allRooms);
                setFilteredRooms(allRooms);
            } catch (error) {
                console.error("Error fetching rooms:", error.message);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const types = await getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error("Error fetching room types:", error.message);
            }
        };

        fetchRooms();
        fetchRoomTypes();
    }, []);

    function handleRoomTypeChange(event) {
        const type = event.target.value;
        setSelectedRoomType(type);
        setFilteredRooms(type === "" ? rooms : rooms.filter(room => room.roomType === type));
        setCurrentPage(1);
    }

    const currentRooms = filteredRooms.slice(
        (currentPage - 1) * roomsPerPage,
        currentPage * roomsPerPage
    );

    return (
        <div className={style.allRoomsPage}>
            <div className={style.allRoomsContainer}>

                {/* HERO HEADER */}
                <div className={style.header}>
                    <div className={style.headerLeft}>
                        <p className={style.headerLabel}>Grand Hotel Ohio</p>
                        <h2 className={style.title}>Szobáink</h2>
                    </div>
                    <span className={style.roomCount}>
                        Elérhető: <strong>{filteredRooms.length} szoba</strong>
                    </span>
                </div>

                {/* FILTER */}
                <div className={style.filterContainer}>
                    <label htmlFor="roomType">Szűrés típus szerint</label>
                    <select id="roomType" value={selectedRoomType} onChange={handleRoomTypeChange}>
                        <option value="">Összes szoba</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* SEARCH */}
                <div className={style.searchWrapper}>
                    <RoomSearch handleSearchResult={handleSearchResults} />
                </div>

                {/* RESULTS */}
                {currentRooms.length > 0 ? (
                    <div className={style.resultsWrapper}>
                        <RoomResult roomSearchResults={currentRooms} />
                    </div>
                ) : (
                    <div className={style.resultsWrapper}>
                        <div className={style.emptyState}>
                            <div className={style.emptyIcon}>🛏️</div>
                            <p>Nem található szoba a megadott feltételeknek.</p>
                        </div>
                    </div>
                )}

                {/* PAGINATION */}
                <div className={style.paginationWrapper}>
                    <Pagination
                        roomsPerPage={roomsPerPage}
                        totalRooms={filteredRooms.length}
                        paginate={(page) => setCurrentPage(page)}
                        currentPage={currentPage}
                    />
                </div>

            </div>
        </div>
    );
}

export default AllRoomsPage;