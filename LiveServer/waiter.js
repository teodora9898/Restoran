import { createLabel } from "./createMethods.js";

export class Waiter{

    constructor(id, name, lastName, jmbg, experience){

        this.id=id;
        this.name=name;
        this.lastName=lastName;
        this.jmbg=jmbg;
        this.experience=experience;

        this.restaurant =  null;
        this.tables = new Array();
        this.container = null;
    }
    //crta jedan red u tabeli konobara : treba da se pozove svaki put kad se doda konobar
    drawRow(host){
        if(!host)
            throw new Error("Host is not valid!");
        
       
        const body = host.querySelector("tbody");

        const row= document.createElement("tr");
        body.appendChild(row);

        let attributes = [this.name, this.lastName,this.jmbg,this.experience];
        let el;
        attributes.forEach(at=>{

            el = document.createElement("td");
            el.innerHTML = at;
            row.appendChild(el);
        });
        //upisuje brojeve stolova u tabelu konobara
        el = document.createElement("td");
        this.tables.forEach(element => {
            el.innerHTML+= element.number+" ";
        });
        row.appendChild(el);
    }
    
}