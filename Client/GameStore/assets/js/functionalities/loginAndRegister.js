document.getElementById("btn__registrarse").addEventListener("click", registerTransicion);
document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesionTransicion);


// Declaracion de variables
var formulario_login = document.querySelector(".formulario__login");
var formulario_register = document.querySelector(".formulario__register");
var contenedor_login_register = document.querySelector(".contenedor__login-register");
var caja_trasera_login = document.querySelector(".caja__trasera-login");
var caja_trasera_register = document.querySelector(".caja__trasera-register");

const baseURL = "http://localhost:3000";

function registerTransicion(){
    formulario_register.style.display = "block";
    contenedor_login_register.style.left = "410px";
    formulario_login.style.display = "none";
    caja_trasera_register.style.opacity = "0";
    caja_trasera_login.style.opacity = "1";
}

function iniciarSesionTransicion(){
    formulario_register.style.display = "none";
    contenedor_login_register.style.left = "10px";
    formulario_login.style.display = "block";
    caja_trasera_register.style.opacity = "1";
    caja_trasera_login.style.opacity = "0";
}

function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidUsername(input) {
    const regexAlfanumerico = /^[a-zA-Z0-9]+$/;
    return regexAlfanumerico.test(input); // Devuelve true si el input es válido
}

function getToken() {
    return sessionStorage.getItem("token");
}

// Registro
document.querySelector(".formulario__register").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = sanitizeInput(e.target.nombre.value);
    const correo = sanitizeInput(e.target.correo.value);
    const telefono = sanitizeInput(e.target.telefono.value);
    const password = sanitizeInput(e.target.password.value);

    // Validar el correo electrónico
    if (!isValidEmail(correo)) {
        alert("Por favor, introduce un correo electrónico válido.");
        return; 
    }
    
    if(!isValidUsername(nombre)) {
        alert("El campo de usuario solo permite simbolos alfanumericos y no permite espacios.");
        return;
    }

    if (!nombre || !correo || !telefono || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch(`${baseURL}/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, telefono, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message); // Registro exitoso

            // Limpiar campos del formulario
            e.target.reset();

            // Mover a la vista de login
            iniciarSesionTransicion();
        } else {
            alert(data.message || "Error al registrar.");
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

// Login
document.querySelector(".formulario__login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = sanitizeInput(e.target.identifier.value);
    const password = sanitizeInput(e.target.password.value);

    if(!isValidEmail(identifier) && !isValidUsername(identifier)){
        alert("Por favor, ingrese un correo o usuario valido.");
        return;
    }

    if (!identifier || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        
        const response = await fetch(`${baseURL}/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            }
        );

        // Manejar la respuesta del servidor
        const data = await response.json();
        if (response.ok) {
            // Guardando token en sessionStorage
            sessionStorage.setItem("token", data.token);

            alert("Login exitoso. Redirigiendo a la pagina principal");
            
            // Redirigir a la pagina principal
            

        } else {
            alert(data.error || "Error al iniciar sesión. Compruebe sus credenciales");
        }
    } catch (error) {
        console.log(error);
        console.error("Error en la solicitud de login:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

