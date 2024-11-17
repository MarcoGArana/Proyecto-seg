let formContainer = null;
let loadingOverlay = null;
let photoLabel = null;
let userRole = null;
let form = null;
let base64Image = null;
let userName = null;
//From fields
let titleInput, descriptionInput, imageUploadInput, priceInput, stateInput, categoryInput = null;

const baseUrl = "http://127.0.0.1:3000";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb21hMjAzIiwiZXhwIjoxNzMxODk4NDkzLCJpYXQiOjE3MzE4MTIwOTN9.ktdZudPhmIwKIyoc1O_Vf9F2JviBJ7LXa4B_LP0E8wc";

const bindElements = () => {
    formContainer = document.querySelector("#form-container");
    loadingOverlay = document.getElementById("loading-overlay");
    userName = document.getElementById("user-name");
}

const bindFormElements = () => {
    form = document.getElementById("form");
    imageUploadInput = document.getElementById("from-photo");
    photoLabel = document.getElementById("photo-holder");
    titleInput = document.getElementById("from-tittle");
    descriptionInput = document.getElementById("from-description");
    priceInput = document.getElementById("from-price");
    stateInput = document.getElementById("from-state");
    categoryInput = document.getElementById("from-category");
}

const addEventListeners = () => {
    //TODO...
    //Enlazar eventos de publicar o modificar
    imageUploadInput.onchange = async (e) => {
        let input = e.target.files[0];
        let text;
        if (input) {
            //process input
            text = imageUploadInput.value;
            const file = e.target.files[0];
            base64Image = await convertToBase64(file);
        } else {
            text = "Selecciona una foto";
        }
        photoLabel.textContent = text;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita el envío por defecto del formulario
        
        // Obtenemos el archivo cargado
        const file = imageUploadInput.files[0];
        const title = titleInput.value;
        const description = descriptionInput.value;
        const price = priceInput.value;
        const state = stateInput.selectedIndex;
        const category = categoryInput.selectedIndex;
        
        // Verificamos si se seleccionó un archivo
        if (!file || !title || !description || !price || state < 1 || state > 3 || category < 1 || category > 18) {
            alert('Por favor, complete todos los campos');
            return;
        }

        // Definimos el regex para solo letras
        const checkTitle = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]+$/;
        const priceRegex = /^\d*(\.\d+)?$/;
        const descRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9.,!?\s'-]*$/

        if(!checkTitle.test(title)){
            alert('El titulo solo admite letras y numeros');
            return;
        }
        if(!descRegex.test(description)){
            alert('Descripcion no valida. Asegurese de solo utilizar letras, numeros o signos de puntuacion');
            return;
        }
        if(!priceRegex.test(price)){
            alert('Precio no valido');
            return;
        }

        // Verificamos el tipo MIME del archivo
        const validMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validMimeTypes.includes(file.type)) {
            alert('Solo se permiten archivos PNG, JPEG o JPG');
            return;
        }

        const formData = {
            nombre: title,
            descripcion: description,
            precio: parseFloat(price),
            imagen: base64Image,
            estado: state,
            categoria: category
        }

        try {
            loading(false);
            const urlWithParams = `${baseUrl}/videogame/`;
            const response = await fetch(urlWithParams, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * displayData
 *
 * This function is used to print multiple card elements into
 * cards container. 
 *
 * @param array: this function receives an array of registers
 */
const displayForm = () => {
    let formHTML = "";
    const url = new URL(window.location.href);
    const title = sanitizeHTML(url.searchParams.get("title") || "");
    const price = sanitizeHTML(url.searchParams.get("price") || "");
    const imgUrl = sanitizeHTML(url.searchParams.get("imgUrl") || "");
    const description = sanitizeHTML(url.searchParams.get("description") || "");
    const gameId = sanitizeHTML(url.searchParams.get("gameId") || "");
    const state = sanitizeHTML(url.searchParams.get("gameState") || "Estado");
    const action = sanitizeHTML(url.searchParams.get("action") || "Publicar");
    const formTitle = action == "Publicar" ? "Publica tus juegos para venderlos" : "Modifica tus publicaciones";

    formHTML += `
        <h2 style="text-align: center; padding: 2rem;">¡${formTitle}!</h2>
        <form id="form" class="form">
                    <div class="form__field">
                        <input
                        type="text"
                        id="from-tittle"
                        name="from-tittle"
                        class="control"
                        placeholder="Titulo"
                        value="${title}"
                        required
                        /> 
                    </div>

                    <div class="form__field">
                        <textarea
                            type="text"
                            id="from-description"
                            name="from-description"
                            class="control"
                            placeholder="Descripcion"
                            spellcheck="false"
                            maxlength="250"
                            required
                        >${description}</textarea>
                    </div>

                    <div class="form__field">
                        <input
                            type="text"
                            id="from-price"
                            name="from-price"
                            class="control"
                            placeholder="Precio"
                            value="${price}"
                            required
                        />
                    </div>

                    <div class="form__field">
                        <label 
                            for="from-photo" 
                            class="custom-file-upload control"
                            id="photo-holder"
                            >
                            Seleccione una foto
                        </label>
                        <input
                            type="file"
                            id="from-photo"
                            name="from-photo"
                            accept='.jpg, .png, .jpeg'
                            style="display:none;"
                        />
                    </div>

                    <div class="form__field select-wrapper">
                        <select 
                            name="category" 
                            class="control"
                            id="from-category"
                        >
                            <option value="" disabled selected hidden>Selecciona un género</option>
                            <option value="accion">Acción</option>
                            <option value="aventura">Aventura</option>
                            <option value="aventura-grafica">Aventura Gráfica</option>
                            <option value="rpg">RPG (Role-Playing Games)</option>
                            <option value="shooter">Shooter</option>
                            <option value="plataformas">Plataformas</option>
                            <option value="deportes">Deportes</option>
                            <option value="simulacion">Simulación</option>
                            <option value="estrategia">Estrategia</option>
                            <option value="lucha">Lucha</option>
                            <option value="horror">Horror</option>
                            <option value="musica-ritmo">Música y Ritmo</option>
                            <option value="sandbox">Sandbox o Mundo Abierto</option>
                            <option value="multijugador-en-linea">Multijugador en línea</option>
                            <option value="vr">Realidad Virtual (VR)</option>
                            <option value="survival">Survival</option>
                            <option value="party-games">Party Games</option>
                            <option value="puzzle">Puzzle</option>
                        </select>
                    </div>

                    <div class="form__field select-wrapper">
                        <select 
                            name="state" 
                            class="control"
                            id="from-state"
                        >
                            <option value="${state}" disabled selected hidden>${state}</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="usado">Usado</option>
                            <option value="desgastado">Desgastado</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="control">${action}</button>
                </form>
            
      `;

    formContainer.innerHTML = formHTML;
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

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

const main = () => {
    bindElements();
    getUserData();
    displayForm();
    bindFormElements();
    addEventListeners();
}

window.onload = main;