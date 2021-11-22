import { Restaurant } from "./restaurant.js";
import { Table } from "./table.js";
import { Waiter } from "./waiter.js";

document.body.style.backgroundImage="url('https://wallpaperaccess.com/full/845581.jpg')";
document.body.style.backgroundRepeat ="no-repeat";
document.body.style.backgroundSize = "cover";

fetch("https://localhost:5001/Restoran/GetAllRestaurants").then(p => {
    p.json().then(data=>{
        data.forEach(rest =>{
            var rest1 = new Restaurant(rest.id, rest.name, rest.address);
            
            rest1.draw(document.body);
            rest1.getAllWaiters();
            rest1.getAllTables();
            console.log(rest1.tables);
            console.log(rest1.waiters);
            
            
        });             
    });
});