import { useEffect, useState } from "react";
import { getAllServices, getServicesByCategory } from "../../service/ApiService";
import style from "./ServicePage.module.css";

const CATEGORIES = ["Összes", "Wellness", "Sport", "Étterem", "Bár", "Szépségápolás", "Egyéb"];

function ServicePage() {
    const [services, setServices] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Összes");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await getAllServices();
                setServices(res.serviceList || []);
                setFiltered(res.serviceList || []);
            } catch (err) {
                console.error("Hiba a szolgáltatások lekérésekor:", err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    function handleCategoryFilter(category) {
        setActiveCategory(category);
        if (category === "Összes") {
            setFiltered(services);
        } else {
            setFiltered(services.filter(s => s.category === category));
        }
    }

    return (
        <div className={style.pageWrapper}>
            {/* HERO */}
            <div className={style.hero}>
                <div className={style.heroOverlay} />
                <div className={style.heroContent}>
                    <span className={style.heroBadge}>Grand Hotel Ohio</span>
                    <h1 className={style.heroTitle}>Hotel Szolgáltatások</h1>
                    <p className={style.heroSubtitle}>
                        Fedezze fel prémium szolgáltatásainkat, amelyek tökéletes élménnyé varázsolják tartózkodását
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
                            onClick={() => handleCategoryFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* SZOLGÁLTATÁSOK */}
                {isLoading ? (
                    <div className={style.loading}>Betöltés...</div>
                ) : filtered.length === 0 ? (
                    <div className={style.empty}>
                        <div>🏨</div>
                        <p>Ebben a kategóriában még nincsenek szolgáltatások.</p>
                    </div>
                ) : (
                    <div className={style.grid}>
                        {filtered.map(s => (
                            <div key={s.id} className={style.card}>
                                {s.photoUrl ? (
                                    <img src={s.photoUrl} alt={s.name} className={style.cardImg} />
                                ) : (
                                    <div className={style.cardImgPlaceholder}>🏨</div>
                                )}
                                <div className={style.cardBody}>
                                    <div className={style.cardTop}>
                                        <span className={style.categoryBadge}>{s.category}</span>
                                    </div>
                                    <h3 className={style.cardTitle}>{s.name}</h3>
                                    {s.description && (
                                        <p className={style.cardDesc}>{s.description}</p>
                                    )}
                                    <div className={style.cardFooter}>
                                        <span className={style.cardPrice}>${s.price}</span>
                                        <span className={style.cardPriceUnit}>/ éjszaka</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServicePage;