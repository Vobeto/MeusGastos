let listaDeGastos = [];
let grafico = null;

function carregarGastosDoLocalStorage() {
  const dados = localStorage.getItem("gastos");
  if (dados) {
    listaDeGastos = JSON.parse(dados);

    if (listaDeGastos.length > 0) {
      const titulo = document.getElementById("Porcent_cat");
      if (titulo) {
        titulo.textContent = "Distribuição por categoria";
      }
    }
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
  const porcentagens = categorias.map(cat => ((totalPorCategoria[cat] / totalGeral) * 100).toFixed(2));

  const ctx = document.getElementById("graficoPizza")?.getContext("2d");
  if (!ctx) return;

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{
        data: porcentagens,
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

window.onload = carregarGastosDoLocalStorage;
