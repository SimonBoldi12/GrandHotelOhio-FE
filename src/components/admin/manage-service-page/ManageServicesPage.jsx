import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import style from "./ManageServicesPage.module.css";
import Toast from "../../common/toast/Toast";
import {
    getAllMealPlans, addMealPlan, deleteMealPlan, updateMealPlan,
    getAllServices, addService, deleteService
} from "../../../service/ApiService";
import { useConfirm } from "../../../hooks/useConfirm";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";

const MEAL_PLAN_TYPES = [
    { value: "NONE", label: "Nincs étkezés" },
    { value: "BREAKFAST", label: "Csak reggeli" },
    { value: "HALF_BOARD", label: "Félpanzió" },
    { value: "ALL_INCLUSIVE", label: "All inclusive" },
];

const SERVICE_CATEGORIES = [
    "Wellness", "Sport", "Étterem", "Bár", "Szépségápolás", "Egyéb"
];

function ManageServicesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("meals");
    const [mealPlans, setMealPlans] = useState([]);
    const [services, setServices] = useState([]);
    const [toast, setToast] = useState({ message: "", type: "success" });

    const [mealForm, setMealForm] = useState({ type: "BREAKFAST", name: "", pricePerNight: "" });
    const [editingMeal, setEditingMeal] = useState(null);

    const [serviceForm, setServiceForm] = useState({
        category: "Wellness", name: "", description: "", price: "", photo: null, photoPreview: null
    });

    const { confirm, config } = useConfirm();

    useEffect(() => {
        fetchMealPlans();
        fetchServices();
    }, []);

    async function fetchMealPlans() {
        try {
            const res = await getAllMealPlans();
            setMealPlans(res.mealPlanList || []);
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    async function fetchServices() {
        try {
            const res = await getAllServices();
            setServices(res.serviceList || []);
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    // ── ÉTKEZÉSI CSOMAGOK ──
    async function handleAddMealPlan() {
        if (!mealForm.name || !mealForm.pricePerNight) {
            setToast({ message: "Kérem töltse ki a kötelező mezőket.", type: "warning" });
            return;
        }
        try {
            await addMealPlan(mealForm.type, mealForm.name, parseFloat(mealForm.pricePerNight));
            setToast({ message: "Étkezési csomag hozzáadva!", type: "success" });
            setMealForm({ type: "BREAKFAST", name: "", pricePerNight: "" });
            fetchMealPlans();
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    async function handleUpdateMealPlan() {
        if (!editingMeal.name || !editingMeal.pricePerNight) return;
        try {
            await updateMealPlan(editingMeal.id, editingMeal.name, parseFloat(editingMeal.pricePerNight));
            setToast({ message: "Étkezési csomag frissítve!", type: "success" });
            setEditingMeal(null);
            fetchMealPlans();
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    async function handleDeleteMealPlan(id) {
    const meal = mealPlans.find(m => m.id === id);
    const ok = await confirm({
            title: "Étkezési csomag törlése",
            message: `Biztosan törölni szeretnéd ${meal?.name || "az adott étkezési csomagot"}? Ez a művelet visszafordíthatatlan!`,
            confirmText: "Törlés",
            cancelText: "Mégse",
            confirmVariant: "danger",
        });
        if (!ok) return;
    try {
        await deleteMealPlan(id);
        setToast({ message: "Étkezési csomag törölve!", type: "success" });
        fetchMealPlans();
    } catch (err) {
        setToast({ message: err.response?.data?.message || err.message, type: "error" });
    }
    }

    // ── HOTEL SZOLGÁLTATÁSOK ──
    async function handleAddService() {
        if (!serviceForm.name || !serviceForm.price || !serviceForm.description) {
            setToast({ message: "Kérem töltse ki a kötelező mezőket.", type: "warning" });
            return;
        }
        try {
            await addService(
                serviceForm.category,
                serviceForm.name,
                serviceForm.description,
                parseFloat(serviceForm.price),
                serviceForm.photo
            );
            setToast({ message: "Szolgáltatás hozzáadva!", type: "success" });
            setServiceForm({ category: "Wellness", name: "", description: "", price: "", photo: null, photoPreview: null });
            fetchServices();
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    async function handleDeleteService(id) {
        const ok = await confirm({
            title: "Szolgáltatás törlése",
            message: `Biztosan törölni szeretnéd? Ez a művelet visszafordíthatatlan!`,
            confirmText: "Törlés",
            cancelText: "Mégse",
            confirmVariant: "danger",
        });
        if (!ok) return;
        try {
            await deleteService(id);
            setToast({ message: "Szolgáltatás törölve!", type: "success" });
            fetchServices();
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    function handleServicePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setServiceForm(p => ({
            ...p,
            photo: file,
            photoPreview: URL.createObjectURL(file)
        }));
    }

    return (
        <div className={style.pageWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <div className={style.page}>

                <div className={style.header}>
                    <div>
                        <span className={style.badge}>Admin / Szolgáltatások</span>
                        <h2 className={style.title}>Szolgáltatások <span>kezelése</span></h2>
                        <p className={style.subtitle}>Étkezési csomagok, felszereltség és hotel szolgáltatások kezelése.</p>
                    </div>
                    <button className={style.backButton} onClick={() => navigate("/admin")}>← Vissza</button>
                </div>

                <div className={style.tabs}>
                    <button className={`${style.tab} ${activeTab === "meals" ? style.tabActive : ""}`} onClick={() => setActiveTab("meals")}>
                        🍽️ Étkezési csomagok
                    </button>
                    <button className={`${style.tab} ${activeTab === "services" ? style.tabActive : ""}`} onClick={() => setActiveTab("services")}>
                        🏨 Hotel szolgáltatások
                    </button>
                </div>

                {/* ── ÉTKEZÉSI CSOMAGOK ── */}
                {activeTab === "meals" && (
                    <div className={style.tabContent}>
                        <div className={style.formCard}>
                            <h3 className={style.formTitle}>Új étkezési csomag hozzáadása</h3>
                            <div className={style.formGrid}>
                                <div className={style.formGroup}>
                                    <label>Típus</label>
                                    <select value={mealForm.type} onChange={e => setMealForm(p => ({ ...p, type: e.target.value }))}>
                                        {MEAL_PLAN_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={style.formGroup}>
                                    <label>Megjelenített név *</label>
                                    <input type="text" placeholder="pl. Reggeli büfé" value={mealForm.name}
                                        onChange={e => setMealForm(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className={style.formGroup}>
                                    <label>Ár / éjszaka ($) *</label>
                                    <input type="number" placeholder="pl. 25" value={mealForm.pricePerNight}
                                        onChange={e => setMealForm(p => ({ ...p, pricePerNight: e.target.value }))} />
                                </div>
                            </div>
                            <button className={style.addButton} onClick={handleAddMealPlan}>
                                Étkezési csomag hozzáadása →
                            </button>
                        </div>

                        <div className={style.mealList}>
                            {mealPlans.map(meal => (
                                <div key={meal.id} className={style.mealItem}>
                                    {editingMeal?.id === meal.id ? (
                                        <>
                                            <div className={style.mealEditFields}>
                                                <input className={style.mealEditInput} value={editingMeal.name}
                                                    onChange={e => setEditingMeal(p => ({ ...p, name: e.target.value }))} placeholder="Név" />
                                                <input className={style.mealEditInput} type="number" value={editingMeal.pricePerNight}
                                                    onChange={e => setEditingMeal(p => ({ ...p, pricePerNight: e.target.value }))} placeholder="Ár/éj" />
                                            </div>
                                            <div className={style.mealEditBtns}>
                                                <button className={style.saveBtn} onClick={handleUpdateMealPlan}>Mentés</button>
                                                <button className={style.cancelBtn} onClick={() => setEditingMeal(null)}>Mégse</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={style.mealInfo}>
                                                <span className={style.mealType}>{MEAL_PLAN_TYPES.find(t => t.value === meal.type)?.label}</span>
                                                <span className={style.mealName}>{meal.name}</span>
                                                <span className={style.mealPrice}>${meal.pricePerNight} / éjszaka</span>
                                            </div>
                                            <div className={style.mealBtns}>
                                                <button className={style.editBtn} onClick={() => setEditingMeal({ ...meal })}>Szerkesztés</button>
                                                <button className={style.deleteBtn} onClick={() => handleDeleteMealPlan(meal.id)}>Törlés</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {mealPlans.length === 0 && (
                                <div className={style.emptyState}><div>🍽️</div><p>Még nincsenek étkezési csomagok.</p></div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── HOTEL SZOLGÁLTATÁSOK ── */}
                {activeTab === "services" && (
                    <div className={style.tabContent}>
                        <div className={style.formCard}>
                            <h3 className={style.formTitle}>Új szolgáltatás hozzáadása</h3>

                            {/* KÉP FELTÖLTÉS */}
                            <div className={style.serviceUploadArea}>
                                {serviceForm.photoPreview ? (
                                    <div className={style.servicePhotoPreview}>
                                        <img src={serviceForm.photoPreview} alt="preview" />
                                        <button className={style.removePhotoBtn} onClick={() => setServiceForm(p => ({ ...p, photo: null, photoPreview: null }))}>✕</button>
                                    </div>
                                ) : (
                                    <div className={style.uploadPlaceholder}>
                                        <div>🖼️</div>
                                        <p>Kattints a kép feltöltéséhez</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className={style.uploadInput} onChange={handleServicePhotoChange} />
                            </div>

                            <div className={style.formGrid}>
                                <div className={style.formGroup}>
                                    <label>Kategória</label>
                                    <select value={serviceForm.category} onChange={e => setServiceForm(p => ({ ...p, category: e.target.value }))}>
                                        {SERVICE_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={style.formGroup}>
                                    <label>Név *</label>
                                    <input type="text" placeholder="pl. Masszázs" value={serviceForm.name}
                                        onChange={e => setServiceForm(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className={style.formGroup}>
                                    <label>Ár / éjszaka ($) *</label>
                                    <input type="number" placeholder="pl. 50" value={serviceForm.price}
                                        onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))} />
                                </div>
                                <div className={`${style.formGroup} ${style.fullWidth}`}>
                                    <label>Leírás *</label>
                                    <textarea placeholder="Rövid leírás a szolgáltatásról..." value={serviceForm.description}
                                        onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} />
                                </div>
                            </div>
                            <button className={style.addButton} onClick={handleAddService}>
                                Szolgáltatás hozzáadása →
                            </button>
                        </div>

                        <div className={style.serviceList}>
                            {services.map(s => (
                                <div key={s.id} className={style.serviceItem}>
                                    {s.photoUrl && (
                                        <img src={s.photoUrl} alt={s.name} className={style.serviceItemImg} />
                                    )}
                                    <div className={style.serviceItemInfo}>
                                        <span className={style.serviceCategoryBadge}>{s.category}</span>
                                        <p className={style.serviceItemName}>{s.name}</p>
                                        <p className={style.serviceItemDesc}>{s.description}</p>
                                    </div>
                                    <div className={style.serviceItemRight}>
                                        <span className={style.serviceItemPrice}>${s.price}/éj</span>
                                        <button className={style.deleteBtn} onClick={() => handleDeleteService(s.id)}>Törlés</button>
                                    </div>
                                </div>
                            ))}
                            {services.length === 0 && (
                                <div className={style.emptyState}><div>🏨</div><p>Még nincsenek hotel szolgáltatások.</p></div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {config && <ConfirmDialog {...config} />}
        </div>
    );
}

export default ManageServicesPage;