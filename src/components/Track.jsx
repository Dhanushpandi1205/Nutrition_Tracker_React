import { Usercontext } from "../contexts/Usercontext";
const BASE_URL = 'https://api-backend-ool6.onrender.com';
import { useContext, useEffect, useState } from "react";
import Food from "./Food";
import Header from "./Header"


export default function Track() {
  const loggedData = useContext(Usercontext);

  const [foodItems, setFoodItems] = useState([]);
  const [food, setFood] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  
  useEffect(() => {
    console.log(food);
  });

  function searchFood(event) {
    const value = event.target.value;
    setSearchValue(value);
    
    if (value !== "") {
      setIsListOpen(true);
      fetch(`${BASE_URL}/foods/${value}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loggedData.loggedUser.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === undefined) {
            setFoodItems(data);
          } else {
            setFoodItems([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFoodItems([]);
      setIsListOpen(false);
    }
  }

  function handleFoodSelect(item) {
    setFood(item);
    setFoodItems([]); // Clear search results
    setSearchValue(""); // Clear search input
    setIsListOpen(false); // Close the list
  }

  return (
    <section className="track-container">
      <Header />
      
      <div className="content-wrapper">
        <div className="track-header">
          <h1>Track Your Food</h1>
          <p>Search and add food items to your daily tracker</p>
        </div>

        <div className="search-container">
          <div className="search">
            <i className="fas fa-search search-icon"></i>
            <input
              className="search-input"
              onChange={searchFood}
              value={searchValue}
              type="search"
              placeholder="Search food items..."
            />
          </div>

          {isListOpen && foodItems.length !== 0 && (
            <div className="search-results">
              {foodItems.map((item) => (
                <div
                  className="search-result-item"
                  onClick={() => handleFoodSelect(item)}
                  key={item._id}
                >
                  <i className="fas fa-utensils"></i>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{item.calories} Kcal per 100g</p>
                  </div>
                  <i className="fas fa-plus-circle add-icon"></i>
                </div>
              ))}
            </div>
          )}
        </div>

        {food !== null && <Food food={food} />}
      </div>
    </section>
  );
}
