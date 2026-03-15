import { useNavigate, useParams } from "react-router";
import style from "./EditRoomPage.module.css";
import { useEffect, useState } from "react";
import { deleteRoom, getRoomById, updateRoom, addImageToRoom } from "../../../service/ApiService";
import Toast from "../../common/toast/Toast";

function EditRoomPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '', roomType: '', roomPrice: '', roomDescription: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "success" });

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
                setPreview(response.room.roomPhotoUrl);
                setExistingImages(response.room.imageUrls || []);
            } catch (error) {
                setToast({ message: "Szoba adatok lekérése sikertelen: " + (error.response?.data?.message || error.message), type: "error" });
            }
        }
        fetchRoomDetails();
    }, [roomId]);

    function handleChange(event) {
        const { name, value } = event.target;
        setRoomDetails((prevState) => ({ ...prevState, [name]: value }));
    }

    function handleMainPhotoChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    }

    function handleNewImagesChange(event) {
        const selected = Array.from(event.target.files);
        if (selected.length === 0) return;
        setNewFiles(prev => [...prev, ...selected]);
        setNewPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
    }

    function removeNewImage(index) {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    }

    async function handleUpdate() {
        setIsUploading(true);
        try {
            // 1. Alap adatok + fő kép frissítése
            const formData = new FormData();
            formData.append("roomType", roomDetails.roomType);
            formData.append("roomPrice", roomDetails.roomPrice);
            formData.append("roomDescription", roomDetails.roomDescription);
            if (file) formData.append("photo", file);
            const result = await updateRoom(roomId, formData);
            if (result.status !== 200) throw new Error("Frissítés sikertelen.");

            // 2. Új extra képek feltöltése
            if (newFiles.length > 0) {
                for (const newFile of newFiles) {
                    await addImageToRoom(roomId, newFile);
                }
            }

            setToast({ message: "Szoba sikeresen frissítve!", type: "success" });
            setTimeout(() => navigate("/admin/manage-rooms"), 2000);
        } catch (error) {
            setToast({ message: "Szoba frissítése sikertelen: " + (error.response?.data?.message || error.message), type: "error" });
        } finally {
            setIsUploading(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Biztosan törölni szeretnéd a szobát? Ez a művelet visszafordíthatatlan!")) return;
        try {
            const result = await deleteRoom(roomId);
            if (result.status === 200) {
                setToast({ message: "Szoba sikeresen törölve!", type: "success" });
                setTimeout(() => navigate("/admin/manage-rooms"), 2000);
            }
        } catch (error) {
            setToast({ message: "Szoba törlése sikertelen: " + (error.response?.data?.message || error.message), type: "error" });
        }
    }

    return (
        <div className={style.editRoomWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <div className={style.editRoomPage}>

                <div className={style.header}>
                    <span className={style.badge}>Admin / Szobák</span>
                    <h2 className={style.title}>Szoba <span>szerkesztése</span></h2>
                    <p className={style.subtitle}>Módosítsd a szoba adatait vagy töröld a rendszerből.</p>
                </div>

                <div className={style.formCard}>

                    {/* FŐ KÉP */}
                    <div className={style.sectionLabel}>Fő kép</div>
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
                        <input type="file" name="roomPhoto" className={style.uploadInput} onChange={handleMainPhotoChange} accept="image/*" />
                    </div>

                    {/* MEGLÉVŐ EXTRA KÉPEK */}
                    {existingImages.length > 0 && (
                        <>
                            <div className={style.sectionLabel}>Meglévő képek</div>
                            <div className={style.previewGrid}>
                                {existingImages.map((url, index) => (
                                    <div key={index} className={style.previewItem}>
                                        <img src={url} alt={`Kép ${index + 1}`} className={style.previewImg} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ÚJ EXTRA KÉPEK */}
                    <div className={style.sectionLabel}>
                        Új képek hozzáadása
                        {newFiles.length > 0 && <span className={style.imageCount}>{newFiles.length} kép kiválasztva</span>}
                    </div>
                    <div className={style.previewGrid}>
                        {newPreviews.map((src, index) => (
                            <div key={index} className={style.previewItem}>
                                <img src={src} alt={`Új kép ${index + 1}`} className={style.previewImg} />
                                <button className={style.removeBtn} onClick={() => removeNewImage(index)}>✕</button>
                            </div>
                        ))}
                        <div className={style.addMoreArea}>
                            <div className={style.uploadPlaceholder}>
                                <div className={style.uploadIcon}>➕</div>
                                <p>Képek hozzáadása</p>
                            </div>
                            <input
                                type="file"
                                className={style.uploadInput}
                                onChange={handleNewImagesChange}
                                multiple
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* MEZŐK */}
                    <div className={style.formGrid}>
                        <div className={style.formGroup}>
                            <label htmlFor="roomType">Szoba típus</label>
                            <input type="text" name="roomType" id="roomType" value={roomDetails.roomType} onChange={handleChange} />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="roomPrice">Ár / éjszaka ($)</label>
                            <input type="number" name="roomPrice" id="roomPrice" value={roomDetails.roomPrice} onChange={handleChange} />
                        </div>
                        <div className={`${style.formGroup} ${style.fullWidth}`}>
                            <label htmlFor="roomDescription">Leírás</label>
                            <textarea name="roomDescription" id="roomDescription" value={roomDetails.roomDescription} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={style.divider} />

                    {/* GOMBOK */}
                    <div className={style.actions}>
                        <button className={style.backButton} onClick={() => navigate("/admin/manage-rooms")}>← Vissza</button>
                        <button className={style.submitButton} onClick={handleUpdate} disabled={isUploading}>
                            {isUploading ? "Mentés..." : "Változtatások mentése →"}
                        </button>
                    </div>

                    <div className={style.divider} />

                    {/* DANGER ZONE */}
                    <div className={style.dangerZone}>
                        <div className={style.dangerInfo}>
                            <h4>Szoba törlése</h4>
                            <p>Ez a művelet visszafordíthatatlan. A szoba véglegesen törlésre kerül.</p>
                        </div>
                        <button className={style.deleteButton} onClick={handleDelete}>Törlés</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EditRoomPage;