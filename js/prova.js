const dadosProva = {
    questoes: [
        {
            enunciado: "O que significa HTML?",
            alternativas: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language"],
            correta: 0
        },
        {
            enunciado: "Qual elemento HTML representa o conteúdo principal da página?",
            alternativas: ["header", "main", "footer"],
            correta: 1
        },
        {
            enunciado: "Qual linguagem é usada principalmente para definir a aparência de uma página web?",
            alternativas: ["SQL", "CSS", "Python"],
            correta: 1
        }
    ]
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
        let campos = "";

        for (let i = 0; i < dadosProva.questoes.length; i++) {
            const questao = dadosProva.questoes[i];
            let alternativas = "";

            for (let j = 0; j < questao.alternativas.length; j++) {
                alternativas += `
                    <label>
                        <input type="radio" name="questao${i}" value="${j}" required>
                        <span>${questao.alternativas[j]}</span>
                    </label>`;
            }

            campos += `
                <fieldset>
                    <legend>${i + 1}. ${questao.enunciado}</legend>
                    ${alternativas}
                </fieldset>`;
        }

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/prova.css">
            <form>
                ${campos}
                <button type="submit">Enviar respostas</button>
            </form>
            <section id="resultado" hidden>
                <h3>Resultado</h3>
                <div id="detalhes-resultado"></div>
                <button type="button" id="refazer">Tentar novamente</button>
            </section>`;

        this.shadowRoot.querySelector("form").addEventListener("submit", (evento) => {
            evento.preventDefault();
            this.corrigirProva();
        });

        this.shadowRoot.querySelector("#refazer").addEventListener("click", () => {
            this.shadowRoot.querySelector("form").reset();
            this.shadowRoot.querySelector("#resultado").hidden = true;
        });
    }

    corrigirProva() {
        const questoes = dadosProva.questoes;
        let acertos = 0;
        let linhas = "";

        for (let i = 0; i < questoes.length; i++) {
            const questao = questoes[i];
            const marcada = this.shadowRoot.querySelector(`input[name="questao${i}"]:checked`);
            const resposta = Number(marcada.value);
            let classe = "incorreta";

            if (resposta == questao.correta) {
                acertos++;
                classe = "correta";
            }

            linhas += `<p class="${classe}"><strong>Questão ${i + 1}:</strong> sua resposta: ${questao.alternativas[resposta]}. Resposta correta: ${questao.alternativas[questao.correta]}.</p>`;
        }

        const nota = (acertos / questoes.length * 10).toFixed(1);

        this.shadowRoot.querySelector("#detalhes-resultado").innerHTML =
            `<p><strong>Nota: ${nota}/10 (${acertos} de ${questoes.length} acertos)</strong></p>${linhas}`;
        this.shadowRoot.querySelector("#resultado").hidden = false;
    }
}

customElements.define("my-test", ProvaOnline);