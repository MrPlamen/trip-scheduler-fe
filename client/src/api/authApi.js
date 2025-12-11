import request from "../utils/request";

const baseUrl = "http://localhost:8080/users";

export const useAuth = () => {
    const me = async () => {
        return request.get(`${baseUrl}/me`);
    };

    return { me };
};

// ---------- LOGIN ----------
export const useLogin = () => {
    const login = async (email, password) => {
        return await request.post(
            `${baseUrl}/login`,
            { email, password },
            { credentials: "include" }  
        );
    };

    return { login };
};

// ---------- REGISTER ----------
export const useRegister = () => {
    const register = async (email, username, password) => {
        return await request.post(
            `${baseUrl}/register`,
            { email, username, password },
            { credentials: "include" }
        );
    };

    return { register };
};

// ---------- LOGOUT ----------
export const useLogout = () => {
    const logout = async () => {
        return await request.post(
            `${baseUrl}/logout`,
            {},
            { credentials: "include" }
        );
    };

    return { logout };
};


