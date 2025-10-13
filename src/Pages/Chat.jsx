import { useEffect, useState } from "react";
import PageTitle from "../Components/PageTitle";
import { useNavigate, useOutletContext } from "react-router";
import axios from "axios";

export default function Chat() {
    const [user, setUser] = useState()
    const navigate = useNavigate()
    const [headerUsername, setHeaderUsername] = useOutletContext()
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

    async function fetchAuth() {
        const token = localStorage.getItem('jwtToken')
        if(token) {
            await axios.get(`${API_BASE_URL}/api/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                setUser(response.data)
                setHeaderUsername(response.data.username)
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

    return(
        <>
        <PageTitle title="Chat | Hardine Chat" />
        {user && (
            <main>
                <div>Hello {user.firstName}</div>
            </main>
        )}
        </>
    )
}