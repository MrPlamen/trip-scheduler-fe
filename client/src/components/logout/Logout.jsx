import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { useLogout } from "../../api/authApi";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function Logout() {
    const { logout } = useLogout();
    const { userLogoutHandler } = useContext(UserContext);
    const [done, setDone] = useState(false);

    useEffect(() => {
        logout()
            .finally(() => {
                userLogoutHandler(); 
                setDone(true);
            });
    }, []);

    return done ? <Navigate to="/" /> : null;
}
