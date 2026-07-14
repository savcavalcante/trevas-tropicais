const fs = require('fs');
const path = require('path');

// ==========================================================================
// CONFIGURAÇÃO DA COLEÇÃO ATUAL
// ==========================================================================
const nomeColecao = 'pets'; // mude para 'artropodes', 'aves', etc.

// ==========================================================================
// CONFIGURAÇÕES DO SCRIPT (Sem dicionários, automático pelo nome do arquivo)
// ==========================================================================
const pastaImagens = path.join(__dirname, 'imagens', 'galeria', nomeColecao);
const arquivoSaida = path.join(__dirname, `html-${nomeColecao}.txt`);
const extensoesValidas = ['.webp', '.jpg', '.jpeg', '.png'];

fs.readdir(pastaImagens, (err, arquivos) => {
  if (err) {
    console.error(`\n❌ Erro ao ler a pasta: ${pastaImagens}.\nVerifique se a pasta existe e se o nome em 'nomeColecao' está correto!`, err);
    return;
  }

  // Filtra apenas imagens válidas
  const imagens = arquivos.filter(arquivo => 
    extensoesValidas.includes(path.extname(arquivo).toLowerCase())
  );

  let htmlGerado = `<!-- INÍCIO DOS ITENS DE ${nomeColecao.toUpperCase()} -->\n`;

  imagens.forEach(imagem => {
    const nomeSemExtensao = path.parse(imagem).name.toLowerCase(); // Ex: "gatos-01" ou "aves-rapina-15"
    
    // Divide o nome pelos hifens
    const partes = nomeSemExtensao.split('-');
    
    let categoria = '';
    
    if (partes.length > 1) {
      // Pega tudo antes do último elemento (que é o número sequencial) e junta com hífen novamente
      // Ex: "aves-rapina-15" vira "aves-rapina"
      categoria = partes.slice(0, -1).join('-');
    } else {
      // Caso o arquivo não tenha hífen (ex: "gato.webp"), usa o nome inteiro como categoria
      categoria = nomeSemExtensao;
    }

    // Cria o bloco HTML limpo
    htmlGerado += `
<div class="item-foto" data-category="${categoria}">
  <img src="../imagens/galeria/${nomeColecao}/${imagem}" 
       alt="Fotografia da coleção ${nomeColecao} - Categoria ${categoria}" 
       class="foto-portfolio" 
       loading="lazy">
</div>\n`;
  });

  htmlGerado += `<!-- FIM DOS ITENS DE ${nomeColecao.toUpperCase()} -->`;

  fs.writeFile(arquivoSaida, htmlGerado, (err) => {
    if (err) {
      console.error('❌ Erro ao salvar o arquivo de texto:', err);
    } else {
      console.log(`\n🎉 Sucesso! HTML gerado para ${imagens.length} fotos da coleção "${nomeColecao}".`);
      console.log(`📂 O arquivo pronto está em: html-${nomeColecao}.txt\n`);
    }
  });
});