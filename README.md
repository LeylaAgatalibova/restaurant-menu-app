# Restaurant QR Menu — Complete Project

A production-ready QR code restaurant menu with a fully secured admin panel.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Firebase Authentication (admin login only)
- Cloud Firestore (categories, products, badges, settings)
- Cloudinary (product image uploads, with automatic optimization)
- next-intl (Azerbaijani / English / Russian)
- Zustand (cart state)

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in your Firebase + Cloudinary values
npm run dev
```

- Customer menu: `http://localhost:3000/az` (or `/en`, `/ru`)
- Admin panel: `http://localhost:3000/admin/login`

## What's included

**Customer-facing app** (`/[locale]`)
- Category browsing, search, product detail view (description, ingredients, price)
- Cart with quantity controls, per-item notes, one order-level note, live total
- No checkout / no payment by design — the cart is shown to the waiter to place the order
- Real-time updates: any admin change appears instantly, no refresh needed
- Full AZ/EN/RU support for both interface text and content (category/product names, descriptions, ingredients, badges)

**Admin panel** (`/admin`, single-owner access enforced by Firebase UID)
- Dashboard with live stats and a QR code linking to your menu
- Categories: create/edit/soft-delete/restore
- Products: create/edit/soft-delete/restore, image upload (Cloudinary, 10MB limit, auto format/quality optimization), availability toggle, featured toggle, badge assignment
- Badges: create/edit/delete reusable tags (e.g. "Spicy", "Chef's Pick")
- Restaurant settings: fixed name + translated description

**Security**
- `firestore.rules` — public read, write restricted to your admin UID only
- No Firebase Storage used (Cloudinary instead), so no Storage rules needed

## Deployment

Already live on Vercel per Milestone 5. To redeploy after future changes:

```bash
vercel --prod
```

Environment variables are managed in your Vercel project → Settings → Environment Variables.

## Project structure

```
src/
├── app/
│   ├── [locale]/          # customer menu (localized)
│   └── admin/              # admin panel (not localized, single-owner)
├── components/
│   ├── customer/           # menu UI
│   ├── admin/               # admin UI
│   └── ui/                   # shared building blocks (LocalizedInput, ImageUpload)
├── services/                 # the only files that call Firestore/Cloudinary directly
├── store/                     # Zustand cart store
├── hooks/                      # useMenuData, useAdminAuth
├── types/                       # Category, Product, Cart, Settings, LocalizedText
├── i18n/                          # next-intl routing/config
├── constants/                      # supported languages
└── lib/                              # formatPrice, Cloudinary URL helper

firestore.rules   # Firestore security rules (published via Firebase Console)
```
