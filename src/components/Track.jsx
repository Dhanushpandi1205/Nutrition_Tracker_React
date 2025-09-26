import { Usercontext } from "../contexts/Usercontext";
const BASE_URL = 'https://api-backend-ool6.onrender.com';
import { useContext, useEffect, useState } from "react";
import Food from "./Food";
import Header from "./Header"


export default function Track() {
  const loggedData = useContext(Usercontext);

  const [foodItems, setFoodItems] = useState([]);

  const [food,setFood]= useState(null);
  
  useEffect(()=>{
    console.log(food)
  })

  function searchFood(event) {
    if (event.target.value !== "") {
  fetch(`${BASE_URL}/foods/${event.target.value}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loggedData.loggedUser.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          
         if(data.message === undefined)
            {
              setFoodItems(data);
            }
            else{
              setFoodItems([]);
            }
        })

        .catch((err) => {
          console.log(err);
        });

    } 
    else
    {
      setFoodItems([]);
    }
  }

  return (
    <section className="container track-container">
     
        <Header></Header>
      <div className="search">
        <input
          className="search-inp"
          onChange={searchFood}
          type="search"
          placeholder="Search Food Items"
        />

        {foodItems.length !== 0 ? (
          <div className="search-results">
            {foodItems.map((item) => {
              return (
                <p className="item"  onClick={()=>{
                 setFood(item);
                }}key={item._id}>
                  {item.name}
                </p>
              );
            })}
          </div>
        ) : null}
      </div>
  
  
      {
        food !==null?(
       <Food food = {food}/>
        ):null
      }
     
    


    </section>
  );
}
