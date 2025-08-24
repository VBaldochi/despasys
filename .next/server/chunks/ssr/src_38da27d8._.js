module.exports = {

"[project]/src/lib/brasilapi/cep.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Serviços de integração com CEP da BrasilAPI
// Útil para validação de endereços e auto-preenchimento
__turbopack_context__.s({
    "cepService": ()=>cepService,
    "cepUtils": ()=>cepUtils,
    "useCep": ()=>useCep
});
class CepService {
    baseUrl = 'https://brasilapi.com.br/api/cep';
    /**
   * Busca endereço por CEP (versão 1)
   */ async buscarCep(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            throw new Error('CEP deve ter 8 dígitos');
        }
        try {
            const response = await fetch(`/api/cep?cep=${cepLimpo}`);
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
            const response = await fetch(`${this.baseUrl}/v2/${cepLimpo}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('CEP não encontrado');
                }
                throw new Error(`Erro ao buscar CEP: ${response.statusText}`);
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
        return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
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
        return !!(endereco.location?.coordinates?.latitude && endereco.location?.coordinates?.longitude);
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
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;
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
}),
"[project]/src/lib/brasilapi/cnpj.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

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
            const response = await fetch(`/api/cnpj?cnpj=${cnpjLimpo}`);
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
}),
"[project]/src/lib/brasilapi/cpf.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

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
                mensagem: `${cpfLimpo.length}/11 dígitos`,
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
}),
"[project]/src/lib/brasilapi/fipe.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Serviços de integração com a API FIPE da BrasilAPI
// Essencial para consultoria veicular - consulta de preços de mercado
__turbopack_context__.s({
    "fipeService": ()=>fipeService,
    "fipeUtils": ()=>fipeUtils,
    "useFipe": ()=>useFipe
});
class FipeService {
    baseUrl = 'https://brasilapi.com.br/api/fipe';
    /**
   * Busca todas as marcas por tipo de veículo
   */ async getMarcas(tipoVeiculo, tabelaReferencia) {
        try {
            const params = new URLSearchParams();
            if (tabelaReferencia) {
                params.append('tabela_referencia', tabelaReferencia.toString());
            }
            const url = `/api/fipe/marcas/${tipoVeiculo}${params.toString() ? `?${params}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao buscar marcas: ${response.statusText}`);
            }
            const data = await response.json();
            return data.marcas || [];
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
            const url = `/api/fipe/veiculo/${tipoVeiculo}/${codigoMarca}${params.toString() ? `?${params}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao buscar veículos: ${response.statusText}`);
            }
            const data = await response.json();
            return Array.isArray(data.veiculos) ? data.veiculos : [
                data.veiculos
            ];
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
            const url = `/api/fipe/preco/${codigoFipe}${params.toString() ? `?${params}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao buscar preço: ${response.statusText}`);
            }
            const data = await response.json();
            return Array.isArray(data.preco) ? data.preco : [
                data.preco
            ];
        } catch (error) {
            console.error('Erro na consulta de preço FIPE:', error);
            throw new Error('Falha ao consultar preço na tabela FIPE');
        }
    }
    /**
   * Lista todas as tabelas de referência disponíveis
   */ async getTabelas() {
        try {
            const url = `/api/fipe/tabelas`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao buscar tabelas: ${response.statusText}`);
            }
            const data = await response.json();
            return data.tabelas || [];
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
            const veiculos = await this.getVeiculos(tipoVeiculo, marca.valor);
            const veiculo = veiculos.find((v)=>v.modelo.toLowerCase().includes(nomeVeiculo.toLowerCase()));
            if (!veiculo) {
                return {
                    marca,
                    veiculo: null,
                    preco: null
                };
            }
            // 3. Buscar preço do veículo
            // Nota: A API Brasil não tem endpoint direto para preços por veículo específico
            // Esta funcionalidade requer implementação personalizada
            const preco = null; // await this.getPreco(veiculo.codigoFipe);
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
}),
"[project]/src/lib/brasilapi/ddd.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Serviços de DDD e validação de telefones
// Útil para validação e formatação de números de telefone brasileiros
__turbopack_context__.s({
    "dddService": ()=>dddService,
    "useDdd": ()=>useDdd
});
class DddService {
    baseUrl = 'https://brasilapi.com.br/api/ddd';
    /**
   * Busca informações de um DDD
   */ async buscarDDD(ddd) {
        const dddLimpo = ddd.replace(/\D/g, '');
        if (dddLimpo.length !== 2) {
            throw new Error('DDD deve ter 2 dígitos');
        }
        try {
            const response = await fetch(`/api/ddd?ddd=${dddLimpo}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar DDD');
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error('DDD não encontrado');
            }
            return data.ddd;
        } catch (error) {
            console.error('Erro ao buscar DDD:', error);
            throw error;
        }
    }
    /**
   * Valida e analisa um número de telefone brasileiro
   */ async analisarTelefone(telefone) {
        const numeroLimpo = telefone.replace(/\D/g, '');
        if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
            throw new Error('Telefone deve ter 10 ou 11 dígitos');
        }
        const ddd = numeroLimpo.slice(0, 2);
        const numero = numeroLimpo.slice(2);
        const tipo = numeroLimpo.length === 11 ? 'celular' : 'fixo';
        try {
            const infoDdd = await this.buscarDDD(ddd);
            return {
                numero: numeroLimpo,
                ddd,
                tipo,
                estado: infoDdd.estado,
                valido: this.validarTelefone(numeroLimpo),
                formatado: this.formatarTelefone(numeroLimpo)
            };
        } catch (error) {
            return {
                numero: numeroLimpo,
                ddd,
                tipo,
                estado: 'Desconhecido',
                valido: this.validarTelefone(numeroLimpo),
                formatado: this.formatarTelefone(numeroLimpo)
            };
        }
    }
    /**
   * Valida formato de telefone
   */ validarTelefone(telefone) {
        const numeroLimpo = telefone.replace(/\D/g, '');
        // Deve ter 10 ou 11 dígitos
        if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
            return false;
        }
        // DDD válido (11-99)
        const ddd = parseInt(numeroLimpo.slice(0, 2));
        if (ddd < 11 || ddd > 99) {
            return false;
        }
        // Primeiro dígito do número não pode ser 0 ou 1
        const primeiroDigito = parseInt(numeroLimpo[2]);
        if (primeiroDigito <= 1) {
            return false;
        }
        // Para celular (11 dígitos), deve começar com 9
        if (numeroLimpo.length === 11 && numeroLimpo[2] !== '9') {
            return false;
        }
        return true;
    }
    /**
   * Formata telefone para exibição
   */ formatarTelefone(telefone) {
        const numeroLimpo = telefone.replace(/\D/g, '');
        if (numeroLimpo.length === 10) {
            // Telefone fixo: (00) 0000-0000
            return numeroLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (numeroLimpo.length === 11) {
            // Celular: (00) 90000-0000
            return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return telefone;
    }
    /**
   * Lista todos os DDDs e seus estados
   */ listarDDDs() {
        return {
            '11': 'SP',
            '12': 'SP',
            '13': 'SP',
            '14': 'SP',
            '15': 'SP',
            '16': 'SP',
            '17': 'SP',
            '18': 'SP',
            '19': 'SP',
            '21': 'RJ',
            '22': 'RJ',
            '24': 'RJ',
            '27': 'ES',
            '28': 'ES',
            '31': 'MG',
            '32': 'MG',
            '33': 'MG',
            '34': 'MG',
            '35': 'MG',
            '37': 'MG',
            '38': 'MG',
            '41': 'PR',
            '42': 'PR',
            '43': 'PR',
            '44': 'PR',
            '45': 'PR',
            '46': 'PR',
            '47': 'SC',
            '48': 'SC',
            '49': 'SC',
            '51': 'RS',
            '53': 'RS',
            '54': 'RS',
            '55': 'RS',
            '61': 'DF',
            '62': 'GO',
            '64': 'GO',
            '63': 'TO',
            '65': 'MT',
            '66': 'MT',
            '67': 'MS',
            '68': 'AC',
            '69': 'RO',
            '71': 'BA',
            '73': 'BA',
            '74': 'BA',
            '75': 'BA',
            '77': 'BA',
            '79': 'SE',
            '81': 'PE',
            '87': 'PE',
            '82': 'AL',
            '83': 'PB',
            '84': 'RN',
            '85': 'CE',
            '88': 'CE',
            '86': 'PI',
            '89': 'PI',
            '91': 'PA',
            '93': 'PA',
            '94': 'PA',
            '92': 'AM',
            '97': 'AM',
            '95': 'RR',
            '96': 'AP',
            '98': 'MA',
            '99': 'MA'
        };
    }
}
const dddService = new DddService();
function useDdd() {
    return {
        buscarDDD: dddService.buscarDDD.bind(dddService),
        analisarTelefone: dddService.analisarTelefone.bind(dddService),
        validarTelefone: dddService.validarTelefone.bind(dddService),
        formatarTelefone: dddService.formatarTelefone.bind(dddService),
        listarDDDs: dddService.listarDDDs.bind(dddService)
    };
}
}),
"[project]/src/lib/brasilapi/banco.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Serviços de bancos e PIX
// Útil para validação de dados bancários e PIX
__turbopack_context__.s({
    "bancoService": ()=>bancoService,
    "useBanco": ()=>useBanco
});
class BancoService {
    baseUrl = 'https://brasilapi.com.br/api/banks';
    /**
   * Lista todos os bancos brasileiros
   */ async listarBancos() {
        try {
            const response = await fetch('/api/bancos');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar bancos');
            }
            const data = await response.json();
            return data.bancos || [];
        } catch (error) {
            console.error('Erro ao buscar bancos:', error);
            throw error;
        }
    }
    /**
   * Busca banco por código
   */ async buscarBancoPorCodigo(codigo) {
        try {
            const response = await fetch(`/api/bancos/${codigo}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Banco não encontrado');
            }
            const data = await response.json();
            return data.banco;
        } catch (error) {
            console.error('Erro ao buscar banco:', error);
            throw error;
        }
    }
    /**
   * Lista participantes do PIX
   */ async listarParticipantesPix() {
        try {
            const response = await fetch('/api/pix/participantes');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar participantes PIX');
            }
            const data = await response.json();
            return data.participantes || [];
        } catch (error) {
            console.error('Erro ao buscar participantes PIX:', error);
            throw error;
        }
    }
    /**
   * Valida formato de chave PIX
   */ validarChavePix(chave) {
        const chaveLimpa = chave.trim();
        // CPF
        if (/^\d{11}$/.test(chaveLimpa.replace(/\D/g, '')) && chaveLimpa.replace(/\D/g, '').length === 11) {
            return {
                tipo: 'cpf',
                valida: this.validarCpf(chaveLimpa.replace(/\D/g, '')),
                formatada: this.formatarCpf(chaveLimpa.replace(/\D/g, ''))
            };
        }
        // CNPJ
        if (/^\d{14}$/.test(chaveLimpa.replace(/\D/g, '')) && chaveLimpa.replace(/\D/g, '').length === 14) {
            return {
                tipo: 'cnpj',
                valida: this.validarCnpj(chaveLimpa.replace(/\D/g, '')),
                formatada: this.formatarCnpj(chaveLimpa.replace(/\D/g, ''))
            };
        }
        // Email
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chaveLimpa)) {
            return {
                tipo: 'email',
                valida: true,
                formatada: chaveLimpa.toLowerCase()
            };
        }
        // Telefone
        if (/^\+55\d{10,11}$/.test(chaveLimpa.replace(/\D/g, '+55'))) {
            const numeroLimpo = chaveLimpa.replace(/\D/g, '');
            if (numeroLimpo.length >= 12 && numeroLimpo.length <= 13) {
                return {
                    tipo: 'telefone',
                    valida: true,
                    formatada: `+55${numeroLimpo.slice(-11)}`
                };
            }
        }
        // Chave aleatória (UUID)
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chaveLimpa)) {
            return {
                tipo: 'chave_aleatoria',
                valida: true,
                formatada: chaveLimpa.toLowerCase()
            };
        }
        return {
            tipo: 'chave_aleatoria',
            valida: false,
            formatada: chaveLimpa
        };
    }
    /**
   * Valida CPF (algoritmo básico)
   */ validarCpf(cpf) {
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0;
        for(let i = 0; i < 9; i++){
            soma += parseInt(cpf[i]) * (10 - i);
        }
        let digito1 = soma % 11;
        digito1 = digito1 < 2 ? 0 : 11 - digito1;
        if (parseInt(cpf[9]) !== digito1) return false;
        soma = 0;
        for(let i = 0; i < 10; i++){
            soma += parseInt(cpf[i]) * (11 - i);
        }
        let digito2 = soma % 11;
        digito2 = digito2 < 2 ? 0 : 11 - digito2;
        return parseInt(cpf[10]) === digito2;
    }
    /**
   * Valida CNPJ (algoritmo básico)
   */ validarCnpj(cnpj) {
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
        let soma = 0;
        let peso = 5;
        for(let i = 0; i < 12; i++){
            soma += parseInt(cnpj[i]) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }
        let digito1 = soma % 11;
        digito1 = digito1 < 2 ? 0 : 11 - digito1;
        if (parseInt(cnpj[12]) !== digito1) return false;
        soma = 0;
        peso = 6;
        for(let i = 0; i < 13; i++){
            soma += parseInt(cnpj[i]) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }
        let digito2 = soma % 11;
        digito2 = digito2 < 2 ? 0 : 11 - digito2;
        return parseInt(cnpj[13]) === digito2;
    }
    /**
   * Formata CPF
   */ formatarCpf(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    /**
   * Formata CNPJ
   */ formatarCnpj(cnpj) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    /**
   * Lista dos principais bancos brasileiros
   */ getBancosPrincipais() {
        return [
            {
                ispb: '00000000',
                name: 'Banco do Brasil',
                code: 1,
                fullName: 'Banco do Brasil S.A.'
            },
            {
                ispb: '00000208',
                name: 'BTG Pactual',
                code: 208,
                fullName: 'Banco BTG Pactual S.A.'
            },
            {
                ispb: '00000237',
                name: 'Bradesco',
                code: 237,
                fullName: 'Banco Bradesco S.A.'
            },
            {
                ispb: '00000341',
                name: 'Itaú',
                code: 341,
                fullName: 'Itaú Unibanco S.A.'
            },
            {
                ispb: '00000104',
                name: 'Caixa Econômica',
                code: 104,
                fullName: 'Caixa Econômica Federal'
            },
            {
                ispb: '00000260',
                name: 'Nu Pagamentos',
                code: 260,
                fullName: 'Nu Pagamentos S.A.'
            },
            {
                ispb: '00000212',
                name: 'Banco Original',
                code: 212,
                fullName: 'Banco Original S.A.'
            },
            {
                ispb: '00000290',
                name: 'PagSeguro',
                code: 290,
                fullName: 'PagSeguro Internet S.A.'
            },
            {
                ispb: '00000323',
                name: 'Mercado Pago',
                code: 323,
                fullName: 'Mercado Pago S.A.'
            },
            {
                ispb: '00000077',
                name: 'Banco Inter',
                code: 77,
                fullName: 'Banco Inter S.A.'
            }
        ];
    }
}
const bancoService = new BancoService();
function useBanco() {
    return {
        listarBancos: bancoService.listarBancos.bind(bancoService),
        buscarBancoPorCodigo: bancoService.buscarBancoPorCodigo.bind(bancoService),
        listarParticipantesPix: bancoService.listarParticipantesPix.bind(bancoService),
        validarChavePix: bancoService.validarChavePix.bind(bancoService),
        getBancosPrincipais: bancoService.getBancosPrincipais.bind(bancoService)
    };
}
}),
"[project]/src/lib/brasilapi/feriado.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Serviço de feriados nacionais brasileiros
// Útil para sistemas de agendamento e calendário
__turbopack_context__.s({
    "feriadoService": ()=>feriadoService,
    "useFeriado": ()=>useFeriado
});
class FeriadoService {
    feriadosFixos = [
        {
            date: '01-01',
            name: 'Confraternização Universal',
            type: 'national'
        },
        {
            date: '04-21',
            name: 'Tiradentes',
            type: 'national'
        },
        {
            date: '05-01',
            name: 'Dia do Trabalhador',
            type: 'national'
        },
        {
            date: '09-07',
            name: 'Independência do Brasil',
            type: 'national'
        },
        {
            date: '10-12',
            name: 'Nossa Senhora Aparecida',
            type: 'religious'
        },
        {
            date: '11-02',
            name: 'Finados',
            type: 'religious'
        },
        {
            date: '11-15',
            name: 'Proclamação da República',
            type: 'national'
        },
        {
            date: '12-25',
            name: 'Natal',
            type: 'religious'
        }
    ];
    diasSemana = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado'
    ];
    /**
   * Busca feriados de um ano específico
   */ async buscarFeriados(ano) {
        try {
            const response = await fetch(`/api/feriados/${ano}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar feriados');
            }
            const data = await response.json();
            return data.feriados || [];
        } catch (error) {
            console.error('Erro ao buscar feriados:', error);
            // Fallback para feriados fixos
            return this.getFeriadosFixos(ano);
        }
    }
    /**
   * Verifica se uma data é feriado
   */ async ehFeriado(data) {
        try {
            const dataObj = typeof data === 'string' ? new Date(data) : data;
            const ano = dataObj.getFullYear();
            const feriados = await this.buscarFeriados(ano);
            const dataStr = dataObj.toISOString().split('T')[0];
            return feriados.some((feriado)=>feriado.date === dataStr);
        } catch  {
            return false;
        }
    }
    /**
   * Busca próximo feriado
   */ async buscarProximoFeriado(dataReferencia = new Date()) {
        try {
            const ano = dataReferencia.getFullYear();
            const feriados = await this.buscarFeriados(ano);
            const feriadosProximoAno = await this.buscarFeriados(ano + 1);
            const todosFeriados = [
                ...feriados,
                ...feriadosProximoAno
            ];
            const dataRef = dataReferencia.toISOString().split('T')[0];
            const feriadosFuturos = todosFeriados.filter((feriado)=>feriado.date > dataRef).sort((a, b)=>a.date.localeCompare(b.date));
            return feriadosFuturos[0] || null;
        } catch (error) {
            console.error('Erro ao buscar próximo feriado:', error);
            return null;
        }
    }
    /**
   * Calcula dias úteis entre duas datas
   */ async calcularDiasUteis(dataInicio, dataFim) {
        try {
            let diasUteis = 0;
            const dataAtual = new Date(dataInicio);
            const ano = dataInicio.getFullYear();
            const feriados = await this.buscarFeriados(ano);
            const feriadosDatas = new Set(feriados.map((f)=>f.date));
            while(dataAtual <= dataFim){
                const diaSemana = dataAtual.getDay();
                const dataStr = dataAtual.toISOString().split('T')[0];
                // Não é fim de semana e não é feriado
                if (diaSemana !== 0 && diaSemana !== 6 && !feriadosDatas.has(dataStr)) {
                    diasUteis++;
                }
                dataAtual.setDate(dataAtual.getDate() + 1);
            }
            return diasUteis;
        } catch (error) {
            console.error('Erro ao calcular dias úteis:', error);
            return 0;
        }
    }
    /**
   * Adiciona dias úteis a uma data
   */ async adicionarDiasUteis(dataInicio, diasUteis) {
        try {
            const dataResultado = new Date(dataInicio);
            const ano = dataInicio.getFullYear();
            const feriados = await this.buscarFeriados(ano);
            const feriadosDatas = new Set(feriados.map((f)=>f.date));
            let diasAdicionados = 0;
            while(diasAdicionados < diasUteis){
                dataResultado.setDate(dataResultado.getDate() + 1);
                const diaSemana = dataResultado.getDay();
                const dataStr = dataResultado.toISOString().split('T')[0];
                // É dia útil
                if (diaSemana !== 0 && diaSemana !== 6 && !feriadosDatas.has(dataStr)) {
                    diasAdicionados++;
                }
            }
            return dataResultado;
        } catch (error) {
            console.error('Erro ao adicionar dias úteis:', error);
            return dataInicio;
        }
    }
    /**
   * Obtém informações detalhadas sobre uma data
   */ async getInfoData(data) {
        try {
            const ehFeriado = await this.ehFeriado(data);
            const proximoFeriado = await this.buscarProximoFeriado(data);
            const diaSemana = data.getDay();
            const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;
            let diasAteProximo = undefined;
            if (proximoFeriado) {
                const dataProximo = new Date(proximoFeriado.date);
                const diffTime = dataProximo.getTime() - data.getTime();
                diasAteProximo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            // Verifica se é ponte útil (feriado na segunda ou sexta)
            const ehPonteUtil = ehFeriado && (diaSemana === 1 || diaSemana === 5);
            return {
                data,
                nome: ehFeriado ? 'Feriado' : this.diasSemana[diaSemana],
                tipo: ehFeriado ? 'feriado' : 'dia_normal',
                diaSemana: this.diasSemana[diaSemana],
                proximoFeriado: proximoFeriado || undefined,
                diasAteProximo,
                ehFimDeSemana,
                ehPonteUtil
            };
        } catch (error) {
            console.error('Erro ao obter info da data:', error);
            return {
                data,
                nome: this.diasSemana[data.getDay()],
                tipo: 'dia_normal',
                diaSemana: this.diasSemana[data.getDay()],
                ehFimDeSemana: data.getDay() === 0 || data.getDay() === 6,
                ehPonteUtil: false
            };
        }
    }
    /**
   * Feriados fixos como fallback
   */ getFeriadosFixos(ano) {
        return this.feriadosFixos.map((feriado)=>({
                date: `${ano}-${feriado.date}`,
                name: feriado.name,
                type: feriado.type
            }));
    }
    /**
   * Calcula páscoa para obter feriados móveis
   */ calcularPascoa(ano) {
        const a = ano % 19;
        const b = Math.floor(ano / 100);
        const c = ano % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const mes = Math.floor((h + l - 7 * m + 114) / 31);
        const dia = (h + l - 7 * m + 114) % 31 + 1;
        return new Date(ano, mes - 1, dia);
    }
    /**
   * Lista de feriados para planejamento
   */ getFeriadosParaPlanejamento(ano) {
        return this.getFeriadosFixos(ano).map((feriado)=>({
                data: new Date(feriado.date),
                nome: feriado.name,
                tipo: feriado.type,
                diaSemana: this.diasSemana[new Date(feriado.date).getDay()],
                ehFimDeSemana: [
                    0,
                    6
                ].includes(new Date(feriado.date).getDay()),
                ehPonteUtil: [
                    1,
                    5
                ].includes(new Date(feriado.date).getDay())
            }));
    }
}
const feriadoService = new FeriadoService();
function useFeriado() {
    return {
        buscarFeriados: feriadoService.buscarFeriados.bind(feriadoService),
        ehFeriado: feriadoService.ehFeriado.bind(feriadoService),
        buscarProximoFeriado: feriadoService.buscarProximoFeriado.bind(feriadoService),
        calcularDiasUteis: feriadoService.calcularDiasUteis.bind(feriadoService),
        adicionarDiasUteis: feriadoService.adicionarDiasUteis.bind(feriadoService),
        getInfoData: feriadoService.getInfoData.bind(feriadoService),
        getFeriadosParaPlanejamento: feriadoService.getFeriadosParaPlanejamento.bind(feriadoService)
    };
}
}),
"[project]/src/lib/brasilapi/ibge.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// Serviços de dados do IBGE
// Útil para localização e dados geográficos brasileiros
__turbopack_context__.s({
    "ibgeService": ()=>ibgeService,
    "useIbge": ()=>useIbge
});
class IbgeService {
    /**
   * Lista todos os estados brasileiros
   */ async listarEstados() {
        try {
            const response = await fetch('/api/ibge/estados');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar estados');
            }
            const data = await response.json();
            return data.estados || this.getEstadosLocais();
        } catch (error) {
            console.error('Erro ao buscar estados:', error);
            return this.getEstadosLocais();
        }
    }
    /**
   * Busca estado por ID ou sigla
   */ async buscarEstado(identificador) {
        try {
            const response = await fetch(`/api/ibge/estados/${identificador}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Estado não encontrado');
            }
            const data = await response.json();
            return data.estado;
        } catch (error) {
            console.error('Erro ao buscar estado:', error);
            // Fallback para busca local
            const estados = this.getEstadosLocais();
            const estado = estados.find((e)=>e.sigla === String(identificador).toUpperCase() || e.id === Number(identificador));
            return estado || null;
        }
    }
    /**
   * Lista cidades de um estado
   */ async listarCidadesPorEstado(estadoId) {
        try {
            const response = await fetch(`/api/ibge/estados/${estadoId}/cidades`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar cidades');
            }
            const data = await response.json();
            return data.cidades || [];
        } catch (error) {
            console.error('Erro ao buscar cidades:', error);
            return [];
        }
    }
    /**
   * Busca cidade por nome ou ID
   */ async buscarCidade(identificador, estadoId) {
        try {
            let url = `/api/ibge/cidades/${identificador}`;
            if (estadoId) {
                url += `?estado=${estadoId}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Cidade não encontrada');
            }
            const data = await response.json();
            return Array.isArray(data.cidades) ? data.cidades : [
                data.cidade
            ];
        } catch (error) {
            console.error('Erro ao buscar cidade:', error);
            return [];
        }
    }
    /**
   * Busca completa por localização
   */ async buscarLocalizacaoCompleta(cidade, estado) {
        try {
            // Primeiro busca o estado se fornecido
            let estadoObj = null;
            if (estado) {
                estadoObj = await this.buscarEstado(estado);
            }
            // Busca a cidade
            const cidades = estadoObj ? await this.listarCidadesPorEstado(estadoObj.id) : await this.buscarCidade(cidade);
            const cidadeEncontrada = cidades.find((c)=>c.nome.toLowerCase().includes(cidade.toLowerCase()));
            if (!cidadeEncontrada) return null;
            // Busca o estado da cidade se não foi fornecido
            if (!estadoObj) {
                estadoObj = await this.buscarEstado(cidadeEncontrada.microrregiao.mesorregiao.UF.id);
            }
            return {
                cidade: cidadeEncontrada,
                estado: estadoObj,
                regiao: estadoObj.regiao.nome,
                codigoIbge: cidadeEncontrada.id
            };
        } catch (error) {
            console.error('Erro ao buscar localização completa:', error);
            return null;
        }
    }
    /**
   * Valida se cidade pertence ao estado
   */ async validarCidadeEstado(cidade, estado) {
        try {
            const localizacao = await this.buscarLocalizacaoCompleta(cidade, estado);
            return localizacao !== null;
        } catch  {
            return false;
        }
    }
    /**
   * Lista cidades por região
   */ async listarCidadesPorRegiao(regiao) {
        try {
            const estados = await this.listarEstados();
            const estadosRegiao = estados.filter((e)=>e.regiao.nome.toLowerCase() === regiao.toLowerCase() || e.regiao.sigla.toLowerCase() === regiao.toLowerCase());
            const todasCidades = [];
            for (const estado of estadosRegiao){
                const cidades = await this.listarCidadesPorEstado(estado.id);
                todasCidades.push(...cidades);
            }
            return todasCidades;
        } catch (error) {
            console.error('Erro ao buscar cidades por região:', error);
            return [];
        }
    }
    /**
   * Busca cidades próximas (por nome similar)
   */ buscarCidadesSimilares(termo, cidades) {
        const termoLower = termo.toLowerCase();
        return cidades.filter((cidade)=>cidade.nome.toLowerCase().includes(termoLower)).sort((a, b)=>{
            // Prioriza matches exatos
            const aExato = a.nome.toLowerCase() === termoLower;
            const bExato = b.nome.toLowerCase() === termoLower;
            if (aExato && !bExato) return -1;
            if (!aExato && bExato) return 1;
            // Depois por início da palavra
            const aInicio = a.nome.toLowerCase().startsWith(termoLower);
            const bInicio = b.nome.toLowerCase().startsWith(termoLower);
            if (aInicio && !bInicio) return -1;
            if (!aInicio && bInicio) return 1;
            // Por fim, alfabética
            return a.nome.localeCompare(b.nome);
        }).slice(0, 10); // Limita a 10 resultados
    }
    /**
   * Estados brasileiros como fallback
   */ getEstadosLocais() {
        return [
            {
                id: 11,
                sigla: 'RO',
                nome: 'Rondônia',
                regiao: {
                    id: 1,
                    sigla: 'N',
                    nome: 'Norte'
                }
            },
            {
                id: 12,
                sigla: 'AC',
                nome: 'Acre',
                regiao: {
                    id: 1,
                    sigla: 'N',
                    nome: 'Norte'
                }
            },
            {
                id: 13,
                sigla: 'AM',
                nome: 'Amazonas',
                regiao: {
                    id: 1,
                    sigla: 'N',
                    nome: 'Norte'
                }
            },
            {
                id: 14,
                sigla: 'RR',
                nome: 'Roraima',
                regiao: {
                    id: 1,
                    sigla: 'N',
                    nome: 'Norte'
                }
            },
            {
                id: 15,
                sigla: 'PA',
                nome: 'Pará',
                regiao: {
                    id: 1,
                    sigla: 'N',
                    nome: 'Norte'
                }
            },
            {
                id: 16,
                sigla: 'AP',
                nome: 'Amapá',
                regiao: {
                    id: 1,
                    sigla: 'N',
                    nome: 'Norte'
                }
            },
            {
                id: 17,
                sigla: 'TO',
                nome: 'Tocantins',
                regiao: {
                    id: 1,
                    sigla: 'N',
                    nome: 'Norte'
                }
            },
            {
                id: 21,
                sigla: 'MA',
                nome: 'Maranhão',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 22,
                sigla: 'PI',
                nome: 'Piauí',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 23,
                sigla: 'CE',
                nome: 'Ceará',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 24,
                sigla: 'RN',
                nome: 'Rio Grande do Norte',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 25,
                sigla: 'PB',
                nome: 'Paraíba',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 26,
                sigla: 'PE',
                nome: 'Pernambuco',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 27,
                sigla: 'AL',
                nome: 'Alagoas',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 28,
                sigla: 'SE',
                nome: 'Sergipe',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 29,
                sigla: 'BA',
                nome: 'Bahia',
                regiao: {
                    id: 2,
                    sigla: 'NE',
                    nome: 'Nordeste'
                }
            },
            {
                id: 31,
                sigla: 'MG',
                nome: 'Minas Gerais',
                regiao: {
                    id: 3,
                    sigla: 'SE',
                    nome: 'Sudeste'
                }
            },
            {
                id: 32,
                sigla: 'ES',
                nome: 'Espírito Santo',
                regiao: {
                    id: 3,
                    sigla: 'SE',
                    nome: 'Sudeste'
                }
            },
            {
                id: 33,
                sigla: 'RJ',
                nome: 'Rio de Janeiro',
                regiao: {
                    id: 3,
                    sigla: 'SE',
                    nome: 'Sudeste'
                }
            },
            {
                id: 35,
                sigla: 'SP',
                nome: 'São Paulo',
                regiao: {
                    id: 3,
                    sigla: 'SE',
                    nome: 'Sudeste'
                }
            },
            {
                id: 41,
                sigla: 'PR',
                nome: 'Paraná',
                regiao: {
                    id: 4,
                    sigla: 'S',
                    nome: 'Sul'
                }
            },
            {
                id: 42,
                sigla: 'SC',
                nome: 'Santa Catarina',
                regiao: {
                    id: 4,
                    sigla: 'S',
                    nome: 'Sul'
                }
            },
            {
                id: 43,
                sigla: 'RS',
                nome: 'Rio Grande do Sul',
                regiao: {
                    id: 4,
                    sigla: 'S',
                    nome: 'Sul'
                }
            },
            {
                id: 50,
                sigla: 'MS',
                nome: 'Mato Grosso do Sul',
                regiao: {
                    id: 5,
                    sigla: 'CO',
                    nome: 'Centro-Oeste'
                }
            },
            {
                id: 51,
                sigla: 'MT',
                nome: 'Mato Grosso',
                regiao: {
                    id: 5,
                    sigla: 'CO',
                    nome: 'Centro-Oeste'
                }
            },
            {
                id: 52,
                sigla: 'GO',
                nome: 'Goiás',
                regiao: {
                    id: 5,
                    sigla: 'CO',
                    nome: 'Centro-Oeste'
                }
            },
            {
                id: 53,
                sigla: 'DF',
                nome: 'Distrito Federal',
                regiao: {
                    id: 5,
                    sigla: 'CO',
                    nome: 'Centro-Oeste'
                }
            }
        ];
    }
    /**
   * Regiões brasileiras
   */ getRegioes() {
        return [
            {
                id: 1,
                sigla: 'N',
                nome: 'Norte'
            },
            {
                id: 2,
                sigla: 'NE',
                nome: 'Nordeste'
            },
            {
                id: 3,
                sigla: 'SE',
                nome: 'Sudeste'
            },
            {
                id: 4,
                sigla: 'S',
                nome: 'Sul'
            },
            {
                id: 5,
                sigla: 'CO',
                nome: 'Centro-Oeste'
            }
        ];
    }
    /**
   * Autocomplete para cidades
   */ async autocompleteCidades(termo, estadoId) {
        try {
            let cidades = [];
            if (estadoId) {
                cidades = await this.listarCidadesPorEstado(estadoId);
            } else {
                // Busca em alguns estados principais se não especificado
                const estadosPrincipais = [
                    35,
                    33,
                    31,
                    41,
                    43
                ]; // SP, RJ, MG, PR, RS
                for (const id of estadosPrincipais){
                    const cidadesEstado = await this.listarCidadesPorEstado(id);
                    cidades.push(...cidadesEstado);
                }
            }
            return this.buscarCidadesSimilares(termo, cidades).map((cidade)=>cidade.nome).slice(0, 5);
        } catch (error) {
            console.error('Erro no autocomplete:', error);
            return [];
        }
    }
}
const ibgeService = new IbgeService();
function useIbge() {
    return {
        listarEstados: ibgeService.listarEstados.bind(ibgeService),
        buscarEstado: ibgeService.buscarEstado.bind(ibgeService),
        listarCidadesPorEstado: ibgeService.listarCidadesPorEstado.bind(ibgeService),
        buscarCidade: ibgeService.buscarCidade.bind(ibgeService),
        buscarLocalizacaoCompleta: ibgeService.buscarLocalizacaoCompleta.bind(ibgeService),
        validarCidadeEstado: ibgeService.validarCidadeEstado.bind(ibgeService),
        listarCidadesPorRegiao: ibgeService.listarCidadesPorRegiao.bind(ibgeService),
        buscarCidadesSimilares: ibgeService.buscarCidadesSimilares.bind(ibgeService),
        autocompleteCidades: ibgeService.autocompleteCidades.bind(ibgeService),
        getRegioes: ibgeService.getRegioes.bind(ibgeService)
    };
}
}),
"[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

// Integração unificada com Brasil API - Todos os serviços essenciais
// Centraliza todos os serviços de dados brasileiros necessários para o sistema
__turbopack_context__.s({
    "brasilApi": ()=>brasilApi,
    "brasilApiUtils": ()=>brasilApiUtils,
    "useBrasilApi": ()=>useBrasilApi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cep$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cep.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cnpj$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cnpj.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cpf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cpf.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/fipe.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$ddd$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/ddd.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$banco$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/banco.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$feriado$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/feriado.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$ibge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/ibge.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
class BrasilApiService {
    // Instâncias dos serviços
    cep = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cep$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cepService"];
    cnpj = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cnpj$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cnpjService"];
    cpf = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cpf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cpfService"];
    fipe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fipeService"];
    ddd = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$ddd$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dddService"];
    banco = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$banco$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bancoService"];
    feriado = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$feriado$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["feriadoService"];
    ibge = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$ibge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ibgeService"];
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
                        erro: `Erro ao buscar CEP: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
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
                            erro: `Erro ao buscar dados da empresa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
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
                erro: `Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
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
                    resultado.erros.push(`CPF: ${cpfValidacao.erro}`);
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
                        resultado.erros.push(`CNPJ: Erro ao buscar dados da empresa`);
                        resultado.valido = false;
                    }
                } else {
                    resultado.erros.push(`CNPJ: CNPJ inválido`);
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
                    resultado.erros.push(`CEP: Erro ao buscar endereço`);
                    resultado.valido = false;
                }
            }
        } catch (error) {
            resultado.erros.push(`Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
                erro: errorMessage.includes('abort') ? 'Serviço temporariamente indisponível. Tente novamente.' : `Erro ao buscar endereço: ${errorMessage}`
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
                erro: `Erro ao buscar empresa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            };
        }
    }
    /**
   * Formatadores unificados
   */ formatadores = {
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
    };
    /**
   * Validadores rápidos (apenas boolean)
   */ validadores = {
        cpf: (cpf)=>this.cpf.validar(cpf).valido,
        cep: async (cep)=>{
            try {
                await this.cep.buscarCep(cep);
                return true;
            } catch  {
                return false;
            }
        },
        cnpj: (cnpj)=>this.cnpj.validarCnpj(cnpj)
    };
    /**
   * Utilitários para formulários
   */ formularios = {
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
    };
}
const brasilApi = new BrasilApiService();
function useBrasilApi() {
    return {
        // Serviços individuais
        cep: brasilApi.cep,
        cnpj: brasilApi.cnpj,
        cpf: brasilApi.cpf,
        fipe: brasilApi.fipe,
        ddd: brasilApi.ddd,
        banco: brasilApi.banco,
        feriado: brasilApi.feriado,
        ibge: brasilApi.ibge,
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
}),
"[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cep$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cep.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cnpj$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cnpj.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$cpf$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/cpf.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/fipe.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$ddd$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/ddd.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$banco$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/banco.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$feriado$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/feriado.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$ibge$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/ibge.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <locals>");
}),
"[project]/src/components/ConsultaFipe.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ConsultaFipe
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-ssr] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/fuel.js [app-ssr] (ecmascript) <export default as Fuel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-ssr] (ecmascript) <export default as Loader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/fipe.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ConsultaFipe({ onVeiculoSelecionado, className = '' }) {
    // Estados principais
    const [tipoVeiculo, setTipoVeiculo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('carros');
    const [marcas, setMarcas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [marcaSelecionada, setMarcaSelecionada] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [veiculos, setVeiculos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [precos, setPrecos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Estados de controle
    const [estadoMarcas, setEstadoMarcas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'idle'
    });
    const [estadoVeiculos, setEstadoVeiculos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'idle'
    });
    const [estadoPrecos, setEstadoPrecos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'idle'
    });
    // Buscar marcas quando tipo de veículo muda
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        buscarMarcas();
    }, [
        tipoVeiculo
    ]);
    // Buscar veículos quando marca muda
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (marcaSelecionada) {
            buscarVeiculos();
        } else {
            setVeiculos([]);
            setVeiculoSelecionado('');
            setPrecos([]);
        }
    }, [
        marcaSelecionada
    ]);
    // Buscar preços quando veículo muda
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (veiculoSelecionado) {
            buscarPrecos();
        } else {
            setPrecos([]);
        }
    }, [
        veiculoSelecionado
    ]);
    const buscarMarcas = async ()=>{
        setEstadoMarcas({
            status: 'loading'
        });
        setMarcaSelecionada('');
        try {
            const resultados = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fipeService"].getMarcas(tipoVeiculo);
            setMarcas(resultados);
            setEstadoMarcas({
                status: 'success'
            });
        } catch (error) {
            console.error('Erro ao buscar marcas:', error);
            setEstadoMarcas({
                status: 'error',
                erro: 'Erro ao carregar marcas. Tente novamente.'
            });
            setMarcas([]);
        }
    };
    const buscarVeiculos = async ()=>{
        if (!marcaSelecionada) return;
        setEstadoVeiculos({
            status: 'loading'
        });
        setVeiculoSelecionado('');
        try {
            const resultados = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fipeService"].getVeiculos(tipoVeiculo, marcaSelecionada);
            setVeiculos(resultados);
            setEstadoVeiculos({
                status: 'success'
            });
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
            setEstadoVeiculos({
                status: 'error',
                erro: 'Erro ao carregar veículos. Tente novamente.'
            });
            setVeiculos([]);
        }
    };
    const buscarPrecos = async ()=>{
        if (!veiculoSelecionado || !marcaSelecionada) return;
        setEstadoPrecos({
            status: 'loading'
        });
        try {
            console.log('Buscando preços FIPE reais para:', {
                tipo: tipoVeiculo,
                marca: marcaSelecionada,
                modelo: veiculoSelecionado
            });
            const response = await fetch('/api/fipe/precos-reais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tipoVeiculo: tipoVeiculo,
                    codigoMarca: marcaSelecionada,
                    modeloNome: veiculoSelecionado
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro na consulta FIPE');
            }
            const data = await response.json();
            if (data.success && data.precos?.length > 0) {
                // Mapear dados da FIPE oficial para o formato esperado
                const precosFormatados = data.precos.map((preco)=>({
                        valor: preco.Valor || 'N/A',
                        marca: marcas.find((m)=>m.valor === marcaSelecionada)?.nome || '',
                        modelo: data.modelo || veiculoSelecionado,
                        anoModelo: parseInt(preco.AnoModelo) || 0,
                        combustivel: preco.Combustivel || 'N/A',
                        codigoFipe: preco.CodigoFipe || 'N/A',
                        mesReferencia: preco.MesReferencia || 'N/A',
                        tipoVeiculo: preco.TipoVeiculo || 1,
                        siglaCombustivel: preco.SiglaCombustivel || 'N/A',
                        dataConsulta: new Date().toLocaleString('pt-BR')
                    }));
                setPrecos(precosFormatados);
                setEstadoPrecos({
                    status: 'success'
                });
                // Notificar componente pai com o primeiro preço (mais recente)
                if (onVeiculoSelecionado && precosFormatados.length > 0) {
                    const precoMaisRecente = precosFormatados[0];
                    const marcaNome = marcas.find((m)=>m.valor === marcaSelecionada)?.nome || '';
                    onVeiculoSelecionado({
                        marca: marcaNome,
                        modelo: precoMaisRecente.modelo,
                        preco: precoMaisRecente.valor,
                        ano: precoMaisRecente.anoModelo,
                        combustivel: precoMaisRecente.combustivel
                    });
                }
            } else {
                throw new Error('Nenhum preço encontrado para este veículo');
            }
        } catch (error) {
            console.error('Erro ao buscar preços FIPE:', error);
            setEstadoPrecos({
                status: 'error',
                erro: error instanceof Error ? error.message : 'Erro ao carregar preços. Tente novamente.'
            });
            setPrecos([]);
        }
    };
    const formatarValor = (valor)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$fipe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fipeService"].formatarValor(valor);
    };
    const resetarConsulta = ()=>{
        setTipoVeiculo('carros');
        setMarcaSelecionada('');
        setVeiculoSelecionado('');
        setVeiculos([]);
        setPrecos([]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white rounded-lg shadow-lg p-6 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-blue-100 p-2 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"], {
                                    className: "w-5 h-5 text-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold text-gray-900",
                                children: "Consulta FIPE"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: resetarConsulta,
                        className: "text-sm text-gray-500 hover:text-gray-700 transition-colors",
                        children: "Limpar consulta"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ConsultaFipe.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Tipo de Veículo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 209,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-3",
                                children: [
                                    'carros',
                                    'motos',
                                    'caminhoes'
                                ].map((tipo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTipoVeiculo(tipo),
                                        className: `p-3 rounded-lg border-2 transition-all ${tipoVeiculo === tipo ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"], {
                                                    className: "w-5 h-5 mx-auto mb-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium capitalize",
                                                    children: tipo
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                            lineNumber: 223,
                                            columnNumber: 17
                                        }, this)
                                    }, tipo, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Marca"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: marcaSelecionada,
                                        onChange: (e)=>setMarcaSelecionada(e.target.value),
                                        disabled: estadoMarcas.status === 'loading',
                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Selecione uma marca"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                lineNumber: 244,
                                                columnNumber: 15
                                            }, this),
                                            marcas.map((marca, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: marca.valor,
                                                    children: marca.nome
                                                }, `${marca.valor}-${index}`, false, {
                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    estadoMarcas.status === 'loading' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                        className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            estadoMarcas.status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-sm text-red-600 flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this),
                                    estadoMarcas.erro
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this),
                    marcaSelecionada && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Modelo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: veiculoSelecionado,
                                        onChange: (e)=>setVeiculoSelecionado(e.target.value),
                                        disabled: estadoVeiculos.status === 'loading',
                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Selecione um modelo"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                lineNumber: 276,
                                                columnNumber: 17
                                            }, this),
                                            veiculos.map((veiculo, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: veiculo.modelo,
                                                    children: veiculo.modelo
                                                }, `${veiculo.modelo}-${index}`, false, {
                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 270,
                                        columnNumber: 15
                                    }, this),
                                    estadoVeiculos.status === 'loading' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                        className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 284,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            estadoVeiculos.status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-sm text-red-600 flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this),
                                    estadoVeiculos.erro
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 288,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                        lineNumber: 265,
                        columnNumber: 11
                    }, this),
                    veiculoSelecionado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-medium text-gray-900 mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 300,
                                        columnNumber: 15
                                    }, this),
                                    "Informações do Veículo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 299,
                                columnNumber: 13
                            }, this),
                            estadoPrecos.status === 'loading' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center py-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader$3e$__["Loader"], {
                                        className: "w-6 h-6 animate-spin text-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 306,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 text-gray-600",
                                        children: "Buscando preços..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 307,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 305,
                                columnNumber: 15
                            }, this),
                            estadoPrecos.status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-red-50 border border-red-200 rounded-lg p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-red-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                lineNumber: 314,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Erro ao buscar preços"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                lineNumber: 315,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-red-600 text-sm mt-1",
                                        children: estadoPrecos.erro
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 317,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this),
                            estadoPrecos.status === 'success' && precos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: precos.map((preco, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 rounded-lg p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"], {
                                                                    className: "w-4 h-4 text-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                    lineNumber: 328,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium text-gray-900",
                                                                    children: preco.modelo
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                    lineNumber: 329,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                            lineNumber: 327,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1 text-sm text-gray-600",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                            lineNumber: 333,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "Ano: ",
                                                                                preco.anoModelo
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                            lineNumber: 334,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__["Fuel"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                            lineNumber: 337,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "Combustível: ",
                                                                                preco.combustivel
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                            lineNumber: 338,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                    lineNumber: 336,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                            lineNumber: 341,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "Código FIPE: ",
                                                                                preco.codigoFipe
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                            lineNumber: 342,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                                    lineNumber: 340,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-right",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-2xl font-bold text-green-600 mb-1",
                                                            children: formatarValor(preco.valor)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-500",
                                                            children: [
                                                                "Ref: ",
                                                                preco.mesReferencia
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-gray-400 mt-1",
                                                            children: "Fonte: FIPE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                            lineNumber: 354,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsultaFipe.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsultaFipe.tsx",
                                            lineNumber: 325,
                                            columnNumber: 21
                                        }, this)
                                    }, index, false, {
                                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                                        lineNumber: 324,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsultaFipe.tsx",
                                lineNumber: 322,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsultaFipe.tsx",
                        lineNumber: 298,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ConsultaFipe.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ConsultaFipe.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ModalConsultaVeiculo.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ModalConsultaVeiculo
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-ssr] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsultaFipe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ConsultaFipe.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ModalConsultaVeiculo({ isOpen, onClose, onVeiculoAdicionado, titulo = "Consultar Veículo FIPE" }) {
    const [veiculoSelecionado, setVeiculoSelecionado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleVeiculoSelecionado = (dados)=>{
        setVeiculoSelecionado(dados);
    };
    const handleAdicionarVeiculo = ()=>{
        if (veiculoSelecionado && onVeiculoAdicionado) {
            onVeiculoAdicionado(veiculoSelecionado);
            setVeiculoSelecionado(null);
            onClose();
        }
    };
    const handleClose = ()=>{
        setVeiculoSelecionado(null);
        onClose();
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-100 p-2 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"], {
                                        className: "w-5 h-5 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-gray-900",
                                    children: titulo
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleClose,
                            className: "text-gray-400 hover:text-gray-600 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsultaFipe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            onVeiculoSelecionado: handleVeiculoSelecionado,
                            className: "border-0 shadow-none p-0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        veiculoSelecionado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 p-4 bg-green-50 border border-green-200 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-medium text-green-800 mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, this),
                                        "Veículo Selecionado"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-green-700 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Marca:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                veiculoSelecionado.marca
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                            lineNumber: 81,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Modelo:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                veiculoSelecionado.modelo
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Ano:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                veiculoSelecionado.ano
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Combustível:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                veiculoSelecionado.combustivel
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Valor FIPE:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                veiculoSelecionado.preco
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 justify-end p-6 border-t border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleClose,
                            className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                            children: "Cancelar"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        veiculoSelecionado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAdicionarVeiculo,
                            className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this),
                                "Adicionar Veículo"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                            lineNumber: 100,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ModalConsultaVeiculo.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(app)/fipe/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>FipePage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-ssr] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsultaFipe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ConsultaFipe.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModalConsultaVeiculo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ModalConsultaVeiculo.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function FipePage() {
    const [modalAberto, setModalAberto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [veiculosSalvos, setVeiculosSalvos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const handleVeiculoAdicionado = (veiculo)=>{
        const novoVeiculo = {
            id: Date.now().toString(),
            ...veiculo,
            dataConsulta: new Date().toLocaleDateString('pt-BR')
        };
        setVeiculosSalvos((prev)=>[
                novoVeiculo,
                ...prev
            ]);
    };
    const removerVeiculo = (id)=>{
        setVeiculosSalvos((prev)=>prev.filter((v)=>v.id !== id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold text-gray-900 flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"], {
                                                className: "w-8 h-8 text-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                lineNumber: 44,
                                                columnNumber: 17
                                            }, this),
                                            "Consulta FIPE"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mt-2",
                                        children: "Consulte preços de veículos segundo a tabela FIPE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                        lineNumber: 47,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setModalAberto(true),
                                className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, this),
                                    "Nova Consulta"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsultaFipe$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                onVeiculoSelecionado: handleVeiculoAdicionado
                            }, void 0, false, {
                                fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-lg shadow-lg p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                    className: "w-5 h-5 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                    lineNumber: 73,
                                                    columnNumber: 17
                                                }, this),
                                                "Sobre a FIPE"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-600 space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "A ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "FIPE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                            lineNumber: 78,
                                                            columnNumber: 21
                                                        }, this),
                                                        " (Fundação Instituto de Pesquisas Econômicas) é responsável pela divulgação da Tabela FIPE de preços médios de veículos."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Os preços são atualizados mensalmente e servem como referência para o mercado de veículos usados no Brasil."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 p-3 bg-blue-50 rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-blue-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                    lineNumber: 87,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: "Dica"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                    lineNumber: 88,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                            lineNumber: 86,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-blue-600 text-xs mt-1",
                                                            children: "Use a consulta FIPE para avaliar veículos em transferências e documentações."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                            lineNumber: 90,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                veiculosSalvos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-lg shadow-lg p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "w-5 h-5 text-green-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 19
                                                }, this),
                                                "Últimas Consultas"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                            lineNumber: 101,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 max-h-96 overflow-y-auto",
                                            children: veiculosSalvos.map((veiculo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border border-gray-200 rounded-lg p-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-start",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-medium text-gray-900 text-sm",
                                                                        children: [
                                                                            veiculo.marca,
                                                                            " ",
                                                                            veiculo.modelo
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                        lineNumber: 110,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-500",
                                                                        children: [
                                                                            veiculo.ano,
                                                                            " • ",
                                                                            veiculo.combustivel
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                        lineNumber: 113,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-bold text-green-600 mt-1",
                                                                        children: veiculo.preco
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                        lineNumber: 116,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-400",
                                                                        children: veiculo.dataConsulta
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                        lineNumber: 119,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                lineNumber: 109,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removerVeiculo(veiculo.id),
                                                                className: "text-gray-400 hover:text-red-500 transition-colors text-xs",
                                                                children: "✕"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                                lineNumber: 123,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 23
                                                    }, this)
                                                }, veiculo.id, false, {
                                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                            lineNumber: 105,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(app)/fipe/page.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModalConsultaVeiculo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    isOpen: modalAberto,
                    onClose: ()=>setModalAberto(false),
                    onVeiculoAdicionado: handleVeiculoAdicionado
                }, void 0, false, {
                    fileName: "[project]/src/app/(app)/fipe/page.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(app)/fipe/page.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(app)/fipe/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),

};

//# sourceMappingURL=src_38da27d8._.js.map