var estoque = new Map();
function salvarNoLocalStorage() {
    var arr = Array.from(estoque.entries());
    localStorage.setItem('estoque', JSON.stringify(arr));
}
function carregarDoLocalStorage() {
    var dados = localStorage.getItem('estoque');
    if (dados) {
        var arr = JSON.parse(dados);
        estoque = new Map(arr);
    }
}
function mostrarSecao(idSecao) {
    var secoes = ['sec-adicionar', 'sec-buscar', 'sec-remover', 'sec-listar'];
    secoes.forEach(function (id) {
        var sec = document.getElementById(id);
        sec.style.display = id === idSecao ? 'block' : 'none';
    });
    mostrarMensagem('', ''); // limpa mensagem geral ao mudar aba
}
function mostrarMensagem(msg, tipo) {
    if (tipo === void 0) { tipo = ''; }
    var container = document.getElementById('msg-geral');
    container.innerText = msg;
    container.className = tipo;
}
function atualizarLista() {
    var listaEstoque = document.getElementById('lista-estoque');
    listaEstoque.innerHTML = '';
    if (estoque.size === 0) {
        listaEstoque.innerHTML = '<li>Estoque vazio.</li>';
        return;
    }
    estoque.forEach(function (prod, id) {
        var li = document.createElement('li');
        li.innerText = "ID: ".concat(id, " \u2014 ").concat(prod.nome, " (").concat(prod.quantidade, " unidades)");
        listaEstoque.appendChild(li);
    });
}
function init() {
    carregarDoLocalStorage();
    mostrarSecao('sec-adicionar');
    atualizarLista();
    //  mostrar abas
    document.getElementById('btn-mostrar-adicionar').addEventListener('click', function () { return mostrarSecao('sec-adicionar'); });
    document.getElementById('btn-mostrar-buscar').addEventListener('click', function () { return mostrarSecao('sec-buscar'); });
    document.getElementById('btn-mostrar-remover').addEventListener('click', function () { return mostrarSecao('sec-remover'); });
    document.getElementById('btn-mostrar-listar').addEventListener('click', function () {
        mostrarSecao('sec-listar');
        atualizarLista();
    });
    // Adicionar Produto
    document.getElementById('btn-adicionar').addEventListener('click', function () {
        var inputAddId = document.getElementById('add-id');
        var inputAddNome = document.getElementById('add-nome');
        var inputAddQt = document.getElementById('add-quantidade');
        var id = inputAddId.value.trim();
        var nome = inputAddNome.value.trim();
        var qt = Number(inputAddQt.value);
        if (!id || !nome || isNaN(qt) || qt < 0) {
            mostrarMensagem('Preencha todos os campos corretamente.', 'erro');
            return;
        }
        if (estoque.has(id)) {
            mostrarMensagem("ID \"".concat(id, "\" j\u00E1 existe."), 'erro');
            return;
        }
        estoque.set(id, { nome: nome, quantidade: qt });
        salvarNoLocalStorage();
        mostrarMensagem("Produto \"".concat(nome, "\" adicionado."), 'sucesso');
        inputAddId.value = '';
        inputAddNome.value = '';
        inputAddQt.value = '';
    });
    // Buscar Produto
    document.getElementById('btn-buscar').addEventListener('click', function () {
        var inputBuscarId = document.getElementById('buscar-id');
        var id = inputBuscarId.value.trim();
        if (!id) {
            mostrarMensagem('Informe um ID para buscar.', 'erro');
            return;
        }
        var prod = estoque.get(id);
        if (!prod) {
            mostrarMensagem("Produto com ID \"".concat(id, "\" n\u00E3o encontrado."), 'erro');
        }
        else {
            mostrarMensagem("\u2192 ".concat(prod.nome, " (").concat(prod.quantidade, " unidades)"), 'sucesso');
        }
    });
    // Removei Produto
    document.getElementById('btn-remover').addEventListener('click', function () {
        var inputRemoverId = document.getElementById('remover-id');
        var inputRemoverQt = document.getElementById('remover-quantidade');
        var id = inputRemoverId.value.trim();
        var qtRemoverStr = inputRemoverQt.value.trim();
        var qtRemover = qtRemoverStr ? Number(qtRemoverStr) : null;
        if (!id) {
            mostrarMensagem('Informe um ID para remover.', 'erro');
            return;
        }
        if (!estoque.has(id)) {
            mostrarMensagem("N\u00E3o h\u00E1 produto com ID \"".concat(id, "\"."), 'erro');
            return;
        }
        if (qtRemover !== null) {
            if (isNaN(qtRemover) || qtRemover <= 0) {
                mostrarMensagem('Informe uma quantidade válida para remover.', 'erro');
                return;
            }
            var prod = estoque.get(id);
            if (qtRemover >= prod.quantidade) {
                // Remove o produto inteiro
                estoque.delete(id);
                mostrarMensagem("Produto \"".concat(id, "\" removido totalmente."), 'sucesso');
            }
            else {
                prod.quantidade -= qtRemover;
                estoque.set(id, prod);
                mostrarMensagem("Removidas ".concat(qtRemover, " unidades do produto \"").concat(id, "\". Restam ").concat(prod.quantidade, "."), 'sucesso');
            }
        }
        else {
            // Remove tudo se não informou quantidade
            estoque.delete(id);
            mostrarMensagem("Produto \"".concat(id, "\" removido totalmente."), 'sucesso');
        }
        salvarNoLocalStorage();
        atualizarLista();
        inputRemoverId.value = '';
        inputRemoverQt.value = '';
    });
    // Atualizar lista (botão na aba listar)
    document.getElementById('btn-listar').addEventListener('click', atualizarLista);
}
window.addEventListener('DOMContentLoaded', init);
