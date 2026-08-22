const campoItem = document.getElementById("novo-item");
const corElemento = document.getElementById("cor-elemento");
const corTexto = document.getElementById("cor-texto");
const corBorda = document.getElementById("cor-borda");
const tamanhoItem = document.getElementById("tamanho-elemento");
const tamanhoTexto = document.getElementById("tamanho-texto");
const arredondamento = document.getElementById("arredondamento");
const corMenu = document.getElementById("cor-menu");
const espacamentoMenu = document.getElementById("espacamento-menu");
const direcaoMenu = document.getElementById("direcao-menu");
const imagemMenu = document.getElementById("imagem-menu");
const botaoAdicionar = document.getElementById("btn-adicionar");
const botaoAtualizar = document.getElementById("btn-atualizar");
const botaoExcluir = document.getElementById("btn-excluir");
const menuGerado = document.getElementById("menu-gerado");
const previewContent = document.getElementById("preview-content");
const erro = document.getElementById("erro");

let itemSelecionado = null;

botaoAdicionar.addEventListener("click", adicionar);
botaoAtualizar.addEventListener("click", atualizarItem);
botaoExcluir.addEventListener("click", excluir);
corMenu.addEventListener("input", atualizarMenu);
espacamentoMenu.addEventListener("input", atualizarMenu);
direcaoMenu.addEventListener("change", atualizarMenu);
imagemMenu.addEventListener("change", mostrarImagem);

function adicionar() {
    const texto = campoItem.value.trim();

    if (texto === "") {
        mostrarErro("Digite um texto antes de adicionar.");
        return;
    }

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item-menu-gerado");
    itemDiv.textContent = texto;

    aplicarEstiloNoItem(itemDiv);

    itemDiv.addEventListener("click", function () {
        selecionarItem(itemDiv);
    });

    menuGerado.appendChild(itemDiv);
    selecionarItem(itemDiv);
    limparCampo();
}

function selecionarItem(item) {
    if (itemSelecionado !== null) {
        itemSelecionado.classList.remove("item-selecionado");
    }

    itemSelecionado = item;
    itemSelecionado.classList.add("item-selecionado");
    campoItem.value = itemSelecionado.textContent;
    campoItem.focus();
    limparErro();
}

function atualizarItem() {
    const texto = campoItem.value.trim();

    if (itemSelecionado === null) {
        mostrarErro("Clique em um item do menu antes de atualizar.");
        return;
    }

    if (texto === "") {
        mostrarErro("Digite um texto para atualizar o item.");
        return;
    }

    itemSelecionado.textContent = texto;
    aplicarEstiloNoItem(itemSelecionado);
    limparCampo();
}

function excluir() {
    if (itemSelecionado === null) {
        mostrarErro("Selecione o item do menu que deseja excluir.");
        return;
    }

    itemSelecionado.remove();
    itemSelecionado = null;
    limparCampo();
}

function aplicarEstiloNoItem(item) {
    item.style.backgroundColor = corElemento.value;
    item.style.color = corTexto.value;
    item.style.borderColor = corBorda.value;
    item.style.borderRadius = arredondamento.value + "px";
    item.style.padding = tamanhoItem.value + "px";
    item.style.fontSize = tamanhoTexto.value + "px";
}

function atualizarMenu() {
    menuGerado.style.backgroundColor = corMenu.value;
    menuGerado.style.gap = espacamentoMenu.value + "px";
    menuGerado.style.flexDirection = direcaoMenu.value;
}

function mostrarImagem() {
    const arquivo = imagemMenu.files[0];
    const imgExistente = document.getElementById("imagem-preview");

    if (arquivo === undefined) {
        if (imgExistente) imgExistente.remove();
        return;
    }

    if (imgExistente) {
        imgExistente.src = URL.createObjectURL(arquivo);
    } else {
        const img = document.createElement("img");
        img.id = "imagem-preview";
        img.alt = "Imagem escolhida para o menu";
        img.src = URL.createObjectURL(arquivo);
        previewContent.insertBefore(img, menuGerado);
    }
}

function mostrarErro(mensagem) {
    erro.textContent = mensagem;
    campoItem.style.borderColor = "var(--color-error)";
}

function limparCampo() {
    campoItem.value = "";
    campoItem.style.borderColor = "";
    limparErro();
}

function limparErro() {
    erro.textContent = "";
}