module.exports = {

"[project]/.next-internal/server/app/api/fipe/precos-reais/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/src/app/api/fipe/precos-reais/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        const body = await request.json();
        const { tipoVeiculo, codigoMarca, modeloNome } = body;
        if (!tipoVeiculo || !codigoMarca || !modeloNome) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Parâmetros obrigatórios: tipoVeiculo, codigoMarca, modeloNome',
                code: 'MISSING_PARAMETERS'
            }, {
                status: 400
            });
        }
        // Buscar modelos da marca para encontrar o código do modelo
        const modelosResponse = await fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos`);
        if (!modelosResponse.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Erro ao buscar modelos FIPE',
                code: 'FIPE_MODELS_ERROR'
            }, {
                status: 500
            });
        }
        const modelosData = await modelosResponse.json();
        const modelo = modelosData.modelos.find((m)=>m.nome.toLowerCase().includes(modeloNome.toLowerCase()) || modeloNome.toLowerCase().includes(m.nome.toLowerCase()));
        if (!modelo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Modelo não encontrado na base FIPE',
                code: 'MODEL_NOT_FOUND'
            }, {
                status: 404
            });
        }
        // Buscar anos disponíveis para o modelo
        const anosResponse = await fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${modelo.codigo}/anos`);
        if (!anosResponse.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Erro ao buscar anos FIPE',
                code: 'FIPE_YEARS_ERROR'
            }, {
                status: 500
            });
        }
        const anos = await anosResponse.json();
        // Buscar preços para os últimos 3 anos para performance
        const anosLimitados = anos.slice(0, 3);
        const precosPromises = anosLimitados.map(async (ano)=>{
            try {
                const precoResponse = await fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${modelo.codigo}/anos/${ano.codigo}`);
                if (precoResponse.ok) {
                    return await precoResponse.json();
                }
                return null;
            } catch  {
                return null;
            }
        });
        const precos = (await Promise.all(precosPromises)).filter(Boolean);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            modelo: modelo.nome,
            totalPrecos: precos.length,
            precos,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro na API FIPE preços:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno do servidor',
            code: 'INTERNAL_ERROR'
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__85b854f6._.js.map