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
    { nome: "Pets", arquivo: "colecoes/pets.html", capa: "imagens/galeria/pets/gatos-12.webp" },
    { nome: "Delírios Lunares", arquivo: "colecoes/delirios-lunares.html", capa: "imagens/galeria/delirios-lunares/lua-cadente-3.webp" },
    { nome: "Deslumbre", arquivo: "colecoes/deslumbre.html", capa: "imagens/galeria/deslumbre/paisagem-natural-4.webp" }, // ajuste a capa se necessário
    { nome: "Micromundo", arquivo: "colecoes/micromundo.html", capa: "imagens/galeria/micromundo/asas-107.webp" },
    { nome: "Reino Plantae", arquivo: "colecoes/reino-plantae.html", capa: "imagens/galeria/reino-plantae/planta-4.webp" },
    { nome: "Mycelia", arquivo: "colecoes/mycelia.html", capa: "imagens/galeria/mycelia/fungo-1.webp" },
    { nome: "Dramas da Natureza", arquivo: "colecoes/dramas-da-natureza.html", capa: "imagens/galeria/dramas-da-natureza/inseto-32.webp" },
    { nome: "Cyberchoque", arquivo: "colecoes/cyberchoque.html", capa: "imagens/galeria/cyberchoque/cyber-horror-4.webp" }
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
          <a href="${prefixo}${colecao.arquivo}" class="card-sugestao-rodape card-colecao">
            <!-- Mobile: Estrutura de Botão Simples -->
            <span class="btn-sugestao-mobile">${colecao.nome}</span>

            <!-- Desktop: Mosaico Reutilizando Perfeitamente as Classes da Home -->
            <div class="moldura-sugestao moldura-foto">
              <img src="${prefixo}${colecao.capa}" alt="Coleção ${colecao.nome}" class="foto-capa img-sugestao-rodape" loading="lazy">
            </div>
            <div class="info-colecao overlay-sugestao">
              <h2 class="titulo-colecao txt-sugestao-desktop">${colecao.nome}</h2>
            </div>
          </a>
        `;
      }
    });

    containerRodape.innerHTML = htmlGerado;
  }

// ==========================================================================
  // 4. LÓGICA DO ALTERNADOR DE VISUALIZAÇÃO (MOSAICO VS LISTA) E FOCO NA FOTO
  // ==========================================================================
  const btnAlternar = document.getElementById("btn-alternar-view");
  const gradeGaleria = document.getElementById("grade-galeria");

  if (btnAlternar && gradeGaleria) {
    // 4.1. Lógica do Botão de Alternância
    btnAlternar.addEventListener("click", () => {
      gradeGaleria.classList.toggle("modo-mosaico");

      if (gradeGaleria.classList.contains("modo-mosaico")) {
        btnAlternar.textContent = "Modo Lista";
      } else {
        btnAlternar.textContent = "Modo Mosaico";
      }
    });

    // 4.2. NOVO: Lógica de clicar na foto no Mosaico para focar na Lista
    const fotosGaleria = gradeGaleria.querySelectorAll(".item-foto");
    
    fotosGaleria.forEach(foto => {
      foto.addEventListener("click", () => {
        // Só age se a galeria estiver atualmente no modo mosaico
        if (gradeGaleria.classList.contains("modo-mosaico")) {
          // 1. Remove o modo mosaico (voltando para o modo lista)
          gradeGaleria.classList.remove("modo-mosaico");
          
          // 2. Atualiza o texto do botão do alternador
          btnAlternar.textContent = "Modo Mosaico";
          
          // 3. Rola a tela suavemente para que a foto clicada fique centralizada
          foto.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      });
    });
  }

// ==========================================================================
  // 5. ALEATORIZAÇÃO DE FOTOS COM PRIORIDADE DE CARREGAMENTO DINÂMICA
  // ==========================================================================
  const galeriaParaEmbaralhar = document.querySelector('.grade-galeria[data-random="true"]');

  if (galeriaParaEmbaralhar) {
    // Transforma a lista de fotos em uma Array para manipulação no JS
    const fotosArray = Array.from(galeriaParaEmbaralhar.querySelectorAll('.item-foto'));
    
    // Algoritmo Fisher-Yates para embaralhar a array de fotos
    for (let i = fotosArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fotosArray[i], fotosArray[j]] = [fotosArray[j], fotosArray[i]];
    }

    // Limpa o conteúdo atual do container
    galeriaParaEmbaralhar.innerHTML = "";

    // Aplica a prioridade de carregamento baseada na nova ordem
    fotosArray.forEach((foto, index) => {
      const img = foto.querySelector('img');
      
      if (img) {
        if (index < 5) {
          // As 5 primeiras imagens do novo topo perdem o "lazy" e carregam imediatamente
          img.removeAttribute('loading');
          img.setAttribute('fetchpriority', 'high'); // Sinaliza ao navegador prioridade máxima
        } else {
          // Todas as outras da 4ª em diante usam carregamento preguiçoso e decodificação assíncrona
          img.setAttribute('loading', 'lazy');
          img.setAttribute('decoding', 'async');
        }
      }
      
      // Insere o elemento na nova ordem aleatória
      galeriaParaEmbaralhar.appendChild(foto);
    });
  }

  // ==========================================================================
  // 6. PROTEÇÃO DO ACERVO (BLOQUEIO DE BOTÃO DIREITO NAS IMAGENS)
  // ==========================================================================
  document.addEventListener("contextmenu", (e) => {
    // Se o clique com botão direito for em cima de uma foto do portfólio, bloqueia
    if (e.target.classList.contains("foto-portfolio") || e.target.classList.contains("foto-capa")) {
      e.preventDefault();
    }
  });

});