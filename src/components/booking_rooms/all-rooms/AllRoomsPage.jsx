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
    const [sortedRooms, setSortedRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [roomsPerPage] = useState(5);
    const [dateParams, setDateParams] = useState("");

    function handleSearchResults(results, checkIn, checkOut) {
        setRooms(results);
        setFilteredRooms(results);
        setCurrentPage(1);
        if (checkIn && checkOut) {
            setDateParams(`?checkIn=${checkIn}&checkOut=${checkOut}`);
        }
    }

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await getAllRooms();
                const allRooms = response.roomList;
                setRooms(allRooms);
                setFilteredRooms(allRooms);
            } catch (error) {
                console.error("Hiba a szobák lekérésekor:", error.message);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const types = await getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error("Hiba a szobatípusok lekérésekor:", error.message);
            }
        };

        fetchRooms();
        fetchRoomTypes();
    }, []);

    useEffect(() => {
        let result = [...filteredRooms];

        if (priceSort === "asc") {
            result.sort((a, b) => a.roomPrice - b.roomPrice);
        } else if (priceSort === "desc") {
            result.sort((a, b) => b.roomPrice - a.roomPrice);
        }

        setSortedRooms(result);
        setCurrentPage(1);
    }, [filteredRooms, priceSort]);

    function handleRoomTypeChange(event) {
        const type = event.target.value;
        setSelectedRoomType(type);
        const base = type === "" ? rooms : rooms.filter(room => room.roomType === type);
        setFilteredRooms(base);
        setCurrentPage(1);
    }

    function handlePriceSortChange(event) {
        setPriceSort(event.target.value);
        setCurrentPage(1);
    }

    const currentRooms = sortedRooms.slice(
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
                    <div className={style.filterGroup}>
                        <label htmlFor="roomType">Szobatípus</label>
                        <select id="roomType" value={selectedRoomType} onChange={handleRoomTypeChange}>
                            <option value="">Összes szoba</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className={style.filterDivider} />

                    <div className={style.filterGroup}>
                        <label htmlFor="priceSort">Ár szerinti rendezés</label>
                        <div className={style.sortButtons}>
                            <button
                                className={`${style.sortBtn} ${priceSort === "asc" ? style.sortBtnActive : ""}`}
                                onClick={() => setPriceSort(priceSort === "asc" ? "" : "asc")}
                            >
                                ↑ Legolcsóbb
                            </button>
                            <button
                                className={`${style.sortBtn} ${priceSort === "desc" ? style.sortBtnActive : ""}`}
                                onClick={() => setPriceSort(priceSort === "desc" ? "" : "desc")}
                            >
                                ↓ Legdrágább
                            </button>
                        </div>
                    </div>

                    <div className={style.filterRight}>
                        {(selectedRoomType || priceSort) && (
                            <button
                                className={style.clearBtn}
                                onClick={() => {
                                    setSelectedRoomType("");
                                    setPriceSort("");
                                    setFilteredRooms(rooms);
                                    setCurrentPage(1);
                                }}
                            >
                                ✕ Szűrők törlése
                            </button>
                        )}
                    </div>
                </div>

                {/* SEARCH */}
                <div className={style.searchWrapper}>
                    <RoomSearch handleSearchResult={handleSearchResults} />
                </div>

                {/* RESULTS */}
                {currentRooms.length > 0 ? (
                    <div className={style.resultsWrapper}>
                        <RoomResult
                            roomSearchResults={currentRooms}
                            dateParams={dateParams}
                        />
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
                        totalRooms={sortedRooms.length}
                        paginate={(page) => setCurrentPage(page)}
                        currentPage={currentPage}
                    />
                </div>

            </div>
        </div>
    );
}

export default AllRoomsPage;