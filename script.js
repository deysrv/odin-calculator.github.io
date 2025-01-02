const btns = document.querySelector(".buttons");
const scrn = document.querySelector(".screen");

let globalCount =0;
let localCount =0;
let remOperation = "";

let start = "";
let output = "";

btns.addEventListener("click", (e) => {
    const target = e.target;
    console.log('Button clicked:', {
        id: target.id,
        text: target.innerText,
        start: start
    });
    if (target.id){
    if (target.id === "power") {
        const pwrBtn = document.querySelector("#power");
        if (start) {
            scrn.innerText = "";
            start = "";
            target.style.color = "red";
            console.log('Power off:', { start, screen: scrn.innerText });
        } else {
            start = "0";
            scrn.innerText = "0";
            target.style.color = "green";
            console.log('Power on:', { start, screen: scrn.innerText });
        }
    } else {
        if (start) {
            const btnText = target.innerText;
            console.log('Current button press:', { btnText, currentScreen: scrn.innerText });

            console.log(`Output${output}`)

            if(globalCount>localCount){
                if ((remOperation === "" && !(["+","-","*","/"].includes(btnText))) || (scrn.innerText.match(/Error/g) || []).length >=1){
                    scrn.innerText = "0";
                    console.log("New Iteration...");
                }
                localCount += 1;
            };

            if (scrn.innerText === "0" && btnText != "=") {
                scrn.innerText = "";
                console.log('Clearing initial zero');
            };
            
            let scrnText ="";

            if(!["=","C", "AC"].includes(btnText)){
                scrnText = scrn.innerText + btnText;
            }else{
                scrnText = scrn.innerText;
            }

            
            console.log('Potential new screen text:', scrnText);
            
            if (target.id === "clear") {
                scrn.innerText = scrn.innerText.slice(0, -1) || "0";
                console.log('After clear:', scrn.innerText);
            } else if (target.id === "allClear") {
                scrn.innerText = "0";
                console.log('After all clear:', scrn.innerText);
            } else {
                const isValid = isValidString(scrnText);
                console.log('String validation:', { scrnText, isValid });
                
                if (isValid) {
                    if (target.id === "equals") {
                        let [output, operation] = isValidString(scrnText, true);
                        console.log('Calculation result:', { output, operation });
                        remOperation = operation || "";
                        scrn.innerText = output + (operation || "");
                    } else {
                        scrn.innerText = scrnText;
                    }
                }
            }
            console.log('Final screen state:', scrn.innerText);
        }
    }
}
});


function add(a, b) {
    const result = a + b;
    console.log('Addition:', { a, b, result });
    return parseFloat(result.toFixed(7));
}

function subtract(a, b) {
    const result = a - b;
    console.log('Subtraction:', { a, b, result });
    return parseFloat(result.toFixed(7));
}

function multiply(a, b) {
    const result = a * b;
    console.log('Multiplication:', { a, b, result });
    return parseFloat(result.toFixed(7));
}

function division(a, b) {
    const result = a / b;
    console.log('Division:', { a, b, result });
    return parseFloat(result.toFixed(7));
}

function operator(operation, first, second) {
    console.log('Operator function called:', { operation, first, second });
    
    switch (operation) {
        case "+":
            return add(first, second);
        case "-":
            return subtract(first, second);
        case "*":
            return multiply(first, second);
        case "/":
            if (second !== 0) {
                return division(first, second);
            } else {
                console.log('Division by zero error');
                return "Error";
            }
        default:
            console.log('Invalid operator:', operation);
            return "Error";
    }
}

function isValidString(text, evaluate = false) {
    console.log('isValidString called:', { text, evaluate });

    const dotPattern = /\./g

    if((text.match(dotPattern) || []).length>1){

        return false
    }

    const operators = ['+', '-', '*', '/'];
    const allOperators = ['+', '-', '*', '/', '.'];

    for (let i = 0; i < text.length - 1; i++) {
        if (allOperators.includes(text[i]) && allOperators.includes(text[i + 1])) {
            console.log('Invalid: consecutive operators detected');
            return false;
        }
    }

    let operatorCount = 0;
    let operatorArray = [];
    let operatorIndices = [];
    let inputs = [];

    for (let i = 0; i < text.length; i++) {
        if (operators.includes(text[i])) {
            operatorCount++;
            operatorArray.push(text[i]);
            operatorIndices.push(i);
        }
    }
    
    //only negative sign is allowed at first
    if(operatorIndices[0]=== 0 && operatorArray[0] === "-"){

        operatorIndices =operatorIndices.slice(1,)
        operatorCount -=1
        operatorArray = operatorArray.slice(1,)
    }else if(operatorIndices[0]=== 0 && operatorArray[0] != "-"){
        scrn.innerText = "0";
        return false
    }

    console.log('Operator analysis:', {
        count: operatorCount,
        operators: operatorArray,
        indices: operatorIndices
    });

    inputs.push(text.slice(0, operatorIndices[0]));

    for (let i = 0; i < operatorIndices.length - 1; i++) {
        let start = operatorIndices[i] + 1;
        let end = operatorIndices[i + 1];
        inputs.push(text.slice(start, end));
    }
    inputs.push(text.slice(operatorIndices[operatorIndices.length - 1] + 1, ));

    inputs = inputs.filter((value)=>{
        return value != "";
    });

    console.log('Parsed inputs:', inputs);

    if (inputs.length > 2) {
        console.log('Invalid: too many inputs');
        return false;
    }

    if (evaluate) {
 
        if (inputs.length < 2 || operatorCount < 1) {
            console.log('Not enough inputs for evaluation');
            return [scrn.innerText,""];
        }

        let [operation, remainingOperator] = ["",""];

        if(operatorCount===1 || (operatorCount ===2 & operatorIndices.at(-1) != text.length-1)){
            operation = text[operatorIndices[1]|| operatorIndices[0]];
            remainingOperator = "";
        }else{
            remainingOperator = text[operatorIndices.at(-1)];
            operatorIndices = operatorIndices.slice(0,-1);
            operation = text[operatorIndices[1] || operatorIndices[0]];
        }
        
        const firstInput = Number(inputs[0]);
        const secondInput = Number(inputs[1]);
        
        console.log('Evaluation inputs:', {
            firstInput,
            secondInput,
            operation
        });
        
        let output = operator(operation, firstInput, secondInput);
        
        console.log('Evaluation result:', {
            output,
            remainingOperator
        });
        globalCount +=1;
        return [output, remainingOperator];
    }

    return true;
}

// adding keyboard to calculator

const keyToIdMap = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
    '0': 'zero',
    '.': 'dot',
    '+': 'plus',
    '-': 'minus',
    '*': 'mult',
    '/': 'division',
    'Enter': 'equals',
    '=': 'equals8',
    'Backspace': 'clear',
  };

  document.addEventListener("keydown",(e)=>{
    const key = `${e.key}`;
    console.log(`${key} is pressed.`)
    document.querySelector(`#${keyToIdMap[key]}`).click();
  }
  )