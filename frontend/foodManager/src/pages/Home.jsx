import '../css/Home.css'
import { useState, useEffect } from 'react'


function Home() {

    //For food and default date
    const [foods, setFoods] = useState([])
    const [defaultDate, setDefaultDate] = useState()

    //function to get the food
    const fetchFoods = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/foods/")
            const data = await response.json()
            setFoods(data)
        } catch (err) {
            console.log(err)
        }
    }

    //setup the date and get the food array,
    //Always rerender whenever the lists change in some way
    useEffect(()=>{
        fetchFoods()

        const d = new Date();
        setDefaultDate(d.toLocaleDateString('en-CA'))
        setFoodDate(d.toLocaleDateString('en-CA'))
    },[foods])

    //For filling out the form to add a new food item
    const [foodName, setFoodName] = useState("")
    const [foodCategory, setFoodCategory] = useState("meats") //Topmost category item to ensure category has a value
    const [foodDate, setFoodDate] = useState()
    const [foodCount, setFoodCount] = useState(1)
    const [foodPrice, setFoodPrice] = useState(0.00)

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

    // To add new food
    const handleAddFood = async () => {
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
                const response = await fetch("http://127.0.0.1:8000/api/foods/create/", {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify(foodData)
                })
            //after receiving the json data,
            const data = await respose.json()
            //update foods --> triggers rerender
            setFoods((f) => [...f, data])
            } catch(err) {
                console.error(err)
            }
        }
    }


    return(<>
        <div className="row">

            {/* The grocery side is a column */}
            <div className="column" id="grocery-side">
                <h1>Grocery List:</h1>

                {/* Div where you enter the food information to add new foods*/}
                <div className="grocery-add-section">
                    <form onSubmit={handleAddFood}>
                        {/* Food Name */}
                        <label htmlFor="foodname">Name:</label>
                        <input type="text" name="foodname" onChange={handleNameChange} placeholder='Enter item name...'></input>

                        {/* Food Category */}
                        <label htmlFor="foodtype"> Category:</label>
                        <select name="foodtype" onChange={handleCategoryChange}>
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
                        <input type="date" name="fooddate" onChange={handleDateChange} defaultValue={defaultDate}></input>

                        {/* Amount of Food */}
                        <label htmlFor="foodcount"> Item count:</label>
                        <input type="number" name="foodcount" onChange={handleCountChange} defaultValue={foodCount} min="1" max="10"></input><br />
                        
                        {/* Food Price */}
                        <label htmlFor="">Price:</label>
                        <input type="number" name="foodcost" onChange={handlePriceChange} defaultValue={foodPrice} min="0.00" max="200.00" step="0.01"></input>

                        <button type="submit">Add Grocery Item</button>
                    </form>
                </div>
                
                {/* Table under the "add" section of the groceries */}
                <div className="groceryList">
                    <table>
                        <tr> {/* The Table Headers */}
                            <th>Name</th>
                            <th>Category</th>
                            <th>Expiration Date</th>
                            <th>Count</th>
                            <th>Price</th>
                            <th>Update/Delete</th>
                        </tr>

                        {/* For every grocery item, display its info in table */}
                        {foods.map((food, index) => (
                            <tr key={index}>
                                <td>{food.name}</td>
                                <td>{food.category}</td>
                                <td>{food.expiration_date}</td>
                                <td>{food.count}</td>
                                <td>{food.price}</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))}

                    </table>
                </div>
                <button>Checkout</button>
            </div>
            

            {/* Pantry Side (WIP) */}
            <div className="column" id="pantry-side">
                <h1>Pantry List:</h1>
                <div className="pantryList"></div>
            </div>
        </div>
    </>)
}

export default Home