// Pega o formulário e a área onde as mensagens de erro serão exibidas

const form = document.getElementById("formConsulta");
const mensagem = document.getElementById("mensagem");

// Executa esta função quando o formulário for enviado

form.addEventListener("submit", (event) => {

// Impede o formulário de recarregar a página

    event.preventDefault();
    
 // Pega o CEP digitado, remove espaços extras

    const entrada = document.getElementById("cep").value.trim();

   // Pega a cidade digitada
    // Remove espaços do começo/fim e transforma vários espaços em apenas um

    const cidade = document.getElementById("cidade")
    .value.trim()
    .replace(/\s+/g, " ");

 // Limpa qualquer mensagem anterior
    
    mensagem.textContent = "";
    
// Verifica se o CEP possui exatamente 8 números, permitindo também o formato 00000-000


  // Mostra uma mensagem de erro quando o CEP é digitado incorretamente

    if (!/^\d{5}-?\d{3}$/.test(entrada)) {
        mensagem.textContent = "Informe um CEP com 8 números.";
        return;

// Verifica se o campo da cidade está vazio
    }
    if (!cidade) {
        mensagem.textContent = "Informe a cidade.";
        return;
    }
   
  // Remove o "-" do CEP, caso o usuário tenha digitado no formato 00000-000

    const cep = entrada.replace("-", "");

// Cria os parâmetros que serão enviados para a próxima página. Exemplo: ?cep=88500000&cidade=Lages

    const parametros = new URLSearchParams({cep, cidade})
    .toString();

// Redireciona o usuário para resultado.html, levando o CEP e a cidade pela URL

    window.location.href = `resultado.html?${parametros}`;
});
