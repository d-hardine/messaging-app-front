import { Link, useNavigate } from 'react-router'
import './Header.css'

export default function Header({headerUsername, setHeaderUsername}) {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.clear()
        setHeaderUsername('')
        navigate('/')
    }

    return (
        <header>
            <Link to="/" className="header-left-container">Hardine Chat</Link>
            {headerUsername !== "" ?
            <div className="header-right-container">
                <div><b>{headerUsername}</b></div>
                <button onClick={handleLogout}>LOG OUT</button>
            </div>
            :
            <div className="header-right-container">
                <Link to="/signup"><button>SIGN UP</button></Link>
                <Link to="/"><button>LOGIN</button></Link>
            </div>
            }
        </header>
    )
}