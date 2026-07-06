document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".btn-filtro");
  const fotos = document.querySelectorAll(".item-foto");

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      // 1. Remove a classe ativo de todos os botões e coloca no clicado
      botoes.forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      // 2. Pega a categoria do botão clicado
      const filtro = botao.getAttribute("data-filter");

      // 3. Mostra ou esconde as fotos baseado na categoria
      fotos.forEach(foto => {
        const categoriaFoto = foto.getAttribute("data-category");

        // CORRIGIDO: mudado 'filter' para 'filtro'
        if (filtro === "todos" || categoriaFoto === filtro) {
          foto.style.display = "flex"; // Mostra a foto
        } else {
          foto.style.display = "none";  // Esconde a foto
        }
      });
    });
  });
});