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
      const seta = gatilhoMobile.querySelector(".seta-filtro");
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
            const seta = gatilhoMobile.querySelector(".seta-filtro");
            if (seta) {
              seta.textContent = "▼";
            }
          }
        }
      });
    });
  }

  // ==========================================================================
  // 3. LÓGICA DO RODAPÉ DINÂMICO (MOSAICO INTEGRAL MOBILE/DESKTOP)
  // ==========================================================================
  const listaColecoes = [
    { nome: "Pets", arquivo: "colecoes/pets.html", capa: "imagens/galeria/pets/gatos-12.webp" },
    { nome: "Delírios Lunares", arquivo: "colecoes/delirios-lunares.html", capa: "imagens/galeria/delirios-lunares/lua-cadente-3.webp" },
    { nome: "Deslumbre", arquivo: "colecoes/deslumbre.html", capa: "imagens/galeria/deslumbre/paisagem-natural-9.webp" },
    { nome: "Micromundo", arquivo: "colecoes/micromundo.html", capa: "imagens/galeria/micromundo/asas-100.webp" },
    { nome: "Reino Plantae", arquivo: "colecoes/reino-plantae.html", capa: "imagens/galeria/reino-plantae/folha-1.webp" },
    { nome: "Mycelia", arquivo: "colecoes/mycelia.html", capa: "imagens/galeria/mycelia/cogumelo-7.webp" },
    { nome: "Dramas da Natureza", arquivo: "colecoes/dramas-da-natureza.html", capa: "imagens/galeria/dramas-da-natureza/inseto-10.webp" },
    { nome: "Cyberchoque", arquivo: "colecoes/cyberchoque.html", capa: "imagens/galeria/cyberchoque/cyber-horror-4.webp" },
    { nome: "Arachnida", arquivo: "colecoes/arachnida.html", capa: "imagens/galeria/arachnida/aranha-13.webp" },
    { nome: "Floresta Noturna", arquivo: "colecoes/floresta-noturna.html", capa: "imagens/galeria/floresta-noturna/anfibio-1.webp" }
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
        btnAlternar.textContent = "[ ☰ Modo Lista ]";
      } else {
        btnAlternar.textContent = "[ ⠿ Modo Mosaico ]";
      }
    });

// 4.2. Lógica de clicar na foto no Mosaico para focar na Lista (com flag de bloqueio para o modal)
    const fotosGaleria = gradeGaleria.querySelectorAll(".item-foto");
    
    fotosGaleria.forEach(foto => {
      foto.addEventListener("click", (e) => {
        // Se ainda está no modo mosaico
        if (gradeGaleria.classList.contains("modo-mosaico")) {
          // Interrompe a propagação para que o evento da seção 8 (Lightbox) não seja disparado neste clique
          e.stopImmediatePropagation();

          // 1. Remove o modo mosaico
          gradeGaleria.classList.remove("modo-mosaico");
          
          // 2. Atualiza o texto do botão
          btnAlternar.textContent = "[ ⠿ Modo Mosaico ]";
          
          // 3. Rola suavemente até a foto
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
    // Transforma a lista de fotos em um Array para manipulação
    const fotosArray = Array.from(galeriaParaEmbaralhar.querySelectorAll('.item-foto'));
    
    // Algoritmo Fisher-Yates para embaralhar o Array de fotos
    for (let i = fotosArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fotosArray[i], fotosArray[j]] = [fotosArray[j], fotosArray[i]];
    }

    // Cria um container invisível em memória RAM (evita múltiplos reflows na tela)
    const fragmento = document.createDocumentFragment();

    fotosArray.forEach(foto => {
      const img = foto.querySelector('img');
      
      if (img) {
        // Aplica o carregamento preguiçoso e a decodificação assíncrona globalmente.
        // O navegador decide automaticamente quais fotos estão visíveis na viewport
        // do usuário e prioriza o carregamento delas nativamente.
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      }
      
      // Adiciona a foto reordenada no fragmento em memória
      fragmento.appendChild(foto);
    });

    // Limpa o container original e injeta a nova ordem em um único ciclo do navegador
    galeriaParaEmbaralhar.innerHTML = "";
    galeriaParaEmbaralhar.appendChild(fragmento);
  }

  // ==========================================================================
  // 6. PROTEÇÃO DO ACERVO (BLOQUEIO DE BOTÃO DIREITO NAS IMAGENS)
  // ==========================================================================
document.addEventListener("contextmenu", (e) => {
    // Se o clique com botão direito for em cima de uma foto do portfólio ou do modal lightbox, bloqueia
    if (
      e.target.classList.contains("foto-portfolio") || 
      e.target.classList.contains("foto-capa") ||
      e.target.classList.contains("img-modal-destaque") ||
      e.target.id === "img-modal-destaque"
    ) {
      e.preventDefault();
    }
  });

   // Previne também o evento de arrastar a imagem com o mouse/dedo
  document.addEventListener("dragstart", (e) => {
    if (
      e.target.classList.contains("foto-portfolio") || 
      e.target.classList.contains("foto-capa") ||
      e.target.classList.contains("img-modal-destaque") ||
      e.target.id === "img-modal-destaque"
    ) {
      e.preventDefault();
    }
  });

  // ==========================================================================
  // 7. LÓGICA DO TOGGLE DE SENSIBILIDADE (OCULTAR ARACNÍDEOS)
  // ==========================================================================
  const btnToggleAranhas = document.getElementById("btn-toggle-aranhas");
  const estadoSalvo = localStorage.getItem("ocultarAranhas") === "true";

  // Função para aplicar/remover o filtro de visibilidade
  function aplicarFiltroAranhas(ocultar) {
    if (ocultar) {
      document.body.classList.add("ocultar-aranhas");
      if (btnToggleAranhas) {
        btnToggleAranhas.classList.add("ativo");
        btnToggleAranhas.querySelector(".icone-check").textContent = "[✓]";
      }
    } else {
      document.body.classList.remove("ocultar-aranhas");
      if (btnToggleAranhas) {
        btnToggleAranhas.classList.remove("ativo");
        btnToggleAranhas.querySelector(".icone-check").textContent = "[ ]";
      }
    }
  }

  // Aplica a preferência assim que a página carrega
  aplicarFiltroAranhas(estadoSalvo);

  // Escuta o clique no botão do rodapé
  if (btnToggleAranhas) {
    btnToggleAranhas.addEventListener("click", () => {
      const estaOculto = document.body.classList.contains("ocultar-aranhas");
      const novoEstado = !estaOculto;
      
      // Salva no localStorage para lembrar a escolha entre as páginas
      localStorage.setItem("ocultarAranhas", novoEstado);
      aplicarFiltroAranhas(novoEstado);
    });
  }

  // ==========================================================================
  // 8. LÓGICA DO MODAL DE VISUALIZAÇÃO (LIGHTBOX)
  //
  // DESATIVADO, achei a aplicação redundante, talvez remova.
  // ==========================================================================
  const modal = document.getElementById("modal-lightbox");
  const imgModal = document.getElementById("img-modal-destaque");
  const tituloModal = document.getElementById("titulo-foto-modal");
  const btnFecharModal = document.getElementById("btn-fechar-modal");
  const btnAntModal = document.getElementById("btn-modal-anterior");
  const btnProxModal = document.getElementById("btn-modal-proxima");

  let fotosAtivas = [];
  let indiceFotoAtual = 0;

  if (modal && imgModal) {
    // Função para abrir o modal
    function abrirModal(index) {
      fotosAtivas = Array.from(document.querySelectorAll(".item-foto"))
        .filter(item => item.style.display !== "none") // Considera apenas fotos visíveis no filtro ativo
        .map(item => item.querySelector("img"));

      if (fotosAtivas.length === 0) return;

      indiceFotoAtual = index;
      atualizarConteudoModal();
      modal.classList.add("ativo");
      document.body.style.overflow = "hidden"; // Desativa scroll da página de fundo
    }

    // Função para fechar o modal
    function fecharModal() {
      modal.classList.remove("ativo");
      document.body.style.overflow = ""; // Reativa scroll da página
    }

    // Atualiza imagem e título no modal
    function atualizarConteudoModal() {
      const imgTarget = fotosAtivas[indiceFotoAtual];
      if (imgTarget) {
        imgModal.src = imgTarget.src;
        tituloModal.textContent = imgTarget.alt || "Sem título";
      }
    }

    // Navegação entre imagens
    function fotoAnterior() {
      indiceFotoAtual = (indiceFotoAtual - 1 + fotosAtivas.length) % fotosAtivas.length;
      atualizarConteudoModal();
    }

    function proximaFoto() {
      indiceFotoAtual = (indiceFotoAtual + 1) % fotosAtivas.length;
      atualizarConteudoModal();
    }

    // Evento de clique: Só abre o Lightbox se a galeria NÃO estiver no modo mosaico
    
    // DESATIVADO TEMPORARIAMENTE
    
    /* document.addEventListener("click", (e) => {
      const itemFoto = e.target.closest(".item-foto");
      const grade = document.getElementById("grade-galeria");

      if (itemFoto && grade && !grade.classList.contains("modo-mosaico")) {
        const fotoClicada = itemFoto.querySelector("img");
        
        fotosAtivas = Array.from(document.querySelectorAll(".item-foto"))
          .filter(item => item.style.display !== "none")
          .map(item => item.querySelector("img"));

        const idx = fotosAtivas.indexOf(fotoClicada);
        if (idx !== -1) abrirModal(idx);
      }
    }); */

    // Controles de botões do modal
    if (btnFecharModal) btnFecharModal.addEventListener("click", fecharModal);
    if (btnAntModal) btnAntModal.addEventListener("click", fotoAnterior);
    if (btnProxModal) btnProxModal.addEventListener("click", proximaFoto);

    // Fechar ao clicar fora da imagem
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("container-midia-modal")) {
        fecharModal();
      }
    });

    // Navegação por teclado (ESC, Seta Esquerda, Seta Direita)
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("ativo")) return;

      if (e.key === "Escape") fecharModal();
      if (e.key === "ArrowLeft") fotoAnterior();
      if (e.key === "ArrowRight") proximaFoto();
    });
  }
  // lógica da navegação por gestos de deslize (swipe) no modal

    let touchstartX = 0;
    let touchendX = 0;
    const limiteMinimoSwipe = 50; // Distância mínima em pixels para considerar um gesto de deslize

    modal.addEventListener("touchstart", (e) => {
      // Registra a posição horizontal inicial do toque
      touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener("touchend", (e) => {
      // Registra a posição horizontal final ao soltar o dedo
      touchendX = e.changedTouches[0].screenX;
      tratarGestoSwipe();
    }, { passive: true });

    function tratarGestoSwipe() {
      const diferencaX = touchendX - touchstartX;

      // Se moveu o dedo para a esquerda além do limite -> próxima foto
      if (diferencaX < -limiteMinimoSwipe) {
        proximaFoto();
      }
      
      // Se moveu o dedo para a direita além do limite -> foto anterior
      if (diferencaX > limiteMinimoSwipe) {
        fotoAnterior();
      }
    }
});