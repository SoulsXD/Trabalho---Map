interface Produto {
  nome: string;
  quantidade: number;
}

let estoque = new Map<string, Produto>();

function salvarNoLocalStorage() {
  const arr = Array.from(estoque.entries());
  localStorage.setItem('estoque', JSON.stringify(arr));
}

function carregarDoLocalStorage() {
  const dados = localStorage.getItem('estoque');
  if (dados) {
    const arr: [string, Produto][] = JSON.parse(dados);
    estoque = new Map(arr);
  }
}

function mostrarSecao(idSecao: string) {
  const secoes = ['sec-adicionar', 'sec-buscar', 'sec-remover', 'sec-listar'];
  secoes.forEach(id => {
    const sec = document.getElementById(id)!;
    sec.style.display = id === idSecao ? 'block' : 'none';
  });

  mostrarMensagem('', ''); // limpa mensagem geral ao mudar aba
}

function mostrarMensagem(msg: string, tipo: 'erro' | 'sucesso' | '' = '') {
  const container = document.getElementById('msg-geral')!;
  container.innerText = msg;
  container.className = tipo;
}

function atualizarLista() {
  const listaEstoque = document.getElementById('lista-estoque')!;
  listaEstoque.innerHTML = '';
  if (estoque.size === 0) {
    listaEstoque.innerHTML = '<li>Estoque vazio.</li>';
    return;
  }
  estoque.forEach((prod, id) => {
    const li = document.createElement('li');
    li.innerText = `ID: ${id} — ${prod.nome} (${prod.quantidade} unidades)`;
    listaEstoque.appendChild(li);
  });
}

function init() {
  carregarDoLocalStorage();
  mostrarSecao('sec-adicionar');
  atualizarLista();

  //  mostrar abas
  document.getElementById('btn-mostrar-adicionar')!.addEventListener('click', () => mostrarSecao('sec-adicionar'));
  document.getElementById('btn-mostrar-buscar')!.addEventListener('click', () => mostrarSecao('sec-buscar'));
  document.getElementById('btn-mostrar-remover')!.addEventListener('click', () => mostrarSecao('sec-remover'));
  document.getElementById('btn-mostrar-listar')!.addEventListener('click', () => {
    mostrarSecao('sec-listar');
    atualizarLista();
  });

  // Adicionar Produto
  document.getElementById('btn-adicionar')!.addEventListener('click', () => {
    const inputAddId = document.getElementById('add-id') as HTMLInputElement;
    const inputAddNome = document.getElementById('add-nome') as HTMLInputElement;
    const inputAddQt = document.getElementById('add-quantidade') as HTMLInputElement;

    const id = inputAddId.value.trim();
    const nome = inputAddNome.value.trim();
    const qt = Number(inputAddQt.value);

    if (!id || !nome || isNaN(qt) || qt < 0) {
      mostrarMensagem('Preencha todos os campos corretamente.', 'erro');
      return;
    }
    if (estoque.has(id)) {
      mostrarMensagem(`ID "${id}" já existe.`, 'erro');
      return;
    }
    estoque.set(id, { nome, quantidade: qt });
    salvarNoLocalStorage();
    mostrarMensagem(`Produto "${nome}" adicionado.`, 'sucesso');

    inputAddId.value = '';
    inputAddNome.value = '';
    inputAddQt.value = '';
  });

  // Buscar Produto
  document.getElementById('btn-buscar')!.addEventListener('click', () => {
    const inputBuscarId = document.getElementById('buscar-id') as HTMLInputElement;
    const id = inputBuscarId.value.trim();
    if (!id) {
      mostrarMensagem('Informe um ID para buscar.', 'erro');
      return;
    }
    const prod = estoque.get(id);
    if (!prod) {
      mostrarMensagem(`Produto com ID "${id}" não encontrado.`, 'erro');
    } else {
      mostrarMensagem(`→ ${prod.nome} (${prod.quantidade} unidades)`, 'sucesso');
    }
  });

  // Removei Produto
  document.getElementById('btn-remover')!.addEventListener('click', () => {
  const inputRemoverId = document.getElementById('remover-id') as HTMLInputElement;
  const inputRemoverQt = document.getElementById('remover-quantidade') as HTMLInputElement;

  const id = inputRemoverId.value.trim();
  const qtRemoverStr = inputRemoverQt.value.trim();
  const qtRemover = qtRemoverStr ? Number(qtRemoverStr) : null;

  if (!id) {
    mostrarMensagem('Informe um ID para remover.', 'erro');
    return;
  }

  if (!estoque.has(id)) {
    mostrarMensagem(`Não há produto com ID "${id}".`, 'erro');
    return;
  }

  if (qtRemover !== null) {
    if (isNaN(qtRemover) || qtRemover <= 0) {
      mostrarMensagem('Informe uma quantidade válida para remover.', 'erro');
      return;
    }
    const prod = estoque.get(id)!;
    if (qtRemover >= prod.quantidade) {
      // Remove o produto inteiro
      estoque.delete(id);
      mostrarMensagem(`Produto "${id}" removido totalmente.`, 'sucesso');
    } else {
      prod.quantidade -= qtRemover;
      estoque.set(id, prod);
      mostrarMensagem(`Removidas ${qtRemover} unidades do produto "${id}". Restam ${prod.quantidade}.`, 'sucesso');
    }
  } else {
    // Remove tudo se não informou quantidade
    estoque.delete(id);
    mostrarMensagem(`Produto "${id}" removido totalmente.`, 'sucesso');
  }

  salvarNoLocalStorage();
  atualizarLista();

  inputRemoverId.value = '';
  inputRemoverQt.value = '';
});


  // Atualizar lista (botão na aba listar)
  document.getElementById('btn-listar')!.addEventListener('click', atualizarLista);
}

window.addEventListener('DOMContentLoaded', init);
