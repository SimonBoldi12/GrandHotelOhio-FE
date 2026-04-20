import style from "./RoomResult.module.css";
import { useNavigate } from "react-router";
import { isAdmin } from "../../../service/ApiService";

function RoomResult({ roomSearchResults = [], adminView = false, dateParams = "" }) {
    const navigate = useNavigate();
    const admin = isAdmin();

    return (
        <section className={style.roomResults}>
            {roomSearchResults && roomSearchResults.length > 0 && (
                <div className={style.roomList}>
                    {roomSearchResults.map(room => (
                        <div key={room.id} className={`${style.roomListItem} ${adminView ? style.roomListItemAdmin : ""}`}>
                            <img className={style.roomListItemImage} src={room.roomPhotoUrl} alt={room.roomType} />
                            <div className={style.roomDetails}>
                                <h3>{room.roomType}</h3>
                                <p>Ár: {room.roomPrice} $ / éjszaka</p>
                                <p>Leírás: {room.roomDescription}</p>
                            </div>
                            <div className={style.bookNowDiv}>
                                {adminView ? (
                                    <button
                                        className={style.editRoomButton}
                                        onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                                    >
                                        Szoba szerkesztése
                                    </button>
                                ) : (
                                    <button
                                        className={style.bookNowButton}
                                        onClick={() => navigate(`/room-details-book/${room.id}${dateParams}`)}
                                    >
                                        Megtekintés / Foglalás
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default RoomResult;