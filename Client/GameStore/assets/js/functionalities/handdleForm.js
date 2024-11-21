let formContainer = null;
let loadingOverlay = null;
let photoLabel = null;
let userRol = null;
let form = null;
let base64Image = null;
let userName = null;
let postData = null;
let navbar = null;
//From fields
let titleInput, descriptionInput, imageUploadInput, priceInput, stateInput, categoryInput = null;

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
    formContainer = document.querySelector("#form-container");
    loadingOverlay = document.getElementById("loading-overlay");
    userName = document.getElementById("user-name");
    navbar = document.getElementById("navigation");
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

const publishFunct = async (e) => {
    e.preventDefault();
    
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

            alert("Publicacion creada exitosamente");
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

const getStateValue = (stateData) => {
    if(stateData == 'Nuevo'){
        return 1;
    }else if(stateData == 'Usado'){
        return 2;
    }
    else if(stateData == 'Desgastado'){
        return 3;
    }
}

const getCategoryNumber = (categoryName) => {
    const categories = [
        "Accion",
        "Aventura",
        "Aventura Grafica",
        "RPG",
        "Shooter",
        "Plataformas",
        "Deportes",
        "Simulacion",
        "Estrategia",
        "Lucha",
        "Horror",
        "Musica y Ritmo",
        "Sandbox o Mundo Abierto",
        "Multijugador en linea",
        "Realidad Virtual",
        "Survival",
        "Party Games",
        "Puzzle"
    ];

    const index = categories.indexOf(categoryName);
    return index !== -1 ? index + 1 : null; // Retorna null si la categoría no existe
};

const modifyFunc = async (e) => {
    e.preventDefault();
    
    // Obtenemos el archivo cargado
    
    const file = imageUploadInput.files[0] || postData.imagen;
    const title = titleInput.value || postData.nombre;
    const description = descriptionInput.value || postData.descripcion;
    const price = priceInput.value || postData.precio;

    const stateValue = getStateValue(postData.estado);
    const categoryValue = getCategoryNumber(postData.categoria);

    const state = stateInput.selectedIndex == 0 ? stateValue : stateInput.selectedIndex;
    const category = categoryInput.selectedIndex == 0 ? categoryValue : categoryInput.selectedIndex;  
    
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
    if(file.type){
        if (!validMimeTypes.includes(file.type)) {
            alert('Solo se permiten archivos PNG, JPEG o JPG');
            return;
        }
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
        const urlWithParams = `${baseUrl}/videogame?id=${postData.id}`;
        const response = await fetch(urlWithParams, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {

            alert("Publicacion modificada exitosamente");
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

    if(postData){
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            modifyFunc(e);
        });
    }else{
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            publishFunct(e);
        });
    }
    
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

const getPostData = async() => {
    const url = new URL(window.location.href);
    let postId = sanitizeHTML(url.searchParams.get("id"));
    const integerRegex = /^\d+$/;

    if(!integerRegex.test(postId)){
        postId = null;
    }

    if (!postId) {
        data = {
            nombre : "",
            precio : "",
            imagen : "Seleccione una foto",
            descripcion : "",
            id : "",
            estado : "Estado",
            categoria : "Categoria",
        }
        displayForm(data, "Publicar");
    }else{
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
                postData = data[0];
                base64Image = data[0].imagen;
                displayForm(data[0], "Modificar");               // Display the data on the card

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
}

const displayForm = (data, formAction) => {
    if(userRol == 'sysadmin'){
        navbar.innerHTML += 
        `<li>
            <a href="usersPanel.html" class="navbar__link">Usuarios</a>
        </li>`;
    }

    let formHTML = "";
    const title = data.nombre || "";
    const price = data.precio || "";
    const img = data.imagen ? "imagen" : "Seleccione una foto";
    const description = data.descripcion || "";
    const state = data.estado || "Estado";
    const category = data.categoria || "Categoria";
    const action =  formAction;
    const formTitle = action == "publicar" ? "Publica tus juegos para venderlos" : "Modifica tus publicaciones";

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
                            ${img}
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
                            <option value="${category}" disabled selected hidden>${category}</option>
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
            userRol = userData.rol;
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

const main = async () => {
    checkToken();
    bindElements();
    await getUserData();
    await getPostData();
    bindFormElements();
    addEventListeners();
}

window.onload = main;