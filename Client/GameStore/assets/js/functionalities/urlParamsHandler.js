let cardsContainer = null;

const bindElements = () => {
    cardsContainer = document.querySelector("#container-cards");
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

const renderDataFromURLParameters = () => {
    const url = new URL(window.location.href);
    const title = sanitizeHTML(url.searchParams.get("title"));
    const price = sanitizeHTML(url.searchParams.get("price"));
    const imgUrl = sanitizeHTML(url.searchParams.get("imgUrl"));
    const description = sanitizeHTML(url.searchParams.get("description"));
    const phone = sanitizeHTML(url.searchParams.get("phone"));
    const state = sanitizeHTML(url.searchParams.get("gameState"));

    cardsContainer.innerHTML = `
    <div class="cardInfo">
        <div class="card__Infocontent">
            <img src="${imgUrl}" alt="${title}" class="card__image" />
            <div class="card__info">
                <h2 class="card__title">${title}</h2>
                <p class="card__price">${price}</p>
                <p class="card__state">${state}</p>
                <p class="card__phone">${phone}</p>
            </div>
        </div>
        <div class="description__content">
            <p>${description}</p>
        </div>
    </div>
    `;
}

const main = () => {
    bindElements();
    renderDataFromURLParameters();
}

window.onload = main;