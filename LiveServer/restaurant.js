import {addBR} from "./createMethods.js";
import {createDiv} from "./createMethods.js";
import {createLabel} from "./createMethods.js";
import {createInput} from "./createMethods.js";
import {createOptionForSelect} from "./createMethods.js";
import { Table } from "./table.js";
import {Waiter} from "./waiter.js";

export class Restaurant{

    constructor(id, name, address){

        this.id = id;
        this.name = name;
        this.address = address;
        this.waiters = new Array();
        this.tables = new Array();
        this.container = null;
    }
//fetch za pribavljanje svih waiter-a i iscrtaanje tabele
getAllWaiters(){

    let waiterSel = this.container.querySelector(".waiterSel");
    let waiterSelForTable = this.container.querySelector(".selectForWaiter");
    let options;

    fetch("https://localhost:5001/Restoran/GetAllWaiters/"+this.id).then(p => {
        p.json().then(data=>{
            this.waiters=[];
            var cont = this.container.querySelector("table");            
            var body = cont.querySelector("tbody");
            console.log(body);
            if(body!=null){
                body.innerHTML = "";
            }
            waiterSel.innerHTML="";
            waiterSelForTable.innerHTML="";
              console.log(cont);       
            data.forEach(waiter =>{
                var wtr = new Waiter(waiter["id"],waiter["name"],waiter["lastName"],waiter["jmbg"],waiter["experience"]); ///sredi   
                wtr.restaurant=this;
                wtr.tables = waiter.tables;
                wtr.drawRow(cont);
                this.waiters.push(waiter);
                options = createOptionForSelect(waiterSel, waiter.name+" "+waiter.lastName, waiter.id);
                options = createOptionForSelect(waiterSelForTable, waiter.name+" "+waiter.lastName, waiter.id);
              // tbl.updateTable(table["id"],table["number"],table["numberOfSeats"],table.status);
                 }); 
                 
             });
                       
        });

}
//fetch za pribavljanje svih stolova i iscrtavanje
getAllTables(){
    let tableSel = this.container.querySelector(".selectForTable");
    let tableSelForWaiter=this.container.querySelector(".selectForTableWaiter");
    let options;
    fetch("https://localhost:5001/Restoran/GetAllTables/"+this.id).then(p => {
        p.json().then(data=>{
            var cont = this.container.getElementsByClassName("tablesFormContainer"+this.id)[0];
         
            data.forEach(table =>{
                var tbl = new Table(table["id"],table["number"],table["numberOfSeats"]); ///sredi   
               
                tbl.status = table["status"];                    
                this.addTable(tbl);
                tbl.drawTable(cont);
                tbl.updateTable(tbl.id,tbl.status);
                tbl.waiterId = table.waiterId;
                console.log(tbl);              
                options = createOptionForSelect(tableSel,tbl.number, tbl.id); 
                options = createOptionForSelect(tableSelForWaiter,tbl.number, tbl.id);
            
            }); 
                 
        });
            
            
    }); 
    //ovde mora da se doda options

}
//dodaje sto u this.tables
addTable(table){
    this.tables.push(table);  
}
addWaiter(waiter){
    this.waiters.push(waiter);
}
addWaiterFetch(){
    //this.waiters.push(waiter);
    let waiter = new Waiter();
    waiter.name = this.container.querySelector(".inputWaiterName").value;
    waiter.lastName = this.container.querySelector(".inputWaiterLastName").value;
    waiter.jmbg = this.container.querySelector(".inputWaiterJMBG").value;
    waiter.experience = parseInt(this.container.querySelector(".inputWaiterExperience").value);

    if(waiter.jmbg.length != 13){
        alert("JMBG must have 13 numbers!");
    }
    else if(waiter.experience<0){
        alert("Experience can not be negative number!");
    }
    else{
 
    fetch("https://localhost:5001/Restoran/AddWaiter/" + this.id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "name": waiter.name, "lastName": waiter.lastName,
                "jmbg": waiter.jmbg, "experience": waiter.experience})
    }).then(p => {
        if (p.ok) {

            this.addWaiter(waiter);
            this.getAllWaiters();
                
        
        }
    });
   
    return waiter;

}
}
deleteWaiterFetch(parent){
        
        let select = parent.querySelector("select");
        let value = select.options[select.selectedIndex].value;
    
        fetch("https://localhost:5001/Restoran/DeleteWaiter/" +this.id+"/"+ value, {
            method: "DELETE"
        }).then(p => {
            if (p.ok) { 
              // this.deleteWaiter(value,select);
              let ind=this.waiters.indexOf({
                id: value,                     
            }); 
            console.log(this.waiters[ind]);   
            this.waiters.splice(ind);               
            select.remove(value);
            this.getAllWaiters();
            }
        }); 
        

        //menja se status stolovima
        let tablesForW = this.tables.filter(t=>t.waiterId==value); 
       // let tablesForW = this.waiters.filter(w=>w.id==value).map(w=>w.tables);

            console.log(tablesForW);
          
        tablesForW.forEach(t=>{          
               let tab = new Table(t.id, t.number, t.numberOfSeats);               
                console.log(t);
                console.log(tab);
                tab.addWaiterChangeStatus(t.id, 0);   
                     
        })
     
}
deleteWaiter(value,select){
    //ako je value indeks da li je ovo uopste potrebno????
    //value je ida ind je indeks
    //  let ind=this.waiters.indexOf({
    //      id: value,                     
    //  }); 
    //  console.log(this.waiters[ind]);   
    // this.waiters.splice(index);               
    // select.remove(value); 
    //treba ga skloniti i iz tabele 
}
changeTableStatusFetch(parent){
    
    let selectTable = parent.querySelector(".selectForTable");
    let valueTable = selectTable.options[selectTable.selectedIndex].value;

    let selectStatus = parent.querySelector(".selectForStatus");
    let valueStatus = selectStatus.options[selectStatus.selectedIndex].value;//cuva ga koa string

    fetch("https://localhost:5001/Restoran/UpdateTableStatus/"+valueTable+"/"+valueStatus, {
        method: "PUT"                             
    }).then(p => {
        if (p.ok) {     
                let table =this.tables.find(t=>t.id==valueTable);                
                let valueStatusInt = parseInt(valueStatus);
                let valueStatusStr = (valueStatusInt).toString();
                console.log(table);
                if(table.waiterId==null){                   
                   alert("This table does not have waiter!");
                }
                else if(table.status.toString()==(valueStatusStr-1) ){
                    
                    table.status = valueStatus;
                    table.updateTable(valueTable,valueStatus);
                }
                else{
                    alert("Please change status in the right order!");
                              
                }
        }
    });
   

    
}
addTableToWaiterFetch(parent){
   
    let selectTable = parent.querySelector(".selectForTableWaiter");
    let valueTable = selectTable.options[selectTable.selectedIndex].value;
   
    let selectWaiter = parent.querySelector(".selectForWaiter");
    let valueWaiter = selectWaiter.options[selectWaiter.selectedIndex].value;
 
    console.log(selectWaiter.options);
    fetch("https://localhost:5001/Restoran/AddTableToWaiter/"+valueTable+"/"+valueWaiter, {
        method: "PUT"                             
    }).then(p => {
        if (p.ok) {           
         
                let wtr = this.waiters.find(w=>w.id == valueWaiter);
                let table= this.tables.find(t=>t.id == valueTable);
                wtr.tables.push(table);
                table.waiterId = valueWaiter;
                table.status=1;
                table.addWaiterChangeStatus(valueTable, 1);
                document.location.reload();
                console.log(table);
                console.log(wtr);
        }
    });

    
}
addWaiterChangeStatus(valueTable, status){
    let table= this.tables.find(t=>t.id == valueTable);
    table.addWaiterChangeStatus(valueTable,status);
}

returnStatusColor(status){
      
    if(status == "EmptyWithWaiter")
    return "green";
    else if(status == "GuestsSeated")
    return "blue";
    else if(status == "GuestsOrdered")
    return "yellow";
    else if(status == "GuestsServerd")
    return "red";
    else 
    return "grey";
            
    
}

drawTablesForm(host){
    if(!host)
        throw new Error("Host is not valid!"); 
    const tablesFormContainer = createDiv(host, "tablesFormContainer"+this.id);
}
//crta tabelu waiter-a
drawWaitersForm(host){
    
    if(!host)
        throw new Error("Host is not valid!");
       
    //treba tabela
    const waitersFormContainer = createDiv(host, "waitersFormContainer"+this.id);
    let waiterTable = document.createElement("table");
    waiterTable.className = "table"+this.id;//klasa za svaki sto je sto+id restorana
    waitersFormContainer.appendChild(waiterTable);

    let waitHeader = document.createElement("thead");
    waitHeader.className = "thead"+this.id;
    waiterTable.appendChild(waitHeader);

    let waitBody = document.createElement("tbody");
    waitBody.className = "tbody"+this.id;
    waiterTable.appendChild(waitBody);

    let rowH = document.createElement("tr");
    rowH.className = "rowH"+this.id;
    waitHeader.appendChild(rowH);

    let headers = ["Name", "Lastname", "JMBG", "Experience", "Tables"];
    let elem;
    headers.forEach(h=>{
        elem = document.createElement("th");
        elem.innerHTML = h;
        rowH.appendChild(elem);
    });
    
}
drawLegend(host){
    const divForLegend = createDiv(host,"divForLegend");
    let divForOne;
    let littleDiv;
    let littleLabel;
    const status = ["EmptyWithNoWaiter","EmptyWithWaiter","GuestsSeated","GuestsOrdered","GuestsServerd"];
    status.forEach(element => {
        divForOne=createDiv(divForLegend, "divForOne");
        littleDiv=createDiv(divForOne, "legend"+element);
        littleDiv.style.backgroundColor = this.returnStatusColor(element);
        littleLabel = createLabel(divForOne,"label",element);
    });
}
draw(host){

    if(!host)
        throw new Error("Host is not valid!");

    host.innerHTML = "";
    this.container = createDiv(host, "mainContainer");

    this.drawInputForm(this.container);
    this.drawTablesForm(this.container);
    this.drawWaitersForm(this.container);

}
addWaiterForm(host){
    const addWaiterDiv = createDiv(host,"addWaiterDiv");

    let label;
    let input;
    let labels = ["Name: ","Lastname: ","JMBG: ","Experience: "];
    let labelsClass = ["nameLabel", "lastNameLabel", "jmbgLabel","experienceLabel",];
    let inputType = ["text", "text", "text","number"];
    let inputClass = ["inputWaiterName","inputWaiterLastName","inputWaiterJMBG","inputWaiterExperience"];
    labels.forEach((l,index)=>{
        label = createLabel(addWaiterDiv, labelsClass[index], l);
        input = createInput(addWaiterDiv, inputType[index],inputClass[index],false, " " );
    })
    let buttonAddWaiter = createInput(addWaiterDiv, "button","input", true, "Add waiter" );
    buttonAddWaiter.onclick = (ev) => {
        let waiterSel = this.container.querySelector(".waiterSel");
        let waiterSelForTable = this.container.querySelector(".selectForWaiter");
        console.log(waiterSel);
        let waiter1=this.addWaiterFetch();
        console.log(waiter1);
        //dodaje novu opciju u sel : razmisli da napises posebnu fju za ovo
        //let options;
       // options = createOptionForSelect(waiterSel, waiter1.name+" "+waiter1.lastName, waiter1.id);
        //options = createOptionForSelect(waiterSelForTable, waiter1.name+" "+waiter1.lastName, waiter1.id);
        }
        

}
deleteWaiterForm(host){
    const deleteWaiterDiv = createDiv(host,"deleteWaiterDiv");

    let waiterSel = document.createElement("select");
    waiterSel.className = "waiterSel";
    deleteWaiterDiv.appendChild(waiterSel); 
    let options;
    this.waiters.forEach(w=>{
        console.log(w);
        options = createOptionForSelect(waiterSel, w.name+" "+w.lastName, w.id);
        options = createOptionForSelect(waiterSelForTable, w.name+" "+w.lastName, w.id);
    });
       
    let buttonDeleteWaiter = createInput(deleteWaiterDiv, "button","input", true, "Delete waiter" );
    buttonDeleteWaiter.onclick = (ev) => {
        let parent = buttonDeleteWaiter.parentNode;
        this.deleteWaiterFetch(parent);
    }
}
changeTableStatusForm(host){
    const tableStatusDiv = createDiv(host, "tableStatusDiv");
    //select za sto
    let label = createLabel(tableStatusDiv, "selectLabel", "Select table: ");
    let tableSel = document.createElement("select");
    tableSel.className = "selectForTable";
    tableStatusDiv.appendChild(tableSel);

    let optionsForTable;

    this.tables.forEach(t=>{
        optionsForTable = createOptionForSelect(tableSel,t.number, t.id); 
        optionsForTable = createOptionForSelect(tableSelForWaiter,t.number, t.id);     
    })

    //select za status
    label = createLabel(tableStatusDiv, "selectLabel", "Select table status: ");
    let tableStatus = document.createElement("select");
    tableStatus.className = "selectForStatus";
    tableStatusDiv.appendChild(tableStatus);

    let optionsForStatus;

    //da li ovo treba ovako?????
   
    const status = ["EmptyWithNoWaiter","EmptyWithWaiter","GuestsSeated","GuestsOrdered","GuestsServerd"];
    for(let i=0; i<status.length; i++){
        optionsForStatus = createOptionForSelect(tableStatus,status[i], i);
    }

    let buttonChangeTableStatus = createInput(tableStatusDiv, "button","input", true, "Change table status:" );
    buttonChangeTableStatus.onclick = (ev) => {
        let parent = buttonChangeTableStatus.parentNode;
        this.changeTableStatusFetch(parent);//verovatno teba dugme
    }
}
addTableToWaiterForm(host){
    const waiterTableDiv = createDiv(host, "tableStatusDiv");

    let label = createLabel(waiterTableDiv, "selectLabel", "Select table: ");
    let tableSelForWaiter = document.createElement("select");
    tableSelForWaiter.className = "selectForTableWaiter";
    waiterTableDiv.appendChild(tableSelForWaiter);

    label = createLabel(waiterTableDiv, "selectLabel", "Select waiter: ");
    let waiterSelForTable = document.createElement("select");
    waiterSelForTable.className ="selectForWaiter";
    waiterTableDiv.appendChild(waiterSelForTable);

    let buttonAddWaiterToTable = createInput(waiterTableDiv, "button","input", true, "Add table to waiter" ); 
    buttonAddWaiterToTable.onclick = (ev) => {
        let parent = buttonAddWaiterToTable.parentNode;
        this.addTableToWaiterFetch(parent);
     }
}
drawInputForm(host){
    if(!host)
        throw new Error("Host is not valid!");

   //forma za dodavanje konobara
    const inputFormContainer = createDiv(host, "inputFormContainer");
    this.addWaiterForm(inputFormContainer);
    //forma za brisanje konobara
    this.deleteWaiterForm(inputFormContainer);
    //forma za menjanje statusa stola
    this.changeTableStatusForm(inputFormContainer);
    //forma za dodavanje stola konobaru
    this.addTableToWaiterForm(inputFormContainer);
    //forma za crtanje legende
    this.drawLegend(inputFormContainer);


    

}
}