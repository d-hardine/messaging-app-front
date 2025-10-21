import { Link, useNavigate } from 'react-router'
import './Header.css'
import { useRef } from 'react'

export default function Header({headerUsername, setHeaderUsername}) {
    const navigate = useNavigate()
    const dialogRef = useRef()

    const toggleDialog = () => {
        if(!dialogRef.current) //check if the dialog tag has ref
            return
        if(dialogRef.current.hasAttribute('open')) //check if the dialog tag is opened
            dialogRef.current.close()
        else
            dialogRef.current.showModal()
    }

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
                <svg onClick={toggleDialog} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={30} fill='#3F3F3F'><path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21" /></svg>
                <button onClick={handleLogout}>LOG OUT</button>
                <dialog ref={dialogRef} onClick={(e) => (e.currentTarget === e.target) && toggleDialog()}>
                    <div className="dialog-container">
                        <h2>Notification</h2>
                        <div><b>bruce.wayne</b> wants to be your friend</div>
                        <button onClick={toggleDialog}>close</button>
                    </div>
                </dialog>
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