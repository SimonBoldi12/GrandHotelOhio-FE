import { useNavigate } from "react-router";
import style from "./HomePage.module.css";
import { Star, MapPin, Clock } from "lucide-react";
import RoomSearch from "../common/room-search/RoomSearch";
import { useState } from "react";
import RoomResult from "../common/room-result/RoomResult";


function HomePage() {
    const navigate = useNavigate();
    const [roomSearchResults, setRoomSearchResults] = useState([]);


    function handleSearchResult(results) {
        setRoomSearchResults(results);
    }

    return (
        <div className={style.home}>
            {/* HEADER / BANNER SECTION */}
            <section>
                <header className={style.headerBanner}>
                    {/* Sötét overlay */}
                    <div className={style.overlay}></div>

                    {/* Középre igazított tartalom */}
                    <div className={style.overlayContent}>
                        <h1>Grand Hotel Ohio</h1>
                        <h3>Experience Luxury &amp; Comfort in the Heart of Ohio</h3>
                        <button
                            className={style.exploreBtn}
                            onClick={() => navigate('/rooms')}
                        >
                            Explore Rooms
                        </button>
                    </div>
                </header>
                <div className={style.container}>
                      {/* Feature Cards */}
                      <div className={style.featuresGrid}>
                        <div className={style.card}>
                          <div className={style.cardContent}>
                            <Star className={style.iconStar} />
                            <h3 className={style.cardTitle}>5-Star Service</h3>
                            <p className={style.cardText}>
                              Experience world-class hospitality and service excellence
                            </p>
                          </div>
                        </div>
                
                        <div className={style.card}>
                          <div className={style.cardContent}>
                            <MapPin className={style.iconMap} />
                            <h3 className={style.cardTitle}>Prime Location</h3>
                            <p className={style.cardText}>
                              Located in the heart of downtown Ohio, close to attractions
                            </p>
                          </div>
                        </div>
                
                        <div className={style.card}>
                          <div className={style.cardContent}>
                            <Clock className={style.iconClock} />
                            <h3 className={style.cardTitle}>24/7 Support</h3>
                            <p className={style.cardText}>
                              Round-the-clock assistance for all your needs
                            </p>
                          </div>
                        </div>
                      </div>


                      <RoomSearch handleSearchResult={handleSearchResult} />
                      <RoomResult roomSearchResults={roomSearchResults} />
                
                      {/* About Section */}
                      <div className={style.aboutGrid}>
                        <div>
                          <h2 className={style.aboutTitle}>Üdvözöljük a Grand Hotel Ohio-nál</h2>
                          <p className={style.aboutText}>
                            Az Ohio szívében megbúvó Grand Hotel Ohio a luxus, a kényelem és a praktikusság egyedülálló ötvözetét kínálja. Gondosan megtervezett szobáink és lakosztályaink tökéletes menedéket nyújtanak az üzleti és szabadidős utazók számára egyaránt.
                          </p>
                          <p className={style.aboutTextLast}>
                            Korszerű felszereléseinkkel, kivételes étkezési lehetőségeinkkel és a kiválóság iránti elkötelezettségünkkel gondoskodunk arról, hogy minden tartózkodás emlékezetes legyen. Legyen szó romantikus hétvégéről, családi nyaralásról vagy üzleti útról – a Grand Hotel Ohio az otthona lesz az otthonától távol.
                          </p>
                          <button
                            className={style.viewRoomsBtn}
                            onClick={() => navigate("/rooms")}
                          >
                            Összes szoba
                          </button>
                        </div>
                
                        <div className={style.imageGrid}>
                          <img
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                            alt="Hotel Lobby"
                            className={style.hotelImage}
                          />
                          <img
                            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
                            alt="Hotel Restaurant"
                            className={`${style.hotelImage} ${style.imageOffsetDown}`}
                          />
                          <img
                            src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
                            alt="Hotel Pool"
                            className={`${style.hotelImage} ${style.imageOffsetUp}`}
                          />
                          <img
                            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
                            alt="Hotel Spa"
                            className={style.hotelImage}
                          />
                        </div>
                      </div>
                
                      {/* CTA Section */}
                      <div className={style.cta}>
                        <h2 className={style.ctaTitle}>Készen állsz foglalni?</h2>
                        <p className={style.ctaSubtitle}>
                          Tapasztald meg az Ohio legjobb szolgáltatásait és kényelmét a Grand Hotel Ohio-ban. Foglalj most, és kezdődjön a felejthetetlen élmény!
                        </p>
                        <button className={style.ctaBtn} onClick={() => navigate("/rooms")}>
                            Foglalás most
                        </button>
                      </div>
                    </div>
            </section>
        </div>
    );
}

export default HomePage;