class GameCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const image = this.getAttribute('data-image');
      const title = this.getAttribute('data-title');
      const price = this.getAttribute('data-price');
      const phone = this.getAttribute('data-phone');
      const description = this.getAttribute('data-description');
      const gameState = this.getAttribute('data-state');
      const id = this.getAttribute('data-id');
      const deletePermission = this.getAttribute('delete-permission');
      const editPermission = this.getAttribute('edit-permission');
      const editDirection = editPermission == "none" ? 
        "#" :
        `publishItem.html?description=${description}&title=${title}&gameId=${id}&action=Save&imgUrl=${image}&price=${price}&phone=${phone}&gameState=${gameState}` 

      this.shadowRoot.innerHTML = `
        <style>
          .card {
            border-radius: 5px;
            width: 15rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            background: rgba(0,0,0,.25);
          }
          #card-info{
            padding: 10px 18px;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .card img {
            width: 100%;
            border-radius: 5px 5px 0px 0px;
            margin-bottom: 3px;
            height: 17rem;
          }
          .card h3 {
            font-size: 1.2em;
          }
          .card p {
            font-size: 1em;
          }
          .card .price {
            font-weight: bold;
            font-size: 1.8em;
          }
          .card .phone {
            font-size: 0.9em;
          }
          #card-info > * {
            margin: 0px;
          }
          #card-info > a {
            width:fit-content;
          }
          .card__link {
            outline: none !important;
            text-decoration: none;
            font-size: 1em;
            color: #ffff;
          }
          #delete{
            width: 2rem;
            height: fit-content;
            cursor:pointer;
          }
          #edit{
            width: 2rem;
            height: fit-content;
            cursor:pointer;
          }
          .card__data{
            display:flex;
            justify-content:space-between;
            align-items:center; 
          }
          .card__data > div > *{
            margin: 0;
          }
          .card-actions { 
            display: flex;
            flex-direction: column-reverse;
            gap: .5rem;
          }
        </style>
        <div class="card" id="card-${id}">
          <img src="${image}" alt="Game image">
          <div id="card-info">
            <a href="gameInfo.html?description=${description}&title=${title}&imgUrl=${image}&price=${price}&phone=${phone}&gameState=${gameState}" class="card__link">
            ${title}
            </a>
            <div class="card__data">
              <div>
                <p class="price">${price}</p>
                <p class="phone">Contact: ${phone}</p>
              </div>
              <div class="card-actions">
                <img src="./assets/images/delete.svg" alt="delete-button" class="delete-${id}" id="delete" onclick="deleteCard({id: '${id}'})" style="display: ${deletePermission}">
                <a href="${editDirection}">
                  <img src="./assets/images/edit.svg" alt="edit-button" class="edit-${id}" id="edit" style="display: ${editPermission}">
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

customElements.define('game-card', GameCard);