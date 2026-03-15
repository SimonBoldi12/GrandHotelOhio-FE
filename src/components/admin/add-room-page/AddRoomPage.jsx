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
        <div className={style.addRoomWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <div className={style.addRoomPage}>

                <div className={style.header}>
                    <span className={style.badge}>Admin / Szobák</span>
                    <h2 className={style.title}>Új szoba <span>hozzáadása</span></h2>
                    <p className={style.subtitle}>Töltsd ki az adatokat és add hozzá az új szobát a rendszerhez.</p>
                </div>

                <div className={style.formCard}>

                    {/* KÉP FELTÖLTÉS */}
                    <div className={style.uploadArea}>
                        {preview ? (
                            <>
                                <img src={preview} alt="Előnézet" className={style.preview} />
                                <div className={style.previewOverlay}>
                                    <span className={style.changePhoto}>🔄 Kép cseréje</span>
                                </div>
                            </>
                        ) : (
                            <div className={style.uploadPlaceholder}>
                                <div className={style.uploadIcon}>🖼️</div>
                                <p><strong>Kattints a feltöltéshez</strong></p>
                                <p>JPG, PNG – max. 10MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            name="roomPhoto"
                            className={style.uploadInput}
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* FORM MEZŐK */}
                    <div className={style.formGrid}>
                        <div className={style.formGroup}>
                            <label htmlFor="roomType">Szoba típus</label>
                            <select id="roomType" value={newRoomType ? "new" : roomDetails.roomType} onChange={handleRoomTypeChange}>
                                <option value="">Válassz egy típust</option>
                                {roomTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                                <option value="new">+ Új típus</option>
                            </select>
                            {newRoomType && (
                                <input
                                    type="text"
                                    name="roomType"
                                    placeholder="Új típus neve..."
                                    value={roomDetails.roomType}
                                    onChange={handleChange}
                                />
                            )}
                        </div>

                        <div className={style.formGroup}>
                            <label htmlFor="roomPrice">Ár / éjszaka ($)</label>
                            <input
                                type="number"
                                name="roomPrice"
                                id="roomPrice"
                                placeholder="pl. 150"
                                value={roomDetails.roomPrice}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={`${style.formGroup} ${style.fullWidth}`}>
                            <label htmlFor="roomDescription">Leírás</label>
                            <textarea
                                name="roomDescription"
                                id="roomDescription"
                                placeholder="Írd le a szoba jellemzőit..."
                                value={roomDetails.roomDescription}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* GOMBOK */}
                    <div className={style.actions}>
                        <button className={style.backButton} onClick={() => navigate("/admin/manage-rooms")}>
                            ← Vissza
                        </button>
                        <button className={style.submitButton} onClick={addRoom}>
                            Szoba hozzáadása →
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddRoomPage;