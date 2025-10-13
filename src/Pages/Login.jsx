import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router"
import PageTitle from "../Components/PageTitle"
import './Login.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleLogin = () => {
        console.log(username, password)
    }

    return (
        <>
            <PageTitle title="Please login first | Hardine Chat"/>
            <main>
                <form action="/signup" method="post" onSubmit={handleLogin} className="login-form">
                    <h1>Login your account</h1>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" placeholder="bruce-wayne" type="text" onChange={(e) => setUsername(e.target.value)} required />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">Login</button>
                    <div>Don't have an account? Signup <Link to="/signup">here</Link>.</div>
                </form>
            </main>
        </>
    )
}