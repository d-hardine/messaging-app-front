import { Link } from "react-router";
import PageTitle from "../Components/PageTitle";
import './Signup.css'

export default function Signup() {
    return (
        <>
            <PageTitle title="Signup | Hardine Chat"/>
            <main>
                <form action="/register" method="post" className="signup-form">
                    <h1>Create a New Account</h1>
                    <label htmlFor="firstname">First Name</label>
                    <input id="firstname" name="firstname" placeholder="Bruce" type="text" required />
                    <label htmlFor="lastname">Last Name</label>
                    <input id="lastname" name="lastname" placeholder="Wayne" type="text" required />
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" placeholder="bruce.wayne" type="text" required />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" required/>
                    <div className="signup-password-info">Min 8 characters, numbers & letters</div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input id="confirm-password" name="confirmPassword" type="password" required/>
                    <button type="submit">Register</button>
                    <div>Already have an account? Please <Link to="/">login</Link>.</div>
                </form>
            </main>
        </>
    )
}