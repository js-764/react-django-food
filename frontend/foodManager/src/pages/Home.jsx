import '../css/Home.css'
import { useState, useEffect } from 'react'
import UpdateFoodModal from '../components/UpdateFoodModal'


function Home() {

    //For the array with ALL the foods
    const [foods, setFoods] = useState([])

    //To prepare to set the default date of a grocery item
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

    //Set up the default grocery-adding date, and get the food array.
    useEffect(()=>{
        fetchFoods()

        const d = new Date();
        setDefaultDate(d.toLocaleDateString('en-CA'))
        setFoodDate(d.toLocaleDateString('en-CA'))
        console.log("Rerendered")
    },[])


    //For filling out the form to add a new grocery food item
    const [foodName, setFoodName] = useState("")
    const [foodCategory, setFoodCategory] = useState("meats") //Topmost category item to ensure category has a value
    const [foodDate, setFoodDate] = useState()
    const [foodCount, setFoodCount] = useState(1)
    const [foodPrice, setFoodPrice] = useState(0.00)

    //All for when users are entering the grocery food info to add a grocery item to the grocery list
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
        //As long as there is a name entered for the food, proceed with adding the food to the grocery list
        if (!foodName.trim().length==0) {
            //get the values from the grocery-item-adding form
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
            //updates foods array
            setFoods((f) => [...f, data])
            } catch(err) {
                console.error(err)
            }
        }
    }

    // to delete selected food with particular primary key (pk)
    const deleteFood = async (pk) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/foods/${pk}/`, {
                method: "DELETE"
            })

            //for the previous array of foods, go through every food in that array and filter out the food with the same id as this pk
            //deletes that matching food in the website array
            setFoods((f) => f.filter((food) => food.id !== pk))

        } catch(err) {
            console.error(err)
        }
    }

    //funtion to move clear the grocery list
    const clearGroceryList = async (foods) => {

        //For every grocery food item in the array of foods, do the following (NOTE: we know that the items in "foods" 
        //are currently in the grocery list bc the foods array that was passed into this function is already being 
        //prefiltered down below in the return statement right before this function gets called)
        foods.map(async (food) => {
            try {
            const response = await fetch(`http://127.0.0.1:8000/api/foods/${food.id}/`, {
                method: "DELETE"
            })

            //for the previous array of foods, go through every food in that array and filter out the food with the same id as this pk
            //deletes that matching food in the website array
            setFoods((f) => f.filter((groceryFood) => groceryFood.id !== food.id))

            } catch(err) {
                console.error(err)
            }
        })
    }

    // variable to determine which grocery food will be updated in the update-modal
    const [selectedFoodItem, setSelectedFoodItem] = useState("")

    // variable to keep track of update-modal's visability
    const [showModal, setShowModal] = useState(false)

    // When the user clicks on the "update" button in the table, open the modal
    function openModal() {
        if (!showModal) {
            setShowModal(true)
        }
    }

    //If the user clicks the x button when the modal is open, close the modal
    function closeModal() {
        if (showModal) {
            setShowModal(false)
        }
    }

    //funtion to move items to the pantry
    const moveToPantry = async (foods) => {

        //For every grocery food item in the array of foods, do the following (NOTE: we know that the items in "foods" 
        //are currently in the grocery list bc the foods array that was passed into this function is already being 
        //prefiltered down below in the return statement right before this function gets called)
        foods.map(async (food) => {
            //get the values from the particular grocery item
            const foodData = {
                name: food.name,
                category: food.category,
                expiration_date: food.expiration_date,
                count: food.count,
                price: food.price,
                is_in_pantry: true //We declare this particular item to now be in the pantry
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/foods/${food.id}/`, {
                    method: "PUT",
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify(foodData)
                })

                //with the data,
                const data = await response.json()
            
                //for every grocery food item in "Foods," see if the id of "Foods"'s said grocery item matches with whatever particular fruit in THIS component's id is :D
                setFoods((f) => f.map((groceryFood) => {
                    if (groceryFood.id===food.id) {
                        // updates this food item
                        return data
                    } else {
                        return groceryFood
                    }
                }))

            } catch(err) {
                console.error(err)
            }
            console.log("END")
        })
    }

    //function to decrease the count of items in the pantry list
    const decreaseCount = async (food) => {
        //get the values from the particular food forrrr the particular food
            const foodData = {
                name: food.name,
                category: food.category,
                expiration_date: food.expiration_date,
                count: food.count-1, //decreasing count here
                price: food.price,
                is_in_pantry: true
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/foods/${food.id}/`, {
                    method: "PUT",
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify(foodData)
                })


                const data = await response.json()
            
                //for every grocery food item in "Foods," see if the id of "Foods"'s said grocery item matches with whatever particular fruit in THIS component's id is :D
                setFoods((f) => f.map((groceryFood) => {
                    if (groceryFood.id===food.id) {
                        return data
                    } else {
                        return groceryFood
                    }
                }))

            } catch(err) {
                console.error(err)
            }
            console.log("END")
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

                        {/* For every grocery item (confirm it isn't a pantry item with ".filter()"), display its info in table */}
                        {foods.filter((f)=> f.is_in_pantry == false).map((food, index) => (
                            <tr key={index}>
                                <td>{food.name}</td>
                                <td>{food.category}</td>
                                <td>{food.expiration_date}</td>
                                <td>{food.count}</td>
                                <td>{food.price}</td>
                                <td>
                                    {/* Every food item row comes with an update and delete button */}

                                    <button onClick={() => {
                                        setSelectedFoodItem(food); //this is the grocery item we want to take to the update-modal
                                        openModal() //this function sets the modal's visibility to true
                                    }}>Update</button>

                                    <button onClick={() =>
                                        deleteFood(food.id)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>

                {/* Under the grocery list, you can either clear the list or check the grocery items out to the pantry list */}
                <div>
                    {/* Get all grocery items (confirm they're grocery items with ".filter()") and call the checkout function on the array of grocery items*/}
                    <button onClick={() => moveToPantry(foods.filter((f)=> f.is_in_pantry == false))}>
                        Checkout
                    </button>
                    <button onClick={() => clearGroceryList(foods.filter((f)=> f.is_in_pantry == false))}>Clear Grocery List</button> {/* WIP */}
                </div>
            </div>
            

            {/* Pantry Side */}
            <div className="column" id="pantry-side">
                <h1>Pantry List:</h1>
                 {/* Table under the "add" section of the groceries */}
                <div className="pantryList">
                    <table>
                        <tr> {/* The Table Headers */}
                            <th>Name</th>
                            <th>Category</th>
                            <th>Count</th>
                            <th>Expiration Date</th>
                            <th>Decrease/Delete</th>
                        </tr>

                        {/* For every pantry item (confirm with filter method) that has a count>0, display its info in table */}
                        {foods.filter((f)=> f.is_in_pantry == true && f.count>0).map((food, index) => (
                                 
                            <tr key={index}>
                                <td>{food.name}</td>
                                <td>{food.category}</td>
                                <td>{food.count}</td>
                                <td>{food.expiration_date}</td>

                                <td> {/* Every pantry item has the option to decrease its count or delete the item */}
                                    {/* If the count > 1, decrease count, but if the count is already 0, might as well just delete the item */}
                                    <button onClick={() => {
                                        if (food.count===1) {
                                            deleteFood(food.id)
                                        } else {decreaseCount(food)}
                                    }}>Decrease Count</button>

                                    <button onClick={() =>
                                        deleteFood(food.id)}
                                    >Delete</button>
                                </td>
                            </tr>
                            
                        ))}

                    </table>
                </div>
            </div>
        </div>

        {/* If showModal's visibility is true, return the modal and send important info with it */}
        {showModal && (
            <UpdateFoodModal
                food={selectedFoodItem} //particular fountain to work with
                closeModal={() => setShowModal(false)} //need to be able to close the modal from in the modal
                setFoods={() => setFoods()} //need to be able to access the whole foods array
                foods={foods} //need to be able to access the whole foods array
            />
        )}
    </>)
}

export default Home