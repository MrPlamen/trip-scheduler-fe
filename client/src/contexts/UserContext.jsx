import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
    user: null,
    userLoginHandler: () => {},
    userLogoutHandler: () => {},
});

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    // 🔹 Restore user on app start
    useEffect(() => {
        // 1️⃣ Try to restore from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            return;
        }

        // 2️⃣ Try backend session restore
        fetch("http://localhost:8080/users/me", {
            credentials: "include" // important — sends session cookie
        })
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                if (data) {
                    setUser(data);
                    localStorage.setItem("user", JSON.stringify(data));
                }
            })
            .catch(err => console.error("Session restore failed:", err));
    }, []);

    // 🔹 Login handler
    const userLoginHandler = (authData) => {
        setUser(authData);
        localStorage.setItem("user", JSON.stringify(authData));
    };

    // 🔹 Logout handler
    const userLogoutHandler = () => {
        setUser(null);
        localStorage.removeItem("user");

        fetch("http://localhost:8080/users/logout", {
            method: "POST",
            credentials: "include",
        }).catch(() => {});
    };

    const contextValue = {
        user,
        userLoginHandler,
        userLogoutHandler,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}
