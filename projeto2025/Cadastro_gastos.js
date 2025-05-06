let listaDeGastos = [];
let grafico = null;

function cadastrarGasto() {
  const categorias = ["Alimentação", "Transporte", "Lazer", "Educação", "Saúde", "Outros"];

  let menu = "Escolha a categoria:\n";
  categorias.forEach((cat, index) => {
    menu += `${index + 1}. ${cat}\n`;
  });

  const escolha = prompt(menu);
  const indexCategoria = parseInt(escolha) - 1;
  const categoriaEscolhida = categorias[indexCategoria];

  if (!categoriaEscolhida) {
    alert("Categoria inválida.");
    return;
  }

  const valor = prompt("Digite o valor do gasto:");
  if (isNaN(valor) || valor.trim() === "") {
    alert("Valor inválido.");
    return;
  }

  const nome = prompt("Dê um nome para esse gasto:");
  if (!nome || nome.trim() === "") {
    alert("Nome inválido.");
    return;
  }

  const gasto = {
    nome,
    categoria: categoriaEscolhida,
    valor: parseFloat(valor),
    data: new Date().toISOString() // Salva a data atual
  };
  

  listaDeGastos.push(gasto);
  salvarGastosNoLocalStorage();
  exibirGastoNaTela(gasto);
  atualizarGrafico();
}

function exibirGastoNaTela(gasto) {
  const gastosDiv = document.getElementById("gastos");

  const div = document.createElement("div");
  div.className = "gasto";

  const info = document.createElement("div");
  info.innerHTML = `
    <strong class="gasto-nome">${gasto.nome}</strong><br>
    Categoria: <span class="gasto-categoria">${gasto.categoria}</span><br>
    Valor: R$ <span class="gasto-valor">${gasto.valor.toFixed(2)}</span>
  `;

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.style.marginRight = "10px";
  btnEditar.onclick = function () {
    const novoNome = prompt("Editar nome do gasto:", gasto.nome);
    if (!novoNome || novoNome.trim() === "") return;

    const novoValor = prompt("Editar valor do gasto:", gasto.valor);
    if (isNaN(novoValor) || novoValor.trim() === "") return;

    gasto.nome = novoNome;
    gasto.valor = parseFloat(novoValor);

    info.querySelector(".gasto-nome").textContent = gasto.nome;
    info.querySelector(".gasto-valor").textContent = gasto.valor.toFixed(2);

    salvarGastosNoLocalStorage();
    atualizarGrafico();
  };

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.onclick = function () {
    if (confirm("Tem certeza que deseja remover este gasto?")) {
      listaDeGastos = listaDeGastos.filter(g => g !== gasto);
      div.remove();
      salvarGastosNoLocalStorage();
      atualizarGrafico();
    }
  };

  div.appendChild(info);
  div.appendChild(btnEditar);
  div.appendChild(btnRemover);

  gastosDiv.appendChild(div);
}

function salvarGastosNoLocalStorage() {
  localStorage.setItem("gastos", JSON.stringify(listaDeGastos));
}

function carregarGastosDoLocalStorage() {
  const dados = localStorage.getItem("gastos");
  if (dados) {
    listaDeGastos = JSON.parse(dados);
    listaDeGastos.forEach(gasto => exibirGastoNaTela(gasto));
    atualizarGrafico();
  }
}

function atualizarGrafico() {
  const totalPorCategoria = {};
  let totalGeral = 0;

  listaDeGastos.forEach(gasto => {
    if (!totalPorCategoria[gasto.categoria]) {
      totalPorCategoria[gasto.categoria] = 0;
    }
    totalPorCategoria[gasto.categoria] += gasto.valor;
    totalGeral += gasto.valor;
  });

  const categorias = Object.keys(totalPorCategoria);
  const valores = categorias.map(cat => ((totalPorCategoria[cat] / totalGeral) * 100).toFixed(2));

  const ctx = document.getElementById('graficoPizza')?.getContext('2d');
  if (!ctx) return;

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{
        data: valores,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800', '#9C27B0']
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  });
}

window.onload = () => {
  carregarGastosDoLocalStorage();
};
