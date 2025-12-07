import { createContext, useEffect, useState } from "react";
import { useAuth } from "../api/authApi";

export const UserContext = createContext({
    user: null,
    userLoginHandler: () => {},
    userLogoutHandler: () => {},
});

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const { me } = useAuth();

    // Restore login from backend session on refresh
    useEffect(() => {
        me()
            .then(data => {
                setUser(data);     // user is logged in
            })
            .catch(() => {
                setUser(null);     // not logged in
            });
    }, []);

    const userLoginHandler = (userData) => {
        setUser(userData);
    };

    const userLogoutHandler = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, userLoginHandler, userLogoutHandler }}>
            {children}
        </UserContext.Provider>
    );
}
