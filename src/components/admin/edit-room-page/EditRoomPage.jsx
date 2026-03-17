import { useNavigate, useParams } from "react-router";
import style from "./EditRoomPage.module.css";
import { useEffect, useState } from "react";
import {
    deleteRoom, getRoomById, updateRoom, addImageToRoom,
    getAllMealPlans, addAmenityToRoom, deleteAmenityFromRoom,
    addMealPlanToRoom, removeMealPlanFromRoom
} from "../../../service/ApiService";
import Toast from "../../common/toast/Toast";

const MEAL_TYPE_LABEL = {
    BREAKFAST: "Csak reggeli",
    HALF_BOARD: "Félpanzió",
    ALL_INCLUSIVE: "All inclusive",
    NONE: "Nincs étkezés",
};

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

    // Amenity
    const [amenities, setAmenities] = useState([]);
    const [newAmenityName, setNewAmenityName] = useState("");
    const [newAmenityIcon, setNewAmenityIcon] = useState("");

    // Meal plan - most több lehet
    const [mealPlans, setMealPlans] = useState([]);
    const [roomMealPlans, setRoomMealPlans] = useState([]);
    const [selectedMealPlanId, setSelectedMealPlanId] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getRoomById(roomId);
                const room = response.room;
                setRoomDetails({
                    roomPhotoUrl: room.roomPhotoUrl,
                    roomType: room.roomType,
                    roomPrice: room.roomPrice,
                    roomDescription: room.roomDescription,
                });
                setPreview(room.roomPhotoUrl);
                setExistingImages(room.imageUrls || []);
                setAmenities(room.amenities || []);
                setRoomMealPlans(room.mealPlans || []);

                const mealRes = await getAllMealPlans();
                setMealPlans(mealRes.mealPlanList || []);
            } catch (error) {
                setToast({ message: "Szoba adatok lekérése sikertelen: " + (error.response?.data?.message || error.message), type: "error" });
            }
        }
        fetchData();
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

    async function handleAddAmenity() {
        if (!newAmenityName.trim()) {
            setToast({ message: "Kérem adja meg a felszereltség nevét.", type: "warning" });
            return;
        }
        try {
            await addAmenityToRoom(roomId, newAmenityName, newAmenityIcon || "⭐");
            setToast({ message: "Felszereltség hozzáadva!", type: "success" });
            setNewAmenityName("");
            setNewAmenityIcon("");
            const res = await getRoomById(roomId);
            setAmenities(res.room.amenities || []);
        } catch (error) {
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        }
    }

    async function handleDeleteAmenity(amenityId) {
        try {
            await deleteAmenityFromRoom(amenityId);
            setAmenities(prev => prev.filter(a => a.id !== amenityId));
            setToast({ message: "Felszereltség törölve!", type: "success" });
        } catch (error) {
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        }
    }

    async function handleAddMealPlan() {
        if (!selectedMealPlanId) return;
        try {
            await addMealPlanToRoom(roomId, selectedMealPlanId);
            const res = await getRoomById(roomId);
            setRoomMealPlans(res.room.mealPlans || []);
            setSelectedMealPlanId("");
            setToast({ message: "Étkezési csomag hozzáadva!", type: "success" });
        } catch (error) {
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        }
    }

    async function handleRemoveMealPlan(mealPlanId) {
        try {
            await removeMealPlanFromRoom(roomId, mealPlanId);
            setRoomMealPlans(prev => prev.filter(m => m.id !== mealPlanId));
            setToast({ message: "Étkezési csomag eltávolítva!", type: "success" });
        } catch (error) {
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        }
    }

    async function handleUpdate() {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("roomType", roomDetails.roomType);
            formData.append("roomPrice", roomDetails.roomPrice);
            formData.append("roomDescription", roomDetails.roomDescription);
            if (file) formData.append("photo", file);
            const result = await updateRoom(roomId, formData);
            if (result.status !== 200) throw new Error("Frissítés sikertelen.");

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
                            <input type="file" className={style.uploadInput} onChange={handleNewImagesChange} multiple accept="image/*" />
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

                    {/* FELSZERELTSÉG */}
                    <div className={style.sectionLabel}>🛋️ Felszereltség</div>
                    <div className={style.amenityAddRow}>
                        <input
                            type="text"
                            placeholder="pl. 🛁"
                            value={newAmenityIcon}
                            onChange={e => setNewAmenityIcon(e.target.value)}
                            className={style.iconInput}
                        />
                        <input
                            type="text"
                            placeholder="Felszereltség neve..."
                            value={newAmenityName}
                            onChange={e => setNewAmenityName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAddAmenity()}
                            className={style.amenityInput}
                        />
                        <button className={style.addAmenityBtn} onClick={handleAddAmenity}>
                            Hozzáadás
                        </button>
                    </div>
                    {amenities.length > 0 ? (
                        <div className={style.amenityList}>
                            {amenities.map(a => (
                                <div key={a.id} className={style.amenityItem}>
                                    <span className={style.amenityIcon}>{a.icon}</span>
                                    <span className={style.amenityName}>{a.name}</span>
                                    <button className={style.amenityDeleteBtn} onClick={() => handleDeleteAmenity(a.id)}>✕</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={style.emptyHint}>Még nincs felszereltség ehhez a szobához.</p>
                    )}

                    <div className={style.divider} />

                    {/* ÉTKEZÉSI CSOMAGOK */}
                    <div className={style.sectionLabel}>🍽️ Étkezési csomagok</div>
                    {roomMealPlans.length > 0 ? (
                        <div className={style.amenityList}>
                            {roomMealPlans.map(m => (
                                <div key={m.id} className={style.amenityItem}>
                                    <span className={style.amenityIcon}>🍽️</span>
                                    <span className={style.amenityName}>
                                        {m.name}
                                        <span className={style.mealPlanPrice}> · +${m.pricePerNight}/éj</span>
                                    </span>
                                    <button className={style.amenityDeleteBtn} onClick={() => handleRemoveMealPlan(m.id)}>✕</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={style.emptyHint}>Nincs étkezési csomag hozzárendelve.</p>
                    )}
                    <div className={style.mealPlanSetRow}>
                        <select
                            value={selectedMealPlanId}
                            onChange={e => setSelectedMealPlanId(e.target.value)}
                            className={style.mealPlanSelect}
                        >
                            <option value="">Válassz étkezési csomagot...</option>
                            {mealPlans
                                .filter(m => !roomMealPlans.find(rm => rm.id === m.id))
                                .map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} – +${m.pricePerNight}/éj
                                    </option>
                                ))
                            }
                        </select>
                        <button
                            className={style.mealPlanSetBtn}
                            onClick={handleAddMealPlan}
                            disabled={!selectedMealPlanId}
                        >
                            Hozzáadás
                        </button>
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