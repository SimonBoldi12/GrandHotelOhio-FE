import { useNavigate, useParams } from "react-router";
import style from "./EditRoomPage.module.css";
import { useEffect, useState } from "react";
import { deleteRoom, getRoomById, updateRoom } from "../../../service/ApiService";

function EditRoomPage() {
     const { roomId } = useParams();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        async function fetchRoomDetails() {
            try {
                const response = await getRoomById(roomId);
                setRoomDetails({
                    roomPhotoUrl: response.room.roomPhotoUrl,
                    roomType: response.room.roomType,
                    roomPrice: response.room.roomPrice,
                    roomDescription: response.room.roomDescription,
                });
            } catch (error) {
                setError("Szoba adatok lekérése sikertelen." + (error.response?.data?.message || error.message));
            }
        }
        fetchRoomDetails();
    }, [roomId]);

    function handleChange(event) {
        const { name, value } = event.target;
        setRoomDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if(selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }else{
            setFile(null);
            setPreview(null);
        }
    }

    async function handleUpdate() {
        try {
            const formData = new FormData();
            formData.append("roomType", roomDetails.roomType);
            formData.append("roomPrice", roomDetails.roomPrice);
            formData.append("roomDescription", roomDetails.roomDescription);

            if(file) {
                formData.append("photo", file); 
            }
            const result = await updateRoom(roomId, formData);
            if(result.status === 200) {
                setSuccess("Szoba sikeresen frissítve!");
                setTimeout(() => {
                    setSuccess('');
                    navigate("/admin/manage-rooms");
                }, 2000);
            }
        } catch (error) {
            setError("Szoba frissítése sikertelen." + (error.response?.data?.message || error.message));
            setTimeout(() => setError(''), 5000);
        }
    }

    async function handleDelete() {
    if(!window.confirm("Biztosan törölni szeretnéd a szobát? Ez a művelet visszafordíthatatlan!")){
        return;
    }
    try {
        const result = await deleteRoom(roomId);
        if(result.status === 200) {
            setSuccess("Szoba sikeresen törölve!");
            setTimeout(() => {
                setSuccess('');
                navigate("/admin/manage-rooms");
            }, 2000);
        }
    } catch (error) {
        setError("Szoba törlése sikertelen." + (error.response?.data?.message || error.message));
        setTimeout(() => setError(''), 5000);
    }
}

    return ( 
        <div className={style.editRoomPage}>
            <h2 className={style.title}>Szoba szerkesztése</h2>
            {error && <p className={style.error}>{error}</p>}
            {success && <p className={style.success}>{success}</p>}
            <div className={style.form}>
                <div className={style.formGroup}>
                    {preview ? (
                        <img src={preview} alt="Room preview" className={style.preview} />
                    ) : (
                        <input 
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange} />
                    )}
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="roomType">Szoba típus:</label>
                    <input
                        type="text"
                        name="roomType"
                        id="roomType"
                        value={roomDetails.roomType}
                        onChange={handleChange}
                    />
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="roomPrice">Szoba ára:</label>
                    <input 
                    type="number"
                    name="roomPrice"
                    id="roomPrice"
                    value={roomDetails.roomPrice}
                    onChange={handleChange}
                    />
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="roomDescription">Szoba leírása:</label>
                    <textarea 
                    name="roomDescription"
                    id="roomDescription"
                    value={roomDetails.roomDescription}
                    onChange={handleChange}
                    />
                </div>

                <button className={style.submitButton} onClick={handleUpdate}>
                    Szoba frissítése
                </button>
                <button className={style.deleteButton} onClick={handleDelete}>
                    Szoba törlése
                </button>
            </div>
        </div>
     );
}

export default EditRoomPage;