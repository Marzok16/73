# دفعة 1973 - موقع الزملاء والخريجين

موقع ويب تذكاري لزملاء دفعة الهندسة المدنية 1973 - لحفظ الذكريات والصور وربط الزملاء.

## المميزات

- 📸 عرض الصور التذكارية واللقاءات
- 👥 قاعدة بيانات الزملاء والخريجين
- 📚 إنشاء كتاب ذكريات PDF
- 📱 تصميم متجاوب يعمل على جميع الأجهزة
- 🎨 واجهة مستخدم عربية حديثة

## التقنيات المستخدمة

- **Vite** - Build tool
- **React** - Framework
- **TypeScript** - Language
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components

## التثبيت والتشغيل

### المتطلبات
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn

### خطوات التشغيل

```bash
# 1. تثبيت المكتبات المطلوبة
npm install

# 2. تشغيل السيرفر للتطوير
npm run dev

# 3. بناء المشروع للإنتاج
npm run build

# 4. معاينة النسخة المبنية
npm run preview
```

## البنية

```
frontend/
├── src/
│   ├── components/      # المكونات القابلة لإعادة الاستخدام
│   ├── pages/          # صفحات التطبيق
│   ├── services/       # خدمات API وPDF
│   ├── hooks/          # React Hooks مخصصة
│   └── assets/         # الصور والملفات الثابتة
├── public/             # الملفات العامة
└── dist/               # الملفات المبنية (يتم إنشاؤها بعد البناء)
```

## النشر (Deployment)

### النشر على Vercel (مجاني)

1. افتح https://vercel.com وسجل دخول بحساب GitHub
2. اضغط "Add New Project"
3. اختر المستودع `Marzok16/73`
4. الإعدادات:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. اضغط "Deploy"

بعد النشر ستحصل على رابط مثل: `https://73.vercel.app`

### بدائل أخرى
- **Netlify**: https://netlify.com (مجاني أيضاً)
- **GitHub Pages**: يحتاج إعداد إضافي

## الروابط

- **المستودع**: [GitHub Repository](https://github.com/Marzok16/73)
- **الموقع**: يتم نشره على Vercel

## المساهمة

نرحب بالمساهمات! يرجى فتح Issue أو Pull Request لأي تحسينات.

## الترخيص

هذا المشروع خاص لدفعة 1973 - جميع الحقوق محفوظة.
