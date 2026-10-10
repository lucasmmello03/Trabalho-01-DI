# Portfólio Semestral — Interação Web

Site desenvolvido para a disciplina de Interação Web do curso de Análise e Desenvolvimento de Sistemas no IFRS Campus Rio Grande.

## Páginas

- **Início** — apresentação do portfólio e dos trabalhos que serão desenvolvidos ao longo do semestre
- **Trabalho 1** — editor de menus para páginas HTML com preview em tempo real
- **Trabalho 2** — prova on-line de múltipla escolha feita como web component

## Trabalho 1 — Editor de Menus

Permite criar e personalizar visualmente um menu de navegação HTML. O usuário pode:

- Adicionar, editar e excluir itens do menu
- Definir cores de fundo, texto e borda de cada item
- Ajustar tamanho do texto, espaçamento interno e arredondamento da borda
- Definir a cor de fundo e o espaçamento entre os itens do menu
- Escolher a direção dos itens (horizontal ou vertical)
- Inserir uma imagem acima do menu

## Trabalho 2 — Objetos e Web Components

### Prova on-line

A prova é um web component: basta adicionar a tag `<my-test></my-test>` na página para que ela apareça, com todo o seu HTML, CSS e JavaScript encapsulados em um Shadow DOM.

- As questões, alternativas e respostas corretas ficam em um objeto literal (`dadosProva`, em `js/prova.js`)
- Para criar uma nova questão, basta adicionar outro objeto no array `questoes`: ela é mostrada e corrigida como as outras
- O usuário responde, clica em "Enviar respostas" e vê a nota, o que respondeu e as respostas corretas
- Não é possível enviar a prova com questões em branco
- O botão "Tentar novamente" permite responder a prova de novo

### Web components do site

Definidos em `js/componentes.js` e reutilizados em todas as páginas:

- `<meu-header>`, `<meu-nav>` e `<meu-footer>` — cabeçalho, menu e rodapé do site, especificados em um único lugar (custom elements)
- `<meu-cartao>` — cartão com Shadow DOM e slots (`titulo`, `descricao` e `link`), usado na página inicial para listar os trabalhos

## Tecnologias

- HTML5
- CSS3 (sem frameworks)
- JavaScript (vanilla)

## Como executar localmente

Abra o arquivo `index.html` em qualquer navegador moderno. Nenhuma instalação necessária.

## Acesso

- Repositório: https://github.com/lucasmmello03/Trabalho-01-DI
- GitHub Pages: https://lucasmmello03.github.io/Trabalho-01-DI/

## Autor

Lucas Melo De Mello