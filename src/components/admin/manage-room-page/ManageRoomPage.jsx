import { useNavigate } from "react-router";
import style from "./ManageRoomPage.module.css";
import { useEffect, useState } from "react";
import { getAllRooms, getRoomTypes } from "../../../service/ApiService";
import RoomResult from "../../common/room-result/RoomResult";
import Pagination from "../../common/pagination/Pagination";
import Toast from "../../../common/toast/Toast";

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
    }

    const currentRooms = filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

    return (
        <div className={style.manageRoomPage}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />
            <h2 className={style.title}>Szobák kezelése</h2>
            <div className={style.controls}>
                <label htmlFor="roomType">Szoba típus:</label>
                <select id="roomType" value={selectedRoomType} onChange={handleRoomTypeChange}>
                    <option value="">Összes</option>
                    {roomTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <button onClick={() => navigate("/admin/add-room")} className={style.addRoomButton}>Új szoba</button>
            </div>
            <RoomResult roomSearchResults={currentRooms} />
            <Pagination roomsPerPage={roomsPerPage} totalRooms={filteredRooms.length} currentPage={currentPage} paginate={(page) => setCurrentPage(page)} />
        </div>
    );
}

export default ManageRoomPage;