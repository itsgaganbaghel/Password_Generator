// input field and slider 
const inputSlider = document.querySelector('[data-length-slider]') ;
const lengthDisplay =  document.querySelector('[data-lengthNumber]') ;
//  display output section
const passwordDisplay = document.querySelector('[data-password-display]');
const copyBtn =  document.querySelector('[data-copy-btn]');
const copyMsg =  document.querySelector('[data-copyMsg]');
// input types 
const upperCaseCheck = document.querySelector('#uppercase');
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector('#numbers');
const specialCharactersCheck = document.querySelector('#symbols');

const indicator = document.querySelector('[data-indicator]');
const generator = document.querySelector('.generateBtn');

const allCheckBox = document.querySelectorAll('input[type=checkbox]');

const Symbols = "!@#$%^&*()_+?/.,;'[{(\|~<,>.?~";

let password = "" ;         // password is blank in the starting 
let passwordLength = 10 ;   // default length of password 
let checkCount = 0 ;
// set strength circle color to grey ;
// indicator("#ccc");

// set password  
function handleSlider() {   // this function works that - it display the change int he ui
    inputSlider.value = passwordLength ;
    lengthDisplay.innerText = passwordLength ;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
    
}

// set indicator  
function setIndicator(color){   // set the color of the indicator on the basis og how many input values are checked 
    indicator.style.backgroundColor = color ;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min , max ){    //  this function returns the random number between thr min and max number 
    return Math.floor(Math.random() * (max - min)) + min ;
    /* work flow here
    * 1. get random number between 0 and 1  - math.random()
    * 2. multiply it by range of numbers i.e (max - min) -  math.random() * (max - min )
    * 3. add min to it . so now we have a number between 0 and (max - min )
    * 4. floor it using math.floor function because we need integer not float value
    */
}

handleSlider();     // call this function at first time so that it will take the initial value from the slider
function generateRandomNumber (){
    return getRandomInteger(0, 9);
}

function generateLowerCase (){
    return String.fromCharCode(getRandomInteger(97 , 123) );
}

function generateUpperCase (){
    return String.fromCharCode(getRandomInteger(65 , 90) );
}

function generateSymbol(){
    // make a string that contains all symbols and then we randomly use them 
    // let length = Symbol.length();

    const randomNumber = getRandomInteger( 0 , Symbols.length) ;
    return Symbols.charAt(randomNumber);

    // return Symbols.charAt(getRandomInteger(0 , Symbols.length)) ;
}

function calcStrength() {
    let hasUpper = false ;
    let hasLower = false ;
    let hasNumber = false ;
    let hasSymbol = false ;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if(specialCharactersCheck.checked) hasSymbol = true ;
    
    if (hasUpper && hasLower && (hasNumber ||  hasSymbol ) && passwordLength >= 8 ) {
        setIndicator("green") ;
    }
    // else if (hasUpper && hasLower && hasNumber && hasSymbol && passwordLength >= 8 ) {
    //     setIndicator("green") ;
    // }
    else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6 ){
            setIndicator("rgb(242, 255, 0)");
    } else{
        setIndicator("red");
    }
}
//copy password 
async function copyPassword(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        // alert(e);
        copyMsg.innerText = "failed";
    }
    // to make copy wala text visible 
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1000);
}

// the main function which will be used to create password

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0 ;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        checkCount++ ;
    })

    // special condition 
    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        console.log("passwordLength")
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange );
}) 

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyPassword();
})

generator.addEventListener('click' , () => {

    console.log("done");
    //  none of the checkboxes are checked
    if(checkCount == 0 ) 
        return ;

    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        handleSlider();
    }
    // create password

    // remove old password
    password = "";

    // let put all the stuff that mentioned by checkboxes
    // if(upperCaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase() ;
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber() ;
    // }
    // if(specialCharactersCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [] ;
    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(specialCharactersCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory  addition 
    for(let i=0 ; i< funcArr.length ; i++){
        password += funcArr[i]() ;
    }
    console.log("compulsory addition");

    // remaining addition 
    for(let i=0 ; i< passwordLength - funcArr.length ; i++){
        let randIndex = getRandomInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
        console.log("password" + randIndex);
    }
    console.log("remaining addition done ");
    // shuffle the password - because the sequence of th password characters are predefine 
    password = shufflePassword(Array.from(password));
    console.log("password" + password);

    // show in ui 
    // passwordDisplay.innerHTML = " nahaha" ;
    passwordDisplay.value = password;
    console.log(passwordDisplay.value);
    calcStrength();

    //copy password
    // copyPassword();
});






