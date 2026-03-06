import { useNavigate } from "react-router";
import style from "./ManageRoomPage.module.css";
import { useEffect, useState } from "react";
import { getAllRooms, getRoomTypes } from "../../../service/ApiService";
import RoomResult from "../../common/room-result/RoomResult";
import Pagination from "../../common/pagination/Pagination";

function ManageRoomPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await getAllRooms();
        const allRooms = response.roomList;
        setRooms(allRooms);
        setFilteredRooms(allRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
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
    setSelectedRoomType(event.target.value);
    filterRooms(event.target.value);
  }

  function filterRooms(type) {
    if (type === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === type);
      setFilteredRooms(filtered);
    }
  }

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={style.manageRoomPage}>
        <h2 className={style.title}>Szobák kezelése</h2>
        <div className={style.controls}>
            <label htmlFor="roomType">Szoba típus:</label>
            <select id="roomType" value={selectedRoomType} onChange={handleRoomTypeChange}>
                <option value="">Összes</option>
                {roomTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button onClick={() => navigate("/admin/add-room")} className={style.addRoomButton}>
                Új szoba
            </button>
        </div>

        <RoomResult roomSearchResults={currentRooms} />

        <Pagination 
        roomsPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}
        />
    </div>
  );
}

export default ManageRoomPage;
