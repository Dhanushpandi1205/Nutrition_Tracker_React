import { Navigate } from "react-router-dom";
import { Usercontext } from "../contexts/Usercontext";
import { useContext } from "react";


export default function Private({Component})
{
  const LoggedData = useContext(Usercontext);

  console.log(LoggedData);

  return(

    LoggedData.loggedUser!==null?
    <Component/>
    :
    <Navigate to="/login"/>
  )
}