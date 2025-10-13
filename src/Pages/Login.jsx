import { useState, useEffect } from "react"
import { useNavigate, Link, useOutletContext } from "react-router"
import axios from "axios"
import PageTitle from "../Components/PageTitle"
import './Login.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState('')

    const [incorrectUserPass, setIncorrectUserPass] = useState(false)

    const [headerUsername, setHeaderUsername] = useOutletContext()

    const navigate = useNavigate()
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

    async function fetchAuth() {
        const token = localStorage.getItem('jwtToken')
        if(token) {
            await axios.get(`${API_BASE_URL}/api/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                navigate('/chat')
            }).catch(err => {
                console.error(err.message)
                navigate('/')
            })
        } else {
            navigate('/')
        }
    }

    useEffect(() => {
        fetchAuth()
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        const loginAttemptUser = {
            username,
            password,
        }
        await axios.post(`${API_BASE_URL}/api/login`, loginAttemptUser)
            .then(response => {
                localStorage.setItem("jwtToken", response.data.token)
                setHeaderUsername(response.data.username)
                setIncorrectUserPass(false)
                navigate('/chat')
            })
            .catch(err => {
                console.error(err.message)
                if(err.status === 401)
                    setIncorrectUserPass(true)
            })
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
                    {incorrectUserPass && (<div className="login-error-message">Incorrect Username or Password</div>)}
                    <div>Don't have an account? Signup <Link to="/signup">here</Link>.</div>
                </form>
            </main>
        </>
    )
}