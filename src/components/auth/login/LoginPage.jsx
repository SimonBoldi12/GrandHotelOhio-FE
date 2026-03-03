import style from "./LoginPage.module.css";
import { loginUser } from "../../../service/ApiService";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/home";

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) {
            setError("Kérem adja meg az email címét és jelszavát.");
            setTimeout(() => setError(""), 5000);
            return;
        }

        try {
            const response = await loginUser(email, password);
            if (response.status === 200) {
                navigate(from, { replace: true });
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(""), 5000);
        }
    }

    return ( 
        <div className={style.loginContainer}>
            <h2>Login</h2>
            {error && <p className={style.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="password">Jelszó:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p className={style.registerLink}>
                Nincs fiókod? <a href="/register">Regisztráció</a>
            </p>
        </div>
     );
}

export default LoginPage;