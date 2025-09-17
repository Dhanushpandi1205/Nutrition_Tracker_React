import './App.css'
import{BrowserRouter,Routes,Route, useNavigate} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Track from './components/Track'
import Diet from "./components/Diet";
import { Usercontext } from './contexts/Usercontext'
import { useEffect, useState } from 'react'
import Private from './components/private'


function App() {

  const [loggedUser,setLoggedUser]=useState(JSON.parse(localStorage.getItem("nutrify-user")));
 
 



  return (
     <>
         <Usercontext.Provider value={{loggedUser,setLoggedUser}}>
           < BrowserRouter>
         
             <Routes>

                <Route path ='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path ='/login' element={<Login/>}/>
                <Route path ='/track' element={<Private Component={Track}/>}/>
                 <Route path ='/diet' element={<Private Component={Diet}/>}/>
                
                <Route path ='*' element={<NotFound/>} />

             </Routes>
          
           </BrowserRouter>
         
          
          </Usercontext.Provider>

    </>
  )
}

export default App
