# Book E-Commerce

Online book selling platform built with Next.js 14, Supabase, MSG91 OTP, and Razorpay.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **OTP**: MSG91
- **Payments**: Razorpay (COD + Online)
- **Hosting**: Vercel

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and fill values
4. Run `npm run dev`
5. Open http://localhost:3000

## Team
- Backend: API, Database, OTP, Razorpay, Admin Logic
- Frontend (Agalya): UI Pages, Components, Styling

## Branch Strategy
- `main` → production only
- `dev` → active development
- `feature/*` → individual task branches
<<<<<<< HEAD



## This Is Tree OF the FIle 
book-ecommerce/
├── src/
│   ├── app/
│   │   ├── page.tsx                        ← Home page
│   │   ├── layout.tsx                      ← Root layout
│   │   ├── globals.css
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   │
│   │   ├── books/[id]/page.tsx             ← Book detail
│   │   ├── cart/page.tsx                   ← Cart
│   │   ├── checkout/page.tsx               ← Checkout Steps 1,2,3
│   │   ├── order-success/page.tsx          ← Success page
│   │   ├── payment-failed/page.tsx         ← Failure page
│   │   ├── admin/page.tsx                  ← Admin login
│   │   ├── admin/dashboard/page.tsx        ← Admin dashboard
│   │   │
│   │   └── api/
│   │       ├── books/route.ts              ← GET all books
│   │       ├── books/[id]/route.ts         ← GET single book
│   │       ├── otp/send/route.ts           ← Send OTP
│   │       ├── otp/verify/route.ts         ← Verify OTP
│   │       ├── orders/route.ts             ← Create order
│   │       ├── payment/create-order/route.ts  ← Razorpay order
│   │       ├── payment/verify/route.ts        ← Razorpay verify
│   │       ├── admin/login/route.ts
│   │       ├── admin/orders/route.ts
│   │       ├── admin/orders/[id]/route.ts
│   │       ├── admin/books/route.ts
│   │       └── admin/books/[id]/route.ts
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── BookCard.tsx
│   │   ├── BookGrid.tsx
│   │   ├── BookSkeleton.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StockBadge.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── CartIcon.tsx
│   │   ├── EmptyCart.tsx
│   │   ├── CheckoutStepper.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── OtpInput.tsx
│   │   ├── OtpResendTimer.tsx
│   │   ├── PaymentSelect.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── LoadingButton.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── PageLoader.tsx
│   │   └── admin/
│   │       ├── AdminNavbar.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── StatsCard.tsx
│   │       ├── OrdersTable.tsx
│   │       ├── OrderStatusDropdown.tsx
│   │       ├── BooksTable.tsx
│   │       ├── AddBookForm.tsx
│   │       ├── OrderFilters.tsx
│   │       └── Pagination.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts          ← DB client
│   │   ├── supabaseAdmin.ts     ← DB admin client
│   │   ├── razorpay.ts          ← Razorpay server setup
│   │   ├── msg91.ts             ← OTP SMS helper
│   │   ├── auth.ts              ← JWT auth helpers
│   │   ├── otpHelper.ts         ← OTP generate/hash
│   │   ├── rateLimit.ts         ← OTP rate limiting
│   │   ├── apiResponse.ts       ← Standard API responses
│   │   ├── formatPrice.ts       ← Rs.299 formatter
│   │   ├── cartHelpers.ts       ← Cart utils
│   │   ├── razorpayLoader.ts    ← Load Razorpay script
│   │   ├── validators.ts        ← Form validators
│   │   └── cn.ts                ← Tailwind class util
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useOtp.ts
│   │   ├── useCheckout.ts
│   │   ├── useBooks.ts
│   │   ├── useAdminOrders.ts
│   │   └── useToast.ts
│   │
│   ├── context/
│   │   ├── CartContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── cart.ts
│   │   └── razorpay.d.ts
│   │
│   ├── styles/
│   │   └── animations.css
│   │
│   └── middleware.ts            ← Admin route protection
│
├── public/images/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .env.local.example           ← Copy this → .env.local
├── .gitignore
└── README.md








##This Who Touch wish file 

 book-ecommerce/
├── package.json                          [shared]
├── tsconfig.json                         [shared]
├── next.config.ts                        [shared]
├── tailwind.config.ts                    [agalya]
├── postcss.config.js                     [agalya]
├── .env.local                            [endhrajith]  ← never commit
├── .gitignore                            [shared]
├── README.md                             [shared]
│
└── src/
    │
    ├── app/
    │   ├── layout.tsx                    [agalya]      ← navbar, razorpay script
    │   ├── globals.css                   [agalya]
    │   ├── loading.tsx                   [agalya]
    │   ├── error.tsx                     [agalya]
    │   ├── not-found.tsx                 [agalya]
    │   ├── page.tsx                      [agalya]      ← home - book listing
    │   │
    │   ├── books/
    │   │   └── [id]/
    │   │       └── page.tsx              [agalya]      ← book detail
    │   │
    │   ├── cart/
    │   │   └── page.tsx                  [agalya]
    │   │
    │   ├── checkout/
    │   │   └── page.tsx                  [agalya]      ← steps 1, 2, 3
    │   │
    │   ├── order-success/
    │   │   └── page.tsx                  [agalya]
    │   │
    │   ├── payment-failed/
    │   │   └── page.tsx                  [agalya]
    │   │
    │   ├── admin/
    │   │   ├── page.tsx                  [agalya]      ← admin login
    │   │   └── dashboard/
    │   │       ├── page.tsx              [agalya]
    │   │       └── loading.tsx           [agalya]
    │   │
    │   └── api/
    │       ├── books/
    │       │   ├── route.ts              [endhrajith]  ← GET all books
    │       │   └── [id]/
    │       │       └── route.ts          [endhrajith]  ← GET single book
    │       │
    │       ├── otp/
    │       │   ├── send/
    │       │   │   └── route.ts          [endhrajith]  ← send OTP via msg91
    │       │   └── verify/
    │       │       └── route.ts          [endhrajith]  ← verify OTP
    │       │
    │       ├── orders/
    │       │   └── route.ts              [endhrajith]  ← create order
    │       │
    │       ├── payment/
    │       │   ├── create-order/
    │       │   │   └── route.ts          [endhrajith]  ← razorpay order
    │       │   └── verify/
    │       │       └── route.ts          [endhrajith]  ← razorpay HMAC verify
    │       │
    │       └── admin/
    │           ├── login/
    │           │   └── route.ts          [endhrajith]
    │           ├── orders/
    │           │   ├── route.ts          [endhrajith]  ← list all orders
    │           │   └── [id]/
    │           │       └── route.ts      [endhrajith]  ← update status
    │           └── books/
    │               ├── route.ts          [endhrajith]  ← add book
    │               └── [id]/
    │                   └── route.ts      [endhrajith]  ← delete book
    │
    ├── components/
    │   ├── Navbar.tsx                    [agalya]
    │   ├── Footer.tsx                    [agalya]
    │   ├── MobileMenu.tsx                [agalya]
    │   ├── BookCard.tsx                  [agalya]
    │   ├── BookGrid.tsx                  [agalya]
    │   ├── BookSkeleton.tsx              [agalya]
    │   ├── SearchBar.tsx                 [agalya]
    │   ├── StockBadge.tsx                [agalya]
    │   ├── CartItem.tsx                  [agalya]
    │   ├── CartSummary.tsx               [agalya]
    │   ├── CartIcon.tsx                  [agalya]
    │   ├── EmptyCart.tsx                 [agalya]
    │   ├── CheckoutStepper.tsx           [agalya]
    │   ├── CheckoutForm.tsx              [agalya]
    │   ├── OtpInput.tsx                  [agalya]
    │   ├── OtpResendTimer.tsx            [agalya]
    │   ├── PaymentSelect.tsx             [agalya]
    │   ├── OrderSummary.tsx              [agalya]
    │   ├── LoadingButton.tsx             [agalya]
    │   ├── StatusBadge.tsx               [agalya]
    │   ├── Toast.tsx                     [agalya]
    │   ├── Modal.tsx                     [agalya]
    │   ├── ConfirmDialog.tsx             [agalya]
    │   ├── Breadcrumb.tsx                [agalya]
    │   ├── PriceDisplay.tsx              [agalya]
    │   ├── EmptyState.tsx                [agalya]
    │   ├── ErrorMessage.tsx              [agalya]
    │   ├── PageLoader.tsx                [agalya]
    │   └── admin/
    │       ├── AdminNavbar.tsx           [agalya]
    │       ├── AdminSidebar.tsx          [agalya]
    │       ├── StatsCard.tsx             [agalya]
    │       ├── OrdersTable.tsx           [agalya]
    │       ├── OrderStatusDropdown.tsx   [agalya]
    │       ├── BooksTable.tsx            [agalya]
    │       ├── AddBookForm.tsx           [agalya]
    │       ├── OrderFilters.tsx          [agalya]
    │       └── Pagination.tsx            [agalya]
    │
    ├── lib/
    │   ├── supabase.ts                   [endhrajith]  ← db client
    │   ├── supabaseAdmin.ts              [endhrajith]  ← db admin client
    │   ├── razorpay.ts                   [endhrajith]  ← razorpay server setup
    │   ├── msg91.ts                      [endhrajith]  ← otp sms helper
    │   ├── auth.ts                       [endhrajith]  ← jwt helpers
    │   ├── otpHelper.ts                  [endhrajith]  ← generate + hash otp
    │   ├── rateLimit.ts                  [endhrajith]  ← otp spam protection
    │   ├── apiResponse.ts                [endhrajith]  ← standard api responses
    │   ├── formatPrice.ts                [agalya]      ← Rs.299 formatter
    │   ├── cartHelpers.ts                [agalya]
    │   ├── razorpayLoader.ts             [agalya]      ← load sdk script
    │   ├── validators.ts                 [agalya]      ← form validators
    │   └── cn.ts                         [agalya]      ← tailwind class util
    │
    ├── hooks/
    │   ├── useCart.ts                    [agalya]
    │   ├── useOtp.ts                     [agalya]
    │   ├── useCheckout.ts                [agalya]
    │   ├── useBooks.ts                   [agalya]
    │   ├── useAdminOrders.ts             [agalya]
    │   └── useToast.ts                   [agalya]
    │
    ├── context/
    │   ├── CartContext.tsx               [agalya]
    │   └── ToastContext.tsx              [agalya]
    │
    ├── types/
    │   ├── index.ts                      [shared]      ← Book, Order, CartItem
    │   ├── api.ts                        [shared]
    │   ├── cart.ts                       [agalya]
    │   └── razorpay.d.ts                 [endhrajith]
    │
    ├── styles/
    │   └── animations.css                [agalya]
    │
    └── middleware.ts                     [endhrajith]  ← admin route protection
=======
>>>>>>> 1f88fadfa101860d452cc9184545d231b97e8f43
