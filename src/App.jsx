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
  const [authState, setAuthState] = useState({
    loggedUser: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("nutrify-user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Stored user data:', userData);
        
        // Ensure all required fields are present
        const validatedUserData = {
          ...userData,
          name: userData.name || userData.username,
          email: userData.email,
          age: userData.age,
          userid: userData.userid || userData._id,
          token: userData.token
        };

        setAuthState({
          loggedUser: validatedUserData,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState({
          loggedUser: null,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthState({
        loggedUser: null,
        isLoading: false,
        error: "Failed to load user data"
      });
    }
  }, []);

  const setLoggedUser = (user) => {
    setAuthState({
      loggedUser: user,
      isLoading: false,
      error: null
    });
  };

  return (
     <>
         <Usercontext.Provider value={{...authState, setLoggedUser}}>
           <BrowserRouter>
             {authState.isLoading ? (
               <div className="loading-container">
                 <div className="loading-spinner"></div>
                 <p>Loading...</p>
               </div>
             ) : (
             <Routes>

                <Route path ='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path ='/login' element={<Login/>}/>
                <Route path ='/track' element={<Private Component={Track}/>}/>
                 <Route path ='/diet' element={<Private Component={Diet}/>}/>
                
                <Route path ='*' element={<NotFound/>} />

             </Routes>
             )}
           </BrowserRouter>
          </Usercontext.Provider>

    </>
  )
}

export default App
