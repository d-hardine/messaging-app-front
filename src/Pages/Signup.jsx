import { Link, useNavigate } from "react-router";
import PageTitle from "../Components/PageTitle";
import axios from "axios";
import './Signup.css'
import { useState } from "react";

export default function Signup() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [mismatchPassword, setMismatchPassword] = useState(false)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        if(password === confirmPassword) {
            const newUser = {
                firstName,
                lastName,
                username,
                email,
                password,
            }
            setMismatchPassword(false)
            const response = await axios.post(`${API_BASE_URL}/api/signup`, newUser)
            if(response.status === 201)
                navigate('/')
        } else {
            setMismatchPassword(true)
        }
    }

    return (
        <>
            <PageTitle title="Signup | Hardine Chat"/>
            <main>
                <form action="/register" method="post" onSubmit={handleSignup} className="signup-form">
                    <h1>Create a New Account</h1>
                    <label htmlFor="firstname">First Name</label>
                    <input id="firstname" name="firstname" placeholder="Bruce" type="text" required onChange={(e) => setFirstName(e.target.value)}/>
                    <label htmlFor="lastname">Last Name</label>
                    <input id="lastname" name="lastname" placeholder="Wayne" type="text" required onChange={(e) => setLastName(e.target.value)}/>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" placeholder="bruce.wayne" type="text" required onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" placeholder="brucewayne@gothammail.com" type="email" onChange={(e) => setEmail(e.target.value)} required/>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
                    <div className="signup-password-info">Min 8 characters, numbers & letters</div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input id="confirm-password" name="confirmPassword" type="password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                    {mismatchPassword && (<div className="signup-mismatch-password">Inputted password and confirm password mismatch</div>)}
                    <button type="submit">Register</button>
                    <div>Already have an account? Please <Link to="/">login</Link>.</div>
                </form>
            </main>
        </>
    )
}