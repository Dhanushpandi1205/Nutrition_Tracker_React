import { useEffect, useState, useContext } from "react";
const BASE_URL = 'https://api-backend-ool6.onrender.com';
import { Usercontext } from "../contexts/Usercontext";
import Header from "./Header"

export default function Diet() {
  let loggedData = useContext(Usercontext);

  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());

  const [total, setTotal] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    totalFiber: 0,
  });

  const [error, setError] = useState(null);
  
  useEffect(() => {
    setError(null); // Clear any previous errors
    
    if (!loggedData?.loggedUser?.userid || !loggedData?.loggedUser?.token) {
      setError('User not logged in');
      return;
    }

    fetch(
      `${BASE_URL}/track/${loggedData.loggedUser.userid}/${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loggedData.loggedUser.token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data) {
          setItems([]);
          return;
        }
        setItems(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => {
        console.error('Error fetching diet data:', err);
        setError('Failed to load diet data. Please try again.');
        setItems([]);
      });
  }, [date, loggedData]);

  // Recalculate totals whenever items change
  useEffect(() => {
    let totalCopy = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0,
    };

    items.forEach((item) => {
      if (item?.details) {
        totalCopy.totalCalories += Number(item.details.calories) || 0;
        totalCopy.totalProtein += Number(item.details.protein) || 0;
        totalCopy.totalCarbs += Number(item.details.carbohydrates) || 0;
        totalCopy.totalFats += Number(item.details.fat) || 0;
        totalCopy.totalFiber += Number(item.details.fiber) || 0;
      }
    });

    setTotal(totalCopy);
  }, [items]);

  return (

      

    <section className="diet-container">
      <Header />
      
      <div className="content-wrapper">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        )}
        <div className="date-selector">
          <i className="fas fa-calendar"></i>
          <input 
            type="date" 
            className="date-input"
            onChange={(event) => {
              setDate(new Date(event.target.value));
            }}
          />
        </div>

        <div className="nutrition-summary">
          <div className="summary-card calories">
            <i className="fas fa-fire"></i>
            <div className="card-content">
              <h4>Total Calories</h4>
              <p>{total.totalCalories} Kcal</p>
            </div>
          </div>
          <div className="summary-card protein">
            <i className="fas fa-drumstick-bite"></i>
            <div className="card-content">
              <h4>Protein</h4>
              <p>{total.totalProtein}g</p>
            </div>
          </div>
          <div className="summary-card carbs">
            <i className="fas fa-bread-slice"></i>
            <div className="card-content">
              <h4>Carbs</h4>
              <p>{total.totalCarbs}g</p>
            </div>
          </div>
          <div className="summary-card fats">
            <i className="fas fa-cheese"></i>
            <div className="card-content">
              <h4>Fats</h4>
              <p>{total.totalFats}g</p>
            </div>
          </div>
        </div>

        <div className="food-items-list">
          <h2>Today's Food Items</h2>
          {items.length === 0 ? (
            <div className="no-items">
              <i className="fas fa-utensils"></i>
              <p>No food items tracked yet</p>
            </div>
          ) : (
            items.map((item) => {
              // Skip rendering if essential data is missing
              if (!item?.foodId || !item?.details) {
                console.warn('Skipping food item due to missing data:', item);
                return null;
              }

              return (
                <div className="food-item-card" key={item._id}>
                  <div className="food-item-header">
                    <h3>{item.foodId?.name || 'Unknown Food'}</h3>
                    <span className="quantity">{item.quantity || 0}g</span>
                  </div>
                  <div className="food-item-details">
                    <div className="nutrient">
                      <i className="fas fa-fire"></i>
                      <span>{item.details?.calories || 0} Kcal</span>
                    </div>
                    <div className="nutrient">
                      <i className="fas fa-drumstick-bite"></i>
                      <span>{item.details?.protein || 0}g</span>
                    </div>
                    <div className="nutrient">
                      <i className="fas fa-bread-slice"></i>
                      <span>{item.details?.carbohydrates || 0}g</span>
                    </div>
                    <div className="nutrient">
                      <i className="fas fa-cheese"></i>
                      <span>{item.details?.fat || 0}g</span>
                    </div>
                    <div className="nutrient">
                      <i className="fas fa-seedling"></i>
                      <span>{item.details?.fiber || 0}g</span>
                    </div>
                  </div>
                </div>
              );
            }).filter(Boolean) // Remove any null items from the list
          )}
        </div>
      </div>
    </section>
  );
}
