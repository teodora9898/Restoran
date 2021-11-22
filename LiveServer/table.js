import {addBR} from "./createMethods.js";
import {createDiv} from "./createMethods.js";
import {createLabel} from "./createMethods.js";
import {createInput} from "./createMethods.js";

export class Table{

    constructor(id, number, numberOfSeats){

        this.id = id;
        this.number = number;
        this.numberOfSeats = numberOfSeats;
        this.status = null;
        this.container = null;
        this.waiterId = null;
        
    }
//inicijalno iscrtavnje stolova
    drawTable(host){
        if(!host)
            throw new Error("Host is not valid!");

        this.container = createDiv(host, "tableContainer"+this.id);
        let labelNumber = createLabel(this.container,"labelNumber", this.number);       
        this.container.style.backgroundColor= this.returnStatusColor(this.status);

    }
//update za status stola-promena boje
    updateTable(id, status){

     
        this.container = document.getElementsByClassName("tableContainer"+id)[0];
        this.container.style.backgroundColor= this.returnStatusColor(status);
        
    }
//pomocna funkcija
    returnStatusColor(status){
      
        if(status == "1")
        return "green";
        else if(status == "2")
        return "blue";
        else if(status == "3")
        return "yellow";
        else if(status == "4")
        return "red";
        else 
        return "grey";      
    }

    addWaiterChangeStatus(valueTable, valueStatus){
      
        fetch("https://localhost:5001/Restoran/UpdateTableStatusToOne/"+valueTable+"/"+valueStatus, {
            method: "PUT"                             
        }).then(p => {
            if (p.ok) {
                this.updateTable(valueTable,valueStatus);

            }
        }
                
        )
        
    }

    
}