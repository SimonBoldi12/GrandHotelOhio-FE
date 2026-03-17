import { useNavigate } from "react-router";
import style from "./ManageRoomPage.module.css";
import { useEffect, useState } from "react";
import { getAllRooms, getRoomTypes } from "../../../service/ApiService";
import RoomResult from "../../common/room-result/RoomResult";
import Pagination from "../../common/pagination/Pagination";
import Toast from "../../common/toast/Toast";

function ManageRoomPage() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(5);
    const [toast, setToast] = useState({ message: "", type: "error" });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await getAllRooms();
                setRooms(response.roomList);
                setFilteredRooms(response.roomList);
            } catch (error) {
                setToast({ message: "Szobák lekérése sikertelen: " + error.message, type: "error" });
            }
        }
        async function fetchRoomTypes() {
            try {
                const types = await getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error("Error fetching room types:", error.message);
            }
        }
        fetchRooms();
        fetchRoomTypes();
    }, []);

    function handleRoomTypeChange(event) {
        const type = event.target.value;
        setSelectedRoomType(type);
        setFilteredRooms(type === "" ? rooms : rooms.filter((room) => room.roomType === type));
        setCurrentPage(1);
    }

    const currentRooms = filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

    return (
        <div className={style.manageRoomWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />
            <div className={style.manageRoomPage}>

                {/* HEADER */}
                <div className={style.header}>
                    <div className={style.headerLeft}>
                        <span className={style.badge}>Admin / Szobák</span>
                        <h2 className={style.title}>Szobák <span>kezelése</span></h2>
                        <p className={style.subtitle}>Szobák listázása, szerkesztése és törlése.</p>
                    </div>
                    <div className={style.headerRight}>
                        <button className={style.addRoomButton} onClick={() => navigate("/admin/add-room")}>
                        + Új szoba hozzáadása
                        </button>
                        <button className={style.backButton} onClick={() => navigate("/admin")}>← Vissza</button>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className={style.controls}>
                    <label htmlFor="roomType">Szűrés típus szerint</label>
                    <select id="roomType" value={selectedRoomType} onChange={handleRoomTypeChange}>
                        <option value="">Összes szoba</option>
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <span className={style.roomCount}>
                        Találat: <strong>{filteredRooms.length} szoba</strong>
                    </span>
                </div>

                {/* SZOBÁK LISTÁJA */}
                {currentRooms.length > 0 ? (
                    <div className={style.roomListWrapper}>
                        <RoomResult roomSearchResults={currentRooms} adminView={true} />
                    </div>
                ) : (
                    <div className={style.roomListWrapper}>
                        <div className={style.emptyState}>
                            <div className={style.emptyIcon}>🛏️</div>
                            <p>Nem található szoba a kiválasztott típushoz.</p>
                        </div>
                    </div>
                )}

                {/* PAGINATION */}
                <div className={style.paginationWrapper}>
                    <Pagination
                        roomsPerPage={roomsPerPage}
                        totalRooms={filteredRooms.length}
                        currentPage={currentPage}
                        paginate={(page) => setCurrentPage(page)}
                    />
                </div>

            </div>
        </div>
    );
}

export default ManageRoomPage;