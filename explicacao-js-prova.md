# Explicação do JavaScript da prova on-line

Este documento descreve o código de `js/Prova.js`, que cria uma prova de múltipla escolha como um Web Component. O componente é usado no HTML pela tag `<my-test></my-test>`.

## 1. Dados das questões

```js
const questoesDaProva = {
    questao1: {
        enunciado: "O que significa HTML?",
        alternativas: {
            a: "HyperText Markup Language",
            b: "HighText Machine Language",
            c: "HyperTool Multi Language"
        },
        correta: "a"
    }
};
```

`questoesDaProva` é um objeto literal que guarda os dados da prova. Cada propriedade, como `questao1`, representa uma questão e contém:

- `enunciado`: o texto da pergunta;
- `alternativas`: outro objeto, cujas chaves (`a`, `b`, `c`) identificam cada resposta;
- `correta`: a chave da alternativa certa.

As três questões atuais seguem essa mesma estrutura. A interface e a correção percorrem o objeto, portanto uma nova questão pode ser incluída acrescentando outra propriedade com esses campos. Cada questão também precisa ter ao menos uma alternativa e uma chave `correta` correspondente a uma das alternativas.

## 2. Definição do Web Component

```js
class ProvaOnline extends HTMLElement {
```

A classe `ProvaOnline` herda de `HTMLElement`, que é a base dos elementos HTML. Isso permite que a classe seja registrada como um elemento personalizado e utilizada com uma tag própria.

### Construtor e Shadow DOM

```js
constructor() {
    super();
    this.attachShadow({ mode: "open" });
}
```

`super()` inicializa a parte herdada de `HTMLElement`. `attachShadow` cria uma árvore Shadow DOM para o componente. O modo `open` permite que o código da página acesse essa árvore por `element.shadowRoot`. O formulário e seus estilos são inseridos nessa árvore, separados dos estilos e elementos comuns da página.

### Ciclo de vida

```js
connectedCallback() {
    this.renderizarProva();
}
```

O navegador chama `connectedCallback` quando `<my-test>` é conectado ao documento. Nesse momento, o método `renderizarProva` constrói a interface.

## 3. Criação da interface

```js
renderizarProva() {
    const estilos = `...`;
```

O método guarda em `estilos` uma string com CSS. Como essa string é colocada dentro do Shadow DOM, essas regras se aplicam ao componente. Elas controlam o formulário, os grupos de alternativas, os botões, os estados de foco, o resultado e um ajuste para telas estreitas.

### Gerar uma questão para cada entrada

```js
const campos = Object.entries(questoesDaProva).map(([id, questao], indice) => {
```

`Object.entries` transforma as propriedades do objeto em pares: o identificador da questão (`id`) e os seus dados (`questao`). `map` percorre esses pares para montar o HTML de cada questão. `indice` é a posição da questão e serve para exibir a numeração começando em 1.

As alternativas também são percorridas com `Object.entries(questao.alternativas)`. Para cada uma, o código cria um `input` do tipo `radio` dentro de um `label`:

```html
<label>
    <input type="radio" name="questao1" value="a" required>
    <span>Texto da alternativa</span>
</label>
```

Todos os radios da mesma pergunta compartilham o mesmo `name`, então só uma alternativa daquele grupo pode ser selecionada. Cada pergunta tem um `name` próprio. O atributo `required` faz a validação nativa do navegador exigir uma resposta para cada grupo antes do envio. O `label` permite selecionar a alternativa clicando também no texto.

As opções e o enunciado são inseridos em `fieldset` e `legend`, elementos que agrupam semanticamente os controles da questão. O resultado de cada `map` é unido em uma única string com `join("")`.

### Escapar texto antes de montar HTML

```js
this.escaparHtml(texto)
```

O método é usado antes de inserir os textos recebidos do objeto no HTML. Ele transforma caracteres especiais como `<`, `>` e `&` em entidades HTML. Isso permite exibir, por exemplo, `<main>` como texto e evita que o navegador o interprete como marcação.

### Inserir o formulário e o espaço do resultado

```js
this.shadowRoot.innerHTML = `
    <style>${estilos}</style>
    <form>...</form>
    <section id="resultado" ... hidden>...</section>
`;
```

O HTML gerado é colocado no Shadow DOM. O formulário contém todas as questões e o botão de envio. A seção `#resultado` começa escondida pelo atributo `hidden`; após a correção, ela passa a exibir a nota e os detalhes. `aria-live="polite"` informa tecnologias assistivas que o conteúdo foi atualizado sem interromper abruptamente a leitura.

## 4. Eventos do formulário e botão de repetição

```js
this.shadowRoot.querySelector("form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    this.corrigirProva();
});
```

O listener reage ao envio. `preventDefault()` impede a navegação ou recarga padrão do formulário, e `corrigirProva()` calcula e mostra o resultado na própria página.

O botão “Tentar novamente” tem um listener de clique. Ele chama `reset()` para desmarcar as respostas, esconde o resultado e move o foco para a primeira alternativa, facilitando uma nova tentativa pelo teclado.

## 5. Correção das respostas

```js
const respostas = new FormData(this.shadowRoot.querySelector("form"));
```

`FormData` lê os valores selecionados no formulário. Como o `name` de cada grupo corresponde à chave da questão, `respostas.get(id)` recupera a alternativa escolhida para aquela questão.

O método percorre novamente `questoesDaProva`. Para cada questão, compara a resposta recebida com `questao.correta`. Se forem iguais, soma um a `acertos`. Também obtém o texto escolhido e o texto do gabarito para formar a linha de resultado. A classe CSS aplicada é `correta` quando acertou e `incorreta` caso contrário.

```js
const nota = (acertos / questoes.length) * 10;
```

A nota é calculada em uma escala de 0 a 10: divide-se o número de acertos pelo total de questões e multiplica-se por 10. `toLocaleString("pt-BR", ...)` formata a nota conforme a convenção brasileira, usando vírgula decimal quando necessário.

Por fim, o conteúdo é inserido na área de detalhes, a seção de resultado é revelada e `scrollIntoView` desloca a página suavemente até ela.

## 6. Registro da tag personalizada

```js
customElements.define("my-test", ProvaOnline);
```

Essa chamada registra a classe no navegador com o nome `my-test`. Nomes de custom elements precisam conter hífen. Depois do registro, a tag `<my-test></my-test>` instancia a prova.

## Fluxo resumido

1. O navegador carrega `js/Prova.js` e registra `<my-test>`.
2. Ao encontrar a tag, chama `connectedCallback`.
3. `renderizarProva` lê o objeto de dados e cria perguntas e alternativas no Shadow DOM.
4. O navegador exige uma resposta em cada grupo por causa de `required`.
5. No envio, `corrigirProva` compara as respostas com o gabarito e apresenta nota e detalhes.
6. “Tentar novamente” limpa as escolhas, oculta o resultado e devolve o foco à prova.