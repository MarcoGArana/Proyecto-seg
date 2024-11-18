let cardsContainer = null;
let loadingOverlay = null;
let userName = null;

const baseUrl = "http://127.0.0.1:3000";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodWV2byIsImV4cCI6MTczMTk3NDQwNiwiaWF0IjoxNzMxODg4MDA2fQ.EXjma5tMz3Y2dEaAuWGG7X2Aq3xppDY7Hbz8m95e5mA";

const bindElements = () => {
    cardsContainer = document.querySelector("#container-cards");
    loadingOverlay = document.getElementById("loading-overlay");
    userName = document.getElementById("user-name");
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

const main = () => {
    bindElements();
    getUserData();
    getPostData();
}

window.onload = main;