function calcularGastosDoUltimoMes() {
    const dados = localStorage.getItem("gastos");
    if (!dados) {
      document.getElementById("totalMes").textContent = "Nenhum gasto registrado.";
      return;
    }
  
    const gastos = JSON.parse(dados);
    const agora = new Date();
  
    const mesAtual = agora.getMonth(); // 0 = Janeiro
    const anoAtual = agora.getFullYear();
  
    // Mês anterior, considerando virada de ano
    let mesAnterior = mesAtual - 1;
    let anoAnterior = anoAtual;
    if (mesAnterior < 0) {
      mesAnterior = 11;
      anoAnterior = anoAtual - 1;
    }
  
    let totalAtual = 0;
    let totalAnterior = 0;
  
    gastos.forEach(gasto => {
      const data = new Date(gasto.data);
      const mes = data.getMonth();
      const ano = data.getFullYear();
  
      if (mes === mesAtual && ano === anoAtual) {
        totalAtual += gasto.valor;
      } else if (mes === mesAnterior && ano === anoAnterior) {
        totalAnterior += gasto.valor;
      }
    });
  
    // Diferença
    const diferenca = totalAtual - totalAnterior;
    const porcentagem = totalAnterior > 0
      ? ((diferenca / totalAnterior) * 100).toFixed(2)
      : "N/A";
  
    // Atualiza tela
    document.getElementById("totalMes").textContent =
      `Total gasto neste mês: R$ ${totalAtual.toFixed(2)}`;
    document.getElementById("totalAnterior").textContent =
      `Total gasto no mês anterior: R$ ${totalAnterior.toFixed(2)}`;
    document.getElementById("diferenca").textContent =
      porcentagem !== "N/A"
        ? `Diferença: R$ ${diferenca.toFixed(2)} (${porcentagem}%)`
        : `Diferença: R$ ${diferenca.toFixed(2)} (sem base anterior)`;
  }
  
  window.onload = calcularGastosDoUltimoMes;
  