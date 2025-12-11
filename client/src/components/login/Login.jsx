import { useActionState, useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";

export default function Login() {
    const navigate = useNavigate();
    const { userLoginHandler } = useContext(UserContext);
    const { login } = useLogin();

    const [errorMessage, setErrorMessage] = useState("");

    const loginHandler = async (_, formData) => {
        const formValues = Object.fromEntries(formData);

        try {
            const authData = await login(formValues.email, formValues.password);

            userLoginHandler(authData);
            setErrorMessage("");
            navigate("/trips");

        } catch (err) {
            const message = err.response?.data?.message || "Login failed";
            setErrorMessage(message);
        }
    };

    const [_, loginAction, isPending] = useActionState(loginHandler, { email: '', password: '' });

    return (
        <section id="login-page" className="auth">
            <form id="login" action={loginAction}>

                <div className="container">
                    <i className="fas fa-user"></i>
                    <h1>Login</h1>
                    <label className="auth-label" htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="example@mail.com" />

                    <label className="auth-label" htmlFor="login-pass">Password:</label>
                    <input type="password" id="login-password" name="password" />
                    <input type="submit" className="btn submit" value="Login" disabled={isPending} />
                    {errorMessage && errorMessage === "Login or password don't match" && (
                        <p className="auth-error"><b>Incorrect email or password!</b></p>
                    )}
                    <p className="field">
                        <span><Link to="/register">Or register here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
}