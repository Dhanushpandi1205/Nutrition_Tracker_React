import { useContext, useEffect, useState } from "react";
import { Usercontext } from "../contexts/Usercontext";


export default function Food(props)
{

     const [grams,setGrams] = useState(100);
     const [food,setFood]= useState({});

     let loggedData = useContext(Usercontext);







     useEffect(()=>{
       setFood(props.food);
     },[props.food])

     function calcMacros(event)
     {
       
       
       if(event.target.value.length !== 0)
       {
              let quantity = Number(event.target.value);
               setGrams(quantity); 
              let copyFood = {...food};
              
             copyFood.protein = (props.food.protein*quantity)/100;
             copyFood.carbohydrates = (props.food.carbohydrates*quantity)/100;
              copyFood.fat = (props.food.fat*quantity)/100;
             copyFood.fiber = (props.food.fiber*quantity)/100;
             copyFood.calories = (props.food.calories*quantity)/100;

             setFood(copyFood);
             
       }
       

     }
    
     function trackFoodItem()
     {
        let trackedItem = {
          userId :loggedData.loggedUser.userid,
          foodId: props.food._id,
          details:{
            protein: food.protein,
            carbohydrates: food.carbohydrates,
            calories:food.calories,
            fiber: food.fiber,
            fat: food.fat
          },
          quantity:grams
        }
         console.log(loggedData);
        console.log(trackedItem);
      

       fetch("http://localhost:8000/track",{
         method:"POST",
         body:JSON.stringify(trackedItem),
         headers:{
          "Authorization":`Bearer ${loggedData.loggedUser.token}`,
          "Content-Type":"application/json"
         }
       })
       .then((res)=>res.json())
       .then((data)=>{
        console.log(data);
       })
       .catch((err)=>{
        console.log(err);
       })
     

     }










    return(
  <div className="food">
          
          <div className="food-img"> 
                <img className="food-image" src={food.imgurl}/>
          </div>

          <h3>{food.name} ({food.calories} Kcal for {grams}G)</h3>
          
          <div className="nutrient">
                <p className="n-title" >Protein</p>
                 <p className="n-value" >{food.protein}g</p>

          </div>


           <div className="nutrient">
                <p className="n-title" >Carbs</p>
                 <p className="n-value" >{food.carbohydrates}g</p>

          </div>


            <div className="nutrient">
                <p className="n-title" >Fat</p>
                 <p className="n-value" >{food.fat}g</p>

          </div>


           <div className="nutrient">
                <p className="n-title" >Fibre</p>
                 <p className="n-value" >{food.fiber}g</p>

          </div>


          <div className="track-control">

          <input type="number" onChange={calcMacros}
          className="inp" placeholder="Quantity in Gms" />

          <button className="btn"  onClick={trackFoodItem}>Track</button>
        
          </div>

      </div>

    ) }