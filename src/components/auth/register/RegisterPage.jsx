import style from "./RegisterPage.module.css";
import { registerUser } from "../../../service/ApiService";
import { useNavigate } from "react-router";
import { useState } from "react";
import Toast from "../../common/toast/Toast";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "", phoneNumber: "",
    });
    const [toast, setToast] = useState({ message: "", type: "success" });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { firstName, lastName, email, password, phoneNumber } = formData;
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            setToast({ message: "Kérem töltse ki az összes mezőt.", type: "warning" });
            return;
        }
        try {
            const response = await registerUser(formData);
            if (response.status === 200) {
                setFormData({ firstName: "", lastName: "", email: "", password: "", phoneNumber: "" });
                setToast({ message: "Sikeres regisztráció! Átirányítás a bejelentkezéshez...", type: "success" });
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (error) {
            setToast({ message: "Hiba a regisztráció során." || error.message, type: "error" });
        }
    }

    return (
        <div className={style.registerWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <div className={style.container}>
                <h2 className={style.heading}>Regisztráció</h2>
                <form onSubmit={handleSubmit}>
                    <input className={style.input} type="text" name="lastName" placeholder="Vezetéknév" value={formData.lastName} onChange={handleInputChange} required />
                    <input className={style.input} type="text" name="firstName" placeholder="Keresztnév" value={formData.firstName} onChange={handleInputChange} required />
                    <input className={style.input} type="email" name="email" placeholder="Email cím" value={formData.email} onChange={handleInputChange} required />
                    <input className={style.input} type="password" name="password" placeholder="Jelszó" value={formData.password} onChange={handleInputChange} required />
                    <input className={style.input} type="text" name="phoneNumber" placeholder="Telefonszám" value={formData.phoneNumber} onChange={handleInputChange} required />
                    <button type="submit" className={style.registerButton}>Regisztrálok</button>
                </form>
                <p className={style.loginLink}>
                    Már van fiókod? <a href="/login">Bejelentkezés</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;