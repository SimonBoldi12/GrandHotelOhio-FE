import style from "./RegisterPage.module.css";
import { loginUser, registerUser } from "../../../service/ApiService";
import { useNavigate } from "react-router";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  function validateForm() {
    const { firstName, lastName, email, password, phoneNumber } = formData;

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
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
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phoneNumber: "",
        });
        setSuccessMessage(
          "Sikeres regisztráció! Átirányítás a bejelentkezéshez...",
        );
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  }

  return (
     <div className={style.registerWrapper}>
        <div className={style.container}>
            <h2 className={style.heading}>Regisztráció</h2>
            {errorMessage && <p className={style.error}>{errorMessage}</p>}
            {successMessage && <p className={style.success}>{successMessage}</p>}
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
