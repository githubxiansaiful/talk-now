(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/landing/hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Hero",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.5_@babel+core@7.2_6cf3e1bc4683dd7051a1d9f58f1f7a8a/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.5_@babel+core@7.2_6cf3e1bc4683dd7051a1d9f58f1f7a8a/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.5_@babel+core@7.2_6cf3e1bc4683dd7051a1d9f58f1f7a8a/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.5_@babel+core@7.2_6cf3e1bc4683dd7051a1d9f58f1f7a8a/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.70.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.70.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.70.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.70.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.70.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/log-in.mjs [app-client] (ecmascript) <export default as LogIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Hero() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [joinCode, setJoinCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [joinError, setJoinError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleJoin = (e)=>{
        e.preventDefault();
        const cleanCode = joinCode.trim().replace(/^.*\/room\//, '').replace(/[^a-zA-Z0-9_-]/g, '');
        if (!cleanCode) {
            setJoinError('Please enter a valid room code or link');
            return;
        }
        router.push(`/room/${cleanCode}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#7657E8]/10 via-[#7657E8]/5 to-transparent blur-3xl pointer-events-none -z-10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-5xl mx-auto px-4 sm:px-6 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text)] max-w-4xl mx-auto leading-[1.12]",
                        children: [
                            "A conversation starts with ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[#7657E8]",
                                children: "one click."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 32,
                                columnNumber: 38
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed",
                        children: "Create a private room, invite your friends, and start talking instantly. No accounts, no passwords, no hassle."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-10 max-w-xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/create",
                                        className: "w-full sm:w-auto shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "lg",
                                            className: "w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold shadow-md shadow-[#7657E8]/20 gap-2",
                                            children: [
                                                "Create a room",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                    lineNumber: 50,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                            lineNumber: 45,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1",
                                        children: "or"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleJoin,
                                        className: "flex-1 w-full sm:w-auto min-w-[280px] sm:min-w-[320px] flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 shadow-xs hover:border-[#7657E8]/40 focus-within:border-[#7657E8] focus-within:ring-2 focus-within:ring-[#7657E8]/20 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Paste room code or link...",
                                                value: joinCode,
                                                onChange: (e)=>{
                                                    setJoinCode(e.target.value);
                                                    setJoinError('');
                                                },
                                                className: "flex-1 min-w-0 px-3.5 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent focus:outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 63,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "submit",
                                                variant: "secondary",
                                                size: "sm",
                                                className: "h-10 px-4 rounded-lg font-semibold shrink-0 gap-1.5 bg-[var(--surface-secondary)] hover:bg-[#7657E8] hover:text-white transition-colors cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__["LogIn"], {
                                                        className: "w-3.5 h-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Join"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 73,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            joinError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2.5 text-xs text-[#DC4C4C] font-medium animate-in fade-in duration-150",
                                children: joinError
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-secondary)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                        className: "w-4 h-4 text-[#16A36A]"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Private & auto-expiring"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-4 h-4 text-[#7657E8]"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Choice of 30m to 24h duration"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "w-4 h-4 text-[#7657E8]"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Multi-member group rooms"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-14 relative max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-5 shadow-xl shadow-black/[0.04]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-3 h-3 rounded-full bg-rose-400/80 inline-block"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 113,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-3 h-3 rounded-full bg-amber-400/80 inline-block"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-3 h-3 rounded-full bg-emerald-400/80 inline-block"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold text-[var(--text)] ml-2",
                                                children: "Quick Design Sync"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 117,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] px-2.5 py-1 rounded-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$70$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: "w-3 h-3 text-[#7657E8]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 17
                                                    }, this),
                                                    "42m remaining"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 120,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-1 text-[11px] font-medium text-[var(--success)] bg-[var(--success-light)] px-2.5 py-1 rounded-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 17
                                                    }, this),
                                                    "4 online"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 124,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3.5 text-left text-xs sm:text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/60 text-[#7657E8] font-bold flex items-center justify-center shrink-0 text-xs",
                                                children: "S"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 134,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-[var(--text)]",
                                                                children: "Saiful"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                                lineNumber: 139,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-[var(--text-muted)]",
                                                                children: "2:40 PM"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                                lineNumber: 140,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] bg-[#7657E8]/10 text-[#7657E8] px-1.5 py-0.2 rounded font-medium",
                                                                children: "Creator"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                                lineNumber: 141,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 bg-[var(--surface-secondary)] text-[var(--text)] p-2.5 rounded-xl rounded-tl-sm max-w-md inline-block",
                                                        children: "Hey everyone! Glad you could make it. Here is the link for our quick check-in."
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 137,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs",
                                                children: "A"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 151,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-[var(--text)]",
                                                                children: "Alex"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-[var(--text-muted)]",
                                                                children: "2:41 PM"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                                lineNumber: 157,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 bg-[var(--surface-secondary)] text-[var(--text)] p-2.5 rounded-xl rounded-tl-sm max-w-md inline-block",
                                                        children: "Jumped in right from my phone! No account login was super smooth."
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                lineNumber: 154,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-end gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-[var(--text-muted)]",
                                                            children: "2:42 PM"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold text-[var(--text)]",
                                                            children: "You"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 bg-[#7657E8] text-white p-2.5 rounded-xl rounded-tr-sm max-w-md inline-block text-left shadow-xs",
                                                    children: "I reviewed the wireframes. Everything looks clean and ready to launch!"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                            lineNumber: 167,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-xs text-[var(--text-secondary)] pt-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1 items-center bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] font-medium",
                                                    children: "Maria is typing"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex gap-0.5 ml-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                            lineNumber: 183,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                            lineNumber: 185,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                        lineNumber: 179,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/landing/hero.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/landing/hero.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(Hero, "zIwzP0Oo4LW0BQh0sLeWyiHTDDM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.5_@babel+core@7.2_6cf3e1bc4683dd7051a1d9f58f1f7a8a/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.5_@babel+core@7.2_6cf3e1bc4683dd7051a1d9f58f1f7a8a/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant = 'primary', size = 'md', ...props }, ref)=>{
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7657E8] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] cursor-pointer';
    const variants = {
        primary: 'bg-[#7657E8] hover:bg-[#6545D5] text-white shadow-sm shadow-[#7657E8]/25 hover:shadow-[#7657E8]/35',
        secondary: 'bg-[var(--surface-secondary)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)]',
        outline: 'border border-[var(--border)] hover:border-[#7657E8] bg-[var(--surface)] hover:bg-[var(--surface-secondary)] text-[var(--text)]',
        ghost: 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]',
        danger: 'bg-[#DC4C4C] hover:bg-[#C93B3B] text-white shadow-sm shadow-[#DC4C4C]/25'
    };
    const sizes = {
        sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
        md: 'text-sm px-4 py-2.5 h-10 gap-2',
        lg: 'text-base px-6 py-3 h-12 gap-2.5 font-semibold',
        icon: 'h-10 w-10 p-0'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$5_$40$babel$2b$core$40$7$2e$2_6cf3e1bc4683dd7051a1d9f58f1f7a8a$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variants[variant], sizes[size], className),
        ...props
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/ui/button.tsx",
        lineNumber: 35,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = 'Button';
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatRemainingTime",
    ()=>formatRemainingTime,
    "formatTime",
    ()=>formatTime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$7$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.7.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$7$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatTime(isoString) {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch  {
        return '';
    }
}
function formatRemainingTime(expiresAtIso) {
    try {
        const now = new Date().getTime();
        const expiry = new Date(expiresAtIso).getTime();
        const diff = Math.max(0, expiry - now);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
        if (hours > 0) {
            return `${hours}h ${minutes}m left`;
        }
        return `${minutes}m left`;
    } catch  {
        return 'Expiring soon';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_0tm6c3ftrw5ya._.js.map