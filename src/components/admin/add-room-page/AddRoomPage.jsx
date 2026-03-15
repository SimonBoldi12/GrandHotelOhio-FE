import { useNavigate } from "react-router";
import style from "./AddRoomPage.module.css";
import { useEffect, useState } from "react";
import { getRoomTypes, addRoom as addRoomApi, addImageToRoom } from "../../../service/ApiService";
import Toast from "../../common/toast/Toast";

function AddRoomPage() {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '', roomType: '', roomPrice: '', roomDescription: '',
    });
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [toast, setToast] = useState({ message: "", type: "success" });
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length === 0) return;

        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(f => URL.createObjectURL(f)));
    }

    function removeImage(index) {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setPreviews(newPreviews);
    }

    async function addRoom() {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            setToast({ message: "Kérem töltse ki az összes mezőt.", type: "warning" });
            return;
        }
        if (!window.confirm("Biztosan hozzá szeretnéd adni a szobát?")) return;

        setIsUploading(true);
        try {
            // 1. Szoba létrehozása az első képpel
            const formData = new FormData();
            formData.append("roomType", roomDetails.roomType);
            formData.append("roomPrice", roomDetails.roomPrice);
            formData.append("roomDescription", roomDetails.roomDescription);
            if (files.length > 0) formData.append("photo", files[0]);

            const result = await addRoomApi(formData);
            if (result.status !== 200) throw new Error("Szoba létrehozása sikertelen.");

            const roomId = result.room?.id;

            // 2. Extra képek feltöltése
            if (roomId && files.length > 1) {
                const extraFiles = files.slice(1);
                for (const extraFile of extraFiles) {
                    await addImageToRoom(roomId, extraFile);
                }
            }

            setToast({ message: `Szoba sikeresen hozzáadva${files.length > 1 ? ` (${files.length} kép feltöltve)` : ""}!`, type: "success" });
            setRoomDetails({ roomPhotoUrl: '', roomType: '', roomPrice: '', roomDescription: '' });
            setFiles([]);
            setPreviews([]);
            setTimeout(() => navigate("/admin/manage-rooms"), 2000);
        } catch (error) {
            setToast({ message: "Hiba a szoba hozzáadásakor: " + (error.response?.data?.message || error.message), type: "error" });
        } finally {
            setIsUploading(false);
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
                    {previews.length === 0 ? (
                        <div className={style.uploadArea}>
                            <div className={style.uploadPlaceholder}>
                                <div className={style.uploadIcon}>🖼️</div>
                                <p><strong>Kattints a feltöltéshez</strong></p>
                                <p>Több képet is választhatsz – JPG, PNG – max. 10MB/kép</p>
                            </div>
                            <input
                                type="file"
                                name="roomPhoto"
                                className={style.uploadInput}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                            />
                        </div>
                    ) : (
                        <div className={style.previewGrid}>
                            {previews.map((src, index) => (
                                <div key={index} className={`${style.previewItem} ${index === 0 ? style.previewMain : ""}`}>
                                    <img src={src} alt={`Kép ${index + 1}`} className={style.previewImg} />
                                    {index === 0 && <span className={style.mainBadge}>Fő kép</span>}
                                    <button className={style.removeBtn} onClick={() => removeImage(index)}>✕</button>
                                </div>
                            ))}
                            {/* Új kép hozzáadása */}
                            <div className={style.addMoreArea}>
                                <div className={style.uploadPlaceholder}>
                                    <div className={style.uploadIcon}>➕</div>
                                    <p>Még több kép</p>
                                </div>
                                <input
                                    type="file"
                                    className={style.uploadInput}
                                    onChange={(e) => {
                                        const newFiles = Array.from(e.target.files);
                                        setFiles(prev => [...prev, ...newFiles]);
                                        setPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
                                    }}
                                    multiple
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    )}

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
                        <button className={style.submitButton} onClick={addRoom} disabled={isUploading}>
                            {isUploading ? "Feltöltés..." : "Szoba hozzáadása →"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddRoomPage;