document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".btn-filtro");
  const fotos = document.querySelectorAll(".item-foto");
  const gatilhoMobile = document.getElementById("btn-gatilho-filtros");
  const conteudoFiltros = document.getElementById("conteudo-filtros");

  // --- LÓGICA DO MENU EXPANSÍVEL (MOBILE) ---
  if (gatilhoMobile && conteudoFiltros) {
    gatilhoMobile.addEventListener("click", () => {
      conteudoFiltros.classList.toggle("aberto");
      
      // Altera a setinha do botão ao abrir/fechar
      const seta = gatilhoMobile.querySelector("span");
      if (conteudoFiltros.classList.contains("aberto")) {
        seta.textContent = "▲";
      } else {
        seta.textContent = "▼";
      }
    });
  }

  // --- LÓGICA DOS FILTROS DE FOTO ---
  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      // 1. Alterna classe ativa dos botões
      botoes.forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      // 2. Filtra as imagens
      const filtro = botao.getAttribute("data-filter");
      fotos.forEach(foto => {
        const categoriaFoto = foto.getAttribute("data-category");
        if (filtro === "todos" || categoriaFoto === filtro) {
          foto.style.display = "flex";
        } else {
          foto.style.display = "none";
        }
      });

      // 3. No mobile, fecha a gaveta de filtros automaticamente após escolher um
      if (window.innerWidth <= 768 && conteudoFiltros) {
        conteudoFiltros.classList.remove("aberto");
        if (gatilhoMobile.querySelector("span")) {
          gatilhoMobile.querySelector("span").textContent = "▼";
        }
      }
    });
  });
});