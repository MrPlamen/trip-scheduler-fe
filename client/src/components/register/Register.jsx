import { useContext, useState } from "react";
import { useRegister } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useRegister();
    const { userLoginHandler } = useContext(UserContext);

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const registerHandler = async (e) => {
        e.preventDefault();

        const { email, username, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setErrorMessage("Password mismatch!");
            return;
        }

        try {
            const authData = await register(email, username, password);
            userLoginHandler(authData);
            navigate("/");
        } catch (err) {
            const backendError = err?.error;

            if (backendError) {
                setErrorMessage(backendError);
            } else {
                setErrorMessage("Registration failed! Please try again.");
            }
        }
    };

    return (
        <section id="register-page" className="content auth">
            <form id="register" onSubmit={registerHandler}>
                <div className="container">
                    <div className="brand-logo"></div>
                    <h1>Register</h1>

                    <label className="auth-label" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="johndoe@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="auth-label" htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label className="auth-label" htmlFor="register-password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        id="register-password"
                        onChange={handleChange}
                        required
                    />

                    <label className="auth-label" htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        id="confirm-password"
                        onChange={handleChange}
                        required
                    />

                    {errorMessage && (
                        <p className="auth-error"><b>{errorMessage}</b></p>
                    )}

                    <input className="btn submit" type="submit" value="Register" />

                    <p className="field">
                        <span><Link to="/login">Or log in here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
}
