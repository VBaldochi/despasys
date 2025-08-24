(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/brasilapi/cep.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Serviços de integração com CEP da BrasilAPI
// Útil para validação de endereços e auto-preenchimento
__turbopack_context__.s({
    "cepService": ()=>cepService,
    "cepUtils": ()=>cepUtils,
    "useCep": ()=>useCep
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class CepService {
    /**
   * Busca endereço por CEP (versão 1)
   */ async buscarCep(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            throw new Error('CEP deve ter 8 dígitos');
        }
        try {
            const response = await fetch("/api/cep?cep=".concat(cepLimpo));
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar CEP');
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error('CEP não encontrado');
            }
            return data.endereco;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            throw error;
        }
    }
    /**
   * Busca endereço por CEP com geolocalização (versão 2)
   */ async buscarCepV2(cep) {
        const cepLimpo = this.limparCep(cep);
        if (!this.validarCep(cepLimpo)) {
            throw new Error('CEP inválido. Use o formato 12345678 ou 12345-678');
        }
        try {
            const response = await fetch("".concat(this.baseUrl, "/v2/").concat(cepLimpo));
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('CEP não encontrado');
                }
                throw new Error("Erro ao buscar CEP: ".concat(response.statusText));
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na consulta de CEP V2:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Falha ao consultar CEP');
        }
    }
    /**
   * Remove formatação do CEP
   */ limparCep(cep) {
        return cep.replace(/\D/g, '');
    }
    /**
   * Valida formato do CEP
   */ validarCep(cep) {
        const cepLimpo = this.limparCep(cep);
        return /^\d{8}$/.test(cepLimpo);
    }
    /**
   * Formata CEP para exibição
   */ formatarCep(cep) {
        const cepLimpo = this.limparCep(cep);
        if (!this.validarCep(cepLimpo)) return cep;
        return "".concat(cepLimpo.slice(0, 5), "-").concat(cepLimpo.slice(5));
    }
    /**
   * Monta endereço completo para exibição
   */ montarEnderecoCompleto(endereco) {
        const partes = [
            endereco.street,
            endereco.neighborhood,
            endereco.city,
            endereco.state
        ].filter(Boolean);
        return partes.join(', ');
    }
    /**
   * Verifica se o endereço tem coordenadas (apenas V2)
   */ temCoordenadas(endereco) {
        var _endereco_location_coordinates, _endereco_location, _endereco_location_coordinates1, _endereco_location1;
        return !!(((_endereco_location = endereco.location) === null || _endereco_location === void 0 ? void 0 : (_endereco_location_coordinates = _endereco_location.coordinates) === null || _endereco_location_coordinates === void 0 ? void 0 : _endereco_location_coordinates.latitude) && ((_endereco_location1 = endereco.location) === null || _endereco_location1 === void 0 ? void 0 : (_endereco_location_coordinates1 = _endereco_location1.coordinates) === null || _endereco_location_coordinates1 === void 0 ? void 0 : _endereco_location_coordinates1.longitude));
    }
    /**
   * Converte coordenadas para números
   */ obterCoordenadas(endereco) {
        if (!this.temCoordenadas(endereco)) return null;
        const lat = parseFloat(endereco.location.coordinates.latitude || '0');
        const lng = parseFloat(endereco.location.coordinates.longitude || '0');
        if (isNaN(lat) || isNaN(lng)) return null;
        return {
            lat,
            lng
        };
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "baseUrl", 'https://brasilapi.com.br/api/cep');
    }
}
const cepService = new CepService();
function useCep() {
    return {
        buscarCep: cepService.buscarCep.bind(cepService),
        buscarCepV2: cepService.buscarCepV2.bind(cepService),
        validarCep: cepService.validarCep.bind(cepService),
        formatarCep: cepService.formatarCep.bind(cepService),
        montarEnderecoCompleto: cepService.montarEnderecoCompleto.bind(cepService),
        temCoordenadas: cepService.temCoordenadas.bind(cepService),
        obterCoordenadas: cepService.obterCoordenadas.bind(cepService)
    };
}
const cepUtils = {
    /**
   * Estados brasileiros com suas siglas
   */ estados: {
        'AC': 'Acre',
        'AL': 'Alagoas',
        'AP': 'Amapá',
        'AM': 'Amazonas',
        'BA': 'Bahia',
        'CE': 'Ceará',
        'DF': 'Distrito Federal',
        'ES': 'Espírito Santo',
        'GO': 'Goiás',
        'MA': 'Maranhão',
        'MT': 'Mato Grosso',
        'MS': 'Mato Grosso do Sul',
        'MG': 'Minas Gerais',
        'PA': 'Pará',
        'PB': 'Paraíba',
        'PR': 'Paraná',
        'PE': 'Pernambuco',
        'PI': 'Piauí',
        'RJ': 'Rio de Janeiro',
        'RN': 'Rio Grande do Norte',
        'RS': 'Rio Grande do Sul',
        'RO': 'Rondônia',
        'RR': 'Roraima',
        'SC': 'Santa Catarina',
        'SP': 'São Paulo',
        'SE': 'Sergipe',
        'TO': 'Tocantins'
    },
    /**
   * Obter nome completo do estado
   */ nomeCompleto (sigla) {
        return this.estados[sigla] || sigla;
    },
    /**
   * Calcular distância aproximada entre dois pontos (fórmula de Haversine)
   */ calcularDistancia (coord1, coord2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.toRad(coord2.lat - coord1.lat);
        const dLng = this.toRad(coord2.lng - coord1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distância em km
    },
    /**
   * Converter graus para radianos
   */ toRad (valor) {
        return valor * (Math.PI / 180);
    },
    /**
   * Gerar URL do Google Maps
   */ gerarUrlMaps (endereco) {
        const enderecoCompleto = cepService.montarEnderecoCompleto(endereco);
        return "https://www.google.com/maps/search/?api=1&query=".concat(encodeURIComponent(enderecoCompleto));
    },
    /**
   * Verificar se CEP é de determinado estado
   */ verificarEstado (cep, siglaEstado) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (!cepService.validarCep(cepLimpo)) return false;
        // Faixas aproximadas de CEP por estado (simplificado)
        const faixasCep = {
            'SP': [
                '01000',
                '20000'
            ],
            'RJ': [
                '20000',
                '29000'
            ],
            'MG': [
                '30000',
                '40000'
            ],
            'BA': [
                '40000',
                '49000'
            ],
            'RS': [
                '90000',
                '100000'
            ]
        };
        const faixa = faixasCep[siglaEstado];
        if (!faixa) return false;
        const cepNum = parseInt(cepLimpo.slice(0, 5));
        const min = parseInt(faixa[0]);
        const max = parseInt(faixa[1]);
        return cepNum >= min && cepNum < max;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/brasilapi/cnpj.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Serviços de integração com CNPJ da BrasilAPI
// Útil para validação de dados empresariais e busca de informações
__turbopack_context__.s({
    "cnpjService": ()=>cnpjService,
    "default": ()=>__TURBOPACK__default__export__
});
class CnpjService {
    /**
   * Busca dados completos da empresa por CNPJ
   */ async buscarEmpresa(cnpj) {
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        if (cnpjLimpo.length !== 14) {
            throw new Error('CNPJ deve ter 14 dígitos');
        }
        try {
            const response = await fetch("/api/cnpj?cnpj=".concat(cnpjLimpo));
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar CNPJ');
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error('CNPJ não encontrado');
            }
            return data.empresa;
        } catch (error) {
            console.error('Erro ao buscar CNPJ:', error);
            throw error;
        }
    }
    /**
   * Valida CNPJ usando algoritmo oficial
   */ validarCnpj(cnpj) {
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        if (cnpjLimpo.length !== 14) return false;
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
        // Calcula primeiro dígito verificador
        let soma = 0;
        let peso = 5;
        for(let i = 0; i < 12; i++){
            soma += parseInt(cnpjLimpo[i]) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }
        let digito1 = soma % 11;
        digito1 = digito1 < 2 ? 0 : 11 - digito1;
        if (parseInt(cnpjLimpo[12]) !== digito1) return false;
        // Calcula segundo dígito verificador
        soma = 0;
        peso = 6;
        for(let i = 0; i < 13; i++){
            soma += parseInt(cnpjLimpo[i]) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }
        let digito2 = soma % 11;
        digito2 = digito2 < 2 ? 0 : 11 - digito2;
        return parseInt(cnpjLimpo[13]) === digito2;
    }
    /**
   * Formata CNPJ para exibição
   */ formatarCnpj(cnpj) {
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        if (cnpjLimpo.length !== 14) return cnpj;
        return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
}
const cnpjService = new CnpjService();
const __TURBOPACK__default__export__ = cnpjService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/brasilapi/cpf.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Serviços de validação e formatação de CPF
// Essencial para validação de dados de clientes
__turbopack_context__.s({
    "cpfService": ()=>cpfService,
    "cpfUtils": ()=>cpfUtils,
    "useCpf": ()=>useCpf
});
class CpfService {
    /**
   * Valida CPF usando algoritmo oficial
   */ validar(cpf) {
        const cpfLimpo = this.limparCpf(cpf);
        // Validações básicas
        if (!cpfLimpo) {
            return {
                valido: false,
                formatado: '',
                limpo: '',
                erro: 'CPF não informado'
            };
        }
        if (cpfLimpo.length !== 11) {
            return {
                valido: false,
                formatado: cpf,
                limpo: cpfLimpo,
                erro: 'CPF deve ter 11 dígitos'
            };
        }
        // Verifica se todos os dígitos são iguais
        if (this.todosDigitosIguais(cpfLimpo)) {
            return {
                valido: false,
                formatado: this.formatarCpf(cpfLimpo),
                limpo: cpfLimpo,
                erro: 'CPF inválido: todos os dígitos são iguais'
            };
        }
        // Validação dos dígitos verificadores
        const valido = this.calcularDigitoVerificador(cpfLimpo);
        return {
            valido,
            formatado: this.formatarCpf(cpfLimpo),
            limpo: cpfLimpo,
            erro: valido ? undefined : 'CPF inválido: dígitos verificadores incorretos'
        };
    }
    /**
   * Formata CPF para exibição (000.000.000-00)
   */ formatarCpf(cpf) {
        const cpfLimpo = this.limparCpf(cpf);
        if (cpfLimpo.length !== 11) {
            return cpf; // Retorna como recebido se inválido
        }
        return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    /**
   * Remove formatação do CPF
   */ limparCpf(cpf) {
        return cpf.replace(/\D/g, '');
    }
    /**
   * Gera CPF válido para testes (NUNCA usar em produção real)
   */ gerarCpfTeste() {
        // Gera os 9 primeiros dígitos
        const primeiros9 = Array.from({
            length: 9
        }, ()=>Math.floor(Math.random() * 10));
        // Calcula os dígitos verificadores
        const cpfParcial = primeiros9.join('');
        const digito1 = this.calcularPrimeiroDigito(cpfParcial);
        const digito2 = this.calcularSegundoDigito(cpfParcial + digito1);
        const cpfCompleto = cpfParcial + digito1 + digito2;
        return this.formatarCpf(cpfCompleto);
    }
    /**
   * Obtém informações detalhadas do CPF
   */ obterInfo(cpf) {
        const validacao = this.validar(cpf);
        const cpfLimpo = validacao.limpo;
        if (!validacao.valido) {
            return {
                cpf: validacao.formatado,
                valido: false,
                formatado: validacao.formatado,
                digito1: 0,
                digito2: 0
            };
        }
        // Determina estado baseado no 9º dígito (região fiscal)
        const estadoInfo = this.obterEstadoPorDigito(parseInt(cpfLimpo[8]));
        return {
            cpf: cpfLimpo,
            valido: true,
            formatado: validacao.formatado,
            estado: estadoInfo.estado,
            regiao: estadoInfo.regiao,
            digito1: parseInt(cpfLimpo[9]),
            digito2: parseInt(cpfLimpo[10])
        };
    }
    /**
   * Verifica se todos os dígitos são iguais
   */ todosDigitosIguais(cpf) {
        return cpf.split('').every((digito)=>digito === cpf[0]);
    }
    /**
   * Calcula e verifica os dígitos verificadores
   */ calcularDigitoVerificador(cpf) {
        const primeiros9 = cpf.substring(0, 9);
        const digito1Calculado = this.calcularPrimeiroDigito(primeiros9);
        const digito2Calculado = this.calcularSegundoDigito(primeiros9 + digito1Calculado);
        const digito1Informado = parseInt(cpf[9]);
        const digito2Informado = parseInt(cpf[10]);
        return digito1Calculado === digito1Informado && digito2Calculado === digito2Informado;
    }
    /**
   * Calcula o primeiro dígito verificador
   */ calcularPrimeiroDigito(primeiros9) {
        let soma = 0;
        for(let i = 0; i < 9; i++){
            soma += parseInt(primeiros9[i]) * (10 - i);
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
    /**
   * Calcula o segundo dígito verificador
   */ calcularSegundoDigito(primeiros10) {
        let soma = 0;
        for(let i = 0; i < 10; i++){
            soma += parseInt(primeiros10[i]) * (11 - i);
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
    /**
   * Determina estado baseado no dígito da região fiscal
   */ obterEstadoPorDigito(digito) {
        const regioes = {
            0: {
                estado: 'RS',
                regiao: 'Rio Grande do Sul'
            },
            1: {
                estado: 'DF/GO/MS/TO',
                regiao: 'Distrito Federal, Goiás, Mato Grosso do Sul, Tocantins'
            },
            2: {
                estado: 'AC/AM/AP/PA/RO/RR',
                regiao: 'Acre, Amazonas, Amapá, Pará, Rondônia, Roraima'
            },
            3: {
                estado: 'CE/MA/PI',
                regiao: 'Ceará, Maranhão, Piauí'
            },
            4: {
                estado: 'AL/PB/PE/RN',
                regiao: 'Alagoas, Paraíba, Pernambuco, Rio Grande do Norte'
            },
            5: {
                estado: 'BA/SE',
                regiao: 'Bahia, Sergipe'
            },
            6: {
                estado: 'MG',
                regiao: 'Minas Gerais'
            },
            7: {
                estado: 'ES/RJ',
                regiao: 'Espírito Santo, Rio de Janeiro'
            },
            8: {
                estado: 'SP',
                regiao: 'São Paulo'
            },
            9: {
                estado: 'PR/SC',
                regiao: 'Paraná, Santa Catarina'
            }
        };
        return regioes[digito] || {
            estado: 'Desconhecido',
            regiao: 'Região não identificada'
        };
    }
    /**
   * Validação em tempo real para formulários
   */ validarEmTempoReal(cpf) {
        const cpfLimpo = this.limparCpf(cpf);
        if (!cpfLimpo) {
            return {
                status: 'vazio',
                mensagem: 'Digite o CPF',
                formatado: ''
            };
        }
        if (cpfLimpo.length < 11) {
            return {
                status: 'incompleto',
                mensagem: "".concat(cpfLimpo.length, "/11 dígitos"),
                formatado: this.formatarCpf(cpfLimpo)
            };
        }
        const validacao = this.validar(cpfLimpo);
        return {
            status: validacao.valido ? 'valido' : 'invalido',
            mensagem: validacao.valido ? 'CPF válido' : validacao.erro || 'CPF inválido',
            formatado: validacao.formatado
        };
    }
}
const cpfService = new CpfService();
function useCpf() {
    return {
        validar: cpfService.validar.bind(cpfService),
        formatarCpf: cpfService.formatarCpf.bind(cpfService),
        limparCpf: cpfService.limparCpf.bind(cpfService),
        obterInfo: cpfService.obterInfo.bind(cpfService),
        validarEmTempoReal: cpfService.validarEmTempoReal.bind(cpfService),
        gerarCpfTeste: cpfService.gerarCpfTeste.bind(cpfService)
    };
}
const cpfUtils = {
    /**
   * Máscara para input de CPF
   */ aplicarMascara (valor) {
        return cpfService.formatarCpf(valor);
    },
    /**
   * Validação rápida (apenas boolean)
   */ ehValido (cpf) {
        return cpfService.validar(cpf).valido;
    },
    /**
   * Lista de CPFs inválidos conhecidos
   */ cpfsInvalidosConhecidos: [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
        '12345678909',
        '11144477735'
    ],
    /**
   * Verifica se é um CPF de teste/inválido conhecido
   */ ehCpfTeste (cpf) {
        const cpfLimpo = cpfService.limparCpf(cpf);
        return this.cpfsInvalidosConhecidos.includes(cpfLimpo);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/brasilapi/fipe.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Serviços de integração com a API FIPE da BrasilAPI
// Essencial para consultoria veicular - consulta de preços de mercado
__turbopack_context__.s({
    "fipeService": ()=>fipeService,
    "fipeUtils": ()=>fipeUtils,
    "useFipe": ()=>useFipe
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class FipeService {
    /**
   * Busca todas as marcas por tipo de veículo
   */ async getMarcas(tipoVeiculo, tabelaReferencia) {
        try {
            const params = new URLSearchParams();
            if (tabelaReferencia) {
                params.append('tabela_referencia', tabelaReferencia.toString());
            }
            const url = "".concat(this.baseUrl, "/marcas/v1/").concat(tipoVeiculo).concat(params.toString() ? "?".concat(params) : '');
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Erro ao buscar marcas: ".concat(response.statusText));
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na consulta de marcas FIPE:', error);
            throw new Error('Falha ao consultar marcas na tabela FIPE');
        }
    }
    /**
   * Busca veículos por marca e tipo
   */ async getVeiculos(tipoVeiculo, codigoMarca, tabelaReferencia) {
        try {
            const params = new URLSearchParams();
            if (tabelaReferencia) {
                params.append('tabela_referencia', tabelaReferencia.toString());
            }
            const url = "".concat(this.baseUrl, "/veiculos/v1/").concat(tipoVeiculo, "/").concat(codigoMarca).concat(params.toString() ? "?".concat(params) : '');
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Erro ao buscar veículos: ".concat(response.statusText));
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na consulta de veículos FIPE:', error);
            throw new Error('Falha ao consultar veículos na tabela FIPE');
        }
    }
    /**
   * Consulta preço específico por código FIPE
   */ async getPreco(codigoFipe, tabelaReferencia) {
        try {
            const params = new URLSearchParams();
            if (tabelaReferencia) {
                params.append('tabela_referencia', tabelaReferencia.toString());
            }
            const url = "".concat(this.baseUrl, "/preco/v1/").concat(codigoFipe).concat(params.toString() ? "?".concat(params) : '');
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Erro ao buscar preço: ".concat(response.statusText));
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na consulta de preço FIPE:', error);
            throw new Error('Falha ao consultar preço na tabela FIPE');
        }
    }
    /**
   * Lista todas as tabelas de referência disponíveis
   */ async getTabelas() {
        try {
            const url = "".concat(this.baseUrl, "/tabelas/v1");
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Erro ao buscar tabelas: ".concat(response.statusText));
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na consulta de tabelas FIPE:', error);
            throw new Error('Falha ao consultar tabelas FIPE');
        }
    }
    /**
   * Busca completa: marca -> veículo -> preço
   * Útil para fluxos completos de consulta
   */ async getBuscaCompleta(tipoVeiculo, nomeMarca, nomeVeiculo) {
        try {
            // 1. Buscar marcas
            const marcas = await this.getMarcas(tipoVeiculo);
            const marca = marcas.find((m)=>m.nome.toLowerCase().includes(nomeMarca.toLowerCase()));
            if (!marca) {
                return {
                    marca: null,
                    veiculo: null,
                    preco: null
                };
            }
            // 2. Buscar veículos da marca
            const veiculos = await this.getVeiculos(tipoVeiculo, marca.codigo);
            const veiculo = veiculos.find((v)=>v.nome.toLowerCase().includes(nomeVeiculo.toLowerCase()));
            if (!veiculo) {
                return {
                    marca,
                    veiculo: null,
                    preco: null
                };
            }
            // 3. Buscar preço do veículo
            const preco = await this.getPreco(veiculo.codigoFipe);
            return {
                marca,
                veiculo,
                preco
            };
        } catch (error) {
            console.error('Erro na busca completa FIPE:', error);
            throw new Error('Falha na consulta completa FIPE');
        }
    }
    /**
   * Formata valor monetário da FIPE
   */ formatarValor(valor) {
        // Remove "R$ " e formata para número
        const numeroLimpo = valor.replace(/[^\d,]/g, '').replace(',', '.');
        const numero = parseFloat(numeroLimpo);
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(numero);
    }
    /**
   * Extrai apenas o valor numérico
   */ extrairValorNumerico(valor) {
        const numeroLimpo = valor.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(numeroLimpo) || 0;
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "baseUrl", 'https://brasilapi.com.br/api/fipe');
    }
}
const fipeService = new FipeService();
function useFipe() {
    return {
        getMarcas: fipeService.getMarcas.bind(fipeService),
        getVeiculos: fipeService.getVeiculos.bind(fipeService),
        getPreco: fipeService.getPreco.bind(fipeService),
        getTabelas: fipeService.getTabelas.bind(fipeService),
        getBuscaCompleta: fipeService.getBuscaCompleta.bind(fipeService),
        formatarValor: fipeService.formatarValor.bind(fipeService),
        extrairValorNumerico: fipeService.extrairValorNumerico.bind(fipeService)
    };
}
const fipeUtils = {
    /**
   * Converte tipo de veículo para exibição
   */ tipoVeiculoParaTexto (tipo) {
        const tipos = {
            carros: 'Automóveis',
            motos: 'Motocicletas',
            caminhoes: 'Caminhões'
        };
        return tipos[tipo];
    },
    /**
   * Valida código FIPE
   */ validarCodigoFipe (codigo) {
        // Código FIPE geralmente tem formato XXX-XXX-XX
        const regex = /^\d{3}-\d{3}-\d{2}$/;
        return regex.test(codigo);
    },
    /**
   * Calcula depreciação baseada no ano
   */ calcularDepreciacao (valorAtual, anoVeiculo) {
        const anoAtual = new Date().getFullYear();
        const idadeVeiculo = anoAtual - anoVeiculo;
        // Estimativa simples: 10% ao ano (pode ser ajustada)
        const percentualDepreciacao = Math.min(idadeVeiculo * 0.1, 0.8); // Max 80%
        const valorEstimado = valorAtual * (1 - percentualDepreciacao);
        return {
            valorEstimado: Math.round(valorEstimado),
            percentualDepreciacao: Math.round(percentualDepreciacao * 100)
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/brasilapi/index.ts [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Integração unificada com Brasil API - Todos os serviços essenciais
// Centraliza todos os serviços de dados brasileiros necessários para o sistema
__turbopack_context__.s({
    "brasilApi": ()=>brasilApi,
    "brasilApiUtils": ()=>brasilApiUtils,
    "useBrasilApi": ()=>useBrasilApi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cep$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cep.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cnpj$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cnpj.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cpf$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cpf.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/fipe.ts [app-client] (ecmascript)");
;
;
;
;
;
class BrasilApiService {
    /**
   * Validação unificada - detecta tipo automaticamente
   */ async validarDado(valor) {
        const valorLimpo = valor.replace(/\D/g, '');
        try {
            // Detecta tipo baseado no comprimento
            if (valorLimpo.length === 8) {
                // CEP
                try {
                    const resultado = await this.cep.buscarCep(valor);
                    return {
                        tipo: 'cep',
                        valido: true,
                        formatado: this.cep.formatarCep(valor),
                        dados: resultado
                    };
                } catch (error) {
                    return {
                        tipo: 'cep',
                        valido: false,
                        formatado: this.cep.formatarCep(valor),
                        erro: "Erro ao buscar CEP: ".concat(error instanceof Error ? error.message : 'Erro desconhecido')
                    };
                }
            } else if (valorLimpo.length === 11) {
                // CPF
                const resultado = this.cpf.validar(valor);
                return {
                    tipo: 'cpf',
                    valido: resultado.valido,
                    formatado: resultado.formatado,
                    dados: resultado.valido ? this.cpf.obterInfo(valor) : null,
                    erro: resultado.erro
                };
            } else if (valorLimpo.length === 14) {
                // CNPJ
                const valido = this.cnpj.validarCnpj(valor);
                const formatado = this.cnpj.formatarCnpj(valor);
                if (valido) {
                    try {
                        const empresa = await this.cnpj.buscarEmpresa(valor);
                        return {
                            tipo: 'cnpj',
                            valido: true,
                            formatado,
                            dados: empresa
                        };
                    } catch (error) {
                        return {
                            tipo: 'cnpj',
                            valido: false,
                            formatado,
                            erro: "Erro ao buscar dados da empresa: ".concat(error instanceof Error ? error.message : 'Erro desconhecido')
                        };
                    }
                } else {
                    return {
                        tipo: 'cnpj',
                        valido: false,
                        formatado,
                        erro: 'CNPJ inválido'
                    };
                }
            } else {
                return {
                    tipo: 'cep',
                    valido: false,
                    formatado: valor,
                    erro: 'Formato não reconhecido. Use CEP (8 dígitos), CPF (11 dígitos) ou CNPJ (14 dígitos)'
                };
            }
        } catch (error) {
            return {
                tipo: 'cep',
                valido: false,
                formatado: valor,
                erro: "Erro na validação: ".concat(error instanceof Error ? error.message : 'Erro desconhecido')
            };
        }
    }
    /**
   * Validação completa de dados do cliente
   */ async validarCliente(dados) {
        const resultado = {
            valido: true,
            erros: []
        };
        try {
            // Validar CPF se fornecido
            if (dados.cpf) {
                const cpfValidacao = this.cpf.validar(dados.cpf);
                if (cpfValidacao.valido) {
                    resultado.cpf = this.cpf.obterInfo(dados.cpf);
                } else {
                    resultado.erros.push("CPF: ".concat(cpfValidacao.erro));
                    resultado.valido = false;
                }
            }
            // Validar CNPJ se fornecido
            if (dados.cnpj) {
                const cnpjValido = this.cnpj.validarCnpj(dados.cnpj);
                if (cnpjValido) {
                    try {
                        const empresaInfo = await this.cnpj.buscarEmpresa(dados.cnpj);
                        resultado.cnpj = empresaInfo;
                    } catch (error) {
                        resultado.erros.push("CNPJ: Erro ao buscar dados da empresa");
                        resultado.valido = false;
                    }
                } else {
                    resultado.erros.push("CNPJ: CNPJ inválido");
                    resultado.valido = false;
                }
            }
            // Validar CEP se fornecido
            if (dados.cep) {
                try {
                    const cepInfo = await this.cep.buscarCep(dados.cep);
                    // Mapear CepResponse para EnderecoCep
                    const enderecoMapeado = {
                        cep: cepInfo.cep,
                        state: cepInfo.uf,
                        city: cepInfo.cidade,
                        neighborhood: cepInfo.bairro,
                        street: cepInfo.logradouro,
                        service: 'brasilapi'
                    };
                    resultado.endereco = enderecoMapeado;
                } catch (error) {
                    resultado.erros.push("CEP: Erro ao buscar endereço");
                    resultado.valido = false;
                }
            }
        } catch (error) {
            resultado.erros.push("Erro na validação: ".concat(error instanceof Error ? error.message : 'Erro desconhecido'));
            resultado.valido = false;
        }
        return resultado;
    }
    /**
   * Consulta completa de veículo
   */ async consultarVeiculo(tipoVeiculo, marca, modelo) {
        try {
            const resultado = await this.fipe.getBuscaCompleta(tipoVeiculo, marca, modelo);
            let valorFormatado;
            let valorNumerico;
            if (resultado.preco && resultado.preco.length > 0) {
                const primeiroPreco = resultado.preco[0];
                valorFormatado = this.fipe.formatarValor(primeiroPreco.valor);
                valorNumerico = this.fipe.extrairValorNumerico(primeiroPreco.valor);
            }
            return {
                ...resultado,
                valorFormatado,
                valorNumerico
            };
        } catch (error) {
            console.error('Erro na consulta veicular:', error);
            return {
                marca: null,
                veiculo: null,
                preco: null
            };
        }
    }
    /**
   * Autocompletar endereço baseado no CEP
   */ async autocompletarEndereco(cep) {
        try {
            // Timeout de 8 segundos para evitar esperas muito longas
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), 8000);
            const cepInfo = await this.cep.buscarCep(cep);
            clearTimeout(timeoutId);
            return {
                success: true,
                endereco: {
                    logradouro: cepInfo.logradouro || '',
                    bairro: cepInfo.bairro || '',
                    cidade: cepInfo.cidade || '',
                    estado: cepInfo.uf || '',
                    cep: cepInfo.cep || ''
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            return {
                success: false,
                erro: errorMessage.includes('abort') ? 'Serviço temporariamente indisponível. Tente novamente.' : "Erro ao buscar endereço: ".concat(errorMessage)
            };
        }
    }
    /**
   * Buscar dados da empresa por CNPJ
   */ async buscarEmpresaPorCnpj(cnpj) {
        try {
            // Primeiro valida o CNPJ
            const valido = this.cnpj.validarCnpj(cnpj);
            if (!valido) {
                return {
                    success: false,
                    erro: 'CNPJ inválido'
                };
            }
            // Busca dados da empresa
            const empresa = await this.cnpj.buscarEmpresa(cnpj);
            return {
                success: true,
                empresa
            };
        } catch (error) {
            return {
                success: false,
                erro: "Erro ao buscar empresa: ".concat(error instanceof Error ? error.message : 'Erro desconhecido')
            };
        }
    }
    constructor(){
        // Instâncias dos serviços
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cep", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cep$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cepService"]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cnpj", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cnpj$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cnpjService"]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cpf", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cpf$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cpfService"]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "fipe", __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fipeService"]);
        /**
   * Formatadores unificados
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "formatadores", {
            cpf: (cpf)=>this.cpf.formatarCpf(cpf),
            cnpj: (cnpj)=>this.cnpj.formatarCnpj(cnpj),
            cep: (cep)=>this.cep.formatarCep(cep),
            valor: (valor)=>this.fipe.formatarValor(valor),
            // Limpar formatação
            limpar: (valor)=>valor.replace(/\D/g, ''),
            // Detectar tipo de documento
            detectarTipo: (valor)=>{
                const limpo = valor.replace(/\D/g, '');
                if (limpo.length === 11) return 'cpf';
                if (limpo.length === 14) return 'cnpj';
                if (limpo.length === 8) return 'cep';
                return 'desconhecido';
            }
        });
        /**
   * Validadores rápidos (apenas boolean)
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "validadores", {
            cpf: (cpf)=>this.cpf.validar(cpf).valido,
            cep: async (cep)=>{
                try {
                    await this.cep.buscarCep(cep);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            cnpj: (cnpj)=>this.cnpj.validarCnpj(cnpj)
        });
        /**
   * Utilitários para formulários
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "formularios", {
            // Máscaras para inputs
            mascaraCpf: (valor)=>this.cpf.formatarCpf(valor),
            mascaraCnpj: (valor)=>this.cnpj.formatarCnpj(valor),
            mascaraCep: (valor)=>this.cep.formatarCep(valor),
            // Validação em tempo real
            validarCpfTempoReal: (cpf)=>this.cpf.validarEmTempoReal(cpf),
            // Auto-formatação baseada no tipo detectado
            autoFormatar: (valor)=>{
                const tipo = this.formatadores.detectarTipo(valor);
                switch(tipo){
                    case 'cpf':
                        return this.formatadores.cpf(valor);
                    case 'cnpj':
                        return this.formatadores.cnpj(valor);
                    case 'cep':
                        return this.formatadores.cep(valor);
                    default:
                        return valor;
                }
            }
        });
    }
}
const brasilApi = new BrasilApiService();
function useBrasilApi() {
    return {
        // Serviços individuais
        cep: brasilApi.cep,
        cnpj: brasilApi.cnpj,
        cpf: brasilApi.cpf,
        fipe: brasilApi.fipe,
        // Serviços unificados
        validarDado: brasilApi.validarDado.bind(brasilApi),
        validarCliente: brasilApi.validarCliente.bind(brasilApi),
        consultarVeiculo: brasilApi.consultarVeiculo.bind(brasilApi),
        autocompletarEndereco: brasilApi.autocompletarEndereco.bind(brasilApi),
        buscarEmpresaPorCnpj: brasilApi.buscarEmpresaPorCnpj.bind(brasilApi),
        // Utilitários
        formatadores: brasilApi.formatadores,
        validadores: brasilApi.validadores,
        formularios: brasilApi.formularios
    };
}
;
const brasilApiUtils = {
    // Constantes úteis
    TIPOS_VEICULO: [
        'carros',
        'motos',
        'caminhoes'
    ],
    ESTADOS_BRASIL: [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO'
    ],
    // Validações combinadas
    validarDocumentoCompleto: async (documento)=>{
        return brasilApi.validarDado(documento);
    },
    // Formatação inteligente
    formatarDocumento: (documento)=>{
        return brasilApi.formularios.autoFormatar(documento);
    },
    // Verificar se valor é um documento brasileiro válido
    ehDocumentoBrasileiroValido: async (documento)=>{
        const resultado = await brasilApi.validarDado(documento);
        return resultado.valido;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/brasilapi/index.ts [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cep$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cep.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cnpj$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cnpj.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cpf$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cpf.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/fipe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-client] (ecmascript) <locals>");
}),
"[project]/src/components/admin/NovoClienteModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>NovoClienteModal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building.js [app-client] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-client] (ecmascript) <export default as Loader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function NovoClienteModal(param) {
    let { isOpen, onClose, onSave } = param;
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        cpfCnpj: '',
        tipoCliente: 'FISICO',
        phone: '',
        email: '',
        endereco: '',
        numero: '',
        cidade: '',
        cep: '',
        observacoes: ''
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [cpfCnpjValidation, setCpfCnpjValidation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: 'vazio',
        mensagem: '',
        formatado: ''
    });
    const [cepValidation, setCepValidation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: 'vazio',
        mensagem: ''
    });
    const [cepLoading, setCepLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [empresaInfo, setEmpresaInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Validação de CPF/CNPJ em tempo real
    const handleCpfCnpjChange = async (value)=>{
        if (formData.tipoCliente === 'FISICO') {
            const validation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].formularios.validarCpfTempoReal(value);
            setCpfCnpjValidation(validation);
            return validation.formatado;
        } else {
            const formatted = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].formatadores.cnpj(value);
            if (formatted.replace(/\D/g, '').length === 14) {
                setCpfCnpjValidation({
                    status: 'incompleto',
                    mensagem: 'Validando CNPJ...',
                    formatado: formatted
                });
                try {
                    const resultado = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].buscarEmpresaPorCnpj(formatted);
                    if (resultado.success && resultado.empresa) {
                        setEmpresaInfo(resultado.empresa);
                        setCpfCnpjValidation({
                            status: 'valido',
                            mensagem: "CNPJ válido - ".concat(resultado.empresa.razao_social),
                            formatado: formatted
                        });
                        // Auto-preencher dados da empresa
                        setFormData((prev)=>({
                                ...prev,
                                name: resultado.empresa.razao_social,
                                endereco: "".concat(resultado.empresa.logradouro, ", ").concat(resultado.empresa.numero),
                                cidade: resultado.empresa.municipio,
                                cep: resultado.empresa.cep
                            }));
                    } else {
                        setCpfCnpjValidation({
                            status: 'invalido',
                            mensagem: 'CNPJ não encontrado na Receita Federal',
                            formatado: formatted
                        });
                        setEmpresaInfo(null);
                    }
                } catch (error) {
                    const valido = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].validadores.cnpj(formatted);
                    setCpfCnpjValidation({
                        status: valido ? 'valido' : 'invalido',
                        mensagem: valido ? 'CNPJ válido' : 'CNPJ inválido',
                        formatado: formatted
                    });
                }
            } else if (formatted.replace(/\D/g, '').length > 0) {
                setCpfCnpjValidation({
                    status: 'incompleto',
                    mensagem: "".concat(formatted.replace(/\D/g, '').length, "/14 dígitos"),
                    formatado: formatted
                });
                setEmpresaInfo(null);
            } else {
                setCpfCnpjValidation({
                    status: 'vazio',
                    mensagem: '',
                    formatado: ''
                });
                setEmpresaInfo(null);
            }
            return formatted;
        }
    };
    // Auto-completar endereço por CEP
    const handleCepChange = async (cep)=>{
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            setCepLoading(true);
            setCepValidation({
                status: 'carregando',
                mensagem: 'Buscando endereço...'
            });
            try {
                const resultado = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].autocompletarEndereco(cep);
                if (resultado.success && resultado.endereco) {
                    setCepValidation({
                        status: 'valido',
                        mensagem: 'CEP válido'
                    });
                    setFormData((prev)=>({
                            ...prev,
                            endereco: resultado.endereco.logradouro,
                            cidade: resultado.endereco.cidade
                        }));
                } else {
                    var _resultado_erro, _resultado_erro1;
                    setCepValidation({
                        status: 'invalido',
                        mensagem: ((_resultado_erro = resultado.erro) === null || _resultado_erro === void 0 ? void 0 : _resultado_erro.includes('indisponível')) || ((_resultado_erro1 = resultado.erro) === null || _resultado_erro1 === void 0 ? void 0 : _resultado_erro1.includes('504')) ? 'Serviço temporariamente indisponível. Tente novamente.' : 'CEP não encontrado. Verifique o número digitado.'
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                if (errorMessage.includes('indisponível') || errorMessage.includes('504') || errorMessage.includes('timeout')) {
                    setCepValidation({
                        status: 'invalido',
                        mensagem: 'Serviço temporariamente indisponível. Tente novamente em alguns segundos.'
                    });
                } else {
                    setCepValidation({
                        status: 'invalido',
                        mensagem: 'Erro ao buscar CEP. Verifique sua conexão e tente novamente.'
                    });
                }
            } finally{
                setCepLoading(false);
            }
        } else if (cepLimpo.length > 0) {
            setCepValidation({
                status: 'incompleto',
                mensagem: "".concat(cepLimpo.length, "/8 dígitos")
            });
        } else {
            setCepValidation({
                status: 'vazio',
                mensagem: ''
            });
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Validação básica
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.cpfCnpj.trim()) newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        // Validação com Brasil API
        if (cpfCnpjValidation.status !== 'valido') {
            newErrors.cpfCnpj = 'CPF/CNPJ inválido';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Criar cliente
        const novoCliente = {
            id: Date.now().toString(),
            ...formData,
            status: 'ATIVO',
            createdAt: new Date().toISOString().split('T')[0],
            processosAtivos: 0,
            empresaInfo: empresaInfo // Incluir dados da empresa se CNPJ
        };
        onSave(novoCliente);
        // Reset form
        setFormData({
            name: '',
            cpfCnpj: '',
            tipoCliente: 'FISICO',
            phone: '',
            email: '',
            endereco: '',
            numero: '',
            cidade: '',
            cep: '',
            observacoes: ''
        });
        setErrors({});
        setCpfCnpjValidation({
            status: 'vazio',
            mensagem: '',
            formatado: ''
        });
        setCepValidation({
            status: 'vazio',
            mensagem: ''
        });
        setEmpresaInfo(null);
        onClose();
    };
    const formatPhone = (value)=>{
        const numero = value.replace(/\D/g, '');
        if (numero.length <= 10) {
            // Telefone fixo: (00) 0000-0000
            return numero.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})/, '$1-$2');
        } else {
            // Celular: (00) 00000-0000
            return numero.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})/, '$1-$2').slice(0, 15);
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-100 p-2 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "w-5 h-5 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-gray-900",
                                    children: "Novo Cliente"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-gray-600 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                    lineNumber: 238,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "Tipo de Cliente"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "radio",
                                                    name: "tipoCliente",
                                                    value: "FISICO",
                                                    checked: formData.tipoCliente === 'FISICO',
                                                    onChange: (e)=>{
                                                        setFormData({
                                                            ...formData,
                                                            tipoCliente: e.target.value,
                                                            cpfCnpj: ''
                                                        });
                                                        setCpfCnpjValidation({
                                                            status: 'vazio',
                                                            mensagem: '',
                                                            formatado: ''
                                                        });
                                                        setCepValidation({
                                                            status: 'vazio',
                                                            mensagem: ''
                                                        });
                                                        setEmpresaInfo(null);
                                                    },
                                                    className: "text-blue-600 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pessoa Física"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "radio",
                                                    name: "tipoCliente",
                                                    value: "JURIDICO",
                                                    checked: formData.tipoCliente === 'JURIDICO',
                                                    onChange: (e)=>{
                                                        setFormData({
                                                            ...formData,
                                                            tipoCliente: e.target.value,
                                                            cpfCnpj: ''
                                                        });
                                                        setCpfCnpjValidation({
                                                            status: 'vazio',
                                                            mensagem: '',
                                                            formatado: ''
                                                        });
                                                        setCepValidation({
                                                            status: 'vazio',
                                                            mensagem: ''
                                                        });
                                                        setEmpresaInfo(null);
                                                    },
                                                    className: "text-blue-600 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 292,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pessoa Jurídica"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 293,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 278,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 256,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: [
                                                formData.tipoCliente === 'FISICO' ? 'Nome Completo' : 'Razão Social',
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.name,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    name: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.name ? 'border-red-300' : 'border-gray-300'),
                                            placeholder: formData.tipoCliente === 'FISICO' ? 'João Silva Santos' : 'Empresa Ltda'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 304,
                                            columnNumber: 15
                                        }, this),
                                        errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-1",
                                            children: errors.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 313,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: [
                                                formData.tipoCliente === 'FISICO' ? 'CPF' : 'CNPJ',
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 317,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.cpfCnpj,
                                            onChange: async (e)=>{
                                                const formatted = await handleCpfCnpjChange(e.target.value);
                                                setFormData({
                                                    ...formData,
                                                    cpfCnpj: formatted
                                                });
                                            },
                                            className: "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ".concat(errors.cpfCnpj ? 'border-red-300 focus:ring-red-500' : cpfCnpjValidation.status === 'valido' ? 'border-green-300 focus:ring-green-500' : cpfCnpjValidation.status === 'invalido' ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'),
                                            placeholder: formData.tipoCliente === 'FISICO' ? '000.000.000-00' : '00.000.000/0000-00'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this),
                                        cpfCnpjValidation.status !== 'vazio' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1 text-sm flex items-center gap-1 ".concat(cpfCnpjValidation.status === 'valido' ? 'text-green-600' : cpfCnpjValidation.status === 'invalido' ? 'text-red-600' : 'text-gray-600'),
                                            children: [
                                                cpfCnpjValidation.status === 'valido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 341,
                                                    columnNumber: 61
                                                }, this),
                                                cpfCnpjValidation.status === 'invalido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 342,
                                                    columnNumber: 63
                                                }, this),
                                                cpfCnpjValidation.status === 'incompleto' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 65
                                                }, this),
                                                cpfCnpjValidation.mensagem
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 336,
                                            columnNumber: 17
                                        }, this),
                                        errors.cpfCnpj && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-1",
                                            children: errors.cpfCnpj
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 347,
                                            columnNumber: 34
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 299,
                            columnNumber: 11
                        }, this),
                        empresaInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-green-50 border border-green-200 rounded-lg p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-medium text-green-800 mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 355,
                                            columnNumber: 17
                                        }, this),
                                        "Dados da Empresa"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 354,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-green-700 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Razão Social:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 359,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.razao_social
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 359,
                                            columnNumber: 17
                                        }, this),
                                        empresaInfo.nome_fantasia && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Nome Fantasia:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 22
                                                }, this),
                                                " ",
                                                empresaInfo.nome_fantasia
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 361,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Situação:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 363,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.descricao_situacao_cadastral
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Porte:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 364,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.descricao_porte
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "CNAE:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.cnae_fiscal_descricao
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 365,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 358,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Telefone *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 373,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.phone,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            phone: formatPhone(e.target.value)
                                                        }),
                                                    className: "w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.phone ? 'border-red-300' : 'border-gray-300'),
                                                    placeholder: "(16) 99999-9999"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 378,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 376,
                                            columnNumber: 15
                                        }, this),
                                        errors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-1",
                                            children: errors.phone
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 388,
                                            columnNumber: 32
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 372,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "E-mail"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 392,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    value: formData.email,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            email: e.target.value
                                                        }),
                                                    className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                    placeholder: "cliente@email.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 395,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 391,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 371,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 411,
                                            columnNumber: 15
                                        }, this),
                                        "Endereço"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 410,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "CEP"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: formData.cep,
                                                            onChange: (e)=>{
                                                                const newValue = e.target.value;
                                                                // Limitar a 9 caracteres (00000-000)
                                                                if (newValue.length > 9) return;
                                                                const formatted = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].formatadores.cep(newValue);
                                                                setFormData((prev)=>({
                                                                        ...prev,
                                                                        cep: formatted
                                                                    }));
                                                                // Sempre chamar validação do CEP
                                                                handleCepChange(formatted);
                                                            },
                                                            className: "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ".concat(cepValidation.status === 'valido' ? 'border-green-300 focus:ring-green-500' : cepValidation.status === 'invalido' ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'),
                                                            placeholder: "14400-000"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 19
                                                        }, this),
                                                        cepLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                                            className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 444,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 17
                                                }, this),
                                                cepValidation.status !== 'vazio' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-sm flex items-center gap-1 ".concat(cepValidation.status === 'valido' ? 'text-green-600' : cepValidation.status === 'invalido' ? 'text-red-600' : cepValidation.status === 'carregando' ? 'text-blue-600' : 'text-gray-600'),
                                                    children: [
                                                        cepValidation.status === 'valido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 454,
                                                            columnNumber: 59
                                                        }, this),
                                                        cepValidation.status === 'invalido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 61
                                                        }, this),
                                                        cepValidation.status === 'carregando' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                                            className: "w-4 h-4 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 456,
                                                            columnNumber: 63
                                                        }, this),
                                                        cepValidation.status === 'incompleto' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 63
                                                        }, this),
                                                        cepValidation.mensagem
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 448,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 416,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Cidade"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 464,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.cidade,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            cidade: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                    placeholder: "Franca"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 467,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 463,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Logradouro"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 479,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.endereco,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            endereco: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                    placeholder: "Rua das Flores"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 482,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 478,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Número"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.numero,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            numero: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                    placeholder: "123"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 495,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 491,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 477,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 409,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Observações"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 508,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                            className: "absolute left-3 top-3 text-gray-400 w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 512,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: formData.observacoes,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    observacoes: e.target.value
                                                }),
                                            rows: 3,
                                            className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
                                            placeholder: "Informações adicionais sobre o cliente..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 513,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 511,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 507,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 justify-end pt-4 border-t border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 525,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 536,
                                            columnNumber: 15
                                        }, this),
                                        "Salvar Cliente"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 532,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 524,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                    lineNumber: 254,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
            lineNumber: 236,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
        lineNumber: 235,
        columnNumber: 5
    }, this);
}
_s(NovoClienteModal, "zaYm7p4b6TOAFM/H8HgVUuTOp1Q=");
_c = NovoClienteModal;
var _c;
__turbopack_context__.k.register(_c, "NovoClienteModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ExemploBrasilAPI.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>ExemploBrasilAPI
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$NovoClienteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/NovoClienteModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building.js [app-client] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ExemploBrasilAPI() {
    _s();
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [clientes, setClientes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const handleSalvarCliente = (cliente)=>{
        setClientes((prev)=>[
                ...prev,
                cliente
            ]);
        console.log('Cliente salvo:', cliente);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-gray-900 mb-2",
                            children: "🇧🇷 Brasil API - Demo Completa"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: "Demonstração da integração completa com validação de CPF/CNPJ, consulta de empresas e auto-completar por CEP"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg shadow-md p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-100 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "w-5 h-5 text-green-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                lineNumber: 35,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 34,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold",
                                            children: "Validação CPF"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 37,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-sm text-gray-600 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Formatação automática"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 40,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Validação em tempo real"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 41,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Feedback visual"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 42,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Indicadores de status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 43,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg shadow-md p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-100 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                className: "w-5 h-5 text-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                lineNumber: 50,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 49,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold",
                                            children: "Consulta CNPJ"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 52,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-sm text-gray-600 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Consulta Receita Federal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 55,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Auto-preenchimento"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Dados da empresa"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Informações completas"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg shadow-md p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-purple-100 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-purple-600",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                        lineNumber: 66,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                        lineNumber: 67,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                lineNumber: 65,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold",
                                            children: "Auto-completar CEP"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-sm text-gray-600 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Busca automática"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 73,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Endereço completo"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Cidade e estado"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "✅ Indicador loading"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setModalOpen(true),
                        className: "bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-3 mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            "Testar Brasil API - Novo Cliente"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-md p-6 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold mb-4",
                            children: "🧪 Como Testar"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-green-700 mb-2",
                                            children: "1. Teste Validação de CPF (Pessoa Física)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-50 border border-green-200 rounded-lg p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-green-700 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "CPF para teste:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 104,
                                                            columnNumber: 19
                                                        }, this),
                                                        " 11144477735"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                    className: "text-sm text-green-600 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: '• Selecione "Pessoa Física"'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 107,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Digite o CPF acima"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Veja a formatação automática: 111.444.777-35"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Observe o feedback visual em tempo real"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 110,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 102,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-blue-700 mb-2",
                                            children: "2. Teste Consulta de CNPJ (Pessoa Jurídica)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-50 border border-blue-200 rounded-lg p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-blue-700 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "CNPJ para teste:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 122,
                                                            columnNumber: 19
                                                        }, this),
                                                        " 11222333000181"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                    className: "text-sm text-blue-600 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: '• Selecione "Pessoa Jurídica"'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Digite o CNPJ acima"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 126,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Veja a formatação: 11.222.333/0001-81"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Aguarde a consulta na Receita Federal"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Dados da empresa são preenchidos automaticamente"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Painel verde mostra informações da empresa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 130,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 120,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-purple-700 mb-2",
                                            children: "3. Teste Auto-completar por CEP"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-purple-50 border border-purple-200 rounded-lg p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-purple-700 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "CEP para teste:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 142,
                                                            columnNumber: 19
                                                        }, this),
                                                        " 01310-100 (Av. Paulista, São Paulo)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                    className: "text-sm text-purple-600 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Digite o CEP acima"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 145,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Veja a formatação: 01310-100"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 146,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Observe o indicador de carregamento"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "• Endereço é preenchido automaticamente"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 148,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: '• Cidade "São Paulo" é preenchida'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 149,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 140,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                clientes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-md p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold mb-4",
                            children: [
                                "👥 Clientes Cadastrados (",
                                clientes.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: clientes.map((cliente, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border border-gray-200 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 mb-2",
                                            children: [
                                                cliente.tipoCliente === 'FISICO' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "w-5 h-5 text-green-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                    className: "w-5 h-5 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-medium",
                                                    children: cliente.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-2 py-1 rounded-full text-xs ".concat(cliente.tipoCliente === 'FISICO' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'),
                                                    children: cliente.tipoCliente === 'FISICO' ? 'Pessoa Física' : 'Pessoa Jurídica'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 165,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "CPF/CNPJ:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 182,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        cliente.cpfCnpj
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Telefone:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 185,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        cliente.phone
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "E-mail:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        cliente.email || 'Não informado'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Endereço:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 191,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        cliente.endereco || 'Não informado'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Cidade:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 194,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        cliente.cidade || 'Não informado'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "CEP:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        cliente.cep || 'Não informado'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 180,
                                            columnNumber: 19
                                        }, this),
                                        cliente.empresaInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 p-3 bg-green-50 border border-green-200 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-medium text-green-800 mb-1",
                                                    children: "Dados da Empresa:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-green-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Situação:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                                    lineNumber: 204,
                                                                    columnNumber: 28
                                                                }, this),
                                                                " ",
                                                                cliente.empresaInfo.descricao_situacao_cadastral
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 204,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Porte:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                                    lineNumber: 205,
                                                                    columnNumber: 28
                                                                }, this),
                                                                " ",
                                                                cliente.empresaInfo.descricao_porte
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 205,
                                                            columnNumber: 25
                                                        }, this),
                                                        cliente.empresaInfo.nome_fantasia && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Nome Fantasia:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                                    lineNumber: 207,
                                                                    columnNumber: 30
                                                                }, this),
                                                                " ",
                                                                cliente.empresaInfo.nome_fantasia
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                            lineNumber: 207,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                                    lineNumber: 203,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                            lineNumber: 201,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                                    lineNumber: 164,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                    lineNumber: 158,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$NovoClienteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    isOpen: modalOpen,
                    onClose: ()=>setModalOpen(false),
                    onSave: handleSalvarCliente
                }, void 0, false, {
                    fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ExemploBrasilAPI.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(ExemploBrasilAPI, "d827EqIvqL+0yYB1tT/SQ1SRyvY=");
_c = ExemploBrasilAPI;
var _c;
__turbopack_context__.k.register(_c, "ExemploBrasilAPI");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_07204761._.js.map