window.onload = function () {
  const main = document.querySelector(".main-content");
  main.innerHTML = ""; // limpa o conteúdo anterior, se houver

  const dados = localStorage.getItem("gastos");
  if (!dados) {
    main.innerHTML = "<p class='mensagem'>Nenhum gasto encontrado.</p>";
    return;
  }

  const gastos = JSON.parse(dados);

  // Agrupa os gastos por categoria e soma os valores
  const categoriasAgrupadas = {};
  gastos.forEach(gasto => {
    if (!categoriasAgrupadas[gasto.categoria]) {
      categoriasAgrupadas[gasto.categoria] = {
        total: 0,
        dataMaisRecente: gasto.data
      };
    }

    categoriasAgrupadas[gasto.categoria].total += gasto.valor;

    // Atualiza a data mais recente
    const dataAtual = new Date(gasto.data);
    const dataSalva = new Date(categoriasAgrupadas[gasto.categoria].dataMaisRecente);
    if (dataAtual > dataSalva) {
      categoriasAgrupadas[gasto.categoria].dataMaisRecente = gasto.data;
    }
  });

  // Converte em array e ordena por total gasto (decrescente)
  const categoriasOrdenadas = Object.entries(categoriasAgrupadas)
    .map(([categoria, info]) => ({
      categoria,
      total: info.total,
      dataMaisRecente: info.dataMaisRecente
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5); // Pega as 5 maiores categorias

  // Título
  const titulo = document.createElement("h2");
  titulo.textContent = "Top 5 Categorias com Mais Gastos";
  titulo.className = "titulo-principais";
  main.appendChild(titulo);

  // Exibição
  categoriasOrdenadas.forEach(item => {
    const card = document.createElement("div");
    card.className = "card-gasto";

    card.innerHTML = `
      <h3>${item.categoria}</h3>
      <p><strong>Valor total:</strong> R$ ${item.total.toFixed(2)}</p>
      <p><strong>Último gasto registrado:</strong> ${new Date(item.dataMaisRecente).toLocaleDateString('pt-BR')}</p>
    `;

    main.appendChild(card);
  });
};




