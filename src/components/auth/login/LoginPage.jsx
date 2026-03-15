import style from "./LoginPage.module.css";
import { loginUser } from "../../../service/ApiService";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Toast from "../../common/toast/Toast";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState({ message: "", type: "error" });
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) {
            setToast({ message: "Kérem adja meg az email címét és jelszavát.", type: "warning" });
            return;
        }
        try {
            const response = await loginUser({ email, password });
            if (response.status === 200) {
                navigate(from, { replace: true });
            }
        } catch (error) {
            setToast({ message: "Hibás email cím vagy jelszó. Kérem próbálja újra.", type: "error" });
        }
    }

    return (
        <div className={style.loginWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />
            <div className={style.container}>
                <h2 className={style.heading}>Bejelentkezés</h2>
                <form onSubmit={handleSubmit}>
                    <input className={style.input} type="email" placeholder="Email cím" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input className={style.input} type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className={style.loginButton}>Bejelentkezés</button>
                </form>
                <p className={style.registerLink}>
                    Nincs fiókod? <a href="/register">Regisztráció</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;