import { useEffect } from "react";
import style from "./ConfirmDialog.module.css";

function ConfirmDialog({ isOpen, title, message, confirmText = "Igen", cancelText = "Mégse", confirmVariant = "danger", onConfirm, onCancel }) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        function handleKey(e) {
            if (!isOpen) return;
            if (e.key === "Escape") onCancel();
            if (e.key === "Enter") onConfirm();
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={style.overlay} onClick={onCancel}>
            <div className={style.dialog} onClick={e => e.stopPropagation()}>

                {/* IKON */}
                <div className={`${style.iconWrapper} ${style[confirmVariant]}`}>
                    {confirmVariant === "danger" && (
                        <svg viewBox="0 0 24 24" fill="none" className={style.icon}>
                            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                    {confirmVariant === "warning" && (
                        <svg viewBox="0 0 24 24" fill="none" className={style.icon}>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    )}
                    {confirmVariant === "success" && (
                        <svg viewBox="0 0 24 24" fill="none" className={style.icon}>
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </div>

                {/* SZÖVEG */}
                <h3 className={style.title}>{title}</h3>
                {message && <p className={style.message}>{message}</p>}

                {/* GOMBOK */}
                <div className={style.actions}>
                    <button className={style.cancelBtn} onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`${style.confirmBtn} ${style[`confirmBtn_${confirmVariant}`]}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;