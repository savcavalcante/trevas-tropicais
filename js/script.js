document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================
  // 1. LÓGICA DO MENU DE NAVEGAÇÃO DO CABEÇALHO (MOBILE)
  // ==========================================================================
  const gatilhoMenu = document.getElementById("btn-gatilho-menu");
  const menuLinks = document.getElementById("menu-links");

  if (gatilhoMenu && menuLinks) {
    gatilhoMenu.addEventListener("click", () => {
      menuLinks.classList.toggle("aberto");
      
      const setaMenu = gatilhoMenu.querySelector(".seta-menu");
      if (setaMenu) {
        if (menuLinks.classList.contains("aberto")) {
          setaMenu.textContent = "▲";
        } else {
          setaMenu.textContent = "▼";
        }
      }
    });
  }

  // ==========================================================================
  // 2. LÓGICA DO MENU EXPANSÍVEL DE FILTROS DAS COLEÇÕES (MOBILE)
  // ==========================================================================
  const botoes = document.querySelectorAll(".btn-filtro");
  const fotos = document.querySelectorAll(".item-foto");
  const gatilhoMobile = document.getElementById("btn-gatilho-filtros");
  const conteudoFiltros = document.getElementById("conteudo-filtros");

  if (gatilhoMobile && conteudoFiltros) {
    gatilhoMobile.addEventListener("click", () => {
      conteudoFiltros.classList.toggle("aberto");
      const seta = gatilhoMobile.querySelector("span");
      if (seta) {
        if (conteudoFiltros.classList.contains("aberto")) {
          seta.textContent = "▲";
        } else {
          seta.textContent = "▼";
        }
      }
    });
  }

  if (botoes.length > 0 && fotos.length > 0) {
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
          if (gatilhoMobile) {
            const seta = gatilhoMobile.querySelector("span");
            if (seta) {
              seta.textContent = "▼";
            }
          }
        }
      });
    });
  }

  // ==========================================================================
  // 3. LÓGICA DO RODAPÉ DINÂMICO (MOSAICO DESKTOP / BOTÕES MOBILE)
  // ==========================================================================
  const listaColecoes = [
    { nome: "Pets", arquivo: "colecoes/pets.html", capa: "imagens/capas/botanica.webp" },
    { nome: "Delírios Lunares", arquivo: "colecoes/delirios-lunares.html", capa: "imagens/capas/delirios-lunares.webp" },
    { nome: "Deslumbre", arquivo: "colecoes/deslumbre.html", capa: "imagens/capas/deslumbre.webp" },
    { nome: "Micromundo", arquivo: "colecoes/micromundo.html", capa: "imagens/capas/micromundo.webp" },
    { nome: "Reino Plantae", arquivo: "colecoes/reino-plantae.html", capa: "imagens/capas/reino-plantae.webp" },
    { nome: "Mycelia", arquivo: "colecoes/mycelia.html", capa: "imagens/capas/mycelia.webp" },
    { nome: "Dramas da Natureza", arquivo: "colecoes/dramas-da-natureza.html", capa: "imagens/capas/dramas-da-natureza.webp" },
    { nome: "Cyberchoque", arquivo: "colecoes/cyberchoque.html", capa: "imagens/capas/cyberchoque.webp" }
  ];

  const paginaAtual = window.location.pathname.split("/").pop();
  const containerRodape = document.getElementById("links-dinamicos-rodape");

  if (containerRodape) {
    const noSubdiretorio = window.location.pathname.includes("/colecoes/");
    const prefixo = noSubdiretorio ? "../" : "";
    
    let htmlGerado = "";

    listaColecoes.forEach(colecao => {
      const nomeArquivoColecao = colecao.arquivo.split("/").pop();
      
      if (nomeArquivoColecao !== paginaAtual) {
        htmlGerado += `
          <a href="${prefixo}${colecao.arquivo}" class="card-sugestao-rodape">
            <div class="moldura-sugestao">
              <img src="${prefixo}${colecao.capa}" alt="Coleção ${colecao.nome}" class="img-sugestao-rodape" loading="lazy">
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