const btns = document.querySelector(".buttons");
const scrn = document.querySelector(".screen");

let start ="";

btns.addEventListener("click",(e)=>{
    const target = e.target;
    if (target.id = "power"){
        const pwrBtn = document.querySelector("#power");
        if(start){
            scrn.innerText ="";
            start ="";
            target.style.opacity = 1;
        }else{
            start ="0";
            scrn.innerText = "0";
            target.style.opacity = 0.7;
        }
    }else{
        if(start){
            const btnId = target.id;
            let scrnText = scrn.innerText + btnId.innerText;
        }
        
    }
})

function isValidString(text, evaluate){

    const operators = ['+', '-', '*', '/', "."];
    let operatorCount = 0;
    let operator = "";
    let operatorIndex = -1;

    for (let i = 0; i < text.length; i++) {
        if (operators.includes(text[i])) {
            operatorCount++;
            operator= text[i];
            operatorIndex = i;
        }
    }

    if (operatorCount > 1 || operatorIndex ==0 ) {
        return false;
    }

    if(evaluate){
        if(operatorCount == 1 & operatorIndex != -1)
    }


    return true;

}