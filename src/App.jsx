import { Outlet } from 'react-router'
import { useState } from 'react'
import Footer from './Components/Footer'
import Header from './Components/Header'

function App() {
  const [headerUsername, setHeaderUsername] = useState("")

  return (
    <>
      <Header headerUsername={headerUsername} setHeaderUsername={setHeaderUsername}/>
      <Outlet context={[headerUsername, setHeaderUsername]}/>
      <Footer />
    </>
  )
}

export default App
