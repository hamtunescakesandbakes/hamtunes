# Hamtunes Cakes & Bakes

A full-stack, production-grade website, intelligent product management system, and automatic photo synchronisation engine for **Hamtunes Cakes & Bakes** — an established Nigerian baking business celebrating 16 years of craftsmanship.

---

## 🎂 Business Information & Official Contact Integration

| Detail | Value | Link Format |
|---|---|---|
| **Business Name** | Hamtunes Cakes & Bakes | — |
| **Experience** | 16 Years of Excellence | Founded 2010 |
| **WhatsApp Direct** | `+234 803 397 6589` | `https://wa.me/2348033976589` |
| **Telephone Line** | `0904 957 1104` | `tel:09049571104` |
| **Official Email** | `hamtunescakesandbakes89@gmail.com` | `mailto:hamtunescakesandbakes89@gmail.com` |
| **Official Instagram** | `@hamtunescakes` | `https://www.instagram.com/hamtunescakes/` |

---

## 🎨 Official Brand Identity & Design Tokens

Refined directly from the authentic Hamtunes Cakes & Bakes logo:

```css
:root {
  --brand-pink: #F50057;          /* Hot Pink: Primary CTAs, badges, highlights */
  --brand-chocolate: #351207;     /* Deep Chocolate Brown: Headings, structure */
  --brand-chocolate-light: #5A2718;
  --brand-white: #FFFFFF;         /* Clean White: Backgrounds & negative space */
  --brand-ivory: #FFF9F5;         /* Warm Ivory: Section accents & cards */
  --brand-cream: #F7EFE8;         /* Light Cream: Category pills & inputs */
  --brand-border: #E8DDD7;        /* Subtle Border */
  --brand-muted: #6F625C;         /* Muted Text */
}
```

---

## 🌟 Key Website Features & Architecture

### 1. Equal Prominence for Both Divisions
- **Division A: Cakes (`/cakes`)**:
  - Birthday Cakes, Gifting & Mini Cakes, Cultural Celebration Cakes, Custom & Milestone Cakes.
  - Interactive live search, category filtering, and custom cake design consultation.
- **Division B: Bakes & Small Chops (`/bakes-and-small-chops`)**:
  - Doughnuts, Cupcakes, Meat Pies & Hand Pies, Sausage Rolls, and authentic Nigerian Small Chops.
  - Party platter and bulk order inquiry section with guest estimates.

### 2. Intelligent Product Discovery
- Interactive occasion selector ("Celebrating a Birthday", "Buying a Gift", "Planning an Event", "Craving Baked Treats", "Need Party Small Chops", "Have a Custom Design").
- Context-aware prefilling: clicking "Enquire on WhatsApp" or "Details" automatically pre-populates category, product name, and required details.

### 3. Automatic Photography Synchronisation System
- **Folder Source**: Watches and scans `Website Assets/` (`Brand Identity/`, `Brand Photography/`, `Cakes/`, `Deserts and Baked Goods/`, `Featured Cakes and Bakes/`).
- **Initial Import & Optimization**:
  - Generates optimized WebP images (max 1600px) and fast-loading thumbnails (500px).
  - Cryptographic duplicate detection via SHA-256 fingerprinting (identifies duplicates across folders).
  - Intelligent classifier categorizes images, extracts brand assets (logo, owner portrait), and routes uncertain images to the review queue.
- **Real-Time Watcher**:
  - Built with `chokidar` to detect new files added to any asset folder and process them automatically.

### 4. Secure Admin Dashboard (`/admin`)
- Accessible via passkey: `hamtunes2026`.
- **Overview**: Real-time KPIs for enquiries, published items, and sync health.
- **Enquiry Manager**: Filter, search, update status (`new`, `contacted`, `in_progress`, `completed`), internal notes, 1-click WhatsApp customer chat, and CSV export.
- **Photo Catalogue & Review**: Inspect new photos, approve or archive images, change categories, and toggle featured placement.
- **Product Manager**: Edit titles, descriptions, categories, and visibility.
- **Sync & Watcher Controls**: Trigger instant manual scans and toggle automatic publishing.

---

## 🚀 Running the Application

### 1. Start Development Server
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
bun run build
bun run start
```

### 3. Run Manual Photo Synchronisation
```bash
bun run sync
```

### 4. Run Real-Time Background File Watcher
```bash
bun run watch
```
Keep this process running in a terminal. Any new photograph dropped into `Website Assets/` will be immediately optimized, fingerprinted, and added to the website catalogue.

---

## ☁️ Cloud Deployment (Vercel & Supabase)

### Vercel Deployment
1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set Build Command: `bun run build` (or `npm run build`).

### Supabase Cloud Database Integration
1. Run the SQL schema script located in `supabase/schema.sql` in your Supabase SQL Editor.
2. In your Vercel project environment variables (or `.env.local`), add:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
3. The platform seamlessly falls back to the resilient local persistent file database (`data/database.json`) when Supabase credentials are not present, ensuring 100% uptime in all environments.
