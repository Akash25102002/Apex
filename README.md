# Apex Product Admin Dashboard

An enterprise-grade, high-performance Product Administration Dashboard built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Axios**, powered by the [DummyJSON API](https://dummyjson.com).

Designed with a modern SaaS aesthetic inspired by production dashboard systems, featuring a collapsible responsive sidebar, live metrics cards, manually engineered data tables, debounced search with request cancellation, full URL state synchronization, and an in-session state persistence store that bridges DummyJSON's stateless mock API.

---

## 🚀 Live Demo & Credentials

| Credential | Value |
| :--- | :--- |
| **Live App URL** | [https://identifying-packed-humidity-cancellation.trycloudflare.com](https://identifying-packed-humidity-cancellation.trycloudflare.com) |
| **Login URL** | `/login` |
| **Demo Username** | `emilys` |
| **Demo Password** | `emilyspass` |
| **Quick Action** | An **Auto-fill** button is provided on `/login` for instantaneous testing |
| **Target Route** | `/products` |

---

## 🛠️ Tech Stack & Philosophy

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode, zero `any` usage in application types)
- **Styling**: Tailwind CSS with custom palette, shadows, and responsive breakpoints
- **HTTP Client**: Axios (single shared instance with interceptors, cancellation, and centralized error handling)
- **Icons**: Lucide React
- **API**: DummyJSON (`https://dummyjson.com`)
- **State & Data Fetching**: Pure React hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useContext`)
  - **Zero React Query / SWR**: All caching, synchronization, cancellation, and pagination logic engineered cleanly with custom hooks.
  - **Zero Ready-made Table / Pagination Libraries**: Table, mobile card transformation, and pagination are custom-built from scratch.

---

## ✨ Features

### 1. Robust Authentication & Protection
- **JWT Session Management**: Authenticates via `POST https://dummyjson.com/auth/login`, securely storing tokens and user profile data in client storage.
- **Global Axios Request Interception**: Automatically attaches `Authorization: Bearer <token>` to all downstream requests.
- **Route Guarding**: `AuthGuard` prevents unauthorized access to protected dashboard routes, redirecting unauthenticated users to `/login?redirect=...`.
- **Session Auto-Redirect**: Authenticated users visiting `/login` are automatically forwarded to `/products`.
- **Form Controls & Feedback**: Live form validation, password visibility toggle (`show/hide`), double-submit prevention, and explicit error banners for invalid credentials.
- **Logout Flow**: Centralized `logout()` cleans auth tokens and smoothly redirects to `/login`.

### 2. Modern SaaS Dashboard Layout
- **Desktop**: Fixed navigation sidebar (brand logo, navigation links, session status, user profile) + sticky top header (breadcrumbs, context info, quick actions, user menu) + content grid.
- **Mobile**: Responsive hamburger drawer navigation with backdrop blur and smooth open/close transitions.
- **Executive Metrics**: Live KPI widgets displaying Total Products, Category Breadth, Catalog Average Rating, and Low Stock Alerts.

### 3. Product Catalog & Listing
- **Manual Data Table (Desktop)**: Engineered from scratch without third-party table libraries. Displays product thumbnail, title, brand, SKU, category tag, formatted currency price, discount badge, star rating, stock badge, and action buttons.
- **Automatic Mobile Card View**: Seamlessly shifts to responsive cards on smaller viewports with full feature parity.
- **Actions**: Direct access to View (`/products/[id]`), Edit (`/products/[id]/edit`), and Delete.

### 4. Search & Debounce with Race Condition Cancellation
- **Debounced Input**: Custom `useDebounce` hook buffers user keystrokes (400ms delay) to prevent spamming the backend API.
- **Request Cancellation**: Leverages Axios `AbortController` / `signal` to immediately cancel in-flight stale requests when the query changes.
  - *Scenario*: User types "phone" then quickly types "laptop". The pending request for "phone" is aborted; only "laptop" results are parsed and displayed, even under high latency or `delay=2000` conditions.
- **URL Synchronization**: The active query updates `?search=...` in the browser URL and resets to page 1.

### 5. Category Filtering & DummyJSON Handling
- Fetches all 24 categories from `GET /products/categories`.
- Dynamic dropdown filters catalog results by category.
- When search and category filters are selected simultaneously, the app queries the search endpoint and refines results by category client-side with an explanatory UI badge.

### 6. Dynamic Sorting
- Provides 7 sorting options:
  - Default
  - Price: Low → High (`price-asc`)
  - Price: High → Low (`price-desc`)
  - Rating: Low → High (`rating-asc`)
  - Rating: High → Low (`rating-desc`)
  - Title: A → Z (`title-asc`)
  - Title: Z → A (`title-desc`)
- Integrates directly with DummyJSON's server-side sorting (`sortBy` and `order`) and serializes into `?sort=...` in the URL.

### 7. Manual Dynamic Pagination
- Pagination calculated dynamically from the API response without pagination packages.
- Features:
  - "Showing X to Y of Z products"
  - Page size selector: `10`, `20`, or `50` products per page
  - Previous / Next buttons with boundary disabling
  - Smart numerical pagination with dynamic ellipsis (`1 ... 4 5 6 ... 10`)
- **Safe Param Normalization**: Malformed query parameters like `?page=abc`, `?page=-10`, or `?page=999` are safely parsed and clamped to valid page boundaries without crashing the application.

### 8. Full URL State Persistence
- Filters, search term, pagination, page size, and sorting are stored directly in the URL:
  `/products?page=2&pageSize=20&search=phone&category=smartphones&sort=price-asc`
- Refreshing the browser or sharing the URL preserves the exact dashboard state.
- Full browser Back / Forward navigation support.

### 9. Product Details (`/products/[id]`)
- Comprehensive layout featuring:
  - Interactive image gallery with thumbnail preview switcher
  - Pricing, discount percentage badges, star ratings, and stock indicators
  - Complete specifications: Brand, SKU, weight, dimensions, warranty, shipping, and return policies
  - Customer review list with star ratings and reviewer information
- **Robust 404 Handler**: Visiting an invalid product ID like `/products/999999` displays an informative "Product Not Found" screen instead of a broken UI.

### 10. Product CRUD Operations & In-Session Store Strategy
- **Add Product (`/products/new`)**: Validated form with title, description, price, category, brand, stock, rating, and image URL with live thumbnail preview.
- **Edit Product (`/products/[id]/edit`)**: Pre-filled form with field validation and save status indicators.
- **Delete Product**: Triggers an accessible confirmation modal (`Are you sure you want to delete "[title]"?`) with loading spinners and double-click prevention.
- **Session Store (`productStore.ts`)**: Because DummyJSON is a simulated mock API that does not persist `POST`, `PUT`, or `DELETE` mutations on its backend, our client-side `productStore` intercepts responses and persists modifications in session storage:
  - Newly added products appear at the top of the catalog and can be inspected at `/products/[id]`.
  - Edited products reflect updated fields across all views.
  - Deleted products are pruned from table, cards, and detail views.

### 11. Loading, Error, and Empty States
- **Loading**: Bespoke skeleton loaders matching the exact dimensions of tables, cards, and detail pages.
- **Errors**: Centralized error boundaries with intuitive messages and a **Retry** button.
- **Empty State**: Friendly illustration and a **Clear Filters** button when searches return 0 matches.

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Authenticated login with validation & demo credentials
│   ├── products/
│   │   ├── [id]/
│   │   │   ├── edit/
│   │   │   │   └── page.tsx      # Edit product page
│   │   │   └── page.tsx          # Product details view & reviews
│   │   ├── new/
│   │   │   └── page.tsx          # Add product page
│   │   └── page.tsx              # Main products catalog (table, cards, filters)
│   ├── layout.tsx                # Root layout with AuthProvider & ToastProvider
│   ├── not-found.tsx             # Custom SaaS 404 page
│   └── page.tsx                  # Root redirector (/products or /login)
│
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx         # Route protection & session validation
│   ├── layout/
│   │   ├── DashboardLayout.tsx   # Shell combining Sidebar, Header & Content
│   │   ├── Header.tsx            # Breadcrumbs, quick actions & user profile menu
│   │   └── Sidebar.tsx           # Desktop fixed sidebar & mobile drawer
│   ├── products/
│   │   ├── DeleteConfirmModal.tsx# Accessible confirmation dialog
│   │   ├── ProductCardList.tsx   # Mobile responsive card view
│   │   ├── ProductFilters.tsx    # Debounced search, category dropdown & sort
│   │   ├── ProductForm.tsx       # Reusable Add/Edit form with live preview
│   │   ├── ProductPagination.tsx # Manual pagination controls & size selector
│   │   ├── ProductStats.tsx      # Top metrics cards
│   │   └── ProductTable.tsx      # Manual sortable data table
│   └── ui/
│       ├── EmptyState.tsx        # Zero-state placeholder with filter reset
│       ├── ErrorState.tsx        # Error banner with retry trigger
│       ├── Skeleton.tsx          # Shimmer loaders for tables, cards, details
│       └── Toast.tsx             # Global toast alert notification system
│
├── context/
│   └── AuthContext.tsx           # Global authentication context & state
│
├── hooks/
│   ├── useAuth.ts                # Authentication hook
│   ├── useDebounce.ts            # Reusable generic debouncer
│   └── useProducts.ts            # Master data hook: queries, URL sync, cancellation
│
├── lib/
│   ├── auth.ts                   # Token & session storage abstraction
│   ├── axios.ts                  # Shared Axios client with interceptors
│   └── productStore.ts           # In-session mock persistence store
│
├── services/
│   ├── auth.service.ts           # Auth API service (login, profile, logout)
│   └── product.service.ts        # Product API service (CRUD, search, categories)
│
├── types/
│   ├── auth.ts                   # TypeScript interfaces for Auth & User
│   └── product.ts                # TypeScript interfaces for Products & Filters
│
└── utils/
    ├── cn.ts                     # Tailwind class merging utility
    ├── formatters.ts             # Currency, dates, and stock badge formatters
    └── url.ts                    # Safe URL parameter parsing & normalization
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
- Node.js `v18.17+` or `v20+` (Tested on Node `v24.19.0`)
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Axios
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   *(By default, `NEXT_PUBLIC_API_URL` points to `https://dummyjson.com`)*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Important Architectural Decisions

### 1. Handling the DummyJSON Search + Category Limitation
**Challenge**: DummyJSON provides `/products/search?q=...` and `/products/category/{cat}`, but its REST API does not allow combining search queries and category filters in a single endpoint (passing `category` to the search endpoint or `q` to the category endpoint is ignored).  
**Strategy**:
- When a search query is active, the app queries the server-side `/products/search?q={query}` endpoint.
- If a category is simultaneously active, the app refines the returned search results by category client-side and presents a clear informational banner: *"Searching for '{query}' filtered within '{category}'"*.
- When the search bar is cleared, the app seamlessly returns to querying `/products/category/{cat}` directly from the backend.

### 2. Request Cancellation & Race Condition Mitigation
**Challenge**: When a user types rapidly (e.g. `p` -> `ph` -> `pho` -> `phone`), or if network latency fluctuates (or `&delay=2000` is simulated), an older slow response might resolve *after* a newer fast response, causing stale results to overwrite fresh data.  
**Strategy**:
- The custom `useDebounce` hook prevents API triggers during active keystrokes (400ms delay).
- When a new fetch cycle initiates, the previous in-flight request is immediately cancelled using `AbortController.abort()`.
- The shared Axios client passes `signal: controller.signal`. In the catch handler, `isCancel(error)` suppresses aborted promise rejections, guaranteeing that only the newest requested query can commit to React state.

### 3. URL as the Single Source of Truth
**Challenge**: Synchronizing complex filter states across page refreshes, browser history navigation (back/forward), and bookmarking without desynchronizing React state.  
**Strategy**:
- `page`, `pageSize`, `search`, `category`, and `sort` are serialized in the URL `searchParams`.
- Parameter parsers in `src/utils/url.ts` strictly sanitize inputs against whitelists and safe boundaries (e.g., non-numeric or negative pages gracefully fallback to `1`).
- Component inputs mirror the URL state, ensuring that copying and pasting a URL or navigating back/forward restores the exact catalog view.

### 4. DummyJSON CRUD Simulation & In-Session Store Strategy
**Challenge**: DummyJSON API simulates `POST /products/add`, `PUT /products/{id}`, and `DELETE /products/{id}` by returning simulated JSON responses, but does *not* persist these changes to its actual database. As a result, subsequent `GET` requests omit added items and revert edits.  
**Strategy**:
- We implemented `src/lib/productStore.ts`, a lightweight session-backed store.
- **Add**: When `POST /products/add` succeeds, the new product is saved to `productStore`. On subsequent list queries, local additions are merged at the top of the catalog and can be viewed or edited.
- **Edit**: When `PUT /products/{id}` succeeds, field overrides are tracked and automatically merged into product objects across the table, cards, and details pages.
- **Delete**: When `DELETE /products/{id}` succeeds, the ID is flagged as deleted. Filter logic excludes it from all catalog listings and returns a 404 screen if directly accessed by URL.

---

## 💡 Challenges Encountered & Solutions

### Challenge: Preventing Stale Overwrite Under High Artificial Latency
**Problem**: During testing with DummyJSON's `&delay=...` parameter, rapid typing could lead to multiple requests resolving out of order. If a query for "smart" was dispatched with a 2-second delay and then replaced with "watch" with a 500ms delay, the "smart" response would resolve last and overwrite the user's "watch" search results.  
**Solution**:
1. Implemented `useRef<AbortController | null>` in `useProducts`.
2. Before dispatching any request, `abortControllerRef.current?.abort()` terminates the active HTTP socket.
3. Added `axios.isCancel` inspection in the centralized Axios response interceptor and hook catch blocks to treat aborted requests as non-error cancellations, eliminating UI flashes or stale state pollution.

---

## 🤖 AI Usage Statement

AI coding assistance was utilized during the development of this project for:
- Accelerating initial boilerplate scaffolding and TypeScript interface drafting.
- Cross-verifying Tailwind utility classes for modern responsive dashboard styling.
- Generating realistic mock specification attributes (dimensions, weight, reviews) for product views.

All system architecture, Axios interceptor configurations, manual table and pagination logic, debounce and cancellation patterns, URL state normalization, and in-session mock persistence strategies were designed, engineered, and reviewed to ensure production-grade software standards.
