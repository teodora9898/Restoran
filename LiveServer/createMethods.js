export function addBR(parent) {
    var br = document.createElement("br");
    parent.appendChild(br);
}

export function createDiv(parent, className) {
    var newDiv = document.createElement("div");
    parent.appendChild(newDiv);
    newDiv.className = className;
    return newDiv;
}

export function createLabel(parent, className, context) {
    var newLabel = document.createElement("label");
    parent.appendChild(newLabel);
    newLabel.innerText = context;
    newLabel.className = className;
}

export function createInput(parent, inputType, className, flagContext, context) {
    var newInput = document.createElement("input");
    parent.appendChild(newInput);
    newInput.className = className;
    newInput.type = inputType;
    if (flagContext == true)
        newInput.value = context;
    return newInput;
}

export function createOptionForSelect(parent, innerHTML, value)
{
    var newOption = document.createElement("option");
    parent.appendChild(newOption);
    newOption.innerHTML = innerHTML;
    newOption.value = value;
    
    return newOption;
}
