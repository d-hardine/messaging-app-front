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

    //error handling
    const [firstNameError, setFirstNameError] = useState(false)
    const [firstNameErrorText, setFirstNameErrorText] = useState('')
    const [lastNameError, setLastNameError] = useState(false)
    const [lastNameErrorText, setLastNameErrorText] = useState('')
    const [usernameError, setUsernameError] = useState(false)
    const [usernameErrorText, setUsernameErrorText] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [emailErrorText, setEmailErrorText] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorText, setPasswordErrorText] = useState('')

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
                confirmPassword
            }
            setMismatchPassword(false)
            await axios.post(`${API_BASE_URL}/api/signup`, newUser)
                .then(response => {
                    console.log(response.status)
                    navigate('/')
                }).catch(err => {
                    console.error('Error occured: ', err.response.data.errors)
                    for(let i = 0; i < err.response.data.errors.length; i++) {
                        if(err.response.data.errors[i].path === 'firstName') {
                            setFirstNameError(true)
                            setFirstNameErrorText(err.response.data.errors[i].msg)
                        } else if(err.response.data.errors[i].path === 'lastName') {
                            setLastNameError(true)
                            setLastNameErrorText(err.response.data.errors[i].msg)
                        } else if(err.response.data.errors[i].path === 'username') {
                            setUsernameError(true)
                            setUsernameErrorText(err.response.data.errors[i].msg)
                        } else if(err.response.data.errors[i].path === 'email') {
                            setEmailError(true)
                            setEmailErrorText(err.response.data.errors[i].msg)
                        } else {
                            setPasswordError(true)
                            setPasswordErrorText(err.response.data.errors[i].msg)
                        }
                    }
                })
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
                    <input id="firstname" className={`${firstNameError && "signup-input-error"}`} name="firstname" placeholder="Bruce" type="text" required onChange={(e) => setFirstName(e.target.value)}/>
                    {firstNameError && (<div className="signup-error-info"><i>{firstNameErrorText}</i></div>)}
                    <label htmlFor="lastname">Last Name</label>
                    <input id="lastname" className={`${lastNameError && "signup-input-error"}`} name="lastname" placeholder="Wayne" type="text" required onChange={(e) => setLastName(e.target.value)}/>
                    {lastNameError && (<div className="signup-error-info"><i>{lastNameErrorText}</i></div>)}
                    <label htmlFor="username">Username</label>
                    <input id="username" className={`${usernameError && "signup-input-error"}`} name="username" placeholder="bruce.wayne" type="text" required onChange={(e) => setUsername(e.target.value)} />
                    {usernameError && (<div className="signup-error-info"><i>{usernameErrorText}</i></div>)}
                    <label htmlFor="email">Email</label>
                    <input id="email" className={`${emailError && "signup-input-error"}`} name="email" placeholder="brucewayne@gothammail.com" type="email" onChange={(e) => setEmail(e.target.value)} required/>
                    {emailError && (<div className="signup-error-info"><i>{emailErrorText}</i></div>)}
                    <label htmlFor="password">Password</label>
                    <input id="password" className={`${passwordError && "signup-input-error"}`} name="password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
                    <div className="signup-password-info">Min 8 characters, with at least 1 number & 1 uppercase letter</div>
                    {passwordError && (<div className="signup-error-info"><i>{passwordErrorText}</i></div>)}
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input id="confirm-password" className={`${mismatchPassword && "signup-input-error"}`} name="confirmPassword" type="password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                    {mismatchPassword && (<div className="signup-error-info"><i>Inputted password and confirm password mismatch</i></div>)}
                    <button type="submit">Register</button>
                    <div>Already have an account? Please <Link to="/">login</Link>.</div>
                </form>
            </main>
        </>
    )
}