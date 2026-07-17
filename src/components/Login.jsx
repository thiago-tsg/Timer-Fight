import "../styles/Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, userData, loading } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const uid = cred.user.uid;

            const userDocRef = doc(db, "users", uid);
            const userSnap = await getDoc(userDocRef);

            if (!userSnap.exists()) {
                setError("Perfil de usuário não encontrado. Contate o administrador.");
                return;
            }

            const data = userSnap.data();
            const gymId = data.gymId;
            if (!gymId) {
                setError("Usuário não está associado a uma academia (gymId ausente).");
                return;
            }

            navigate(`/timer/${encodeURIComponent(gymId)}`, { replace: true });
        } catch (err) {
            console.error(err);
            setError("Erro ao fazer login: " + err.message);
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (user && userData?.gymId) {
        navigate(`/timer/${encodeURIComponent(userData.gymId)}`, { replace: true });
        return null;
    }

    return (
        <div className="login-container flex-colum flex-center container">
            <div className="background-shapes">

                {/* Círculos */}
                <div className="shape circle circle1"></div>
                <div className="shape circle circle2"></div>
                <div className="shape circle circle3"></div>
                <div className="shape circle circle4"></div>

                {/* Triângulos */}
                <div className="shape triangle triangle1"></div>
                <div className="shape triangle triangle2"></div>
                <div className="shape triangle triangle3"></div>
                
                {/* Quadrados */}
                <div className="shape square square1"></div>
                <div className="shape square square2"></div>
                <div className="shape square square3">
                    
                </div>
            </div>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="flex-colum gap-md">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="buttons">
                    <button type="submit">Entrar</button>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
