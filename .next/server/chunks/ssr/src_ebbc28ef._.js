module.exports = {

"[project]/src/components/LoadingSpinner.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "CardLoader": ()=>CardLoader,
    "PageLoader": ()=>PageLoader,
    "TableSkeleton": ()=>TableSkeleton,
    "default": ()=>LoadingSpinner
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-ssr] (ecmascript) <export default as LoaderIcon>");
'use client';
;
;
;
function LoadingSpinner({ size = 'md', color = 'blue', text = 'Carregando...' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };
    const colorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        gray: 'text-gray-600'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center py-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                animate: {
                    rotate: 360
                },
                transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                },
                className: `${sizeClasses[size]} ${colorClasses[color]} mb-2`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderIcon$3e$__["LoaderIcon"], {
                    className: "h-full w-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingSpinner.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/LoadingSpinner.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                initial: {
                    opacity: 0.5
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                },
                className: `text-sm ${colorClasses[color]} font-medium`,
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/LoadingSpinner.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LoadingSpinner.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
function PageLoader() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl shadow-xl p-8 border border-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingSpinner, {
                size: "lg",
                text: "Carregando página..."
            }, void 0, false, {
                fileName: "[project]/src/components/LoadingSpinner.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/LoadingSpinner.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/LoadingSpinner.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
function CardLoader() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-50 rounded-lg p-6 animate-pulse",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 bg-gray-200 rounded w-3/4"
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingSpinner.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 bg-gray-200 rounded w-1/2"
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingSpinner.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 bg-gray-200 rounded w-2/3"
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingSpinner.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/LoadingSpinner.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/LoadingSpinner.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
function TableSkeleton({ rows = 5, cols = 4 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: Array.from({
            length: rows
        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex space-x-4",
                children: Array.from({
                    length: cols
                }, (_, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-gray-200 rounded animate-pulse flex-1"
                    }, j, false, {
                        fileName: "[project]/src/components/LoadingSpinner.tsx",
                        lineNumber: 82,
                        columnNumber: 13
                    }, this))
            }, i, false, {
                fileName: "[project]/src/components/LoadingSpinner.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/LoadingSpinner.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ProtectedRoute.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ProtectedRoute": ()=>ProtectedRoute
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSpinner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoadingSpinner.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function ProtectedRoute({ children, requiredRole }) {
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (status === 'loading') return; // Ainda carregando
        if (!session) {
            // Aguardar um pouco antes de redirecionar para evitar redirects prematuros
            const timer = setTimeout(()=>{
                if (!session && status === 'unauthenticated') {
                    // Não autenticado - redirecionar para login
                    const currentUrl = window.location.pathname + window.location.search;
                    const tenant = new URLSearchParams(window.location.search).get('tenant') || 'demo';
                    router.push(`/auth/login?tenant=${tenant}&callbackUrl=${encodeURIComponent(currentUrl)}`);
                }
            }, 1000) // Aguardar 1 segundo
            ;
            return ()=>clearTimeout(timer);
        }
        if (requiredRole && session.user.role !== requiredRole) {
            // Usuário não tem a role necessária
            router.push('/unauthorized');
            return;
        }
    }, [
        session,
        status,
        router,
        requiredRole
    ]);
    if (status === 'loading') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSpinner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/ProtectedRoute.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ProtectedRoute.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this);
    }
    if (!session) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSpinner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/ProtectedRoute.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ProtectedRoute.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    if (requiredRole && session.user.role !== requiredRole) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-900 mb-2",
                        children: "Acesso Negado"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ProtectedRoute.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Você não tem permissão para acessar esta página."
                    }, void 0, false, {
                        fileName: "[project]/src/components/ProtectedRoute.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ProtectedRoute.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ProtectedRoute.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
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
        const cepLimpo = this.limparCep(cep);
        if (!this.validarCep(cepLimpo)) {
            throw new Error('CEP inválido. Use o formato 12345678 ou 12345-678');
        }
        try {
            const response = await fetch(`${this.baseUrl}/v1/${cepLimpo}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('CEP não encontrado');
                }
                throw new Error(`Erro ao buscar CEP: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na consulta de CEP:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Falha ao consultar CEP');
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
// Essencial para validação de clientes empresariais
__turbopack_context__.s({
    "cnpjService": ()=>cnpjService,
    "cnpjUtils": ()=>cnpjUtils,
    "useCnpj": ()=>useCnpj
});
class CnpjService {
    baseUrl = 'https://brasilapi.com.br/api/cnpj/v1';
    /**
   * Consulta dados da empresa por CNPJ
   */ async consultarCnpj(cnpj) {
        const cnpjLimpo = this.limparCnpj(cnpj);
        if (!this.validarCnpj(cnpjLimpo)) {
            throw new Error('CNPJ inválido. Use o formato 12345678000123');
        }
        try {
            const response = await fetch(`${this.baseUrl}/${cnpjLimpo}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('CNPJ não encontrado na Receita Federal');
                }
                throw new Error(`Erro ao consultar CNPJ: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro na consulta de CNPJ:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Falha ao consultar CNPJ');
        }
    }
    /**
   * Remove formatação do CNPJ
   */ limparCnpj(cnpj) {
        return cnpj.replace(/\D/g, '');
    }
    /**
   * Valida CNPJ usando algoritmo oficial
   */ validarCnpj(cnpj) {
        const cnpjLimpo = this.limparCnpj(cnpj);
        if (cnpjLimpo.length !== 14) return false;
        if (/^(\d)\1+$/.test(cnpjLimpo)) return false; // Todos os dígitos iguais
        // Calcular primeiro dígito verificador
        let soma = 0;
        let peso = 2;
        for(let i = 11; i >= 0; i--){
            soma += parseInt(cnpjLimpo[i]) * peso;
            peso = peso === 9 ? 2 : peso + 1;
        }
        const primeiroDigito = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (parseInt(cnpjLimpo[12]) !== primeiroDigito) return false;
        // Calcular segundo dígito verificador
        soma = 0;
        peso = 2;
        for(let i = 12; i >= 0; i--){
            soma += parseInt(cnpjLimpo[i]) * peso;
            peso = peso === 9 ? 2 : peso + 1;
        }
        const segundoDigito = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return parseInt(cnpjLimpo[13]) === segundoDigito;
    }
    /**
   * Formata CNPJ para exibição
   */ formatarCnpj(cnpj) {
        const cnpjLimpo = this.limparCnpj(cnpj);
        if (!this.validarCnpj(cnpjLimpo)) return cnpj;
        return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    /**
   * Monta endereço completo da empresa
   */ montarEnderecoCompleto(empresa) {
        const partes = [
            empresa.descricao_tipo_logradouro && empresa.logradouro ? `${empresa.descricao_tipo_logradouro} ${empresa.logradouro}` : empresa.logradouro,
            empresa.numero,
            empresa.complemento,
            empresa.bairro,
            empresa.municipio,
            empresa.uf,
            this.formatarCep(empresa.cep)
        ].filter(Boolean);
        return partes.join(', ');
    }
    /**
   * Formata CEP
   */ formatarCep(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return cep;
        return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
    }
    /**
   * Verifica se a empresa está ativa
   */ isEmpresaAtiva(empresa) {
        return empresa.situacao_cadastral === 2; // 2 = ATIVA
    }
    /**
   * Verifica se a empresa é MEI
   */ isEmpresaMEI(empresa) {
        return empresa.opcao_pelo_mei;
    }
    /**
   * Verifica se a empresa é do Simples Nacional
   */ isEmpresaSimples(empresa) {
        return empresa.opcao_pelo_simples;
    }
    /**
   * Obter telefone principal formatado
   */ obterTelefonePrincipal(empresa) {
        if (!empresa.ddd_telefone_1 || !empresa.telefone_1) return null;
        const ddd = empresa.ddd_telefone_1;
        const telefone = empresa.telefone_1;
        // Formatar telefone baseado no tamanho
        if (telefone.length === 8) {
            return `(${ddd}) ${telefone.slice(0, 4)}-${telefone.slice(4)}`;
        } else if (telefone.length === 9) {
            return `(${ddd}) ${telefone.slice(0, 5)}-${telefone.slice(5)}`;
        }
        return `(${ddd}) ${telefone}`;
    }
    /**
   * Obter idade da empresa em anos
   */ obterIdadeEmpresa(empresa) {
        const dataInicio = new Date(empresa.data_inicio_atividade);
        const hoje = new Date();
        const diffTime = Math.abs(hoje.getTime() - dataInicio.getTime());
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        return diffYears;
    }
    /**
   * Formatar capital social
   */ formatarCapitalSocial(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
    /**
   * Obter sócios principais (com maior participação)
   */ obterSociosPrincipais(empresa, limite = 3) {
        return empresa.qsa.sort((a, b)=>b.percentual_capital_social - a.percentual_capital_social).slice(0, limite).map((socio)=>({
                nome: socio.nome_socio,
                participacao: socio.percentual_capital_social,
                cpfCnpj: socio.cnpj_cpf_do_socio
            }));
    }
}
const cnpjService = new CnpjService();
function useCnpj() {
    return {
        consultarCnpj: cnpjService.consultarCnpj.bind(cnpjService),
        validarCnpj: cnpjService.validarCnpj.bind(cnpjService),
        formatarCnpj: cnpjService.formatarCnpj.bind(cnpjService),
        montarEnderecoCompleto: cnpjService.montarEnderecoCompleto.bind(cnpjService),
        isEmpresaAtiva: cnpjService.isEmpresaAtiva.bind(cnpjService),
        isEmpresaMEI: cnpjService.isEmpresaMEI.bind(cnpjService),
        isEmpresaSimples: cnpjService.isEmpresaSimples.bind(cnpjService),
        obterTelefonePrincipal: cnpjService.obterTelefonePrincipal.bind(cnpjService),
        obterIdadeEmpresa: cnpjService.obterIdadeEmpresa.bind(cnpjService),
        formatarCapitalSocial: cnpjService.formatarCapitalSocial.bind(cnpjService),
        obterSociosPrincipais: cnpjService.obterSociosPrincipais.bind(cnpjService)
    };
}
const cnpjUtils = {
    /**
   * Tipos de situação cadastral
   */ situacoesCadastrais: {
        1: 'NULA',
        2: 'ATIVA',
        3: 'SUSPENSA',
        4: 'INAPTA',
        8: 'BAIXADA'
    },
    /**
   * Obter descrição da situação
   */ obterSituacao (codigo) {
        return this.situacoesCadastrais[codigo] || 'DESCONHECIDA';
    },
    /**
   * Obter cor da situação para UI
   */ obterCorSituacao (codigo) {
        const cores = {
            1: 'red',
            2: 'green',
            3: 'yellow',
            4: 'orange',
            8: 'red' // BAIXADA
        };
        return cores[codigo] || 'gray';
    },
    /**
   * Gerar resumo da empresa
   */ gerarResumo (empresa) {
        return {
            nomeExibicao: empresa.nome_fantasia || empresa.razao_social,
            situacao: empresa.descricao_situacao_cadastral,
            corSituacao: this.obterCorSituacao(empresa.situacao_cadastral),
            endereco: cnpjService.montarEnderecoCompleto(empresa),
            telefone: cnpjService.obterTelefonePrincipal(empresa),
            idade: cnpjService.obterIdadeEmpresa(empresa),
            porte: empresa.descricao_porte
        };
    }
};
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
            const url = `${this.baseUrl}/marcas/v1/${tipoVeiculo}${params.toString() ? `?${params}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar marcas: ${response.statusText}`);
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
            const url = `${this.baseUrl}/veiculos/v1/${tipoVeiculo}/${codigoMarca}${params.toString() ? `?${params}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar veículos: ${response.statusText}`);
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
            const url = `${this.baseUrl}/preco/v1/${codigoFipe}${params.toString() ? `?${params}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar preço: ${response.statusText}`);
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
            const url = `${this.baseUrl}/tabelas/v1`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar tabelas: ${response.statusText}`);
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
                        const empresa = await this.cnpj.consultarCnpj(valor);
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
                        const empresaInfo = await this.cnpj.consultarCnpj(dados.cnpj);
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
                    resultado.endereco = cepInfo;
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
            const cepInfo = await this.cep.buscarCep(cep);
            return {
                success: true,
                endereco: {
                    logradouro: cepInfo.street || '',
                    bairro: cepInfo.neighborhood || '',
                    cidade: cepInfo.city || '',
                    estado: cepInfo.state || '',
                    cep: cepInfo.cep || ''
                }
            };
        } catch (error) {
            return {
                success: false,
                erro: `Erro ao buscar endereço: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
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
            const empresa = await this.cnpj.consultarCnpj(cnpj);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <locals>");
}),
"[project]/src/components/admin/NovoClienteModal.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>NovoClienteModal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building.js [app-ssr] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
;
function NovoClienteModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        cpfCnpj: '',
        tipoCliente: 'FISICO',
        phone: '',
        email: '',
        endereco: '',
        cidade: '',
        cep: '',
        observacoes: ''
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [cpfCnpjValidation, setCpfCnpjValidation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'vazio',
        mensagem: '',
        formatado: ''
    });
    const [cepLoading, setCepLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [empresaInfo, setEmpresaInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Validação de CPF/CNPJ em tempo real
    const handleCpfCnpjChange = async (value)=>{
        if (formData.tipoCliente === 'FISICO') {
            const validation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].formularios.validarCpfTempoReal(value);
            setCpfCnpjValidation(validation);
            return validation.formatado;
        } else {
            const formatted = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].formatadores.cnpj(value);
            const valido = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].validadores.cnpj(formatted);
            if (formatted.replace(/\D/g, '').length === 14) {
                try {
                    const resultado = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].buscarEmpresaPorCnpj(formatted);
                    if (resultado.success && resultado.empresa) {
                        setEmpresaInfo(resultado.empresa);
                        setCpfCnpjValidation({
                            status: 'valido',
                            mensagem: 'CNPJ válido - Empresa encontrada',
                            formatado: formatted
                        });
                        // Auto-preencher dados da empresa
                        setFormData((prev)=>({
                                ...prev,
                                name: resultado.empresa.razao_social,
                                endereco: `${resultado.empresa.logradouro}, ${resultado.empresa.numero}`,
                                cidade: resultado.empresa.municipio,
                                cep: resultado.empresa.cep
                            }));
                    } else {
                        setCpfCnpjValidation({
                            status: 'invalido',
                            mensagem: 'CNPJ não encontrado na Receita Federal',
                            formatado: formatted
                        });
                    }
                } catch (error) {
                    setCpfCnpjValidation({
                        status: valido ? 'valido' : 'invalido',
                        mensagem: valido ? 'CNPJ válido' : 'CNPJ inválido',
                        formatado: formatted
                    });
                }
            } else if (formatted.replace(/\D/g, '').length > 0) {
                setCpfCnpjValidation({
                    status: 'incompleto',
                    mensagem: `${formatted.replace(/\D/g, '').length}/14 dígitos`,
                    formatado: formatted
                });
            } else {
                setCpfCnpjValidation({
                    status: 'vazio',
                    mensagem: '',
                    formatado: ''
                });
            }
            return formatted;
        }
    };
    // Auto-completar endereço por CEP
    const handleCepChange = async (value)=>{
        const formatted = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].formatadores.cep(value);
        if (formatted.replace(/\D/g, '').length === 8) {
            setCepLoading(true);
            try {
                const resultado = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].autocompletarEndereco(formatted);
                if (resultado.success && resultado.endereco) {
                    setFormData((prev)=>({
                            ...prev,
                            endereco: resultado.endereco.logradouro,
                            cidade: resultado.endereco.cidade
                        }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            } finally{
                setCepLoading(false);
            }
        }
        return formatted;
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
        setEmpresaInfo(null);
        onClose();
    };
    const formatCpfCnpj = (value)=>{
        const numero = value.replace(/\D/g, '');
        if (formData.tipoCliente === 'FISICO') {
            // Formato CPF: 000.000.000-00
            return numero.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14);
        } else {
            // Formato CNPJ: 00.000.000/0000-00
            return numero.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2').slice(0, 18);
        }
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
    const formatCep = (value)=>{
        const numero = value.replace(/\D/g, '');
        return numero.replace(/(\d{5})(\d{1,3})/, '$1-$2').slice(0, 9);
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-100 p-2 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "w-5 h-5 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-gray-900",
                                    children: "Novo Cliente"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 224,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 220,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-gray-600 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 226,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "Tipo de Cliente"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        setEmpresaInfo(null);
                                                    },
                                                    className: "text-blue-600 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pessoa Física"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 242,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        setEmpresaInfo(null);
                                                    },
                                                    className: "text-blue-600 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pessoa Jurídica"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: [
                                                formData.tipoCliente === 'FISICO' ? 'Nome Completo' : 'Razão Social',
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 280,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.name,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    name: e.target.value
                                                }),
                                            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`,
                                            placeholder: formData.tipoCliente === 'FISICO' ? 'João Silva Santos' : 'Empresa Ltda'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, this),
                                        errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-1",
                                            children: errors.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 292,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: [
                                                formData.tipoCliente === 'FISICO' ? 'CPF' : 'CNPJ',
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 296,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.cpfCnpj,
                                            onChange: async (e)=>{
                                                const formatted = await handleCpfCnpjChange(e.target.value);
                                                setFormData({
                                                    ...formData,
                                                    cpfCnpj: formatted
                                                });
                                            },
                                            className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${errors.cpfCnpj ? 'border-red-300 focus:ring-red-500' : cpfCnpjValidation.status === 'valido' ? 'border-green-300 focus:ring-green-500' : cpfCnpjValidation.status === 'invalido' ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`,
                                            placeholder: formData.tipoCliente === 'FISICO' ? '000.000.000-00' : '00.000.000/0000-00'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this),
                                        cpfCnpjValidation.status !== 'vazio' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `mt-1 text-sm flex items-center gap-1 ${cpfCnpjValidation.status === 'valido' ? 'text-green-600' : cpfCnpjValidation.status === 'invalido' ? 'text-red-600' : 'text-gray-600'}`,
                                            children: [
                                                cpfCnpjValidation.status === 'valido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 61
                                                }, this),
                                                cpfCnpjValidation.status === 'invalido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 63
                                                }, this),
                                                cpfCnpjValidation.status === 'incompleto' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 65
                                                }, this),
                                                cpfCnpjValidation.mensagem
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 315,
                                            columnNumber: 17
                                        }, this),
                                        errors.cpfCnpj && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-1",
                                            children: errors.cpfCnpj
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 326,
                                            columnNumber: 34
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this),
                        empresaInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-green-50 border border-green-200 rounded-lg p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-medium text-green-800 mb-2 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 334,
                                            columnNumber: 17
                                        }, this),
                                        "Dados da Empresa"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 333,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-green-700 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Razão Social:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.razao_social
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 338,
                                            columnNumber: 17
                                        }, this),
                                        empresaInfo.nome_fantasia && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Nome Fantasia:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 340,
                                                    columnNumber: 22
                                                }, this),
                                                " ",
                                                empresaInfo.nome_fantasia
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 340,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Situação:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 342,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.descricao_situacao_cadastral
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 342,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Porte:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.descricao_porte
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 343,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "CNAE:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                empresaInfo.cnae_fiscal_descricao
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 344,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 337,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 332,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Telefone *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.phone,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            phone: formatPhone(e.target.value)
                                                        }),
                                                    className: `w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'}`,
                                                    placeholder: "(16) 99999-9999"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 357,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 355,
                                            columnNumber: 15
                                        }, this),
                                        errors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-1",
                                            children: errors.phone
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 367,
                                            columnNumber: 32
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "E-mail"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 371,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 376,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 374,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 370,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this),
                                        "Endereço"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 389,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Endereço Completo"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 395,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.endereco,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    endereco: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                            placeholder: "Rua das Flores, 123, Centro"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 398,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 394,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Cidade"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 412,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 408,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "CEP"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: formData.cep,
                                                            onChange: async (e)=>{
                                                                const formatted = await handleCepChange(e.target.value);
                                                                setFormData({
                                                                    ...formData,
                                                                    cep: formatted
                                                                });
                                                            },
                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                            placeholder: "14400-000"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 426,
                                                            columnNumber: 19
                                                        }, this),
                                                        cepLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                                lineNumber: 438,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 421,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 407,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 388,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Observações"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 448,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                            className: "absolute left-3 top-3 text-gray-400 w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 452,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                            lineNumber: 453,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 451,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 447,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 justify-end pt-4 border-t border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 465,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                            lineNumber: 476,
                                            columnNumber: 15
                                        }, this),
                                        "Salvar Cliente"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                                    lineNumber: 472,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                            lineNumber: 464,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
            lineNumber: 217,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/NovoClienteModal.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/admin/clientes/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building.js [app-ssr] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProtectedRoute.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$NovoClienteModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/NovoClienteModal.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
// Dados mock para demonstração
const clientesMock = [
    {
        id: '1',
        name: 'João Silva Santos',
        cpfCnpj: '123.456.789-01',
        tipoCliente: 'FISICO',
        phone: '(16) 99999-1234',
        email: 'joao@email.com',
        cidade: 'Franca',
        status: 'ATIVO',
        createdAt: '2024-01-15',
        processosAtivos: 2,
        ultimoProcesso: 'Transferência Honda Civic'
    },
    {
        id: '2',
        name: 'Transportadora ABC Ltda',
        cpfCnpj: '12.345.678/0001-90',
        tipoCliente: 'JURIDICO',
        phone: '(16) 3333-5678',
        email: 'contato@transportadoraabc.com',
        cidade: 'Ribeirão Preto',
        status: 'ATIVO',
        createdAt: '2024-02-20',
        processosAtivos: 5,
        ultimoProcesso: 'Licenciamento Frota'
    },
    {
        id: '3',
        name: 'Maria Oliveira',
        cpfCnpj: '987.654.321-09',
        tipoCliente: 'FISICO',
        phone: '(16) 98888-5555',
        email: 'maria@outlook.com',
        cidade: 'Franca',
        status: 'ATIVO',
        createdAt: '2024-03-10',
        processosAtivos: 1,
        ultimoProcesso: 'Primeiro Emplacamento'
    }
];
function ClientesPage() {
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const [clientes, setClientes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filtroTipo, setFiltroTipo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('TODOS');
    const [filtroStatus, setFiltroStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('TODOS');
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchClientes();
    }, []);
    const fetchClientes = async ()=>{
        try {
            setLoading(true);
            const response = await fetch('/api/customers');
            if (response.ok) {
                const data = await response.json();
                // Converter dados do banco para o formato esperado
                const clientesFormatados = data.map((customer)=>({
                        id: customer.id,
                        name: customer.name,
                        cpfCnpj: customer.cpfCnpj,
                        tipoCliente: customer.tipoCliente,
                        phone: customer.phone,
                        email: customer.email,
                        cidade: customer.cidade,
                        status: 'ATIVO',
                        createdAt: new Date(customer.createdAt).toLocaleDateString('pt-BR'),
                        processosAtivos: 0,
                        ultimoProcesso: undefined
                    }));
                setClientes(clientesFormatados);
            } else {
                console.error('Erro ao buscar clientes');
                // Em caso de erro, usar dados mock temporariamente
                setClientes(clientesMock);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setClientes(clientesMock);
        } finally{
            setLoading(false);
        }
    };
    const handleAddCliente = async (novoCliente)=>{
        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoCliente)
            });
            if (response.ok) {
                await fetchClientes(); // Recarregar lista
                setIsModalOpen(false);
            } else {
                const error = await response.json();
                console.error('Erro ao criar cliente:', error.error);
                alert('Erro ao criar cliente: ' + error.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao criar cliente');
        }
    };
    const clientesFiltrados = clientes.filter((cliente)=>{
        const matchSearch = cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.cpfCnpj.includes(searchTerm) || cliente.phone.includes(searchTerm);
        const matchTipo = filtroTipo === 'TODOS' || cliente.tipoCliente === filtroTipo;
        const matchStatus = filtroStatus === 'TODOS' || cliente.status === filtroStatus;
        return matchSearch && matchTipo && matchStatus;
    });
    const getStatusBadge = (status)=>{
        const styles = {
            ATIVO: 'bg-green-100 text-green-800 border-green-200',
            INATIVO: 'bg-gray-100 text-gray-800 border-gray-200',
            SUSPENSO: 'bg-red-100 text-red-800 border-red-200'
        };
        return styles[status] || styles.ATIVO;
    };
    const getTipoIcon = (tipo)=>{
        return tipo === 'FISICO' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/src/app/admin/clientes/page.tsx",
            lineNumber: 159,
            columnNumber: 32
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/src/app/admin/clientes/page.tsx",
            lineNumber: 159,
            columnNumber: 63
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-b border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold text-gray-900",
                                        children: "Clientes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mt-1",
                                        children: [
                                            session?.user?.tenant?.name,
                                            " - ",
                                            loading ? 'Carregando...' : `${clientes.length} clientes cadastrados`
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/dashboard",
                                        className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                                        children: "Voltar ao Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsModalOpen(true),
                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            "Novo Cliente"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/clientes/page.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 bg-white border-b border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Buscar por nome, CPF/CNPJ ou telefone...",
                                    className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500",
                                    value: filtroTipo,
                                    onChange: (e)=>setFiltroTipo(e.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "TODOS",
                                            children: "Todos os Tipos"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "FISICO",
                                            children: "Pessoa Física"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "JURIDICO",
                                            children: "Pessoa Jurídica"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500",
                                    value: filtroStatus,
                                    onChange: (e)=>setFiltroStatus(e.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "TODOS",
                                            children: "Todos os Status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 225,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "ATIVO",
                                            children: "Ativo"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "INATIVO",
                                            children: "Inativo"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 227,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "SUSPENSO",
                                            children: "Suspenso"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 228,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/clientes/page.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg border border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Total de Clientes"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: clientes.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-100 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "w-6 h-6 text-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 243,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg border border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Pessoa Física"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: clientes.filter((c)=>c.tipoCliente === 'FISICO').length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 251,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-100 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "w-6 h-6 text-green-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                lineNumber: 258,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 257,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg border border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Pessoa Jurídica"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: clientes.filter((c)=>c.tipoCliente === 'JURIDICO').length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 265,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-purple-100 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                className: "w-6 h-6 text-purple-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg border border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Processos Ativos"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-gray-900",
                                                    children: clientes.reduce((acc, c)=>acc + c.processosAtivos, 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 279,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-orange-100 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                                className: "w-6 h-6 text-orange-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                    lineNumber: 278,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg border border-gray-200 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "min-w-full divide-y divide-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-gray-50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                    children: "Cliente"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                    children: "Contato"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                    children: "Localização"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                    children: "Atividade"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                    children: "Ações"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                            lineNumber: 297,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "bg-white divide-y divide-gray-200",
                                        children: clientesFiltrados.map((cliente)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-gray-50 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center",
                                                                    children: getTipoIcon(cliente.tipoCliente)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                    lineNumber: 323,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "ml-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-medium text-gray-900",
                                                                            children: cliente.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                            lineNumber: 327,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm text-gray-500",
                                                                            children: cliente.cpfCnpj
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                            lineNumber: 328,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                    lineNumber: 326,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                            lineNumber: 322,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-900 flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                        className: "w-3 h-3 text-gray-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                        lineNumber: 334,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    cliente.phone
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                lineNumber: 333,
                                                                columnNumber: 23
                                                            }, this),
                                                            cliente.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-500 flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                        className: "w-3 h-3 text-gray-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                        lineNumber: 339,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    cliente.email
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                lineNumber: 338,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-900 flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "w-3 h-3 text-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 25
                                                                }, this),
                                                                cliente.cidade || 'Não informado'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                            lineNumber: 345,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(cliente.status)}`,
                                                            children: cliente.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-900",
                                                                children: [
                                                                    cliente.processosAtivos,
                                                                    " processo",
                                                                    cliente.processosAtivos !== 1 ? 's' : '',
                                                                    " ativo",
                                                                    cliente.processosAtivos !== 1 ? 's' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 23
                                                            }, this),
                                                            cliente.ultimoProcesso && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-500",
                                                                children: cliente.ultimoProcesso
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                lineNumber: 360,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 whitespace-nowrap text-right",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "text-gray-400 hover:text-gray-600 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                                lineNumber: 365,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                            lineNumber: 364,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, cliente.id, true, {
                                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                                lineNumber: 320,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 295,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/clientes/page.tsx",
                            lineNumber: 294,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this),
                    clientesFiltrados.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg border border-gray-200 p-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "w-12 h-12 text-gray-400 mx-auto mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 378,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-900 mb-2",
                                children: "Nenhum cliente encontrado"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 379,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 mb-4",
                                children: searchTerm || filtroTipo !== 'TODOS' || filtroStatus !== 'TODOS' ? 'Tente ajustar os filtros ou termo de busca' : 'Comece adicionando seu primeiro cliente ao sistema'
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 380,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsModalOpen(true),
                                className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg",
                                children: "Adicionar Cliente"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/clientes/page.tsx",
                                lineNumber: 386,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/clientes/page.tsx",
                        lineNumber: 377,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/clientes/page.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$NovoClienteModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isModalOpen,
                onClose: ()=>setIsModalOpen(false),
                onSave: handleAddCliente
            }, void 0, false, {
                fileName: "[project]/src/app/admin/clientes/page.tsx",
                lineNumber: 397,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/clientes/page.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
function ClientesPageWrapper() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProtectedRoute"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClientesPage, {}, void 0, false, {
            fileName: "[project]/src/app/admin/clientes/page.tsx",
            lineNumber: 409,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/clientes/page.tsx",
        lineNumber: 408,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = ClientesPageWrapper;
}),

};

//# sourceMappingURL=src_ebbc28ef._.js.map