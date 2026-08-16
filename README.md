# NavaLab

เว็บไซต์กลุ่ม NavaLab (Maritime Specialists Community) — หน้าวิสัยทัศน์กลุ่ม + โปรไฟล์สมาชิก 10 คน สองภาษา (ไทย/อังกฤษ) แก้เนื้อหาได้ผ่าน CMS ที่ `/admin` โดยไม่ต้องแตะโค้ด

## Stack

- [Astro](https://astro.build) (static output) + Tailwind CSS 4
- Astro Content Collections สำหรับเนื้อหา (`src/content/`, schema ที่ `src/content.config.ts`)
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) ที่ `/admin` — commit ตรงเข้า GitHub
- Docker self-host (nginx + webhook auto-rebuild) — ดู `docs/DEPLOY.md`

## พัฒนา

```sh
npm install
npm run dev          # http://localhost:4321
```

เนื้อหาตอนนี้เป็น **placeholder** ทั้งหมด (สมาชิก 10 คนสมมติ, avatar เป็นตัวอักษรย่อ) สร้างด้วย `node scripts/generate-placeholders.mjs` — แก้เป็นข้อมูลจริงผ่าน `/admin` หรือแก้ไฟล์ `.md`/`.json` ใน `src/content/` โดยตรง

## โครงสร้างสำคัญ

```
src/content.config.ts        schema เนื้อหาทั้งหมด (members, projects, news, site)
src/content/                 เนื้อหาจริง (Markdown/JSON)
src/i18n/ui.ts                คำแปล UI ไทย/อังกฤษ
src/styles/global.css         design tokens (สี, ฟอนต์)
src/layouts/BaseLayout.astro  SEO, JSON-LD, hreflang
src/views/                    หน้าแต่ละแบบ (ใช้ร่วมกันทั้ง /th และ /en)
public/admin/config.yml       นิยามฟอร์มใน CMS — ต้องตรงกับ content.config.ts เสมอ
deploy/                       Docker self-host stack (builder, webhook, oauth proxy)
```

## เอกสาร

- `docs/CMS-GUIDE.md` — วิธีแก้เนื้อหาผ่าน `/admin` (สำหรับ admin)
- `docs/DEPLOY.md` — วิธี deploy ด้วย Docker Compose บนเซิร์ฟเวอร์ตัวเอง

## คำสั่งอื่นๆ

| Command | Action |
| :--- | :--- |
| `npm run build` | Build ไปที่ `./dist/` |
| `npm run preview` | ดูผล build ก่อน deploy จริง |
| `docker compose up -d --build` | รันสแต็ก self-host ทั้งหมด |
