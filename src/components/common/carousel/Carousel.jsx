import { useState } from "react";
import style from "./Carousel.module.css";

function Carousel({ images = [] }) {
    const [current, setCurrent] = useState(0);

    if (images.length === 0) return null;

    function prev() {
        setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
    }

    function next() {
        setCurrent(i => (i === images.length - 1 ? 0 : i + 1));
    }

    return (
        <div className={style.carousel}>
            {/* FŐ KÉP */}
            <div className={style.mainImageWrapper}>
                <img
                    key={current}
                    src={images[current]}
                    alt={`Kép ${current + 1}`}
                    className={style.mainImage}
                />

                {images.length > 1 && (
                    <>
                        <button className={`${style.navBtn} ${style.prevBtn}`} onClick={prev}>
                            ‹
                        </button>
                        <button className={`${style.navBtn} ${style.nextBtn}`} onClick={next}>
                            ›
                        </button>
                    </>
                )}

                <div className={style.counter}>
                    {current + 1} / {images.length}
                </div>
            </div>

            {/* THUMBNAIL SÁV */}
            {images.length > 1 && (
                <div className={style.thumbnails}>
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`${style.thumb} ${index === current ? style.thumbActive : ""}`}
                            onClick={() => setCurrent(index)}
                        >
                            <img src={src} alt={`Thumbnail ${index + 1}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Carousel;