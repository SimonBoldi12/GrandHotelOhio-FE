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
            const response = await loginUser({email, password});
            if (response.status === 200) {
                navigate(from, { replace: true });
            }
        } catch (error) {
            setError("Hibás email cím vagy jelszó. Kérem próbálja újra.");
            setTimeout(() => setError(""), 5000);
        }
    }

    return ( 
        <div className={style.loginWrapper}>
        <div className={style.container}>
            <h2 className={style.heading}>Bejelentkezés</h2>
            {error && <p className={style.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    className={style.input}
                    type="email"
                    placeholder="Email cím"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className={style.input}
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
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