import { useNavigate } from "react-router";
import style from "./AddRoomPage.module.css";
import { useEffect, useState } from "react";
import { getRoomTypes, addRoom as addRoomApi, addImageToRoom, getAllMealPlans, addAmenityToRoom, setRoomMealPlan } from "../../../service/ApiService";
import Toast from "../../common/toast/Toast";

const AMENITY_PRESETS = [
    { name: "WiFi", icon: "📶" },
    { name: "TV", icon: "📺" },
    { name: "Klíma", icon: "❄️" },
    { name: "Minibár", icon: "🍷" },
    { name: "Fürdőkád", icon: "🛁" },
    { name: "Zuhanyzó", icon: "🚿" },
    { name: "Széf", icon: "🔒" },
    { name: "Erkély", icon: "🌅" },
    { name: "Hajszárító", icon: "💨" },
    { name: "Kávéfőző", icon: "☕" },
    { name: "Parkoló", icon: "🚗" },
    { name: "Medence", icon: "🏊" },
];

function AddRoomPage() {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({ roomPhotoUrl: '', roomType: '', roomPrice: '', roomDescription: '' });
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [toast, setToast] = useState({ message: "", type: "success" });
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [mealPlans, setMealPlans] = useState([]);
    const [selectedMealPlanId, setSelectedMealPlanId] = useState(null);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [customAmenity, setCustomAmenity] = useState({ name: "", icon: "" });

    useEffect(() => {
        async function fetchData() {
            try {
                const [types, mealRes] = await Promise.all([getRoomTypes(), getAllMealPlans()]);
                setRoomTypes(types);
                setMealPlans(mealRes.mealPlanList || []);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        }
        fetchData();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setRoomDetails(prev => ({ ...prev, [name]: value }));
    }

    function handleRoomTypeChange(event) {
        if (event.target.value === "new") {
            setNewRoomType(true);
            setRoomDetails(prev => ({ ...prev, roomType: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prev => ({ ...prev, roomType: event.target.value }));
        }
    }

    function handleFileChange(event) {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length === 0) return;
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(f => URL.createObjectURL(f)));
    }

    function removeImage(index) {
        setFiles(files.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    }

    function toggleAmenity(amenity) {
        setSelectedAmenities(prev =>
            prev.find(a => a.name === amenity.name)
                ? prev.filter(a => a.name !== amenity.name)
                : [...prev, amenity]
        );
    }

    function addCustomAmenity() {
        if (!customAmenity.name) return;
        if (selectedAmenities.find(a => a.name === customAmenity.name)) return;
        setSelectedAmenities(prev => [...prev, { name: customAmenity.name, icon: customAmenity.icon || "⭐" }]);
        setCustomAmenity({ name: "", icon: "" });
    }

    async function addRoom() {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            setToast({ message: "Kérem töltse ki az összes mezőt.", type: "warning" });
            return;
        }
        if (!window.confirm("Biztosan hozzá szeretnéd adni a szobát?")) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("roomType", roomDetails.roomType);
            formData.append("roomPrice", roomDetails.roomPrice);
            formData.append("roomDescription", roomDetails.roomDescription);
            if (files.length > 0) formData.append("photo", files[0]);

            const result = await addRoomApi(formData);
            if (result.status !== 200) throw new Error("Szoba létrehozása sikertelen.");
            const roomId = result.room?.id;

            // Extra képek
            if (roomId && files.length > 1) {
                for (const extraFile of files.slice(1)) {
                    await addImageToRoom(roomId, extraFile);
                }
            }

            // Amenity-k
            if (roomId && selectedAmenities.length > 0) {
                for (const amenity of selectedAmenities) {
                    await addAmenityToRoom(roomId, amenity.name, amenity.icon);
                }
            }

            // Étkezési csomag
            if (roomId && selectedMealPlanId) {
                await setRoomMealPlan(roomId, selectedMealPlanId);
            }

            setToast({ message: "Szoba sikeresen hozzáadva!", type: "success" });
            setRoomDetails({ roomPhotoUrl: '', roomType: '', roomPrice: '', roomDescription: '' });
            setFiles([]);
            setPreviews([]);
            setSelectedAmenities([]);
            setSelectedMealPlanId(null);
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
                            <input type="file" name="roomPhoto" className={style.uploadInput} onChange={handleFileChange} multiple accept="image/*" />
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
                            <div className={style.addMoreArea}>
                                <div className={style.uploadPlaceholder}>
                                    <div className={style.uploadIcon}>➕</div>
                                    <p>Még több kép</p>
                                </div>
                                <input type="file" className={style.uploadInput}
                                    onChange={(e) => {
                                        const newFiles = Array.from(e.target.files);
                                        setFiles(prev => [...prev, ...newFiles]);
                                        setPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
                                    }}
                                    multiple accept="image/*" />
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
                                <input type="text" name="roomType" placeholder="Új típus neve..." value={roomDetails.roomType} onChange={handleChange} />
                            )}
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="roomPrice">Ár / éjszaka ($)</label>
                            <input type="number" name="roomPrice" id="roomPrice" placeholder="pl. 150" value={roomDetails.roomPrice} onChange={handleChange} />
                        </div>
                        <div className={`${style.formGroup} ${style.fullWidth}`}>
                            <label htmlFor="roomDescription">Leírás</label>
                            <textarea name="roomDescription" id="roomDescription" placeholder="Írd le a szoba jellemzőit..." value={roomDetails.roomDescription} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={style.sectionDivider} />

                    {/* FELSZERELTSÉG */}
                    <div className={style.sectionTitle}>🛋️ Felszereltség</div>
                    <p className={style.sectionSubtitle}>Válaszd ki a szobához tartozó felszereltséget</p>
                    <div className={style.amenityGrid}>
                        {AMENITY_PRESETS.map(a => (
                            <button
                                key={a.name}
                                type="button"
                                className={`${style.amenityChip} ${selectedAmenities.find(s => s.name === a.name) ? style.amenityChipActive : ""}`}
                                onClick={() => toggleAmenity(a)}
                            >
                                <span>{a.icon}</span>
                                <span>{a.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* EGYEDI AMENITY */}
                    <div className={style.customAmenityRow}>
                        <input
                            type="text"
                            placeholder="Emoji"
                            value={customAmenity.icon}
                            onChange={e => setCustomAmenity(p => ({ ...p, icon: e.target.value }))}
                            className={style.customIconInput}
                        />
                        <input
                            type="text"
                            placeholder="Egyedi felszereltség neve..."
                            value={customAmenity.name}
                            onChange={e => setCustomAmenity(p => ({ ...p, name: e.target.value }))}
                            className={style.customNameInput}
                        />
                        <button type="button" className={style.customAddBtn} onClick={addCustomAmenity}>+ Hozzáad</button>
                    </div>

                    {selectedAmenities.length > 0 && (
                        <div className={style.selectedAmenities}>
                            <span className={style.selectedLabel}>Kiválasztott:</span>
                            {selectedAmenities.map((a, i) => (
                                <span key={i} className={style.selectedChip}>
                                    {a.icon} {a.name}
                                    <button onClick={() => setSelectedAmenities(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className={style.sectionDivider} />

                    {/* ÉTKEZÉSI CSOMAG */}
                    <div className={style.sectionTitle}>🍽️ Étkezési csomag</div>
                    <p className={style.sectionSubtitle}>Válaszd ki az alapértelmezett étkezési csomagot (opcionális)</p>
                    <div className={style.mealPlanGrid}>
                        <button
                            type="button"
                            className={`${style.mealChip} ${selectedMealPlanId === null ? style.mealChipActive : ""}`}
                            onClick={() => setSelectedMealPlanId(null)}
                        >
                            <span>Nincs étkezés</span>
                            <span className={style.mealChipPrice}>+$0/éj</span>
                        </button>
                        {mealPlans.map(plan => (
                            <button
                                key={plan.id}
                                type="button"
                                className={`${style.mealChip} ${selectedMealPlanId === plan.id ? style.mealChipActive : ""}`}
                                onClick={() => setSelectedMealPlanId(plan.id)}
                            >
                                <span>{plan.name}</span>
                                <span className={style.mealChipPrice}>+${plan.pricePerNight}/éj</span>
                            </button>
                        ))}
                    </div>

                    <div className={style.sectionDivider} />

                    {/* GOMBOK */}
                    <div className={style.actions}>
                        <button className={style.backButton} onClick={() => navigate("/admin/manage-rooms")}>← Vissza</button>
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