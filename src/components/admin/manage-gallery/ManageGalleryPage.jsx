import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import style from "./ManageGalleryPage.module.css";
import Toast from "../../common/toast/Toast";
import { getAllGallery, addGalleryImage, deleteGalleryImage } from "../../../service/ApiService";
import { useConfirm } from "../../../hooks/useConfirm";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";
const CATEGORIES = ["Szobák", "Étterem", "Wellness", "Medence", "Lobby", "Egyéb"];

function ManageGalleryPage() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Összes");
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ message: "", type: "success" });
    const [form, setForm] = useState({ category: "Szobák", caption: "", photo: null, photoPreview: null });
    const [isUploading, setIsUploading] = useState(false);
    const [lightbox, setLightbox] = useState(null);
    const { confirm, config } = useConfirm();

    useEffect(() => {
        fetchGallery();
    }, []);

    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") setLightbox(null);
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    async function fetchGallery() {
        try {
            setIsLoading(true);
            const res = await getAllGallery();
            const list = res.galleryList || [];
            setImages(list);
            setFiltered(list);
        } catch (err) {
            setToast({ message: "Hiba a képek lekérésekor." || err.message, type: "error" });
        } finally {
            setIsLoading(false);
        }
    }

    function handleFilter(category) {
        setActiveCategory(category);
        if (category === "Összes") {
            setFiltered(images);
        } else {
            setFiltered(images.filter(img => img.category === category));
        }
    }

    function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setForm(p => ({ ...p, photo: file, photoPreview: URL.createObjectURL(file) }));
    }

    async function handleAddImage() {
        if (!form.photo) {
            setToast({ message: "Kérem válasszon ki egy képet.", type: "warning" });
            return;
        }
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("category", form.category);
            formData.append("caption", form.caption);
            formData.append("photo", form.photo);
            await addGalleryImage(formData);
            setToast({ message: "Kép sikeresen feltöltve!", type: "success" });
            setForm({ category: "Szobák", caption: "", photo: null, photoPreview: null });
            fetchGallery();
        } catch (err) {
            setToast({ message: "Hiba a kép feltöltésekor." || err.message, type: "error" });
        } finally {
            setIsUploading(false);
        }
    }

    async function handleDelete(id) {
        const ok = await confirm({
            title: "Kép törlése",
            message: `Biztosan törölni szeretnéd ezt a képet? Ez a művelet visszafordíthatatlan!`,
            confirmText: "Törlés",
            cancelText: "Mégse",
            confirmVariant: "danger",
        });
        if (!ok) return;
        try {
            await deleteGalleryImage(id);
            setToast({ message: "Kép törölve!", type: "success" });
            fetchGallery();
        } catch (err) {
            setToast({ message: "Hiba a kép törlésekor." || err.message, type: "error" });
        }
    }

    return (
        <div className={style.pageWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <div className={style.page}>

                {/* HEADER */}
                <div className={style.header}>
                    <div>
                        <span className={style.badge}>Admin / Galéria</span>
                        <h2 className={style.title}>Galéria <span>szerkesztése</span></h2>
                        <p className={style.subtitle}>Képek feltöltése, törlése és kategóriák kezelése.</p>
                    </div>
                    <button className={style.backButton} onClick={() => navigate("/admin")}>← Vissza</button>
                </div>

                {/* FELTÖLTÉS FORM */}
                <div className={style.formCard}>
                    <h3 className={style.formTitle}>Új kép feltöltése</h3>

                    <div className={style.formLayout}>
                        {/* KÉP FELTÖLTÉS */}
                        <div className={style.uploadArea}>
                            {form.photoPreview ? (
                                <div className={style.previewWrapper}>
                                    <img src={form.photoPreview} alt="preview" className={style.previewImg} />
                                    <button
                                        className={style.removeBtn}
                                        onClick={() => setForm(p => ({ ...p, photo: null, photoPreview: null }))}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className={style.uploadPlaceholder}>
                                    <div className={style.uploadIcon}>🖼️</div>
                                    <p><strong>Kattints a feltöltéshez</strong></p>
                                    <p className={style.uploadHint}>JPG, PNG – max. 10MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className={style.uploadInput}
                                onChange={handlePhotoChange}
                            />
                        </div>

                        {/* MEZŐK */}
                        <div className={style.formFields}>
                            <div className={style.formGroup}>
                                <label>Kategória</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={style.formGroup}>
                                <label>Felirat (opcionális)</label>
                                <input
                                    type="text"
                                    placeholder="pl. Deluxe szoba kilátással"
                                    value={form.caption}
                                    onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                                />
                            </div>
                            <button
                                className={style.uploadButton}
                                onClick={handleAddImage}
                                disabled={isUploading}
                            >
                                {isUploading ? "Feltöltés..." : "Kép feltöltése →"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* KATEGÓRIA SZŰRŐ */}
                <div className={style.filterBar}>
                    {["Összes", ...CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            className={`${style.filterBtn} ${activeCategory === cat ? style.filterBtnActive : ""}`}
                            onClick={() => handleFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* KÉP SZÁM */}
                <p className={style.imageCount}>
                    {filtered.length} kép {activeCategory !== "Összes" ? `– ${activeCategory}` : "összesen"}
                </p>

                {/* KÉPEK GRID */}
                {isLoading ? (
                    <div className={style.loading}>Betöltés...</div>
                ) : filtered.length === 0 ? (
                    <div className={style.empty}>
                        <div>🖼️</div>
                        <p>Még nincsenek képek ebben a kategóriában.</p>
                    </div>
                ) : (
                    <div className={style.grid}>
                        {filtered.map(img => (
                            <div key={img.id} className={style.gridItem}>
                                <img
                                    src={img.imageUrl}
                                    alt={img.caption || img.category}
                                    className={style.gridImg}
                                    onClick={() => setLightbox({ src: img.imageUrl, caption: img.caption })}
                                />
                                <div className={style.gridOverlay}>
                                    <span className={style.gridCategory}>{img.category}</span>
                                    {img.caption && <p className={style.gridCaption}>{img.caption}</p>}
                                </div>
                                <button
                                    className={style.deleteBtn}
                                    onClick={() => handleDelete(img.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* LIGHTBOX */}
            {lightbox && (
                <div className={style.lightboxOverlay} onClick={() => setLightbox(null)}>
                    <div className={style.lightboxContent} onClick={e => e.stopPropagation()}>
                        <button className={style.lightboxClose} onClick={() => setLightbox(null)}>✕</button>
                        <img src={lightbox.src} alt={lightbox.caption} className={style.lightboxImg} />
                        {lightbox.caption && (
                            <p className={style.lightboxCaption}>{lightbox.caption}</p>
                        )}
                    </div>
                </div>
            )}
            {config && <ConfirmDialog {...config} />}
        </div>
    );
}

export default ManageGalleryPage;