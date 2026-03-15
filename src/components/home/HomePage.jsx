import style from "./HomePage.module.css";
import { Star, MapPin, Clock } from "lucide-react";
import RoomSearch from "../common/room-search/RoomSearch";
import { useState } from "react";
import RoomResult from "../common/room-result/RoomResult";
import { useNavigate } from "react-router";
import { isAuthenticated } from "../../service/ApiService";

function HomePage() {
    const navigate = useNavigate();
    const [roomSearchResults, setRoomSearchResults] = useState([]);
    const authenticated = isAuthenticated();

    function handleSearchResult(results) {
        setRoomSearchResults(results);
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
                    <p className={style.sectionLabel}>Miért válasszon minket</p>
                    <h2 className={style.sectionTitle}>Minden, amit egy tökéletes tartózkodáshoz</h2>
                    <div className={style.featuresGrid}>
                        <div className={style.card}>
                            <div className={style.cardContent}>
                                <div className={`${style.iconWrapper} ${style.yellow}`}>
                                    <Star className={style.iconStar} />
                                </div>
                                <h3 className={style.cardTitle}>5 csillagos szolgáltatás</h3>
                                <p className={style.cardText}>Tapasztalja meg a világszínvonalú vendéglátást és a szolgáltatások kiválóságát</p>
                            </div>
                        </div>
                        <div className={style.card}>
                            <div className={style.cardContent}>
                                <div className={`${style.iconWrapper} ${style.blue}`}>
                                    <MapPin className={style.iconMap} />
                                </div>
                                <h3 className={style.cardTitle}>Kiváló elhelyezkedés</h3>
                                <p className={style.cardText}>Ohio belvárosának szívében, a látványosságok közelében</p>
                            </div>
                        </div>
                        <div className={style.card}>
                            <div className={style.cardContent}>
                                <div className={`${style.iconWrapper} ${style.green}`}>
                                    <Clock className={style.iconClock} />
                                </div>
                                <h3 className={style.cardTitle}>24/7 Támogatás</h3>
                                <p className={style.cardText}>Éjjel-nappal elérhető segítség minden igényéhez</p>
                            </div>
                        </div>
                    </div>

                    {/* ── SEARCH ── */}
                    <div className={style.searchSection}>
                        <p className={style.sectionLabel}>Szobakeresés</p>
                        <h2 className={style.sectionTitle}>Találja meg a tökéletes szobát</h2>
                        <RoomSearch handleSearchResult={handleSearchResult} />
                        <RoomResult roomSearchResults={roomSearchResults} />
                    </div>

                    {/* ── ABOUT ── */}
                    <div className={style.aboutGrid}>
                        <div>
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
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" alt="Hotel Lobby" className={style.hotelImage} />
                            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800" alt="Hotel Étterem" className={`${style.hotelImage} ${style.imageOffsetDown}`} />
                            <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800" alt="Hotel Medence" className={`${style.hotelImage} ${style.imageOffsetUp}`} />
                            <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800" alt="Hotel Spa" className={style.hotelImage} />
                        </div>
                    </div>

                    {/* ── CTA ── */}
                    <div className={style.cta}>
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