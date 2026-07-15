// ==========================================================================
// 1. LÓGICA DO MENU EXPANSÍVEL DE FILTROS (MOBILE)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".btn-filtro");
  const fotos = document.querySelectorAll(".item-foto");
  const gatilhoMobile = document.getElementById("btn-gatilho-filtros");
  const conteudoFiltros = document.getElementById("conteudo-filtros");

  if (gatilhoMobile && conteudoFiltros) {
    gatilhoMobile.addEventListener("click", () => {
      conteudoFiltros.classList.toggle("aberto");
      const seta = gatilhoMobile.querySelector("span");
      if (conteudoFiltros.classList.contains("aberto")) {
        seta.textContent = "▲";
      } else {
        seta.textContent = "▼";
      }
    });
  }

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      botoes.forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      const filtro = botao.getAttribute("data-filter");
      fotos.forEach(foto => {
        const categoriaFoto = foto.getAttribute("data-category");
        if (filtro === "todos" || categoriaFoto === filtro) {
          foto.style.display = "flex";
        } else {
          foto.style.display = "none";
        }
      });

      if (window.innerWidth <= 768 && conteudoFiltros) {
        conteudoFiltros.classList.remove("aberto");
        if (gatilhoMobile.querySelector("span")) {
          gatilhoMobile.querySelector("span").textContent = "▼";
        }
      }
    });
  });


// ==========================================================================
// 2. LÓGICA DO RODAPÉ DINÂMICO (MOSAICO DESKTOP / BOTÕES MOBILE)
// ==========================================================================
// Lista oficial de coleções. Quando criar uma nova, adicionar uma linha aqui.
// A ordem das linhas determina a ordem de exibição no rodapé, por enquanto.


  const listaColecoes = [
    { nome: "Artrópodes", arquivo: "artropodes.html", capa: "../imagens/capas/artropodes.webp" },
    { nome: "colecaoX", arquivo: "botanica.html", capa: "../imagens/capas/botanica.webp" },
    { nome: "colecaoY", arquivo: "aves.html", capa: "../imagens/capas/aves.webp" }
  ];

  // Descobre em qual página o usuário está agora (ex: artropodes.html)
  const paginaAtual = window.location.pathname.split("/").pop();
  const containerRodape = document.getElementById("links-dinamicos-rodape");

  if (containerRodape) {
    let htmlGerado = "";

    listaColecoes.forEach(colecao => {
      // Só gera o link se NÃO for a página que o usuário já está vendo
      if (colecao.arquivo !== paginaAtual) {
        htmlGerado += `
          <a href="../${colecao.arquivo}" class="card-sugestao-rodape">
            <div class="moldura-sugestao">
              <img src="${colecao.capa}" alt="Coleção ${colecao.nome}" class="img-sugestao-rodape" loading="lazy">
              <div class="overlay-sugestao">
                <span class="txt-sugestao-desktop">${colecao.nome}</span>
              </div>
            </div>
            <span class="btn-sugestao-mobile">${colecao.nome}</span>
          </a>
        `;
      }
    });

    containerRodape.innerHTML = htmlGerado;
  }
});