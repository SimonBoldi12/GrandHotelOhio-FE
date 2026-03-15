import { useNavigate } from "react-router";
import style from "./AddRoomPage.module.css";
import { useEffect, useState } from "react";
import { getRoomTypes, addRoom as addRoomApi } from "../../../service/ApiService";
import Toast from "../../common/toast/Toast";

function AddRoomPage() {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '', roomType: '', roomPrice: '', roomDescription: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "success" });
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        async function fetchRoomTypes() {
            try {
                const response = await getRoomTypes();
                setRoomTypes(response);
            } catch (error) {
                console.error("Error fetching room types:", error.message);
            }
        }
        fetchRoomTypes();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setRoomDetails((prevState) => ({ ...prevState, [name]: value }));
    }

    function handleRoomTypeChange(event) {
        if (event.target.value === "new") {
            setNewRoomType(true);
            setRoomDetails((prevState) => ({ ...prevState, roomType: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails((prevState) => ({ ...prevState, roomType: event.target.value }));
        }
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    }

    async function addRoom() {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            setToast({ message: "Kérem töltse ki az összes mezőt.", type: "warning" });
            return;
        }
        if (!window.confirm("Biztosan hozzá szeretnéd adni a szobát?")) return;
        try {
            const formData = new FormData();
            formData.append("roomType", roomDetails.roomType);
            formData.append("roomPrice", roomDetails.roomPrice);
            formData.append("roomDescription", roomDetails.roomDescription);
            if (file) formData.append("photo", file);
            const result = await addRoomApi(formData);
            if (result.status === 200) {
                setToast({ message: "Szoba sikeresen hozzáadva!", type: "success" });
                setRoomDetails({ roomPhotoUrl: '', roomType: '', roomPrice: '', roomDescription: '' });
                setFile(null);
                setPreview(null);
                setTimeout(() => navigate("/admin/manage-rooms"), 2000);
            }
        } catch (error) {
            setToast({ message: "Hiba a szoba hozzáadásakor: " + (error.response?.data?.message || error.message), type: "error" });
        }
    }

    return (
        <div className={style.addRoomPage}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <h2 className={style.title}>Új szoba hozzáadása</h2>
            <div className={style.form}>
                <div className={style.formGroup}>
                    {preview && <img src={preview} alt="Room preview" className={style.preview} />}
                    <input type="file" name="roomPhoto" onChange={handleFileChange} />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="roomType">Szoba típus:</label>
                    <select id="roomType" value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                        <option value="">Válassz egy típust</option>
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">Új típus</option>
                    </select>
                    {newRoomType && (
                        <input type="text" name="roomType" placeholder="Add meg az új típus nevét" value={roomDetails.roomType} onChange={handleChange} />
                    )}
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="roomPrice">Szoba ára:</label>
                    <input type="number" name="roomPrice" id="roomPrice" value={roomDetails.roomPrice} onChange={handleChange} />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="roomDescription">Szoba leírása:</label>
                    <textarea name="roomDescription" id="roomDescription" value={roomDetails.roomDescription} onChange={handleChange} />
                </div>
                <button className={style.submitButton} onClick={addRoom}>Szoba hozzáadása</button>
            </div>
        </div>
    );
}

export default AddRoomPage;