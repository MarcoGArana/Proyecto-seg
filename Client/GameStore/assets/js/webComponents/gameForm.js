class GameForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.sanitizeHTML(this.getAttribute('title-value') || "");
        const img = this.sanitizeHTML(this.getAttribute('img-value') || "");
        const price = this.sanitizeHTML(this.getAttribute('price-value') || "");
        const phone = this.sanitizeHTML(this.getAttribute('phone-value') || "");
        const description = this.sanitizeHTML(this.getAttribute('description-value') || "");
        const gameState = this.sanitizeHTML(this.getAttribute('data-state-value') || "");
        const action = this.sanitizeHTML(this.getAttribute('form-action') || "");
        const stateValue = "";

        this.shadowRoot.innerHTML = `
      <style>
            input,
            button,
            textarea,
            select,
            fieldset, label {
                font: inherit;
                border: 0;
                cursor: pointer;
            }

            :is(a, button, input, textarea, select, details, summary, label):focus-visible {
                outline: white solid 0.2rem;
                outline-offset: 0.2rem;
            }

            button,
            a,
            input, textarea, label {
                transition: var(--base-transition);
            }

            input, textarea, button, select, label {
                color-scheme: dark;
            }

            .controls {
                max-width: 52.875rem;
                padding-block: 1rem;
                font-weight: 600;
            }

            .controls--stats {
                display: flex;
                justify-content: space-around;
                align-items: center;
            }

            .control {
                padding: 0.7rem 1.4rem;
                background: rgba(0,0,0,.5);
                border-radius: var(--border-radius);
            }

            button.control:hover,
            input.control:hover,
            textarea.control:hover,
            label.control:hover {
                background: rgba(0,0,0,.35);
            }

            .form {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                align-items: center;
            }

            .form__fieldset {
                display: grid;
                gap: 1rem;
                grid-template-columns: auto 1fr;
                align-items: center;
            }

            .form__field {
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 100%;
                width: 100%;
            }

            .form__field > input, label {
                width: 100%;
                min-height: 3rem;
            }

            .form__field > textarea {
                width: 100%;
                min-height: 6rem;
            }

            .container {
                margin-inline: auto;
                max-width: 90.75rem;
            }

            .select-wrapper {
                position: relative;
                width: fit-content;
            }
            
            .select-wrapper::after {
                content: "▼";
                font-size: 0.75rem;
                top: 13px;
                right: 10px;
                position: absolute;
            }

            select {
                appearance: none;
            }

            .custom-file-upload {
                display: flex;
                align-items: center;
            }
        </style>
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
                    
                    <div  class="form__field">
                        <input
                            type="text"
                            id="from-cellphone"
                            name="from-cellphone"
                            class="control"
                            placeholder="Telefono de contacto"
                            value="${phone}"
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
                            name="state" 
                            class="control"
                            id="from-state"
                        >
                            <option value="${stateValue}" disabled selected hidden>${gameState}</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="usado">Usado</option>
                            <option value="desgastado">Desgastado</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="control">${action}</button>
                </form>
            
      `;
    }
}

customElements.define('game-form', GameForm);