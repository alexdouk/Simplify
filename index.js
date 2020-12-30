
const form = document.querySelector('.form');
const formInput = form.querySelector('.form__input');
const formError = form.querySelector('.form__error');
const linkBoxContainer = document.querySelector('.response-wrapper');



form.addEventListener("submit", handleForm);
form.setAttribute("novalidate", true);

formError.style.display = "none";


function handleForm(event){
    event.preventDefault();

    if(checkValidation()){
        sendRequest(formInput.value);
        clearInput(formInput);
    }
}


//remove warning when user clicks anywhere on page
document.addEventListener("click",removeWarning)

function removeWarning(){
    formError.style.display = "none";
    formInput.placeholder = "Paste your URL link here..";
}



function checkValidation(){

    if (!formInput.checkValidity() || formInput.value === "") {
        formError.style.display = "block";
        formError.style.position ="fixed";
        formInput.placeholder = "Please add a valid link";
        return false;
    }
    else
        return true;
}

function sendRequest(){
    const linkDiv = createNewLinkDiv();

    getData(formInput.value).then((data)=>{
        handleResponse(data, linkDiv);
     }).catch(data => {
         linkDiv.innerHTML = renderProblemWithServer(linkDiv.targetLink);
     })
}

function handleResponse(data, linkDiv){
    if(data.ok){
        linkDiv.innerHTML = renderOkRequestElement(data, linkDiv.targetLink)
        createCopyButton(data, linkDiv);
    }
    else
        linkDiv.innerHTML = renderRejectRequestElement(linkDiv.targetLink)
}

function createCopyButton(dataToCopy, element){
    element.querySelector(".button--response").addEventListener("click", function() {
        handleCopyButton(this, dataToCopy);
        shakeThisElement(element)
    })
}

function handleCopyButton(button, data){

     navigator.clipboard.writeText(data.result.short_link)
     button.disabled = false;
     button.textContent = "Done!";
     setTimeout(function(){ window.location.reload(); }, 3000);
}


function createNewLinkDiv(){

    const linkDiv = document.createElement('div')
    linkDiv.classList.add("response");
    linkDiv.targetLink = checkTargetLinkLength(formInput.value);
    linkDiv.innerHTML = renderUserLink(linkDiv.targetLink);
    linkBoxContainer.append(linkDiv);

    return linkDiv;
}




// Get data

async function getData(userLink){

    const apiUrl = `https://api.shrtco.de/v2/shorten?url=${userLink}`

        const data = await fetch(apiUrl);
        return data.json();
}


//Helpers

function clearInput(input){
    input.value = "";
}

function checkTargetLinkLength(link){

    if(isUserLinkLengthToLong(link))
        return cutUserLinkLength(link);
    else
        return link;
}

function cutUserLinkLength(userLink){
    let shortlyLink = '';
    let maxLengthOfLink = window.innerWidth < 500 ? 30 : 20;

    for(let i = 0; i<maxLengthOfLink; i++){
        shortlyLink += userLink[i];
    }
    return shortlyLink+="...";
}

function isUserLinkLengthToLong(userLink){
    return userLink.length >= 40;
}


//views

function renderUserLink(targetLink){
    return  `
        <p class="response__input-link">${targetLink}</p>
        <div class="response__awaiting">
            <div class="response__ring"></div>
        </div>
    `
}

function renderOkRequestElement(data, targetLink){
    return `
        <p class="response__input-link">${targetLink}</p>
        <p class="response__output-link">${data.result.short_link}</p>
        <button class="button button--response button--full">Copy</button>
    `
}


function renderProblemWithServer(targetLink){
    return `
         <p class="response__input-link">${targetLink}</p>
         <div class="response__error">
             <p class="response__error-text">ERROR : Server not responding</p>
             <img src="./images/alert.svg" width="20" height ="20" alt="" class="response__error-icon">
         </div>
     `
 }





if (document.documentElement.clientWidth > 900) {
	ScrollReveal().reveal('.headline')
    ScrollReveal().reveal('.tagline', { delay: 1000})
    ScrollReveal().reveal('.punchline', { delay: 2000 })
    ScrollReveal().reveal('.tagline', { scale: 2.5 });
 }