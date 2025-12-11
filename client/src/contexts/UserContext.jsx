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
    const { logout: apiLogout } = useLogout();

    // run on app load
    useEffect(() => {
        me()
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    const userLoginHandler = (userData) => {
        setUser(userData);
    };

    const userLogoutHandler = async () => {
        await apiLogout();   // backend logout
        setUser(null);       // frontend logout
    };

    return (
        <UserContext.Provider value={{ user, userLoginHandler, userLogoutHandler }}>
            {children}
        </UserContext.Provider>
    );
}
