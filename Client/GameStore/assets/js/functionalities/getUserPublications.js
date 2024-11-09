let cardsContainer = null;
let loadingOverlay = null;

let userPosts = null;

const baseUrl = "http://127.0.0.1:5500/GameStore/assets";

const bindElements = () => {
    cardsContainer = document.querySelector("#container-cards");
    loadingOverlay = document.getElementById("loading-overlay");
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

    // const urlWithParams = `${baseUrl}/planetary/apod?${queryParams.toString()}`;
    try {
        // try code
        const urlWithParams = `${baseUrl}/games.json`;
        const response = await fetch(urlWithParams);

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
        if (userPosts.includes(element.id)) {
            const encodedDescription = encodeURIComponent(element.description);
            const editDirection = `publishItem.html?description=${encodedDescription}&title=${element.title}&gameId=${element.id}&action=Save&imgUrl=${element.image}&price=${element.price}&phone=${element.phone}&gameState=${element.state}`

            cardsHTML += 
            `<div class="card" id="card-${element.id}">
                <img src="${element.image}" alt="Game image">
                <div id="card-info">
                    <a href="gameInfo.html?description=${encodedDescription}&title=${element.title}&imgUrl=${element.image}&price=${element.price}&phone=${element.phone}&gameState=${element.state}" class="card__link">
                    ${element.title}
                    </a>
                    <div class="card__data">
                        <div>
                            <p class="price">${element.price}</p>
                            <p class="phone">Contact: ${element.phone}</p>
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
    try {
        const card = document.querySelector("#card-".concat(id));
        card.style.display = "none";

        // TODO: delete game from database
    } catch (error) {
        showErrorAlert(error);                      // Display an error using a function declared later
        console.error("An error occurred:", error); // Show the error in the console
    }

}

const getUserData = async () => {
    try {
        const urlWithParams = `${baseUrl}/user.json`;
        const response = await fetch(urlWithParams);

        if (response.ok) {

            const userData = await response.json(); // Parse the response as JSON
            userPosts = userData.posts;

        } else if (response.status === 400 || response.status === 404) {

            // Throws an error with the API's error message.
            const errorData = await response.json();
            throw new Error(`The request was not successful: ${errorData.msg}`);

        } else {

            // Throws a general error 
            throw new Error(`The request was not successful`);
        }
    } catch (error) {
        showErrorAlert(error);                      // Display an error using a function declared later
        console.error("An error occurred:", error); // Show the error in the console
    }
}

const showErrorAlert = (msg) => {
    alert(msg || "An unexpected error occurred");
}

const main = () => {
    getUserData();
    bindElements();
    addEventListeners();
    getGames();
}

window.onload = main;
