import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

export default function Header() {
    const { email, username } = useContext(UserContext);

    return (
        <header className="header-container">
            <div className="logo-container">
                    <h1>
                        <Link className="hero-home" to="/">
                            <img src="/logo3.png" alt="Trip Planner" className="logo" />
                        </Link>
                    </h1>
            </div>

            <nav className="hero-nav">

                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/search">Search</Link>

                {username || email ? (
                    <>
                        <Link className="nav-link" to="/trips">My trips</Link>
                        <Link className="nav-link" to="/visits">My visit points</Link>
                        <Link className="nav-link" to="/trips/create">Create Trip</Link>
                        <Link className="nav-link" to="/logout">
                            Logout (
                            <span className={username === "Admin" ? "logged-admin" : "logged-username"}>
                                {username || email}
                            </span>
                            )
                        </Link>
                    </>
                ) : (
                    <>
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link" to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
