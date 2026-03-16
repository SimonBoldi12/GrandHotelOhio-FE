import { useNavigate } from "react-router";
import style from "./EditProfile.module.css";
import { deleteUser, getUserProfile } from "../../../service/ApiService";
import { useEffect, useState } from "react";
import Toast from "../../common/toast/Toast";

const BG_COLORS = [
  { value: "#0f172a", label: "Éjfekete" },
  { value: "#1e293b", label: "Sötétszürke" },
  { value: "#334155", label: "Acélszürke" },
  { value: "#1e3a8a", label: "Mélykék" },
  { value: "#1d4ed8", label: "Kobalt" },
  { value: "#2563eb", label: "Kék" },
  { value: "#0369a1", label: "Óceánkék" },
  { value: "#0e7490", label: "Teal" },
  { value: "#065f46", label: "Erdőzöld" },
  { value: "#166534", label: "Smaragd" },
  { value: "#713f12", label: "Csokoládé" },
  { value: "#92400e", label: "Réz" },
  { value: "#78350f", label: "Mahagóni" },
  { value: "#7c2d12", label: "Terrakotta" },
  { value: "#9f1239", label: "Bordó" },
  { value: "#881337", label: "Mélypiros" },
  { value: "#4c1d95", label: "Szilvalila" },
  { value: "#5b21b6", label: "Lila" },
  { value: "#6d28d9", label: "Viola" },
  { value: "#86198f", label: "Orchidea" },
  { value: "#701a75", label: "Padlizsán" },
  { value: "#be123c", label: "Rubin" },
];

const TEXT_COLORS = [
  { value: "#ffffff", label: "Fehér" },
  { value: "#f8fafc", label: "Hófehér" },
  { value: "#e2e8f0", label: "Ezüst" },
  { value: "#bae6fd", label: "Égszín" },
  { value: "#a5f3fc", label: "Cián" },
  { value: "#bbf7d0", label: "Menta" },
  { value: "#fef08a", label: "Aranysárga" },
  { value: "#fed7aa", label: "Barack" },
  { value: "#fda4af", label: "Rózsa" },
  { value: "#ddd6fe", label: "Levendula" },
];

function EditProfile() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "error" });
  const [monogramBg, setMonogramBg] = useState("#6b7280");
  const [monogramText, setMonogramText] = useState("#ffffff");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await getUserProfile();
        setUser(response.users);
        // felhasználó specifikus kulcs
        const saved = localStorage.getItem(
          `monogramColors_${response.users.email}`,
        );
        if (saved) {
          const { bg, text } = JSON.parse(saved);
          setMonogramBg(bg);
          setMonogramText(text);
        }
      } catch (err) {
        setToast({
          message: err.response?.data?.message || err.message,
          type: "error",
        });
      }
    }
    fetchUserProfile();
  }, []);

  function handleSaveColors() {
    localStorage.setItem(
      `monogramColors_${user.email}`,
      JSON.stringify({ bg: monogramBg, text: monogramText }),
    );
    setToast({ message: "Monogram szín elmentve!", type: "success" });
  }

  async function handleDeleteProfile() {
    if (
      !window.confirm(
        "Biztosan törölni szeretnéd a profilodat? Ez a művelet visszafordíthatatlan!",
      )
    )
      return;
    try {
      await deleteUser(user.id);
      navigate("/register");
    } catch (error) {
      setToast({
        message: error.response?.data?.message || error.message,
        type: "error",
      });
    }
  }

  return (
    <div className={style.editProfilePage}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />

      <div className={style.header}>
        <button
          className={style.backButton}
          onClick={() => navigate("/profile")}
        >
          ← Vissza a profilhoz
        </button>
        <h2 className={style.title}>Profil szerkesztése</h2>
        <p className={style.subtitle}>
          Fiókod adatainak megtekintése és kezelése.
        </p>
      </div>

      {user && (
        <>
          <div className={style.profileCard}>
            <div className={style.avatarSection}>
              <div
                className={style.avatar}
                style={{ backgroundColor: monogramBg, color: monogramText }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className={style.avatarInfo}>
                <h3 className={style.avatarName}>{user.name}</h3>
                <span className={style.avatarRole}>Felhasználó</span>
              </div>
            </div>
            <div className={style.profileFields}>
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Email cím</span>
                <span className={style.fieldValue}>{user.email}</span>
              </div>
              <div className={style.profileField}>
                <span className={style.fieldLabel}>Telefonszám</span>
                <span className={style.fieldValue}>{user.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* MONOGRAM SZÍNVÁLASZTÓ */}
          <div className={style.colorCard}>
            <div className={style.colorCardHeader}>
              <h4 className={style.colorCardTitle}>
                Monogram ikon testreszabása
              </h4>
              <p className={style.colorCardSubtitle}>
                Válaszd ki a profilikon háttér- és betűszínét.
              </p>
            </div>

            <div className={style.colorPreview}>
              <div
                className={style.monogramPreview}
                style={{ backgroundColor: monogramBg, color: monogramText }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className={style.colorPreviewLabel}>Előnézet</span>
            </div>

            <div className={style.colorSection}>
              <span className={style.colorSectionLabel}>Háttérszín</span>
              <div className={style.colorGrid}>
                {BG_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`${style.colorSwatch} ${monogramBg === c.value ? style.colorSwatchActive : ""}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setMonogramBg(c.value)}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className={style.colorSection}>
              <span className={style.colorSectionLabel}>Betűszín</span>
              <div className={style.colorGrid}>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`${style.colorSwatch} ${monogramText === c.value ? style.colorSwatchActive : ""}`}
                    style={{
                      backgroundColor: c.value,
                      border:
                        c.value === "#ffffff" || c.value === "#f1f5f9"
                          ? "1px solid #e0e7ff"
                          : "none",
                    }}
                    onClick={() => setMonogramText(c.value)}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <button className={style.saveColorsBtn} onClick={handleSaveColors}>
              Szín mentése
            </button>
          </div>

          <div className={style.dangerZone}>
            <div className={style.dangerInfo}>
              <h4>Fiók törlése</h4>
              <p>
                Ez a művelet visszafordíthatatlan. Minden adatod és foglalásod
                törlésre kerül.
              </p>
            </div>
            <button
              className={style.deleteButton}
              onClick={handleDeleteProfile}
            >
              Profil törlése
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EditProfile;
