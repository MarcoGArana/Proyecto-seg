let cardsContainer = null;
let loadingOverlay = null;
let userName = null;
let userRol = null;
let navbar = null;

// Funcion para obtener el token
function getToken() {
    return sessionStorage.getItem("token");
}

const baseUrl = `${CONFIG.API_BASE_URL}`;
const token = getToken();

const bindElements = () => {
    cardsContainer = document.querySelector("#container-cards");
    loadingOverlay = document.getElementById("loading-overlay");
    userName = document.getElementById("user-name");
    navbar = document.getElementById("navigation");
}

const checkToken = () => {
    if(!token){
        window.location.replace("./index.html");
    }
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

const loading = (complete) => {
    // TODO...
    if (complete) {
        loadingOverlay.style.display = "none";
    }
    else {
        loadingOverlay.style.display = "flex";
    }
}

const getPostData = async() => {
    const url = new URL(window.location.href);
    const postId = sanitizeHTML(url.searchParams.get("id"));
    if (!postId) {
        window.location.replace("http://localhost:5500/index.html");
    }

    const urlWithParams = `${baseUrl}/videogame?id=${postId}`;

    try {
        // try code
        loading(false);
        const response = await fetch(urlWithParams, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json(); // Parse the response as JSON
            loading(true);                      // Hide the loading overlay
            renderDataFromPost(data[0]);               // Display the data on the card

        } else if (response.status === 400 || response.status === 404) {

            // Throws an error with the API's error message.
            const errorData = await response.json();
            throw new Error(`The request was not successful: ${errorData.msg}`);

        } else {

            // Throws a general error 
            throw new Error(`The request was not successful`);
        }
    } catch (error) {
        // catch code
        loading(true);                              // Hide the loading overlay
        showErrorAlert(error);                      // Display an error using a function declared later
        console.error("An error occurred:", error); // Show the error in the console
    }
}

const renderDataFromPost = (data) => {
    const title = data.nombre;
    const price = data.precio;
    const imgUrl = data.imagen;
    const encodedDescription = data.descripcion;
    const phone = data.telefono;
    const state = data.estado;

    if(userRol == 'sysadmin'){
        navbar.innerHTML += 
        `<li>
            <a href="usersPanel.html" class="navbar__link">Usuarios</a>
        </li>`;
    }

    cardsContainer.innerHTML = `
    <div class="cardInfo">
        <div class="card__Infocontent">
            <img src="${imgUrl}" alt="${title}" class="card__image" />
            <div class="card__info">
                <h2 class="card__title">${title}</h2>
                <p class="card__price">$${price}</p>
                <p class="card__state">${state}</p>
                <p class="card__phone">${phone}</p>
            </div>
        </div>
        <div class="description__content">
            <p>${encodedDescription}</p>
        </div>
    </div>
    `;
}

const getUserData = async () => {
    try {
        loading(false);
        const urlWithParams = `${baseUrl}/whoami/`;
        const response = await fetch(urlWithParams, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {

            const userData = await response.json(); // Parse the response as JSON
            userRol = userData.rol;
            userName.innerText = userData.nombre;

        } else if (response.status === 401) {
            // Throws an error with the API's error message.
            window.location.replace("./index.html");

        } else if (response.status === 400 || response.status === 404) {

            // Throws an error with the API's error message.
            const errorData = await response.json();
            throw new Error(`The request was not successful: ${errorData.msg}`);

        } else {

            // Throws a general error 
            throw new Error(`The request was not successful`);
        }
    } catch (error) {
        loading(true);
        showErrorAlert(error);                      // Display an error using a function declared later
        console.error("An error occurred:", error); // Show the error in the console
    }
}

const main = async () => {
    checkToken();
    bindElements();
    await getUserData();
    await getPostData();
}

window.onload = main;