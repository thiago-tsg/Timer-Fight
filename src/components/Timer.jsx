import "../styles/Timer.scss";
import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export default function Timer() {
    const BASE_URL = import.meta.env.BASE_URL;
    const { gymId } = useParams();
    const navigate = useNavigate();

    const [roundMinutes, setRoundMinutes] = useState(3);
    const [restSeconds, setRestSeconds] = useState(60);
    const [totalRounds, setTotalRounds] = useState(3);
    const [currentRound, setCurrentRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isRest, setIsRest] = useState(false);

    const timerRef = useRef(null);
    const bongSound = useRef(new Audio(`${BASE_URL}bong.mp3`));
    const piSound = useRef(new Audio(`${BASE_URL}pi.mp3`));

    const [gymData, setGymData] = useState(null);
    const [loadingGym, setLoadingGym] = useState(true);

    useEffect(() => {
        async function loadGym() {
            setLoadingGym(true);
            try {
                const gymDoc = doc(db, "gyms", gymId);
                const snap = await getDoc(gymDoc);
                if (snap.exists()) {
                    setGymData(snap.data());
                } else {
                    setGymData({
                        name: gymId,
                        logoPath: `/logos/${gymId}/logo.png`,
                        primaryColor: "#111",
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar gym:", err);
                setGymData({
                    name: gymId,
                    logoPath: `/logos/${gymId}/logo.png`,
                    primaryColor: "#111",
                });
            } finally {
                setLoadingGym(false);
            }
        }
        loadGym();
    }, [gymId]);

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsRest(false);
            setCurrentRound(1);
            setTimeLeft(roundMinutes * 60);
            bongSound.current.play();
        }
    };

    const togglePause = () => {
        if (isRunning) {
            clearInterval(timerRef.current);
            setIsRunning(false);
        } else {
            setIsRunning(true);
        }
    };

    const resetTimer = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setCurrentRound(1);
        setIsRest(false);
        setTimeLeft(roundMinutes * 60);
    };

    useEffect(() => {
        if (!isRunning) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    useEffect(() => {
        if (!isRunning || isRest) return;
        if (timeLeft > 0 && timeLeft <= 10) {
            piSound.current.currentTime = 0;
            piSound.current.play();
        }
    }, [timeLeft, isRest, isRunning]);

    useEffect(() => {
        if (!isRunning) return;

        if (!isRest && timeLeft === 0) {
            bongSound.current.play();
            setTimeout(() => {
                if (currentRound < totalRounds) {
                    setIsRest(true);
                    setTimeLeft(restSeconds);
                } else {
                    setIsRunning(false);
                    alert("Treino finalizado!");
                }
            }, 500);
        }

        if (isRest && timeLeft === 0) {
            setIsRest(false);
            setCurrentRound((prev) => prev + 1);
            setTimeLeft(roundMinutes * 60);
            bongSound.current.play();
        }
    }, [timeLeft, isRest, currentRound, totalRounds, restSeconds, roundMinutes, isRunning]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error("Erro ao sair:", err);
        }
    };

    if (loadingGym) return <div>Carregando dados da academia...</div>;

    const logoUrl = gymData?.logoPath
        ? `${BASE_URL}${gymData.logoPath.replace(/^\/+/, '')}`
        : `${BASE_URL}logos/${gymId}/logo.png`;

    const backgroundStyle = {
        backgroundColor: gymData?.primaryColor ?? "#111",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundImage: `url(${logoUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "150px auto",
    };

    return (
        <section className="cg-timer container flex-colum gap-md"
            style={{
                backgroundImage: `url(${logoUrl})`,
            }}>
            <div>

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
                    <div className="shape square square3"></div>
                </div>

                <div className="c-timer flex-colum flex-center gap-md">
                    <div className="cg-min-round flex-colum flex-center">
                        <label>Minutos do round:</label>
                        <input
                            type="number"
                            value={roundMinutes}
                            onChange={(e) => setRoundMinutes(Number(e.target.value))}
                        />
                    </div>

                    <div className="cg-descanso flex-colum flex-center">
                        <label>Descanso (segundos):</label>
                        <input
                            type="number"
                            value={restSeconds}
                            onChange={(e) => setRestSeconds(Number(e.target.value))}
                        />
                    </div>

                    <div className="cg-rounds flex-colum flex-center">
                        <label>Total de rounds:</label>
                        <input
                            type="number"
                            value={totalRounds}
                            onChange={(e) => setTotalRounds(Number(e.target.value))}
                        />
                    </div>

                    <div className="cg-tempo flex-colum flex-center gap-md">
                        <p className="tempo">{isRest ? "Descanso" : `Round ${currentRound}`}</p>
                        <p className={`tempo ${!isRest && timeLeft > 0 && timeLeft <= 10 ? "urgent" : ""}`}>
                            {formatTime(timeLeft)}
                        </p>
                    </div>

                    <div className="cg-btn flex-center gap-md">
                        <button onClick={startTimer} disabled={isRunning && !isRest} className="btn">
                            Iniciar
                        </button>
                        <button onClick={togglePause} className="btn">
                            {isRunning ? "Pausar" : "Continuar"}
                        </button>
                        <button onClick={resetTimer} className="btn">
                            Reiniciar
                        </button>
                        <button onClick={handleLogout} className="btn logout-button">
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
