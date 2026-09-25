# محرر ألف 5.3 التفاعلي (Alif Online Editor)

محرر تفاعلي عربي (RTL) للغة البرمجة **ألف 5.3** — بوضعين: **محرر مرئي** بالعقد (React Flow) و**محرر شيفرة** مع تلوين وتنسيق عربي، مع طرفية مخرجات متصلة بمفسر ألف السحابي عبر WebSocket.

## التشغيل محلياً

```bash
npm install
npm run dev      # http://localhost:3000
```

## الأوامر

| الأمر | الوصف |
| --- | --- |
| `npm run dev` | خادم التطوير |
| `npm run build` | بناء نسخة الإنتاج (تصدير ثابت `out/`) |
| `npm start` | تشغيل نسخة الإنتاج |
| `npm test` | اختبارات الوحدة (vitest) — 20 اختباراً |
| `npm run lint` | فحص ESLint |

## البنية باختصار

- `app/page.tsx` — الصفحة الرئيسية (محرر + طرفية)
- `app/components/editors/VisualEditor.tsx` — المحرر المرئي بالعقد
- `app/components/editors/TextEditor.tsx` — محرر الشيفرة مع التلوين
- `app/components/AlifNodes.ts` — تعريفات ~60 عقدة برمجية
- `app/lib/AlifGenerator.ts` — توليد كود ألف من الجراف (مع `# @node:id` لتتبع الأخطاء)
- `app/lib/alifHighlighter.ts` — التلوين والتنسيق
- `app/lib/shareCode.ts` — ترميز روابط المشاركة `?code=`
- `app/store/useEditorStore.ts` — الحالة العامة (zustand: العقد، الماكرو، المشاريع، التراجع)
- `app/hooks/useAlifCompiler.ts` — الاتصال بالمفسر: `wss://alif-playground.onrender.com`

## الاختصارات

- `Ctrl+Enter` (أو `Cmd+Enter`) — تشغيل البرنامج
- `Ctrl+Z` / `Ctrl+Shift+Z` / `Ctrl+Y` — تراجع / إعادة في المحرر المرئي

## النشر

يُبنى المشروع كصفحة ثابتة (`output: export`) ويُنشر تلقائياً على GitHub Pages عند الدفع إلى `main` عبر `.github/workflows/nextjs.yml` (يفحص الأنواع والاختبارات قبل البناء).
