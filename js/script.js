document.addEventListener("DOMContentLoaded", () => {

  // Força o navegador a NÃO restaurar a posição do scroll ao recarregar a página
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

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
  const gradeGaleriaFiltro = document.getElementById("grade-galeria");

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
        
        if (gradeGaleriaFiltro) {
          const alturaCabecalho = 140; 
          
          const posicaoTopo = gradeGaleriaFiltro.getBoundingClientRect().top + window.scrollY - alturaCabecalho;

          window.scrollTo({
            top: posicaoTopo,
            behavior: "smooth"
          });
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

    /*
// 4.2. Lógica de clicar na foto no Mosaico para focar na Lista (com flag de bloqueio para o modal)
    const fotosGaleria = gradeGaleria.querySelectorAll(".item-foto");

    fotosGaleria.forEach(foto => {
      foto.addEventListener("click", (e) => {
        if (gradeGaleria.classList.contains("modo-mosaico")) {
          // Alterna o modo sem bloquear a propagação de touch do celular
          gradeGaleria.classList.remove("modo-mosaico");
          if (btnAlternar) btnAlternar.textContent = "[ ⠿ Modo Mosaico ]";
          
          foto.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      });
    }); */
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

  // Lógica do botão de reorganização da trilha (recarrega a página para reembaralhar)

  const btnReorganizar = document.getElementById("btn-reorganizar-trilha");

  if (btnReorganizar) {
    btnReorganizar.addEventListener("click", () => {
      // 1. Rola suavemente até ao topo instantaneamente antes de recarregar
      window.scrollTo(0, 0);

      // 2. Dispara o recarregamento nativo da página
      // Ao recarregar, o algoritmo de aleatorização (Fisher-Yates) reordenará as imagens
      window.location.reload();
    });
  }

  // ==========================================================================
  // 6. PROTEÇÃO DO ACERVO (BLOQUEIO DE BOTÃO DIREITO NAS IMAGENS)
  // ==========================================================================
 /* document.addEventListener("contextmenu", (e) => {
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
  }); */

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
  
  // Lógica para o botão de texto na apresentação da Home ("é só clicar aqui")
  const btnFiltroTopo = document.getElementById("btn-filtro-aracnideos-topo");
  
  if (btnFiltroTopo) {
    btnFiltroTopo.addEventListener("click", () => {
      if (btnToggleAranhas) {
        // Dispara o clique no botão original do rodapé, reaproveitando toda a lógica de salvar no localStorage e trocar classes
        btnToggleAranhas.click();
      }
    });
  }

  // ==========================================================================
  // 8. LÓGICA DO MODAL DE VISUALIZAÇÃO (LIGHTBOX)
  // ==========================================================================
  const modal = document.getElementById("modal-lightbox");
  const imgModal = document.getElementById("img-modal-destaque");
  const statusLojaModal = document.getElementById("status-loja-modal");
  const subtituloModal = document.getElementById("subtitulo-modal");
  const btnWspModal = document.getElementById("btn-wsp-modal");
  const btnEmailModal = document.getElementById("btn-email-modal");
  const btnFecharModal = document.getElementById("btn-fechar-modal");
  const btnAntModal = document.getElementById("btn-modal-anterior");
  const btnProxModal = document.getElementById("btn-modal-proxima");

  // SEUS DADOS DE CONTATO
  const numeroWhatsapp = "5521964304299"; 
  const emailContato = "contato@trevastropicais.art.br"; 

  let fotosAtivas = [];
  let indiceFotoAtual = 0;

  // Variáveis para controle de gestos (Swipe)
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  const limiteSwipe = 40;

  if (modal && imgModal) {
    function abrirModal(index) {
      fotosAtivas = Array.from(document.querySelectorAll(".item-foto"))
        .filter(item => item.style.display !== "none")
        .map(item => item.querySelector("img"));

      if (fotosAtivas.length === 0) return;

      indiceFotoAtual = index;
      atualizarConteudoModal();
      modal.classList.add("ativo");
      document.body.style.overflow = "hidden";
    }

    function fecharModal() {
      modal.classList.remove("ativo");
      document.body.style.overflow = "";
    }

    function obterNomeArquivo(src) {
      if (!src) return "";
      return src.split("/").pop();
    }

    function atualizarConteudoModal() {
      const imgTarget = fotosAtivas[indiceFotoAtual];
      if (imgTarget) {
        imgModal.src = imgTarget.src;
        imgModal.alt = imgTarget.alt || "Fotografia";

        const nomeArquivo = obterNomeArquivo(imgTarget.src);
        const linkLoja = imgTarget.getAttribute("data-loja");

        if (linkLoja) {
          if (statusLojaModal) statusLojaModal.textContent = "Essa foto já está disponível para compra!";
          if (subtituloModal) subtituloModal.textContent = "";
          if (btnWspModal) {
            btnWspModal.textContent = "[ 🛒 Visitar a Loja ]";
            btnWspModal.href = linkLoja;
            btnWspModal.target = "_blank";
          }
          if (btnEmailModal) btnEmailModal.style.display = "none";
        } else {
          if (btnEmailModal) btnEmailModal.style.display = "inline-block";

          if (statusLojaModal) statusLojaModal.textContent = "Essa foto ainda não está disponível na loja, mas posso disponibilizá-la para você rapidinho!";
          if (subtituloModal) subtituloModal.textContent = "Entre em contato:";

          if (btnWspModal) {
            btnWspModal.textContent = "[ 💬 WhatsApp ]";
            const msgWsp = encodeURIComponent(`Olá! Gostaria de encomendar essa foto: ${nomeArquivo}`);
            btnWspModal.href = `https://wa.me/${numeroWhatsapp}?text=${msgWsp}`;
            btnWspModal.target = "_blank";
          }

          if (btnEmailModal) {
            btnEmailModal.textContent = "[ ✉️ E-mail ]";
            const assuntoEmail = encodeURIComponent(`Encomenda da foto ${nomeArquivo}`);
            const corpoEmail = encodeURIComponent(`Olá!\n\nGostaria de obter informações e encomendar essa foto: ${nomeArquivo}\n\nObrigado!`);
            btnEmailModal.href = `mailto:${emailContato}?subject=${assuntoEmail}&body=${corpoEmail}`;
            btnEmailModal.target = "_self";
          }
        }
      }
    }

    function fotoAnterior() {
      indiceFotoAtual = (indiceFotoAtual - 1 + fotosAtivas.length) % fotosAtivas.length;
      atualizarConteudoModal();
    }

    function proximaFoto() {
      indiceFotoAtual = (indiceFotoAtual + 1) % fotosAtivas.length;
      atualizarConteudoModal();
    }

    // Adicionar escutadores de eventos para os botões do modal
    if (btnFecharModal) {
      btnFecharModal.addEventListener("click", fecharModal);
    }

    if (btnAntModal) {
      btnAntModal.addEventListener("click", (e) => {
        e.stopPropagation();
        fotoAnterior();
      });
    }

    if (btnProxModal) {
      btnProxModal.addEventListener("click", (e) => {
        e.stopPropagation();
        proximaFoto();
      });
    }

    // Fechar ao clicar no fundo escuro fora da imagem
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("container-midia-modal")) {
        fecharModal();
      }
    });

    // Clique unificado para desktop e mobile
    document.addEventListener("click", (e) => {
      // Localiza se o clique/toque foi em algum item da galeria
      const itemFoto = e.target.closest(".item-foto");
      if (!itemFoto) return;

      const grade = document.getElementById("grade-galeria");

      // REGRA 1: Se estiver em MODO MOSAICO
      // O clique APENAS sai do mosaico, foca a imagem em lista e NÃO abre o modal.
      if (grade && grade.classList.contains("modo-mosaico")) {
        grade.classList.remove("modo-mosaico");
        if (btnAlternar) btnAlternar.textContent = "[ ⠿ Modo Mosaico ]";
        
        itemFoto.scrollIntoView({ behavior: "smooth", block: "center" });
        return; // Interrompe para não abrir o Lightbox
      }

      // REGRA 2: Se estiver em MODO LISTA (ou mobile em fluxo padrão)
      // O clique ABRE o Modal Lightbox.
      const fotoClicada = itemFoto.querySelector("img");
      
      // Mapeia apenas as fotos visíveis no momento (respeitando filtros)
      fotosAtivas = Array.from(document.querySelectorAll(".item-foto"))
        .filter(item => {
          const style = window.getComputedStyle(item);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map(item => item.querySelector("img"));

      const idx = fotosAtivas.indexOf(fotoClicada);
      if (idx !== -1) {
        abrirModal(idx);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("ativo")) return;

      if (e.key === "Escape") fecharModal();
      if (e.key === "ArrowLeft") fotoAnterior();
      if (e.key === "ArrowRight") proximaFoto();
    });

    // Gestos Touch (Swipe no Mobile)
    modal.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    modal.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      tratarGestoSwipe();
    }, { passive: true });

    function tratarGestoSwipe() {
      const difX = touchStartX - touchEndX;
      const difY = touchStartY - touchEndY;

      // Garante que o gesto foi horizontal (scroll para o lado) e não um scroll vertical
      if (Math.abs(difX) > Math.abs(difY) && Math.abs(difX) > limiteSwipe) {
        if (difX > 0) {
          proximaFoto();
        } else {
          fotoAnterior();
        }
      }
    }
  }
  
// ==========================================================================
  // 9. EFEITO DE AUMENTO NO TÍTULO "TREVAS TROPICAIS" AO ROLAR A PÁGINA
  // ==========================================================================
  const destaqueCinzel = document.querySelector('.destaque-cinzel');

  if (destaqueCinzel) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        destaqueCinzel.classList.add('expandido');
      } else {
        destaqueCinzel.classList.remove('expandido');
      }
    });
  }  
});