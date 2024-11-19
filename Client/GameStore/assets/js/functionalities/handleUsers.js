let formContainer = null;
let loadingOverlay = null;
let userRole = null;
let form = null;
let userName = null;
//From fields
let userNameInput = null;

const baseUrl = "http://127.0.0.1:3000";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodWV2byIsImV4cCI6MTczMTk3NDQwNiwiaWF0IjoxNzMxODg4MDA2fQ.EXjma5tMz3Y2dEaAuWGG7X2Aq3xppDY7Hbz8m95e5mA";

const bindElements = () => {
    formContainer = document.querySelector("#form-container");
    loadingOverlay = document.getElementById("loading-overlay");
    userName = document.getElementById("user-name");
}

const bindFormElements = () => {
    form = document.getElementById("form");
    userNameInput = document.getElementById("from-name");
}

const toggleUser = async (e) => {
    e.preventDefault();

    // Obtenemos el archivo cargado
    const name = userNameInput.value;

    // Verificamos si se seleccionó un archivo
    if (!name) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Definimos el regex para solo letras
    const checkName = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]+$/;

    if (!checkName.test(name)) {
        alert('El nombre letras y numeros');
        return;
    }

    const formData = {
        nombre: name,
    }

    try {
        loading(false);
        const urlWithParams = `${baseUrl}/rol/`;
        const response = await fetch(urlWithParams, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            
            loading(true);
            alert("Usuario modificado exitosamente");

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

const addEventListeners = () => {
    //TODO...
    //Enlazar eventos de publicar o modificar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        toggleUser(e);
    });

}

const loading = (complete) => {
    if (complete) {
        loadingOverlay.style.display = "none";
    }
    else {
        loadingOverlay.style.display = "flex";
    }
}

const showErrorAlert = (msg) => {
    alert(msg || "An unexpected error occurred");
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
            userRole = userData.role;
            userName.innerText = userData.nombre;
            loading(true);

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
    bindElements();
    await getUserData();
    bindFormElements();
    addEventListeners();
}

window.onload = main;