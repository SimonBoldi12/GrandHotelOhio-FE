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
    }

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await getAllRooms();
                const allRooms = await response.roomList;
                setRooms(allRooms);
                setFilteredRooms(allRooms);
            } catch (error) {
                console.error("Error fetching rooms:", error.message);
            }
        }

        const fetchRoomTypes = async () => {
            try {
                const types = await getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error("Error fetching room types:", error.message);
            }
        }

        fetchRooms();
        fetchRoomTypes();
    }, [])

    function handleRoomTypeChange(event) {
        setSelectedRoomType(event.target.value);
        filterRooms(event.target.value);
    }

    function filterRooms(type){
        if(type === "") {
            setFilteredRooms(rooms);
        } else {
            const filtered = rooms.filter(room => room.roomType === type);
            setFilteredRooms(filtered);
        }
        setCurrentPage(1);
    }

    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return ( 
        <div className={style.allRoomsContainer}>
            <h2>Szobák</h2>
            <div className={style.filterContainer}>
                <label htmlFor="roomType">Szűrés szobatípus alapján: </label>
                <select id="roomType" value={selectedRoomType} onChange={handleRoomTypeChange}>
                    <option value="">Összes</option>
                    {roomTypes.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <RoomSearch handleSearchResult={handleSearchResults} />
            <RoomResult roomSearchResults={currentRooms} />
            <Pagination
                roomsPerPage={roomsPerPage}
                totalRooms={filteredRooms.length}
                paginate={paginate}
                currentPage={currentPage}
            />


        </div>

        
    );
}

export default AllRoomsPage;