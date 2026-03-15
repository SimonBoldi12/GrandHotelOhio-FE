import { useEffect } from "react";
import style from "./Toast.module.css";

const icons = {
  success: (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  error: (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  warning: (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  info: (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
};

const closeIcon = (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M6 18 17.94 6M18 18 6.06 6" />
  </svg>
);

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className={`${style.toast} ${style[type]}`}>
      <div className={style.content}>
        <div className={style.icon}>{icons[type]}</div>
        <span className={style.text}>{message}</span>
      </div>
      <button className={style.closeBtn} onClick={onClose}>
        {closeIcon}
      </button>
      <div className={style.progressBar} />
    </div>
  );
}

export default Toast;
