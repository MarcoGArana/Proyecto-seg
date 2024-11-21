let cardsContainer = null;
let loadingOverlay = null;
let userRol = null;
let userName = null;
let userData = null;
let navbar = null;

// Funcion para obtener el token
function getToken() {
    return sessionStorage.getItem("token");
}

const baseUrl = "http://127.0.0.1:3000";
const token = getToken();

const checkToken = () => {
    if(!token){
        window.location.replace("http://localhost:5500/Client/GameStore/");
    }
}

const bindElements = () => {
    cardsContainer = document.querySelector("#container-cards");
    loadingOverlay = document.getElementById("loading-overlay");
    userName = document.getElementById("user-name");
    navbar = document.getElementById("navigation");
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

    if(userRol == 'sysadmin'){
        navbar.innerHTML += 
        `<li>
            <a href="usersPanel.html" class="navbar__link">Usuarios</a>
        </li>`;
    }

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
            userRol = userDataResponse.rol;
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
    checkToken();
    bindElements();
    getUserData();
    addEventListeners();
    getGames();
}

window.onload = main;
