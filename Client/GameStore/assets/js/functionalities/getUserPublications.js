let cardsContainer = null;
let loadingOverlay = null;
let userRol = null;
let userName = null;
let userData = null;

const baseUrl = "http://127.0.0.1:3000";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodWV2byIsImV4cCI6MTczMTk3NDQwNiwiaWF0IjoxNzMxODg4MDA2fQ.EXjma5tMz3Y2dEaAuWGG7X2Aq3xppDY7Hbz8m95e5mA";

const bindElements = () => {
    cardsContainer = document.querySelector("#container-cards");
    loadingOverlay = document.getElementById("loading-overlay");
    userName = document.getElementById("user-name");
}

const addEventListeners = () => {
    //Enlazar eventos
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

const getGames = async () => {

    const urlWithParams = `${baseUrl}/videogame/`;

    try {
        loading(false);
        // try code
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
            displayData(data);               // Display the data on the card

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

/**
 * displayData
 *
 * This function is used to print multiple card elements into
 * cards container. 
 *
 * @param array: this function receives an array of registers
 */
const displayData = (data) => {
    let cardsHTML = "";

    // Determine the media URL based on the media_type
    data.forEach((element) => {
        if (element.correo == userData.correo && element.usuario == userData.nombre && element.telefono == userData.telefono) {
            const editDirection = `publishItem.html?id=${element.id}`

            cardsHTML += 
            `<div class="card" id="card-${element.id}">
                <img src="${element.imagen}" alt="Game image">
                <div id="card-info">
                    <a href="gameInfo.html?id=${element.id}" class="card__link">
                    ${element.nombre}
                    </a>
                    <div class="card__data">
                        <div>
                            <p class="price">$${element.precio}</p>
                            <p class="phone">Contact: ${element.telefono}</p>
                        </div>
                        <div class="card-actions">
                            <img src="./assets/images/delete.svg" alt="delete-button" class="delete-${element.id}" id="delete" onclick="deleteCard({id:'${element.id}'})">
                            <a href="${editDirection}">
                                <img src="./assets/images/edit.svg" alt="edit-button" class="edit-${element.id}" id="edit">
                            </a>
                        </div>
                    </div>
                </div>
            </div>`
        }

    });

    cardsContainer.innerHTML = cardsHTML;
}

const deleteCard = async ({ id }) => {
    const urlWithParams = `${baseUrl}/videogame?id=${id}`;
    loading(false);

    try {
            const response = await fetch(urlWithParams, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const card = document.querySelector("#card-".concat(id));
                card.style.display = "none";
                loading(true);
                alert("Publicacion eliminada correctamente");
    
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

            const userDataResponse = await response.json(); // Parse the response as JSON
            userData = userDataResponse;
            userName.innerText = userDataResponse.nombre;

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

const showErrorAlert = (msg) => {
    alert(msg || "An unexpected error occurred");
}

const main = () => {
    bindElements();
    getUserData();
    addEventListeners();
    getGames();
}

window.onload = main;
