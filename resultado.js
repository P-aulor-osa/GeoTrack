// Pega os parâmetros enviados pela URL. Exemplo: resultado.html?cep=88500000&cidade=Lages

const parametros = new URLSearchParams(window.location.search);

// Pega o CEP da URL, se não existir, usa uma string vazia

const cep = parametros.get("cep") || "";

// Pega a cidade da URL

const cidadeInformada = parametros.get("cidade") || "";

// Pega os elementos HTML onde os resultados serão exibidos

const resultado = document.getElementById("resultado");
const linkMaps = document.getElementById("linkMaps");

// Função usada para deixar textos em um formato padronizado

function normalizar(texto) {

// Remove acentos, transforma em letras minúsculas, e remove espaços extras

    return texto.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim().replace(/\s+/g, " ");
}

// Função responsável por criar uma linha de informação dentro da área de resultados

function mostrarCampo(rotulo, valor) {

// Cria elementos <p> e <strong>, e rotula de acordo com os dados inseridos

    const linha = document.createElement("p");
    const titulo = document.createElement("strong");
    titulo.textContent = `${rotulo}: `;
    linha.append(titulo, valor || "Não informado");

// Adiciona a linha criada à área de resultados

    resultado.append(linha);
}

// Função assíncrona que consulta o CEP na API ViaCEP

async function consultarEndereco() {

// Esconde o link do Google Maps enquanto a consulta acontece

    linkMaps.hidden = true;

 // Verifica se o CEP tem 8 números e se a cidade foi informada

    if (!/^\d{8}$/.test(cep) || !cidadeInformada.trim()) {

        resultado.classList.add("erroDados")

        resultado.textContent =
            "Dados inválidos. Volte e informe CEP e cidade.";
        return;
    }
    resultado.textContent = "Consultando endereço...";
    const controle = new AbortController();
    const limite = setTimeout(() => controle.abort(), 10000);
    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            { signal: controle.signal }
        );
        if (!resposta.ok) {
            throw new Error("Falha HTTP");
        }
        const dados = await resposta.json();
        if (dados.erro) {

            resultado.classList.add("erroCEP")

            resultado.textContent = "CEP não encontrado.";
            return;
        }
        if (!dados.localidade || !dados.cep) {
            throw new Error("Resposta incompleta");
        }
        if (normalizar(cidadeInformada) !==
            normalizar(dados.localidade)) {
            
            resultado.classList.add("erroInser");

            resultado.textContent =
                `Este CEP pertence a ${dados.localidade}/${dados.uf}, ` +
                `e não a ${cidadeInformada}. Faça uma nova consulta.`;
            return;
        }
        resultado.replaceChildren();
        const campos = [
            ["CEP", dados.cep],
            ["Logradouro", dados.logradouro],
            ["Complemento", dados.complemento],
            ["Bairro", dados.bairro],
            ["Cidade", dados.localidade],
            ["Estado", dados.estado],
            ["UF", dados.uf]
        ];
        campos.forEach(([rotulo, valor]) => {
            mostrarCampo(rotulo, valor);
        });
        const endereco = [
            dados.logradouro, dados.complemento, dados.bairro,
            dados.localidade, dados.estado, dados.uf, dados.cep
        ].filter(Boolean).join(", ");
        mostrarCampo("Endereço completo disponível", endereco);
        const busca = encodeURIComponent(`${endereco}, Brasil`);
        linkMaps.href =
            `https://www.google.com/maps/search/?api=1&query=${busca}`;
        linkMaps.hidden = false;
    } catch (erro) {
        resultado.textContent = erro.name === "AbortError"
            ? "A consulta demorou demais. Tente novamente."
            : "Não foi possível consultar. Verifique a conexão " +
            "e tente novamente.";
    } finally {
        clearTimeout(limite);
    }
}
consultarEndereco();