import {useState, useEffect} from 'react'
import "../css/UpdateFoodModal.css"

//import all the stuff from Home.jsx
function UpdateFoodModal({food,closeModal,
                          fetchFoods,handleNameChange,
                          handleCategoryChange,
                          handleDateChange,
                          handleCountChange,
                          handlePriceChange, foods}) {

    // To update food
    const handleUpdateFood = async () => {
        //As long as there is a name entered for the food, add the food to the grocery list
        if (!foodName.trim().length==0) {
            //get the values from the grocery item-adding form
            const foodData = {
                name: foodName,
                category: foodCategory,
                expiration_date: foodDate,
                count: foodCount,
                price: foodPrice
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/foods/:${food.id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify(foodData)
                })
            
                //for every grocery food item in "Foods," see if the id of "Foods"'s said grocery item matches with whatever particular fruit in THIS component's id is :D
                setFoods((f) => f.map((groceryFood) => {
                    if (groceryFood.id===food.id) {
                        // changes foods array from Home.jsx --> triggers rerender(?)
                        return foodData
                    } else {
                        return foods
                    }
                }))

            //close modal, refetch the new fountain data

            } catch(err) {
                console.error(err)
            }
        }
    }

    // In case users don't make any changes to a field, ensure all fields have a value right off the bat
    useEffect(() => {
        setFoodName(food.name)
        setFoodCategory(food.category)
        setFoodDate(food.date)
        setFoodCount(food.count)
        setFoodPrice(food.price)
    },[])

    //For filling out the form to add a new food item
    const [foodName, setFoodName] = useState("")
    const [foodCategory, setFoodCategory] = useState("") //Topmost category item to ensure category has a value
    const [foodDate, setFoodDate] = useState()
    const [foodCount, setFoodCount] = useState()
    const [foodPrice, setFoodPrice] = useState()

    //All for when users are adding food info
    function handleNameChange(event) {
        setFoodName(event.target.value)
    }
    function handleCategoryChange(event) {
        setFoodCategory(event.target.value)
    }
    function handleDateChange(event) {
        setFoodDate(event.target.value)
    }
    function handleCountChange(event) {
        setFoodCount(event.target.value)
    }
    function handlePriceChange(event) {
        setFoodPrice(event.target.value)
    }
    
    
    return(<>
            <div id="myModal" className="modal">
            <div className="modal-content">
                
                <span className="close" onClick={closeModal}>&times;</span> {/* Onclick function here to close modal (&times; is an x) */}

                <form>
                    {/* Food Name */}
                    <label htmlFor="foodname">Name:</label>
                    <input type="text" name="foodname" defaultValue={food.name} onChange={handleNameChange} placeholder='Enter item name...'></input>

                    {/* Food Category */}
                    <label htmlFor="foodtype"> Category:</label>
                    <select name="foodtype" defaultValue={food.category} onChange={handleCategoryChange}>
                        <option>meats</option>
                        <option>dairy</option>
                        <option>fruits</option>
                        <option>vegetables</option>
                        <option>desserts</option>
                        <option>bakery/grains</option>
                        <option>condiments</option>
                        <option>sauces</option>
                        <option>seasonings</option>
                        <option>beverages</option>
                    </select><br />
                    
                    {/* Food Expiration Date */}
                    <label htmlFor="fooddate"> Expiration date:</label>
                    <input type="date" name="fooddate" defaultValue={food.expiration_date} onChange={handleDateChange}></input>

                    {/* Amount of Food */}
                    <label htmlFor="foodcount"> Item count:</label>
                    <input type="number" name="foodcount" defaultValue={food.count} onChange={handleCountChange} min="1" max="10"></input><br />
                    
                    {/* Food Price */}
                    <label htmlFor="">Price:</label>
                    <input type="number" name="foodcost" defaultValue={food.price} onChange={handlePriceChange} min="0.00" max="200.00" step="0.01"></input>

                    <button type="submit" onClick={handleUpdateFood}>Update Grocery Item</button>
                </form>
            </div>
        </div>
    </>)
}

export default UpdateFoodModal