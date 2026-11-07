# DripVora — storefront + admin panel

React 19 · Vite · Tailwind 4 · React Router · Axios · Framer Motion.
It talks to the DripVora Spring Boot API (`store/`), which uses **e-mail OTP verification** for sign-up and sign-in.

## Run

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:8080
npm install
npm run dev              # http://localhost:5173  (the only origin the backend's CORS allows)
```

Start the backend first (MySQL + the `store` project). Make an admin by setting `role = 'ADMIN'` on a user row
in MySQL once (or promote a user from the admin panel afterwards).

## How sign-in works

1. `POST /dripvora/signup` or `/login` → the backend e-mails a 6-digit code (valid 5 min).
2. The `/verify` screen sends it to `POST /dripvora/verify-otp` → JWT.
3. The JWT is kept in `localStorage` (`dripvora:token`), sent as `Authorization: Bearer …`, and the profile
   (`GET /dripvora/user/profile`) supplies the role. The admin area renders only for `ADMIN`.

## Layout

| Path | What |
| --- | --- |
| `src/services/` | **All** HTTP calls (one file per backend area). `api.js` = Axios client, token, error handling |
| `src/lib/adapters.js` | Backend product → UI shape (discount → selling price, gender → men/women/kids, "new" badge) |
| `src/context/` | Auth, products, cart, wishlist state on top of the services |
| `src/pages/` | Home, Shop, Product, Cart, Checkout, Orders, Wishlist, Login, Signup, Verify OTP, Profile |
| `src/admin/` | Dashboard · Products (add/edit/hide/delete + image upload) · Categories · Orders · Customers |
| `src/components/` | Navbar + mega-menu, search, cart drawer, product card, footer … |
| `public/art/` | Hero/category artwork (regenerate with `node scripts/generate-art.mjs`) |

## Backend notes

* The backend declares some routes as `/dripora/...` (no "v"): wishlist and admin dashboard/orders/users/categories.
  The services use the paths exactly as declared.
* Products have a single `imageUrl`, no sizes/colours, and `gender` (Men / Women / Kids / Unisex) drives the storefront sections.
* `backend-fixes.patch` (shipped alongside) contains four small backend fixes the cart/orders screens depend on.
