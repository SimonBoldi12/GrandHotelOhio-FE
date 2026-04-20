import { useEffect, useState } from "react";
import { getAllGallery } from "../../service/ApiService";
import style from "./GalleryPage.module.css";

const CATEGORIES = ["Összes", "Szobák", "Étterem", "Wellness", "Medence", "Lobby", "Egyéb"];

function GalleryPage() {
    const [images, setImages] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Összes");
    const [isLoading, setIsLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null); 

    useEffect(() => {
        async function fetchGallery() {
            try {
                const res = await getAllGallery();
                setImages(res.galleryList || []);
                setFiltered(res.galleryList || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchGallery();
    }, []);

    function handleFilter(category) {
        setActiveCategory(category);
        if (category === "Összes") {
            setFiltered(images);
        } else {
            setFiltered(images.filter(img => img.category === category));
        }
    }

    
    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") setLightbox(null);
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <div className={style.pageWrapper}>
            {/* HERO */}
            <div className={style.hero}>
                <div className={style.heroOverlay} />
                <div className={style.heroContent}>
                    <span className={style.heroBadge}>Grand Hotel Ohio</span>
                    <h1 className={style.heroTitle}>Galéria</h1>
                    <p className={style.heroSubtitle}>
                        Tekintse meg szállodánk legszebb pillanatait és tereit
                    </p>
                </div>
            </div>

            <div className={style.container}>
                {/* KATEGÓRIA SZŰRŐ */}
                <div className={style.filterBar}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`${style.filterBtn} ${activeCategory === cat ? style.filterBtnActive : ""}`}
                            onClick={() => handleFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* KÉPEK */}
                {isLoading ? (
                    <div className={style.loading}>Betöltés...</div>
                ) : filtered.length === 0 ? (
                    <div className={style.empty}>
                        <div>🖼️</div>
                        <p>Ebben a kategóriában még nincsenek képek.</p>
                    </div>
                ) : (
                    <div className={style.grid}>
                        {filtered.map(img => (
                            <div
                                key={img.id}
                                className={style.gridItem}
                                onClick={() => setLightbox({ src: img.imageUrl, caption: img.caption })}
                            >
                                <img src={img.imageUrl} alt={img.caption || img.category} className={style.gridImg} />
                                <div className={style.gridOverlay}>
                                    <span className={style.gridCategory}>{img.category}</span>
                                    {img.caption && (
                                        <p className={style.gridCaption}>{img.caption}</p>
                                    )}
                                    <span className={style.zoomIcon}>🔍</span>
                                </div>
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
        </div>
    );
}

export default GalleryPage;