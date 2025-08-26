module.exports = {

"[project]/.next-internal/server/app/api/fipe/preco/[codigo]/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/fipe/preco/[codigo]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request, { params }) {
    try {
        const { codigo } = await params;
        if (!codigo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Código do veículo é obrigatório'
            }, {
                status: 400
            });
        }
        // Parse código para extrair tipo, marca, modelo e ano
        // Formato esperado: cars/brands/59/models/5940/years/2014-3
        const url = new URL(request.url);
        const tipo = url.searchParams.get('tipo') || 'cars';
        const marca = url.searchParams.get('marca');
        const modelo = url.searchParams.get('modelo');
        const ano = url.searchParams.get('ano');
        // Try new FIPE API v2 first
        try {
            let fipeUrl = '';
            if (marca && modelo && ano) {
                // Use full path if we have all parameters
                fipeUrl = `https://fipe.parallelum.com.br/api/v2/${tipo}/brands/${marca}/models/${modelo}/years/${ano}`;
            } else {
                // Fallback: try to use codigo as fipe code
                fipeUrl = `https://fipe.parallelum.com.br/api/v2/${tipo}/${codigo}/years`;
            }
            const response = await fetch(fipeUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; DespaSys/1.0)'
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Format response to match expected structure
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    valor: data.price || data.valor,
                    marca: data.brand || data.marca,
                    modelo: data.model || data.modelo,
                    anoModelo: data.modelYear || data.anoModelo,
                    combustivel: data.fuel || data.combustivel,
                    codigoFipe: data.codeFipe || data.codigoFipe,
                    mesReferencia: data.referenceMonth || data.mesReferencia,
                    tipoVeiculo: data.vehicleType || data.tipoVeiculo,
                    siglaCombustivel: data.fuelAcronym || data.siglaCombustivel,
                    source: 'FIPE API v2',
                    timestamp: new Date().toISOString()
                });
            }
        } catch (fipeError) {
            console.warn('New FIPE API v2 failed, trying BrasilAPI fallback:', fipeError);
        }
        // Fallback to BrasilAPI
        const fallbackResponse = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${codigo}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; DespaSys/1.0)'
            }
        });
        if (!fallbackResponse.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Erro ao consultar preço do veículo'
            }, {
                status: fallbackResponse.status
            });
        }
        const fallbackData = await fallbackResponse.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...fallbackData,
            source: 'BrasilAPI (fallback)',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao consultar preço FIPE:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno do servidor'
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5d371032._.js.map