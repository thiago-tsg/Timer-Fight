import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);          
    const [userData, setUserData] = useState(null);  
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                try {
                    const userDocRef = doc(db, "users", u.uid);
                    const snap = await getDoc(userDocRef);
                    if (snap.exists()) {
                        setUserData(snap.data());
                    } else {
                        setUserData({ email: u.email, uid: u.uid });
                    }
                } catch (err) {
                    console.error("Erro ao buscar userData:", err);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const value = { user, userData, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
