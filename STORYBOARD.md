# Hero Scroll Animation — Storyboard

> **الصور محتاج تحطها يدوياً في `/public/storyboard/`**
> بعد ما تحطها أنا بنفذ كل مشهد بالضبط من الصورة.

---

## القواعد الثابتة

- كل صورة = keyframe ثابتة
- الـ scroll بيعمل transition بين الـ keyframes
- مش بغير أي composition أو layout
- مش بضيف حاجة مش موجودة في الصور

---

## Scene 01 — Phone in Hand · Entry

**Scroll range:** `0% → 0%` *(first frame on page load)*
**Image path:** `/public/storyboard/scene-01.jpg`

**ما في الصورة:**
- يد بتمسك iPhone بالوضع العمودي — خلفية سوداء
- الشاشة شغالة بخلفية curves مضيئة (أزرق / أبيض)
- Dynamic Island ظاهر فوق
- الإطار graphite داكن
- الكروب بيأخذ الإطار + الشاشة كلها

**الـ transition للمشهد الجاي:**
- Camera تقترب (zoom in) ناحية الشاشة
- أو fade → مشهد 2

---

## Scene 02 — Camera System · Macro

**Scroll range:** `0% → 25%`
**Image path:** `/public/storyboard/scene-02.jpg`

**ما في الصورة:**
- Extreme close-up لنظام الكاميرا من الخلف
- 3 عدسات كبيرة في ترتيب مثلث (يسار أعلى، يمين وسط، يسار تحت)
- LiDAR + Flash يمين أعلى
- لون graphite داكن جداً
- خلفية سوداء
- Lighting سينمائي low-key

**الـ transition للمشهد الجاي:**
- Pull back / zoom out للخلف لحد ما الموبايل كامل يبان (مشهد 3)

---

## Scene 03 — Full Phone Reveal · Front & Back

**Scroll range:** `25% → 50%`
**Image path:** `/public/storyboard/scene-03.jpg`

**ما في الصورة:**
- الموبايل كامل — بيبان الوجهين في نفس الوقت (rotation / split view)
- اللون: Titanium برتقالي
- الخلف: Camera system يسار أعلى + Apple Logo وسط
- الأمام: الشاشة بيها wallpaper curves برتقالية ملتهبة
- خلفية سوداء — composition مربع

**الـ transition للمشهد الجاي:**
- يتقلب للخلف أو Camera تقترب للكاميرا (مشهد 4)

---

## Scene 04 — Camera Island · Perspective Close-Up

**Scroll range:** `50% → 70%`
**Image path:** `/public/storyboard/scene-04.jpg`

**ما في الصورة:**
- كلوز-أب للكاميرا من الخلف بزاوية منظور (perspective angle من تحت)
- اللون: Titanium برتقالي — التكستشر واضح جداً
- 3 عدسات + LiDAR + Flash
- Apple Logo ظاهر في الجزء التحتاني
- الإضاءة بتلعب على المادة البرتقالية وتبان ملمس metallc
- خلفية سوداء

**الـ transition للمشهد الجاي:**
- Camera تبتعد وتتحول للرأي من فوق → layers تبدأ تتفكك (مشهد 5)

---

## Scene 05 — 4-Layer Architecture · Exploded View

**Scroll range:** `70% → 100%`
**Image path:** `/public/storyboard/scene-05.jpg`

**ما في الصورة:**
- "iPhone 17 Pro Max" — عنوان كبير أبيض فوق
- "4-LAYER ARCHITECTURE" — subtitle صغير
- 4 Layers أفقية معلقة في الهواء بمسافات بين بعضهم:
  1. **DISPLAY & GLASS** — Super Retina XDR · Ceramic Shield 2
  2. **TITANIUM FRAME** — Aerospace-grade · Grade 5
  3. **LOGIC BOARD** — A19 Pro Chip · Advanced Architecture
  4. **BATTERY & CAMERA** — High-Density Battery · Pro Camera System
- Labels بيمين كل layer — خط رفيع + نقطة برتقالية + نص أبيض/رمادي
- خلفية سوداء — lighting درامي على كل layer

**Animation في المشهد ده:**
- Layers بتبدأ مفككة (كما في الصورة)
- مع الـ scroll بتتجمع وتتبنى الموبايل الكامل
- Labels بتختفي مع التجميع

**نهاية الـ hero:**
- بعد التجميع → CTA / "اكتشف المجموعة"

---

## ترتيب الـ Scenes

```
Scene 01 → Scene 02 → Scene 03 → Scene 04 → Scene 05
  يد         كاميرا    كامل      كاميرا      مفكك
 تمسك       macro     أمام       angle      + تجميع
 موبايل              + خلف
```

---

## الخطوة الجاية

1. احفظ الصور في `/public/storyboard/` باسم `scene-01.jpg` لـ `scene-05.jpg`
2. قولي "ابدأ" وأنا أنفذ كل مشهد بالترتيب ده بالضبط
