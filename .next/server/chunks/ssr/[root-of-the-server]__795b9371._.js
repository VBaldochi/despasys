module.exports = {

"[project]/src/store/processoStore.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "formatDate": ()=>formatDate,
    "formatDateTime": ()=>formatDateTime,
    "getPriorityColor": ()=>getPriorityColor,
    "getPriorityLabel": ()=>getPriorityLabel,
    "getStatusColor": ()=>getStatusColor,
    "getStatusLabel": ()=>getStatusLabel,
    "useProcessStore": ()=>useProcessStore
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'date-fns'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'date-fns/locale'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
// Mock data para demonstração
const MOCK_PROCESSES = [
    {
        id: '1',
        customerId: 'customer-1',
        customerName: 'João Silva',
        customerPhone: '(16) 99999-9999',
        customerEmail: 'joao@email.com',
        customerCPF: '12345678900',
        title: 'Licenciamento Anual - Honda Civic',
        description: 'Licenciamento anual do veículo Honda Civic 2020',
        serviceType: 'licenciamento',
        status: 'PROCESSING',
        priority: 'MEDIUM',
        startDate: new Date('2024-01-15'),
        estimatedEndDate: new Date('2024-01-25'),
        progress: 75,
        totalCost: 280.50,
        steps: [
            {
                id: 'step-1',
                title: 'Recebimento dos Documentos',
                description: 'Documentos do veículo e proprietário recebidos',
                status: 'completed',
                completedAt: new Date('2024-01-16'),
                documents: [
                    'doc1.pdf',
                    'doc2.pdf'
                ]
            },
            {
                id: 'step-2',
                title: 'Análise da Documentação',
                description: 'Verificação e validação dos documentos',
                status: 'completed',
                completedAt: new Date('2024-01-18')
            },
            {
                id: 'step-3',
                title: 'Pagamento das Taxas',
                description: 'Pagamento das taxas no DETRAN',
                status: 'in_progress',
                estimatedDate: new Date('2024-01-22')
            },
            {
                id: 'step-4',
                title: 'Emissão do Licenciamento',
                description: 'Emissão do documento de licenciamento',
                status: 'pending',
                estimatedDate: new Date('2024-01-24')
            },
            {
                id: 'step-5',
                title: 'Entrega dos Documentos',
                description: 'Entrega dos documentos ao cliente',
                status: 'pending',
                estimatedDate: new Date('2024-01-25')
            }
        ],
        documents: [
            {
                id: 'doc-1',
                name: 'CNH.pdf',
                type: 'application/pdf',
                url: '/documents/cnh.pdf',
                uploadedAt: new Date('2024-01-15'),
                size: 1024000,
                status: 'approved'
            },
            {
                id: 'doc-2',
                name: 'CRLV.pdf',
                type: 'application/pdf',
                url: '/documents/crlv.pdf',
                uploadedAt: new Date('2024-01-15'),
                size: 2048000,
                status: 'approved'
            }
        ],
        notifications: [
            {
                id: 'notif-1',
                title: 'Processo Iniciado',
                message: 'Seu processo de licenciamento foi iniciado',
                type: 'info',
                createdAt: new Date('2024-01-15'),
                read: true
            },
            {
                id: 'notif-2',
                title: 'Documentos Aprovados',
                message: 'Todos os documentos foram aprovados',
                type: 'success',
                createdAt: new Date('2024-01-18'),
                read: false
            }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: '2',
        customerId: 'customer-2',
        customerName: 'Maria Santos',
        customerPhone: '(16) 88888-8888',
        customerEmail: 'maria@email.com',
        customerCPF: '98765432100',
        title: 'Transferência de Propriedade - Toyota Corolla',
        description: 'Transferência de propriedade do veículo Toyota Corolla 2019',
        serviceType: 'transferencia',
        status: 'WAITING_CLIENT',
        priority: 'HIGH',
        startDate: new Date('2024-01-10'),
        estimatedEndDate: new Date('2024-01-30'),
        progress: 40,
        totalCost: 450.00,
        steps: [
            {
                id: 'step-1',
                title: 'Recebimento dos Documentos',
                description: 'Documentos do veículo e proprietário recebidos',
                status: 'completed',
                completedAt: new Date('2024-01-11')
            },
            {
                id: 'step-2',
                title: 'Análise da Documentação',
                description: 'Verificação e validação dos documentos',
                status: 'completed',
                completedAt: new Date('2024-01-13')
            },
            {
                id: 'step-3',
                title: 'Aguardando Assinatura',
                description: 'Aguardando assinatura do comprador',
                status: 'in_progress',
                estimatedDate: new Date('2024-01-25'),
                notes: 'Cliente precisa comparecer para assinatura'
            },
            {
                id: 'step-4',
                title: 'Protocolo no DETRAN',
                description: 'Protocolo da transferência no DETRAN',
                status: 'pending',
                estimatedDate: new Date('2024-01-28')
            }
        ],
        documents: [],
        notifications: [
            {
                id: 'notif-1',
                title: 'Ação Necessária',
                message: 'Você precisa comparecer ao escritório para assinatura',
                type: 'warning',
                createdAt: new Date('2024-01-20'),
                read: false
            }
        ],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20')
    }
];
const useProcessStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        processes: MOCK_PROCESSES,
        selectedProcess: null,
        isLoading: false,
        searchTerm: '',
        statusFilter: 'ALL',
        priorityFilter: 'ALL',
        setProcesses: (processes)=>set({
                processes
            }),
        setSelectedProcess: (process)=>set({
                selectedProcess: process
            }),
        setIsLoading: (loading)=>set({
                isLoading: loading
            }),
        setSearchTerm: (term)=>set({
                searchTerm: term
            }),
        setStatusFilter: (status)=>set({
                statusFilter: status
            }),
        setPriorityFilter: (priority)=>set({
                priorityFilter: priority
            }),
        addProcess: (processData)=>{
            const newProcess = {
                ...processData,
                id: `process-${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            set((state)=>({
                    processes: [
                        ...state.processes,
                        newProcess
                    ]
                }));
        },
        updateProcess: (id, updates)=>{
            set((state)=>({
                    processes: state.processes.map((process)=>process.id === id ? {
                            ...process,
                            ...updates,
                            updatedAt: new Date()
                        } : process)
                }));
        },
        deleteProcess: (id)=>{
            set((state)=>({
                    processes: state.processes.filter((process)=>process.id !== id)
                }));
        },
        updateProcessStep: (processId, stepId, updates)=>{
            set((state)=>({
                    processes: state.processes.map((process)=>process.id === processId ? {
                            ...process,
                            steps: process.steps.map((step)=>step.id === stepId ? {
                                    ...step,
                                    ...updates
                                } : step),
                            updatedAt: new Date()
                        } : process)
                }));
        },
        addDocument: (processId, documentData)=>{
            const newDocument = {
                ...documentData,
                id: `doc-${Date.now()}`,
                uploadedAt: new Date()
            };
            set((state)=>({
                    processes: state.processes.map((process)=>process.id === processId ? {
                            ...process,
                            documents: [
                                ...process.documents,
                                newDocument
                            ],
                            updatedAt: new Date()
                        } : process)
                }));
        },
        addNotification: (processId, notificationData)=>{
            const newNotification = {
                ...notificationData,
                id: `notif-${Date.now()}`,
                createdAt: new Date(),
                read: false
            };
            set((state)=>({
                    processes: state.processes.map((process)=>process.id === processId ? {
                            ...process,
                            notifications: [
                                ...process.notifications,
                                newNotification
                            ],
                            updatedAt: new Date()
                        } : process)
                }));
        },
        markNotificationAsRead: (processId, notificationId)=>{
            set((state)=>({
                    processes: state.processes.map((process)=>process.id === processId ? {
                            ...process,
                            notifications: process.notifications.map((notif)=>notif.id === notificationId ? {
                                    ...notif,
                                    read: true
                                } : notif),
                            updatedAt: new Date()
                        } : process)
                }));
        },
        getProcessById: (id)=>{
            return get().processes.find((process)=>process.id === id);
        },
        getProcessesByCustomer: (customerId)=>{
            return get().processes.filter((process)=>process.customerId === customerId);
        },
        getFilteredProcesses: ()=>{
            const { processes, searchTerm, statusFilter, priorityFilter } = get();
            return processes.filter((process)=>{
                const matchesSearch = !searchTerm || process.title.toLowerCase().includes(searchTerm.toLowerCase()) || process.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || process.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'ALL' || process.status === statusFilter;
                const matchesPriority = priorityFilter === 'ALL' || process.priority === priorityFilter;
                return matchesSearch && matchesStatus && matchesPriority;
            });
        },
        calculateProgress: (process)=>{
            const completedSteps = process.steps.filter((step)=>step.status === 'completed').length;
            const totalSteps = process.steps.length;
            return totalSteps > 0 ? Math.round(completedSteps / totalSteps * 100) : 0;
        }
    }));
const formatDate = (date)=>{
    return format(date, 'dd/MM/yyyy', {
        locale: ptBR
    });
};
const formatDateTime = (date)=>{
    return format(date, 'dd/MM/yyyy HH:mm', {
        locale: ptBR
    });
};
const getStatusColor = (status)=>{
    switch(status){
        case 'STARTED':
            return 'bg-blue-100 text-blue-800';
        case 'DOCUMENTS_RECEIVED':
            return 'bg-purple-100 text-purple-800';
        case 'PROCESSING':
            return 'bg-yellow-100 text-yellow-800';
        case 'WAITING_CLIENT':
            return 'bg-orange-100 text-orange-800';
        case 'COMPLETED':
            return 'bg-green-100 text-green-800';
        case 'CANCELLED':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
const getStatusLabel = (status)=>{
    switch(status){
        case 'STARTED':
            return 'Iniciado';
        case 'DOCUMENTS_RECEIVED':
            return 'Documentos Recebidos';
        case 'PROCESSING':
            return 'Em Processamento';
        case 'WAITING_CLIENT':
            return 'Aguardando Cliente';
        case 'COMPLETED':
            return 'Concluído';
        case 'CANCELLED':
            return 'Cancelado';
        default:
            return 'Desconhecido';
    }
};
const getPriorityColor = (priority)=>{
    switch(priority){
        case 'LOW':
            return 'bg-gray-100 text-gray-800';
        case 'MEDIUM':
            return 'bg-blue-100 text-blue-800';
        case 'HIGH':
            return 'bg-orange-100 text-orange-800';
        case 'URGENT':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
const getPriorityLabel = (priority)=>{
    switch(priority){
        case 'LOW':
            return 'Baixa';
        case 'MEDIUM':
            return 'Média';
        case 'HIGH':
            return 'Alta';
        case 'URGENT':
            return 'Urgente';
        default:
            return 'Desconhecida';
    }
};
}),
"[project]/src/components/ChatWidget.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ChatWidget
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@heroicons/react/24/outline'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
'use client';
;
;
;
;
function ChatWidget({ processId, customerName, customerPhone }) {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newMessage, setNewMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Mock messages para demonstração
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mockMessages = [
            {
                id: '1',
                sender: 'admin',
                content: 'Olá! Seu processo de licenciamento foi iniciado. Em breve entraremos em contato.',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                processId
            },
            {
                id: '2',
                sender: 'client',
                content: 'Obrigado! Quanto tempo leva para ficar pronto?',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                processId
            },
            {
                id: '3',
                sender: 'admin',
                content: 'Geralmente de 5 a 7 dias úteis. Você será notificado a cada etapa do processo.',
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                processId
            }
        ];
        setMessages(mockMessages);
    }, [
        processId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        scrollToBottom();
    }, [
        messages
    ]);
    const scrollToBottom = ()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };
    const handleSendMessage = ()=>{
        if (!newMessage.trim()) return;
        const message = {
            id: Date.now().toString(),
            sender: 'client',
            content: newMessage,
            timestamp: new Date(),
            processId
        };
        setMessages([
            ...messages,
            message
        ]);
        setNewMessage('');
        // Simular resposta do admin
        setTimeout(()=>{
            setIsTyping(true);
            setTimeout(()=>{
                const adminResponse = {
                    id: (Date.now() + 1).toString(),
                    sender: 'admin',
                    content: 'Obrigado pela mensagem! Vou verificar e te respondo em breve.',
                    timestamp: new Date(),
                    processId
                };
                setMessages((prev)=>[
                        ...prev,
                        adminResponse
                    ]);
                setIsTyping(false);
            }, 2000);
        }, 500);
    };
    const handleKeyPress = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const formatTime = (date)=>{
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                onClick: ()=>setIsOpen(!isOpen),
                className: "fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center",
                whileHover: {
                    scale: 1.1
                },
                whileTap: {
                    scale: 0.9
                },
                children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(XMarkIcon, {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/components/ChatWidget.tsx",
                    lineNumber: 129,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatBubbleLeftRightIcon, {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/components/ChatWidget.tsx",
                    lineNumber: 131,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ChatWidget.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.8,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.8,
                        y: 20
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-blue-600 text-white p-4 rounded-t-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UserIcon, {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ChatWidget.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "font-medium",
                                                            children: "Lazuli Despachante"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-blue-100",
                                                            children: "Online"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                                            lineNumber: 154,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                            lineNumber: 148,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setIsOpen(false),
                                            className: "p-1 hover:bg-blue-700 rounded",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(XMarkIcon, {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ChatWidget.tsx",
                                                lineNumber: 161,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                            lineNumber: 157,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                    lineNumber: 147,
                                    columnNumber: 15
                                }, this),
                                customerName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 text-sm text-blue-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Cliente: ",
                                                customerName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                            lineNumber: 166,
                                            columnNumber: 19
                                        }, this),
                                        processId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Processo: #",
                                                processId
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                            lineNumber: 167,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                    lineNumber: 165,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ChatWidget.tsx",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-4 space-y-3",
                            children: [
                                messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 10
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        transition: {
                                            duration: 0.2
                                        },
                                        className: `flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `max-w-xs p-3 rounded-lg ${message.sender === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: message.content
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `text-xs mt-1 ${message.sender === 'client' ? 'text-blue-100' : 'text-gray-500'}`,
                                                    children: formatTime(message.timestamp)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, this)
                                    }, message.id, false, {
                                        fileName: "[project]/src/components/ChatWidget.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this)),
                                isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 10
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    className: "flex justify-start",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-100 p-3 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex space-x-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                                    style: {
                                                        animationDelay: '0.1s'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                                    style: {
                                                        animationDelay: '0.2s'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                            lineNumber: 207,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ChatWidget.tsx",
                                        lineNumber: 206,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                    lineNumber: 201,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messagesEndRef
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ChatWidget.tsx",
                                    lineNumber: 216,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ChatWidget.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-t border-gray-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: newMessage,
                                        onChange: (e)=>setNewMessage(e.target.value),
                                        onKeyPress: handleKeyPress,
                                        placeholder: "Digite sua mensagem...",
                                        className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ChatWidget.tsx",
                                        lineNumber: 222,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSendMessage,
                                        disabled: !newMessage.trim(),
                                        className: "px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PaperAirplaneIcon, {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ChatWidget.tsx",
                                            lineNumber: 235,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ChatWidget.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ChatWidget.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatWidget.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ChatWidget.tsx",
                    lineNumber: 138,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ChatWidget.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
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
"[project]/src/components/PortalCliente.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ClientPortal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-hook-form'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@hookform/resolvers/zod'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'zod'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@heroicons/react/24/outline'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/processoStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ChatWidget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brasilapi/index.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
;
;
;
;
;
;
;
const searchSchema = z.object({
    phone: z.string().optional(),
    cpf: z.string().optional(),
    processId: z.string().optional()
}).refine((data)=>data.phone || data.cpf || data.processId, {
    message: "Informe pelo menos um campo: telefone, CPF ou código do processo",
    path: [
        "phone"
    ]
});
function ClientPortal() {
    const [showDetails, setShowDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customerPhone, setCustomerPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [cpfValidation, setCpfValidation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'vazio',
        mensagem: '',
        formatado: ''
    });
    const { processes, searchTerm, statusFilter, priorityFilter, setSearchTerm, setStatusFilter, setPriorityFilter, getFilteredProcesses, getProcessesByCustomer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProcessStore"])();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(searchSchema)
    });
    const [customerProcesses, setCustomerProcesses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Funções de validação e formatação com Brasil API
    const handleCpfChange = (value)=>{
        const validation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brasilapi$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["brasilApi"].formularios.validarCpfTempoReal(value);
        setCpfValidation(validation);
        return validation.formatado;
    };
    const onSubmit = async (data)=>{
        // Validar CPF se fornecido
        if (data.cpf && cpfValidation.status !== 'valido') {
            alert('Por favor, digite um CPF válido');
            return;
        }
        // Simular busca por telefone ou CPF
        const foundProcesses = processes.filter((process)=>{
            const phoneMatch = data.phone && process.customerPhone.replace(/\D/g, '') === data.phone.replace(/\D/g, '');
            const cpfMatch = data.cpf && process.customerCPF?.replace(/\D/g, '') === data.cpf.replace(/\D/g, '');
            const processIdMatch = data.processId && process.id === data.processId;
            return phoneMatch || cpfMatch || processIdMatch;
        });
        if (foundProcesses.length > 0) {
            setIsAuthenticated(true);
            setCustomerPhone(data.phone || data.cpf || '');
            setCustomerProcesses(foundProcesses);
        } else {
            alert('Nenhum processo encontrado com esses dados');
        }
    };
    const logout = ()=>{
        setIsAuthenticated(false);
        setCustomerPhone('');
        setCustomerProcesses([]);
        reset();
    };
    const getStepIcon = (status)=>{
        switch(status){
            case 'completed':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircleIcon, {
                    className: "h-5 w-5 text-green-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/PortalCliente.tsx",
                    lineNumber: 126,
                    columnNumber: 16
                }, this);
            case 'in_progress':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlayIcon, {
                    className: "h-5 w-5 text-blue-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/PortalCliente.tsx",
                    lineNumber: 128,
                    columnNumber: 16
                }, this);
            case 'pending':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClockIcon, {
                    className: "h-5 w-5 text-gray-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/PortalCliente.tsx",
                    lineNumber: 130,
                    columnNumber: 16
                }, this);
            case 'cancelled':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(XCircleIcon, {
                    className: "h-5 w-5 text-red-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/PortalCliente.tsx",
                    lineNumber: 132,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClockIcon, {
                    className: "h-5 w-5 text-gray-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/PortalCliente.tsx",
                    lineNumber: 134,
                    columnNumber: 16
                }, this);
        }
    };
    const getProgressColor = (progress)=>{
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 60) return 'bg-blue-500';
        if (progress >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.8
                },
                className: "bg-white rounded-2xl shadow-xl p-8 w-full max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentTextIcon, {
                                    className: "h-8 w-8 text-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PortalCliente.tsx",
                                    lineNumber: 156,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-900 mb-2",
                                children: "Portal do Cliente"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Acompanhe seus processos em tempo real"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-2",
                                children: "Informe pelo menos um dos campos abaixo para acessar"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PortalCliente.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit(onSubmit),
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                        children: "Telefone/WhatsApp (opcional)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ...register('phone'),
                                        type: "tel",
                                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        placeholder: "(16) 99999-9999"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this),
                                    errors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-red-600",
                                        children: errors.phone.message
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 181,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                        children: "CPF (opcional)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ...register('cpf'),
                                        type: "text",
                                        className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 ${cpfValidation.status === 'valido' ? 'border-green-300 focus:ring-green-500' : cpfValidation.status === 'invalido' ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`,
                                        placeholder: "123.456.789-00",
                                        maxLength: 14,
                                        onChange: (e)=>{
                                            const formatted = handleCpfChange(e.target.value);
                                            e.target.value = formatted;
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    cpfValidation.status !== 'vazio' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `mt-1 text-sm flex items-center gap-1 ${cpfValidation.status === 'valido' ? 'text-green-600' : cpfValidation.status === 'invalido' ? 'text-red-600' : 'text-gray-600'}`,
                                        children: [
                                            cpfValidation.status === 'valido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircleIcon, {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 214,
                                                columnNumber: 57
                                            }, this),
                                            cpfValidation.status === 'invalido' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(XCircleIcon, {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 215,
                                                columnNumber: 59
                                            }, this),
                                            cpfValidation.status === 'incompleto' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClockIcon, {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 216,
                                                columnNumber: 61
                                            }, this),
                                            cpfValidation.mensagem
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, this),
                                    errors.cpf && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-red-600",
                                        children: errors.cpf.message
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 221,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                        children: "Código do Processo (opcional)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 226,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ...register('processId'),
                                        type: "text",
                                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        placeholder: "Ex: 123456"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium",
                                children: "Acessar Meus Processos"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PortalCliente.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 text-center text-sm text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Não consegue acessar? Entre em contato:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium text-blue-600",
                                children: "(16) 98247-7126"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 p-3 bg-blue-50 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-blue-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Dados para teste:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PortalCliente.tsx",
                                            lineNumber: 250,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/PortalCliente.tsx",
                                            lineNumber: 250,
                                            columnNumber: 51
                                        }, this),
                                        "CPF: 123.456.789-00 ou 987.654.321-00",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/PortalCliente.tsx",
                                            lineNumber: 251,
                                            columnNumber: 54
                                        }, this),
                                        "Telefone: (16) 99999-9999 ou (16) 88888-8888"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PortalCliente.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PortalCliente.tsx",
                        lineNumber: 245,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PortalCliente.tsx",
                lineNumber: 148,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/PortalCliente.tsx",
            lineNumber: 147,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-sm border-b border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center py-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold text-gray-900",
                                        children: "Meus Processos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600",
                                        children: "Acompanhe o andamento dos seus processos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 269,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: logout,
                                className: "px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors",
                                children: "Sair"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PortalCliente.tsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/PortalCliente.tsx",
                    lineNumber: 265,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PortalCliente.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: customerProcesses.map((process)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: 0.5
                                },
                                className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6 border-b border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentTextIcon, {
                                                                    className: "h-5 w-5 text-blue-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/PortalCliente.tsx",
                                                                    lineNumber: 298,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 297,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-semibold text-gray-900",
                                                                        children: process.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                        lineNumber: 301,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-600",
                                                                        children: [
                                                                            "Processo #",
                                                                            process.id
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                        lineNumber: 304,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 300,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-2 py-1 text-xs font-medium rounded-full ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStatusColor"])(process.status)}`,
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStatusLabel"])(process.status)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-2 py-1 text-xs font-medium rounded-full ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPriorityColor"])(process.priority)}`,
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPriorityLabel"])(process.priority)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 313,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 295,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-sm text-gray-600 mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Progresso"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 322,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    process.progress,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-gray-200 rounded-full h-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `h-2 rounded-full transition-all duration-300 ${getProgressColor(process.progress)}`,
                                                            style: {
                                                                width: `${process.progress}%`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/PortalCliente.tsx",
                                                            lineNumber: 326,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 325,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 320,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "Data de Início:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 336,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(process.startDate)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 337,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "Previsão de Conclusão:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 340,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium",
                                                                children: process.estimatedEndDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(process.estimatedEndDate) : 'A definir'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500",
                                                                children: "Valor Total:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 346,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-green-600",
                                                                children: process.totalCost ? `R$ ${process.totalCost.toFixed(2)}` : 'A definir'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 347,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 345,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 334,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowDetails(showDetails === process.id ? null : process.id),
                                                className: "mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeIcon, {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: showDetails === process.id ? 'Ocultar Detalhes' : 'Ver Detalhes'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 353,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this),
                                    showDetails === process.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            height: 0
                                        },
                                        animate: {
                                            opacity: 1,
                                            height: 'auto'
                                        },
                                        transition: {
                                            duration: 0.3
                                        },
                                        className: "p-6 bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-semibold text-gray-900 mb-4",
                                                        children: "Andamento do Processo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 372,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: process.steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start space-x-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-shrink-0 mt-1",
                                                                        children: getStepIcon(step.status)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                        lineNumber: 378,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-between",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                        className: "font-medium text-gray-900",
                                                                                        children: step.title
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                        lineNumber: 383,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-sm text-gray-500",
                                                                                        children: step.completedAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(step.completedAt) : step.estimatedDate ? `Previsto: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(step.estimatedDate)}` : ''
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                        lineNumber: 384,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 382,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-gray-600 mt-1",
                                                                                children: step.description
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 393,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            step.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-orange-600 mt-1 font-medium",
                                                                                children: [
                                                                                    "📝 ",
                                                                                    step.notes
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 395,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                        lineNumber: 381,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, step.id, true, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 377,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 375,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 371,
                                                columnNumber: 19
                                            }, this),
                                            process.documents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-semibold text-gray-900 mb-4",
                                                        children: "Documentos"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                        children: process.documents.map((doc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-white rounded-lg p-4 border border-gray-200",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                className: "font-medium text-gray-900",
                                                                                children: doc.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 415,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `px-2 py-1 text-xs font-medium rounded-full ${doc.status === 'approved' ? 'bg-green-100 text-green-800' : doc.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`,
                                                                                children: doc.status === 'approved' ? 'Aprovado' : doc.status === 'rejected' ? 'Rejeitado' : 'Pendente'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 416,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                        lineNumber: 414,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-600",
                                                                        children: [
                                                                            "Enviado em ",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(doc.uploadedAt)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                        lineNumber: 425,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-500",
                                                                        children: [
                                                                            (doc.size / 1024 / 1024).toFixed(2),
                                                                            " MB"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                                        lineNumber: 428,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, doc.id, true, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 413,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 407,
                                                columnNumber: 21
                                            }, this),
                                            process.notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-semibold text-gray-900 mb-4",
                                                        children: "Notificações Recentes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 440,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: process.notifications.slice(0, 3).map((notification)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `p-4 rounded-lg border ${notification.type === 'success' ? 'bg-green-50 border-green-200' : notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : notification.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-start space-x-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-shrink-0",
                                                                            children: notification.type === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircleIcon, {
                                                                                className: "h-5 w-5 text-green-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 457,
                                                                                columnNumber: 35
                                                                            }, this) : notification.type === 'warning' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ExclamationTriangleIcon, {
                                                                                className: "h-5 w-5 text-yellow-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 459,
                                                                                columnNumber: 35
                                                                            }, this) : notification.type === 'error' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(XCircleIcon, {
                                                                                className: "h-5 w-5 text-red-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 461,
                                                                                columnNumber: 35
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BellIcon, {
                                                                                className: "h-5 w-5 text-blue-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                lineNumber: 463,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/PortalCliente.tsx",
                                                                            lineNumber: 455,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                    className: "font-medium text-gray-900",
                                                                                    children: notification.title
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                    lineNumber: 467,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-gray-600 mt-1",
                                                                                    children: notification.message
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                    lineNumber: 468,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500 mt-2",
                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$processoStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(notification.createdAt)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/PortalCliente.tsx",
                                                                                    lineNumber: 469,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/PortalCliente.tsx",
                                                                            lineNumber: 466,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/PortalCliente.tsx",
                                                                    lineNumber: 454,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, notification.id, false, {
                                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                                lineNumber: 445,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                                        lineNumber: 443,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PortalCliente.tsx",
                                                lineNumber: 439,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PortalCliente.tsx",
                                        lineNumber: 364,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, process.id, true, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/PortalCliente.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    customerProcesses.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentTextIcon, {
                                className: "h-12 w-12 text-gray-400 mx-auto mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 488,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-900 mb-2",
                                children: "Nenhum processo encontrado"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 489,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-4",
                                children: "Não encontramos processos para o telefone informado."
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 492,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: logout,
                                className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                                children: "Tentar Novamente"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PortalCliente.tsx",
                                lineNumber: 495,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PortalCliente.tsx",
                        lineNumber: 487,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PortalCliente.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, this),
            isAuthenticated && customerProcesses.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                processId: customerProcesses[0]?.id,
                customerName: customerProcesses[0]?.customerName,
                customerPhone: customerPhone
            }, void 0, false, {
                fileName: "[project]/src/components/PortalCliente.tsx",
                lineNumber: 507,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PortalCliente.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/components/ImprovedHeader.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ImprovedHeader
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as MenuIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as HomeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalculatorIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calculator.js [app-ssr] (ecmascript) <export default as CalculatorIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as CalendarIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as SearchIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileTextIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileTextIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InfoIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as InfoIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as PhoneIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as UserIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDownIcon>");
'use client';
;
;
;
;
;
;
;
function ImprovedHeader() {
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isServicesOpen, setIsServicesOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const toggleMenu = ()=>{
        setIsMenuOpen(!isMenuOpen);
    };
    const navItems = [
        {
            href: '/',
            label: 'Início',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"],
            description: 'Página inicial'
        },
        {
            href: '/servicos',
            label: 'Serviços',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileTextIcon$3e$__["FileTextIcon"],
            description: 'Nossos serviços',
            hasDropdown: true,
            subItems: [
                {
                    href: '/calculadora',
                    label: 'Calculadora',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalculatorIcon$3e$__["CalculatorIcon"]
                },
                {
                    href: '/agendamento',
                    label: 'Agendamento',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"]
                },
                {
                    href: '/consultas',
                    label: 'Consultas',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__["SearchIcon"]
                },
                {
                    href: '/processos',
                    label: 'Processos',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileTextIcon$3e$__["FileTextIcon"]
                }
            ]
        },
        {
            href: '/consultas',
            label: 'Consultas',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__["SearchIcon"],
            description: 'DETRAN e documentos'
        },
        {
            href: '/processos',
            label: 'Processos',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileTextIcon$3e$__["FileTextIcon"],
            description: 'Acompanhe seus processos'
        },
        {
            href: '/sobre',
            label: 'Sobre',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__InfoIcon$3e$__["InfoIcon"],
            description: 'Sobre a empresa'
        },
        {
            href: '/contato',
            label: 'Contato',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneIcon$3e$__["PhoneIcon"],
            description: 'Fale conosco'
        }
    ];
    const isActive = (href)=>{
        if (!pathname) return false;
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "container mx-auto px-4 py-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center space-x-3 group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/logo/333639480_607887381351075_3074158683519753451_n.jpg",
                                            alt: "Lazuli Despachante",
                                            width: 40,
                                            height: 40,
                                            className: "rounded-full object-cover transition-transform group-hover:scale-105"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 rounded-full bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors",
                                            children: "Lazuli Despachante"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 100,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 -mt-1",
                                            children: "Franca-SP"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:flex items-center space-x-1",
                            children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative group",
                                    children: item.hasDropdown ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        onMouseEnter: ()=>setIsServicesOpen(true),
                                        onMouseLeave: ()=>setIsServicesOpen(false),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 23
                                                    }, this),
                                                    item.label,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                                                        className: "h-4 w-4 ml-1 transition-transform group-hover:rotate-180"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                lineNumber: 117,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                                children: isServicesOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                    initial: {
                                                        opacity: 0,
                                                        y: 10
                                                    },
                                                    animate: {
                                                        opacity: 1,
                                                        y: 0
                                                    },
                                                    exit: {
                                                        opacity: 0,
                                                        y: 10
                                                    },
                                                    transition: {
                                                        duration: 0.2
                                                    },
                                                    className: "absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50",
                                                    children: item.subItems?.map((subItem)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: subItem.href,
                                                            className: "flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(subItem.icon, {
                                                                    className: "h-4 w-4 mr-3 text-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                                    lineNumber: 138,
                                                                    columnNumber: 31
                                                                }, this),
                                                                subItem.label
                                                            ]
                                                        }, subItem.href, true, {
                                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                lineNumber: 123,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ImprovedHeader.tsx",
                                        lineNumber: 112,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: `flex items-center px-4 py-2 font-medium transition-colors duration-200 rounded-lg relative group ${isActive(item.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                lineNumber: 155,
                                                columnNumber: 21
                                            }, this),
                                            item.label,
                                            isActive(item.href) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                className: "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full",
                                                layoutId: "activeTab"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                lineNumber: 158,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ImprovedHeader.tsx",
                                        lineNumber: 147,
                                        columnNumber: 19
                                    }, this)
                                }, item.href, false, {
                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:flex items-center space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/admin/dashboard",
                                    className: "flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserIcon$3e$__["UserIcon"], {
                                            className: "h-4 w-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, this),
                                        "Admin"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/#calculator",
                                    className: "bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg",
                                    children: "Calcular Preço"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: toggleMenu,
                            className: "lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors",
                            children: isMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {
                                className: "h-6 w-6 text-gray-600"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ImprovedHeader.tsx",
                                lineNumber: 192,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuIcon$3e$__["MenuIcon"], {
                                className: "h-6 w-6 text-gray-600"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ImprovedHeader.tsx",
                                lineNumber: 194,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            height: 0
                        },
                        animate: {
                            opacity: 1,
                            height: 'auto'
                        },
                        exit: {
                            opacity: 0,
                            height: 0
                        },
                        transition: {
                            duration: 0.3
                        },
                        className: "lg:hidden mt-4 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.href,
                                                    onClick: ()=>setIsMenuOpen(false),
                                                    className: `flex items-center justify-between p-3 rounded-lg transition-colors ${isActive(item.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                    className: "h-5 w-5 mr-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                                    lineNumber: 223,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: item.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                                            lineNumber: 225,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500 mt-0.5",
                                                                            children: item.description
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                                            lineNumber: 226,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                            lineNumber: 222,
                                                            columnNumber: 25
                                                        }, this),
                                                        isActive(item.href) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-2 h-2 bg-blue-600 rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                            lineNumber: 232,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 23
                                                }, this),
                                                item.hasDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ml-8 mt-2 space-y-1",
                                                    children: item.subItems?.map((subItem)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: subItem.href,
                                                            onClick: ()=>setIsMenuOpen(false),
                                                            className: "flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(subItem.icon, {
                                                                    className: "h-4 w-4 mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                                    lineNumber: 245,
                                                                    columnNumber: 31
                                                                }, this),
                                                                subItem.label
                                                            ]
                                                        }, subItem.href, true, {
                                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, item.href, true, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 212,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                    lineNumber: 210,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-gray-200 mt-4 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/admin/dashboard",
                                            onClick: ()=>setIsMenuOpen(false),
                                            className: "flex items-center p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserIcon$3e$__["UserIcon"], {
                                                    className: "h-5 w-5 mr-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 21
                                                }, this),
                                                "Área Administrativa"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 256,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/#calculator",
                                            onClick: ()=>setIsMenuOpen(false),
                                            className: "block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors",
                                            children: "Calcular Preço"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                                            lineNumber: 264,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ImprovedHeader.tsx",
                            lineNumber: 209,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ImprovedHeader.tsx",
                        lineNumber: 202,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ImprovedHeader.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ImprovedHeader.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ImprovedHeader.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/Breadcrumb.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>Breadcrumb
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as HomeIcon>");
'use client';
;
;
;
;
function Breadcrumb() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const getBreadcrumbs = ()=>{
        const breadcrumbs = [
            {
                label: 'Início',
                href: '/',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"]
            }
        ];
        if (!pathname || pathname === '/') {
            return breadcrumbs;
        }
        const pathSegments = pathname.split('/').filter(Boolean);
        pathSegments.forEach((segment, index)=>{
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            let label = segment;
            // Mapear segmentos para labels mais amigáveis
            switch(segment){
                case 'consultas':
                    label = 'Consultas DETRAN';
                    break;
                case 'processos':
                    label = 'Meus Processos';
                    break;
                case 'admin':
                    label = 'Administração';
                    break;
                case 'dashboard':
                    label = 'Dashboard';
                    break;
                case 'login':
                    label = 'Login';
                    break;
                default:
                    label = segment.charAt(0).toUpperCase() + segment.slice(1);
            }
            breadcrumbs.push({
                label,
                href
            });
        });
        return breadcrumbs;
    };
    const breadcrumbs = getBreadcrumbs();
    // Não mostrar breadcrumb na página inicial
    if (pathname === '/') {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "bg-gray-50 border-b border-gray-200",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                className: "flex items-center space-x-2 text-sm",
                children: breadcrumbs.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center",
                        children: [
                            index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                                className: "h-4 w-4 text-gray-400 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Breadcrumb.tsx",
                                lineNumber: 73,
                                columnNumber: 17
                            }, this),
                            index === breadcrumbs.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center font-medium text-blue-600",
                                children: [
                                    item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                        className: "h-4 w-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Breadcrumb.tsx",
                                        lineNumber: 78,
                                        columnNumber: 33
                                    }, this),
                                    item.label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Breadcrumb.tsx",
                                lineNumber: 77,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: "flex items-center text-gray-600 hover:text-blue-600 transition-colors",
                                children: [
                                    item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                        className: "h-4 w-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Breadcrumb.tsx",
                                        lineNumber: 86,
                                        columnNumber: 33
                                    }, this),
                                    item.label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Breadcrumb.tsx",
                                lineNumber: 82,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/src/components/Breadcrumb.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/Breadcrumb.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Breadcrumb.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Breadcrumb.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ScrollToTop.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ScrollToTop
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-ssr] (ecmascript) <export default as ArrowUpIcon>");
'use client';
;
;
;
;
function ScrollToTop() {
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const toggleVisibility = ()=>{
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return ()=>window.removeEventListener('scroll', toggleVisibility);
    }, []);
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
            initial: {
                opacity: 0,
                scale: 0.8
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            exit: {
                opacity: 0,
                scale: 0.8
            },
            transition: {
                duration: 0.3
            },
            onClick: scrollToTop,
            className: "fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group",
            whileHover: {
                scale: 1.1
            },
            whileTap: {
                scale: 0.9
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpIcon$3e$__["ArrowUpIcon"], {
                className: "h-5 w-5 group-hover:animate-bounce"
            }, void 0, false, {
                fileName: "[project]/src/components/ScrollToTop.tsx",
                lineNumber: 43,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ScrollToTop.tsx",
            lineNumber: 33,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ScrollToTop.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/FloatingActionButton.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>FloatingActionButton
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as PlusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as PhoneIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalculatorIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calculator.js [app-ssr] (ecmascript) <export default as CalculatorIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as CalendarIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as XIcon>");
'use client';
;
;
;
;
function FloatingActionButton() {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const actions = [
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalculatorIcon$3e$__["CalculatorIcon"],
            label: 'Calcular Preço',
            onClick: ()=>{
                const calculatorElement = document.getElementById('calculator');
                if (calculatorElement) {
                    calculatorElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                setIsOpen(false);
            },
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"],
            label: 'Agendar Atendimento',
            onClick: ()=>{
                const agendamentoElement = document.getElementById('agendamento');
                if (agendamentoElement) {
                    agendamentoElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                setIsOpen(false);
            },
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircleIcon$3e$__["MessageCircleIcon"],
            label: 'WhatsApp',
            onClick: ()=>{
                window.open('https://wa.me/5516982477126?text=Olá! Gostaria de mais informações sobre os serviços da Lazuli Despachante.', '_blank');
                setIsOpen(false);
            },
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneIcon$3e$__["PhoneIcon"],
            label: 'Ligar',
            onClick: ()=>{
                window.location.href = 'tel:+5516982477126';
                setIsOpen(false);
            },
            color: 'bg-orange-600 hover:bg-orange-700'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-6 left-6 z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "mb-4 space-y-3",
                    children: actions.map((action, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                            initial: {
                                opacity: 0,
                                x: -20,
                                scale: 0.8
                            },
                            animate: {
                                opacity: 1,
                                x: 0,
                                scale: 1,
                                transition: {
                                    delay: index * 0.1
                                }
                            },
                            exit: {
                                opacity: 0,
                                x: -20,
                                scale: 0.8,
                                transition: {
                                    delay: (actions.length - index - 1) * 0.1
                                }
                            },
                            onClick: action.onClick,
                            className: `flex items-center p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white group ${action.color}`,
                            whileHover: {
                                scale: 1.05
                            },
                            whileTap: {
                                scale: 0.95
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(action.icon, {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FloatingActionButton.tsx",
                                    lineNumber: 100,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-3 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity",
                                    children: action.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FloatingActionButton.tsx",
                                    lineNumber: 101,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, action.label, true, {
                            fileName: "[project]/src/components/FloatingActionButton.tsx",
                            lineNumber: 80,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/FloatingActionButton.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/FloatingActionButton.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                onClick: ()=>setIsOpen(!isOpen),
                className: "bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
                whileHover: {
                    scale: 1.1
                },
                whileTap: {
                    scale: 0.9
                },
                animate: {
                    rotate: isOpen ? 45 : 0
                },
                children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/components/FloatingActionButton.tsx",
                    lineNumber: 118,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__["PlusIcon"], {
                    className: "h-6 w-6"
                }, void 0, false, {
                    fileName: "[project]/src/components/FloatingActionButton.tsx",
                    lineNumber: 120,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/FloatingActionButton.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/FloatingActionButton.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/Footer.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>Footer
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
;
;
;
const footerSections = [
    {
        title: 'Serviços',
        links: [
            {
                name: 'Licenciamentos',
                href: '#services'
            },
            {
                name: 'Transferências',
                href: '#services'
            },
            {
                name: '1° Registro',
                href: '#services'
            },
            {
                name: 'Desbloqueios',
                href: '#services'
            }
        ]
    },
    {
        title: 'Empresa',
        links: [
            {
                name: 'Sobre',
                href: '#about'
            },
            {
                name: 'Serviços',
                href: '#services'
            },
            {
                name: 'Contato',
                href: '#contact'
            }
        ]
    }
];
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-gray-900 text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-3 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/logo/333639480_607887381351075_3074158683519753451_n.jpg",
                                            alt: "Lazuli Despachante",
                                            width: 40,
                                            height: 40,
                                            className: "rounded-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Footer.tsx",
                                            lineNumber: 32,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl font-semibold",
                                            children: "Lazuli Despachante"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Footer.tsx",
                                            lineNumber: 39,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Footer.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 mb-4 max-w-md",
                                    children: "Despachante credenciado ao Detran-SP, oferecendo serviços automotivos com qualidade e agilidade em Franca-SP."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Footer.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "tel:+5516982477126",
                                        className: "flex items-center space-x-2 text-gray-400 hover:text-white transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "📞"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Footer.tsx",
                                                lineNumber: 50,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "(16) 98247-7126"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Footer.tsx",
                                                lineNumber: 51,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Footer.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Footer.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        footerSections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold mb-4",
                                        children: section.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-2",
                                        children: section.links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: link.href,
                                                    className: "text-gray-400 hover:text-white transition-colors",
                                                    children: link.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Footer.tsx",
                                                    lineNumber: 63,
                                                    columnNumber: 21
                                                }, this)
                                            }, link.name, false, {
                                                fileName: "[project]/src/components/Footer.tsx",
                                                lineNumber: 62,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, section.title, true, {
                                fileName: "[project]/src/components/Footer.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Footer.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-gray-800 mt-12 pt-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-gray-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "© 2025 Lazuli Despachante. Todos os direitos reservados."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "📍"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Footer.tsx",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Av. Alagoas, 882 - Vila Aparecida, Franca-SP"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Footer.tsx",
                                                lineNumber: 83,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Footer.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://wa.me/5516982477126",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors duration-300 flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "💬"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Footer.tsx",
                                            lineNumber: 94,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "WhatsApp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Footer.tsx",
                                            lineNumber: 95,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Footer.tsx",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Footer.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Footer.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Footer.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Footer.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/Layout.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "AdminLayout": ()=>AdminLayout,
    "AuthLayout": ()=>AuthLayout,
    "default": ()=>Layout
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ImprovedHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ImprovedHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Breadcrumb.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScrollToTop.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FloatingActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/FloatingActionButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Toast.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function Layout({ children, showBreadcrumb = true, showFAB = true, showScrollToTop = true }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ImprovedHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                showBreadcrumb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 28,
                    columnNumber: 28
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "pt-20",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                showScrollToTop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 36,
                    columnNumber: 29
                }, this),
                showFAB && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FloatingActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 37,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Layout.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Layout.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
function AdminLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-100",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ImprovedHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "pt-20",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Layout.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Layout.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Layout.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
function AuthLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/Layout.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Layout.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/processos/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ClientPortalPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PortalCliente$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PortalCliente.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Layout.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ClientPortalPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        duration: 0.6
                    },
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-gray-900 mb-2",
                            children: "Portal do Cliente"
                        }, void 0, false, {
                            fileName: "[project]/src/app/processos/page.tsx",
                            lineNumber: 18,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: "Acompanhe seus processos de documentação veicular"
                        }, void 0, false, {
                            fileName: "[project]/src/app/processos/page.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/processos/page.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PortalCliente$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/processos/page.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/processos/page.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/processos/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__795b9371._.js.map