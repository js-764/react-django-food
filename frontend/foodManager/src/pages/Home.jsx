import '../css/Home.css'
import { useState, useEffect } from 'react'
import UpdateFoodModal from '../components/UpdateFoodModal'


function Home() {

    //For the array with ALL the foods
    const [foods, setFoods] = useState([])

    //For sorting the pantry foods
    const [sortedFoods, setSortedFoods] = useState([])

    //To prepare to set the default date of a grocery item
    const [defaultDate, setDefaultDate] = useState([])


    //function to get the food
    const fetchFoods = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/foods/")
            const data = await response.json()
            setFoods(data)
            setSortedFoods(data.filter((f)=> f.is_in_pantry == true))
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
            fetchFoods()

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

        setSortedFoods((f) => f.filter((foods) => foods.category==="helpme"))
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

            
                setSortedFoods((f) => [...f, data])
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
            
                console.log("this was reached")
                //for every grocery food item in "Foods," see if the id of "Foods"'s said grocery item matches with whatever particular fruit in THIS component's id is :D
                setFoods((f) => f.map((groceryFood) => {
                    if (groceryFood.id===food.id) {
                        fetchFoods()
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

    //Sort foods by name a-z
    function nameA2Z(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return a.name.localeCompare(b.name)}
        )
    )}

    //Sort foods by name z-a
    function nameZ2A(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return b.name.localeCompare(a.name)}
        )
    )}

    //Sort foods by category a-z
    function categoryA2Z(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return a.category.localeCompare(b.category)}
        )
    )}

    //Sort foods by category z-a
    function categoryZ2A(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return b.category.localeCompare(a.category)}
        )
    )}

    //Sort foods by date lowest to highest
    function dateAscending(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()}
        )
    )}

    //Sort foods by date highest to lowest
    function dateDescending(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return new Date(b.expiration_date).getTime() - new Date(a.expiration_date).getTime()}
        )
    )}
    
    //Sort foods by count lowest to highest
    function countAscending(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return a.count - b.count}
        )
    )}

    //Sort foods by count highest to lowest
    function countDescending(foods) {
        setSortedFoods(
            foods.sort(function(a,b) {
            return b.count - a.count}
        )
    )}


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

                        <button type="submit" className='grocerySubmit'>Add Grocery Item</button>
                    </form>
                </div>
                
                {/* Table under the "add" section of the groceries */}
                <div className="groceryList">
                    <table className='groceryTable'>
                        <tr className='groceryRow'> {/* The Table Headers */}
                            <th className='groceryHeader'>Name</th>
                            <th className='groceryHeader'>Category</th>
                            <th className='groceryHeader'>Expiration Date</th>
                            <th className='groceryHeader'>Count</th>
                            <th className='groceryHeader'>Price</th>
                            <th className='groceryHeader'>Update/Delete</th>
                        </tr>

                        {/* For every grocery item (confirm it isn't a pantry item with ".filter()"), display its info in table */}
                        {foods.filter((f)=> f.is_in_pantry == false).map((food, index) => (
                            <tr className='groceryRow' key={index}>
                                <td className='groceryTableItems'>{food.name}</td>
                                <td className='groceryTableItems'>{food.category}</td>
                                {/* If default dat (current day that the website is being used) is greater than this food's expiration date, make the background red */}
                                {(food.expiration_date===defaultDate ||food.expiration_date<defaultDate) && <td className='groceryTableItems' style={{ color: 'black', backgroundColor: 'rgba(216, 185, 185, 1)' }}>{food.expiration_date}, (Expired)</td>}
                                {(!(food.expiration_date===defaultDate) && !(food.expiration_date<defaultDate)) && <td className='groceryTableItems'>{food.expiration_date}</td>}
                                <td className='groceryTableItems'>{food.count}</td>
                                <td className='groceryTableItems'>{food.price}</td>
                                <td className='groceryTableItems'>
                                    {/* Every food item row comes with an update and delete button */}

                                    <button onClick={() => {
                                        setSelectedFoodItem(food); //this is the grocery item we want to take to the update-modal
                                        openModal() //this function sets the modal's visibility to true
                                    }} className='changing'>Update</button>

                                    <button onClick={() =>
                                        deleteFood(food.id)}
                                    className='deleting'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>

                {/* Under the grocery list, you can either clear the list or check the grocery items out to the pantry list */}
                <div>
                    {/* Get all grocery items (confirm they're grocery items with ".filter()") and call the checkout function on the array of grocery items*/}
                    <button onClick={() => moveToPantry(foods.filter((f)=> f.is_in_pantry == false))} className='grocerySubmit'>
                        Checkout
                    </button>
                    <button onClick={() => clearGroceryList(foods.filter((f)=> f.is_in_pantry == false))} className='deleting'>Clear Grocery List</button>
                </div>
            </div>
            

            {/* Pantry Side */}
            <div className="column" id="pantry-side">
                <h1>Pantry List:</h1>

                {/* Buttons to sort the table by a certain characteristics */}
                <div className='sort-section'>
                    {/* Sort by name */}
                    <label htmlFor='sort'>Sort by name:</label><button className='pantrySubmit' onClick={() => nameA2Z(foods.filter((f)=> f.is_in_pantry == true))} name="sort">a-z</button><button className='pantrySubmit' onClick={() => nameZ2A(foods.filter((f)=> f.is_in_pantry == true))} name="sort">z-a</button>

                    {/* Sort by catrgory */}
                    <label htmlFor='sort'>Sort by category:</label><button className='pantrySubmit' onClick={() => categoryA2Z(foods.filter((f)=> f.is_in_pantry == true))} name="sort">a-z</button><button className='pantrySubmit' onClick={() => categoryZ2A(foods.filter((f)=> f.is_in_pantry == true))} name="sort">z-a</button><br />

                    {/* Sort by date */}
                    <label htmlFor='sort'>Sort by expiration date:</label><button className='pantrySubmit' onClick={() => dateAscending(foods.filter((f)=> f.is_in_pantry == true))} name="sort">ascending</button><button className='pantrySubmit' onClick={() => dateDescending(foods.filter((f)=> f.is_in_pantry == true))} name="sort">descending</button>

                    {/* Sort by count */}
                    <label htmlFor='sort'>Sort by count:</label><button className='pantrySubmit' onClick={() => countAscending(foods.filter((f)=> f.is_in_pantry == true))} name="sort">highest to lowest</button><button className='pantrySubmit' onClick={() => countDescending(foods.filter((f)=> f.is_in_pantry == true))} name="sort">lowest to highest</button>
                </div>

                {/* Table where the pantry list is */}
                <div className="pantryList">
                    <table className='pantryTable'>
                        <tr className='pantryRow'> {/* The Table Headers */}
                            <th className='pantryHeader'>Name</th>
                            <th className='pantryHeader'>Category</th>
                            <th className='pantryHeader'>Count</th>
                            <th className='pantryHeader'>Expiration Date</th>
                            <th className='pantryHeader'>Decrease/Delete</th>
                        </tr>

                        {/* For every pantry item, display its info in table */}
                        {/* "sortedFoods is used here instead of "foods" because sorted foods will be changing around a lot with the sorting buttons */}
                        {sortedFoods.map((food, index) => (
                                 
                            <tr className='pantryRow' key={index}>
                                <td className='pantryTableItem'>{food.name}</td>
                                <td className='pantryTableItem'>{food.category}</td>
                                <td className='pantryTableItem'>{food.count}</td>
                                {/* If default date (current day that the website is being used) is greater than this food's expiration date, make the background red */}
                                {(food.expiration_date===defaultDate ||food.expiration_date<defaultDate) && <td className='pantryTableItem' style={{ color: 'black', backgroundColor: 'rgba(216, 185, 185, 1)' }}>{food.expiration_date}, (Expired)</td>}
                                {(!(food.expiration_date===defaultDate) && !(food.expiration_date<defaultDate)) && <td className='pantryTableItem'>{food.expiration_date}</td>}
                                
                                <td className='pantryTableItem'> {/* Every pantry item has the option to decrease its count or delete the item */}
                                    {/* If the count > 1, decrease count, but if the count is already 0, might as well just delete the item */}
                                    <button onClick={() => {
                                        if (food.count===1) {
                                            deleteFood(food.id)
                                        } else {decreaseCount(food)}
                                    }}className='changing'>Decrease Count</button>

                                    <button onClick={() =>
                                        deleteFood(food.id)}
                                    className='deleting'>Delete</button>
                                </td>
                            </tr>
                            
                        ))}

                    </table>
                    
                </div>
                <button onClick={() => clearGroceryList(foods.filter((f)=> f.is_in_pantry == true))} className='deleting'>Clear Pantry List</button>
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