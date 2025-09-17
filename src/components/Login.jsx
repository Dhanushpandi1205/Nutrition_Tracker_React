import { useState,useContext } from "react"
import { Link , useNavigate } from "react-router-dom"
import { Usercontext } from "../contexts/Usercontext";




export default function Login(){

   const loggedData = useContext(Usercontext);



    const navigate = useNavigate();

   const [userCred,setUserCred] = useState({
    email:"",
    password:""
   })

   const [message,setMessage]= useState({
    type:"invisible-msg",
    text:""

   })

   function handleInput(event){
     setUserCred((prevState)=>{
        return{...prevState,[event.target.name]:event.target.value};
     })
   }

   function handleLogin(event)
   {
    event.preventDefault();
    

    fetch("http://localhost:8000/login",{
     method:"POST",
     body:JSON.stringify(userCred),
     headers:{
        "Content-Type":"application/json"
     }
     
    })
    .then((res)=>{
       
      if(res.status === 404)
      {
        setMessage({type:"error",text:"Username or Email Doesn't Exist"})
      }
      else if(res.status===403){
         setMessage({type:"error",text:"Incorrect password"})
    }
      else if (res.status===200){
            return res.json()
    }

        setTimeout(()=>{
        setMessage({type:"invisible-msg",text:"Dummy sg"})
    },5000)

     
      })
    .then((data)=>{
       
        if(data.token !== undefined){

        localStorage.setItem("nutrify-user",JSON.stringify(data));
       
        loggedData.setLoggedUser(data);
        navigate("/track");

        }

    })
    .catch((err)=>{
          console.log(err);
    })

   }





    return(
           <>
           <section className="container">
               
               <form  className="form" onSubmit={handleLogin}>
                   <h1>Login to be Fit </h1>
                   
                

                   <input  className="inp" required type="text" placeholder="Enter Email" onChange={handleInput} name="email" value={userCred.email}/>
                   <input  className="inp" required maxLength={8} type="password" placeholder="Enter Password" onChange={handleInput} name="password" value={userCred.password}/>
                 
                     <button className="btn">Login</button>
                     <p>Dont Have a Account ? <Link to="/register">Register Now</Link>  </p>
                      <p className={message.type}>{message.text}</p>
               </form>

           </section>
           
           
           
           
           </>
            

    )
}