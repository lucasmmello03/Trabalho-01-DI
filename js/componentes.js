class MeuHeader extends HTMLElement {
    constructor() {
        super();
        const titulo = this.innerHTML;
        this.innerHTML = `
            <header id="topo">
                <img src="assets/img/logo-transparent.webp" alt="Logo Lucas Mello">
                ${titulo}
                <meu-nav></meu-nav>
            </header>`;
    }
}

class MeuNav extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <nav>
                <ul class="menu">
                    <li><a href="index.html">Início</a></li>
                    <li><a href="editor.html">Trabalho 1</a></li>
                    <li><a href="trabalho2.html">Trabalho 2</a></li>
                    <li><a href="trabalho3.html">Trabalho 3</a></li>
                    <li><a href="trabalho4.html">Trabalho 4</a></li>
                </ul>
            </nav>`;
    }
}

class MeuFooter extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <footer>
                <p>Página desenvolvida por: Lucas Melo De Mello</p>
            </footer>`;
    }
}

// Cartão com Shadow DOM e slots: cada página que usar o <meu-cartao>
// escolhe o conteúdo que vai em cada slot (titulo, descricao e link).
class MeuCartao extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/cartao.css">
            <article>
                <slot name="titulo">Sem título</slot>
                <slot name="descricao"></slot>
                <slot name="link"></slot>
            </article>`;
    }
}

customElements.define("meu-header", MeuHeader);
customElements.define("meu-nav", MeuNav);
customElements.define("meu-footer", MeuFooter);
customElements.define("meu-cartao", MeuCartao);