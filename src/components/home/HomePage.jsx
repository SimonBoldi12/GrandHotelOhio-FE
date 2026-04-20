import style from "./HomePage.module.css";
import { Star, MapPin, Clock } from "lucide-react";
import RoomSearch from "../common/room-search/RoomSearch";
import { useState, useEffect, useRef } from "react";
import RoomResult from "../common/room-result/RoomResult";
import { useNavigate } from "react-router";
import { isAuthenticated } from "../../service/ApiService";

// ── Irányított scroll-reveal hook ──────────────────────────────
function useReveal(direction = "up", delay = 0) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.classList.add(style.reveal, style[`reveal--${direction}`]);
        if (delay) el.style.transitionDelay = `${delay}ms`;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add(style.revealed);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

// ── Számlálós stat hook
function useCounter(target, duration = 2000) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(el);
                let start = null;
                function step(ts) {
                    if (!start) start = ts;
                    const progress = Math.min((ts - start) / duration, 1);
                    // Ease out cubic
                    const ease = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(ease * target);
                    if (progress < 1) requestAnimationFrame(step);
                    else el.textContent = target;
                }
                requestAnimationFrame(step);
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);
    return ref;
}

function HomePage() {
    const navigate = useNavigate();
    const [roomSearchResults, setRoomSearchResults] = useState([]);
    const [dateParams, setDateParams] = useState("");
    const authenticated = isAuthenticated();

    // Features
    const featHeadRef = useReveal("up");
    const card1Ref    = useReveal("left",   0);
    const card2Ref    = useReveal("up",   200);
    const card3Ref    = useReveal("right",400);

    // Stats — reveal + counter
    const stat1Ref = useReveal("up",   0);
    const stat2Ref = useReveal("up", 150);
    const stat3Ref = useReveal("up", 300);
    const stat4Ref = useReveal("up", 450);

    const count1Ref = useCounter(48,   1800);
    const count2Ref = useCounter(25,   2000);
    const count3Ref = useCounter(98,   1600);
    const count4Ref = useCounter(12,   2200);

    // Search
    const searchRef   = useReveal("up");

    // About
    const aboutTxtRef = useReveal("left");
    const img1Ref     = useReveal("right",   0);
    const img2Ref     = useReveal("right", 200);
    const img3Ref     = useReveal("right", 400);
    const img4Ref     = useReveal("right", 600);

    // CTA
    const ctaRef      = useReveal("up");

    function handleSearchResult(results, checkIn, checkOut) {
        setRoomSearchResults(results);
        if (checkIn && checkOut) {
            setDateParams(`?checkIn=${checkIn}&checkOut=${checkOut}`);
        }
    }

    return (
        <div className={style.home}>
            <section>

                {/* ── HERO ── */}
                <header className={style.headerBanner}>
                    <div className={style.overlay}></div>
                    <div className={style.overlayContent}>
                        <p className={style.heroLabel}>Ohio, Egyesült Államok</p>
                        <h1>Grand Hotel Ohio</h1>
                        <h3>Tapasztalja meg a luxust és a kényelmet Ohio szívében</h3>
                        <div className={style.heroBtns}>
                            <button className={style.exploreBtn} onClick={() => navigate('/rooms')}>
                                Szobák felfedezése
                            </button>
                            {authenticated && (
                                <button className={style.heroSecondaryBtn} onClick={() => navigate('/find-booking')}>
                                    Foglalásaim
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <div className={style.container}>

                    {/* ── FEATURES ── */}
                    <div ref={featHeadRef}>
                        <p className={style.sectionLabel}>Miért válasszon minket</p>
                        <h2 className={style.sectionTitle}>Minden, amit egy tökéletes tartózkodáshoz</h2>
                    </div>

                    <div className={style.featuresGrid}>
                        <div ref={card1Ref} className={style.card}>
                            <div className={style.cardContent}>
                                <div className={`${style.iconWrapper} ${style.yellow}`}>
                                    <Star className={style.iconStar} />
                                </div>
                                <h3 className={style.cardTitle}>5 csillagos szolgáltatás</h3>
                                <p className={style.cardText}>Tapasztalja meg a világszínvonalú vendéglátást és a szolgáltatások kiválóságát</p>
                            </div>
                        </div>
                        <div ref={card2Ref} className={style.card}>
                            <div className={style.cardContent}>
                                <div className={`${style.iconWrapper} ${style.blue}`}>
                                    <MapPin className={style.iconMap} />
                                </div>
                                <h3 className={style.cardTitle}>Kiváló elhelyezkedés</h3>
                                <p className={style.cardText}>Ohio belvárosának szívében, a látványosságok közelében</p>
                            </div>
                        </div>
                        <div ref={card3Ref} className={style.card}>
                            <div className={style.cardContent}>
                                <div className={`${style.iconWrapper} ${style.green}`}>
                                    <Clock className={style.iconClock} />
                                </div>
                                <h3 className={style.cardTitle}>24/7 Támogatás</h3>
                                <p className={style.cardText}>Éjjel-nappal elérhető segítség minden igényéhez</p>
                            </div>
                        </div>
                    </div>

                    {/* ── STATS ── */}
                    <div className={style.statsSection}>
                        <div ref={stat1Ref} className={style.statItem}>
                            <div className={style.statNumWrap}>
                                <span ref={count1Ref} className={style.statNum}>0</span>
                                <span className={style.statSuffix}>+</span>
                            </div>
                            <span className={style.statUnit}>Luxus szoba</span>
                        </div>
                        <div ref={stat2Ref} className={style.statItem}>
                            <div className={style.statNumWrap}>
                                <span ref={count2Ref} className={style.statNum}>0</span>
                                <span className={style.statSuffix}>+</span>
                            </div>
                            <span className={style.statUnit}>Év tapasztalat</span>
                        </div>
                        <div ref={stat3Ref} className={style.statItem}>
                            <div className={style.statNumWrap}>
                                <span ref={count3Ref} className={style.statNum}>0</span>
                                <span className={style.statSuffix}>%</span>
                            </div>
                            <span className={style.statUnit}>Vendég elégedettség</span>
                        </div>
                        <div ref={stat4Ref} className={style.statItem}>
                            <div className={style.statNumWrap}>
                                <span ref={count4Ref} className={style.statNum}>0</span>
                                <span className={style.statSuffix}>×</span>
                            </div>
                            <span className={style.statUnit}>Díj és elismerés</span>
                        </div>
                    </div>

                    {/* ── SEARCH ── */}
                    <div ref={searchRef} className={style.searchSection}>
                        <p className={style.sectionLabel}>Szobakeresés</p>
                        <h2 className={style.sectionTitle}>Találja meg a tökéletes szobát</h2>
                        <RoomSearch handleSearchResult={handleSearchResult} />
                        <RoomResult roomSearchResults={roomSearchResults} dateParams={dateParams} />
                    </div>

                    {/* ── ABOUT ── */}
                    <div className={style.aboutGrid}>
                        <div ref={aboutTxtRef}>
                            <p className={style.sectionLabel}>Rólunk</p>
                            <h2 className={style.aboutTitle}>Üdvözöljük a Grand Hotel Ohio-nál</h2>
                            <p className={style.aboutText}>
                                Az Ohio szívében megbúvó Grand Hotel Ohio a luxus, a kényelem és a praktikusság egyedülálló ötvözetét kínálja. Gondosan megtervezett szobáink és lakosztályaink tökéletes menedéket nyújtanak az üzleti és szabadidős utazók számára egyaránt.
                            </p>
                            <p className={style.aboutTextLast}>
                                Korszerű felszereléseinkkel, kivételes étkezési lehetőségeinkkel és a kiválóság iránti elkötelezettségünkkel gondoskodunk arról, hogy minden tartózkodás emlékezetes legyen.
                            </p>
                            <button className={style.viewRoomsBtn} onClick={() => navigate("/rooms")}>
                                Összes szoba →
                            </button>
                        </div>
                        <div className={style.imageGrid}>
                            <img ref={img1Ref}
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                                alt="Hotel Lobby"
                                className={style.hotelImage} />
                            <img ref={img2Ref}
                                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
                                alt="Hotel Étterem"
                                className={`${style.hotelImage} ${style.imageOffsetDown}`} />
                            <img ref={img3Ref}
                                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
                                alt="Hotel Medence"
                                className={`${style.hotelImage} ${style.imageOffsetUp}`} />
                            <img ref={img4Ref}
                                src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
                                alt="Hotel Spa"
                                className={style.hotelImage} />
                        </div>
                    </div>

                    {/* ── CTA ── */}
                    <div ref={ctaRef} className={style.cta}>
                        <p className={style.ctaLabel}>Ne várjon tovább</p>
                        <h2 className={style.ctaTitle}>Készen áll a foglalásra?</h2>
                        <p className={style.ctaSubtitle}>
                            Tapasztald meg az Ohio legjobb szolgáltatásait és kényelmét a Grand Hotel Ohio-ban. Foglalj most, és kezdődjön a felejthetetlen élmény!
                        </p>
                        <button className={style.ctaBtn} onClick={() => navigate("/rooms")}>
                            Foglalás most →
                        </button>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default HomePage;