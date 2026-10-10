const questoesDaProva = {
    questao1: {
        enunciado: "O que significa HTML?",
        alternativas: {
            a: "HyperText Markup Language",
            b: "HighText Machine Language",
            c: "HyperTool Multi Language"
        },
        correta: "a"
    },
    questao2: {
        enunciado: "Qual elemento HTML representa o conteúdo principal da página?",
        alternativas: {
            a: "<header>",
            b: "<main>",
            c: "<footer>"
        },
        correta: "b"
    },
    questao3: {
        enunciado: "Qual linguagem é usada principalmente para definir a aparência de uma página web?",
        alternativas: {
            a: "SQL",
            b: "CSS",
            c: "Python"
        },
        correta: "b"
    }
};

class ProvaOnline extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.renderizarProva();
    }

    renderizarProva() {
        const estilos = `
            :host { display: block; }
            form { display: grid; gap: 1rem; margin-top: 1.5rem; }
            fieldset { min-width: 0; margin: 0; padding: 1rem; border: 1px solid #5c635d; border-radius: .5rem; }
            legend { max-width: 100%; padding: 0 .5rem; font-weight: 700; }
            label { display: flex; align-items: flex-start; gap: .5rem; margin-top: .5rem; padding: .5rem; border-radius: .5rem; cursor: pointer; }
            label:hover { background: #323f38; }
            input { flex: 0 0 auto; margin: .25em 0 0; accent-color: #a3c4a8; }
            button { justify-self: start; min-height: 2.75rem; padding: .5rem 1.5rem; color: #222831; font: inherit; font-weight: 700; background: #a3c4a8; border: 1px solid #a3c4a8; border-radius: .5rem; cursor: pointer; }
            button:hover { background: #c2dac1; }
            button:focus-visible, input:focus-visible { outline: 3px solid #c2dac1; outline-offset: 3px; }
            #resultado { margin-top: 1.5rem; padding: 1rem; background: #222831; border: 1px dashed #5c635d; border-radius: .5rem; }
            #resultado h3 { margin: 0 0 .5rem; color: #a3c4a8; }
            #resultado p { margin: .5rem 0 0; }
            .correta { color: #a3c4a8; }
            .incorreta { color: #ff9b9b; }
            @media (max-width: 40rem) { button { justify-self: stretch; } fieldset { padding: .5rem; } }
        `;

        const campos = Object.entries(questoesDaProva).map(([id, questao], indice) => {
            const alternativas = Object.entries(questao.alternativas).map(([valor, texto]) => `
                <label>
                    <input type="radio" name="${id}" value="${valor}" required>
                    <span>${this.escaparHtml(texto)}</span>
                </label>
            `).join("");

            return `
                <fieldset>
                    <legend>${indice + 1}. ${this.escaparHtml(questao.enunciado)}</legend>
                    ${alternativas}
                </fieldset>
            `;
        }).join("");

        this.shadowRoot.innerHTML = `
            <style>${estilos}</style>
            <form>
                ${campos}
                <button type="submit">Enviar respostas</button>
            </form>
            <section id="resultado" aria-labelledby="titulo-resultado" aria-live="polite" hidden>
                <h3 id="titulo-resultado">Resultado</h3>
                <div id="detalhes-resultado"></div>
                <button type="button" id="refazer">Tentar novamente</button>
            </section>
        `;

        this.shadowRoot.querySelector("form").addEventListener("submit", (evento) => {
            evento.preventDefault();
            this.corrigirProva();
        });

        this.shadowRoot.querySelector("#refazer").addEventListener("click", () => {
            this.shadowRoot.querySelector("form").reset();
            this.shadowRoot.querySelector("#resultado").hidden = true;
            this.shadowRoot.querySelector("form").querySelector("input").focus();
        });
    }

    corrigirProva() {
        const respostas = new FormData(this.shadowRoot.querySelector("form"));
        const questoes = Object.entries(questoesDaProva);
        let acertos = 0;

        const linhas = questoes.map(([id, questao], indice) => {
            const resposta = respostas.get(id);
            const acertou = resposta === questao.correta;
            if (acertou) acertos += 1;

            const textoResposta = resposta
                ? questao.alternativas[resposta]
                : "Não respondida";
            const classe = acertou ? "correta" : "incorreta";

            return `<p class="${classe}"><strong>Questão ${indice + 1}:</strong> sua resposta: ${this.escaparHtml(textoResposta)}. Resposta correta: ${this.escaparHtml(questao.alternativas[questao.correta])}.</p>`;
        }).join("");

        const nota = (acertos / questoes.length) * 10;
        const detalhes = this.shadowRoot.querySelector("#detalhes-resultado");
        detalhes.innerHTML = `<p><strong>Nota: ${nota.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}/10 (${acertos} de ${questoes.length} acertos)</strong></p>${linhas}`;
        this.shadowRoot.querySelector("#resultado").hidden = false;
        this.shadowRoot.querySelector("#resultado").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    escaparHtml(texto) {
        return String(texto).replace(/[&<>"']/g, (caractere) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]);
    }
}

customElements.define("my-test", ProvaOnline);
