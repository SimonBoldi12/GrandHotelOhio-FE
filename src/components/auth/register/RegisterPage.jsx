import style from "./RegisterPage.module.css";
import { loginUser, registerUser } from "../../../service/ApiService";
import { useNavigate } from "react-router";
import { useState } from "react";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    })

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    function validateForm(){
        const { name, email, password, phoneNumber } = formData;

        if (!name || !email || !password || !phoneNumber) {
            setErrorMessage("Kérem töltse ki az összes mezőt.");
            return false;
        }
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) {
            setErrorMessage("Kérem töltse ki az összes mezőt.");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }
        try {
            const response = await registerUser(formData);
            if (response.status === 200) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                setSuccessMessage("Sikeres regisztráció! Átirányítás a bejelentkezéshez...");
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate("/login");
                }, 3000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(""), 5000);
        }
    }

    return ( 
        <div>
            {errorMessage && <p className={style.error}>{errorMessage}</p>}
            {successMessage && <p className={style.success}>{successMessage}</p>}
            <h2>Regisztráció</h2>
            <form onSubmit={handleSubmit} className={style.registerForm}>
                <div className={style.formGroup}>
                    <label htmlFor="name">Név:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="password">Jelszó:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="phoneNumber">Telefonszám:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className={style.registerButton}>Regisztráció</button>
            </form>
        </div>
     );
}

export default RegisterPage;