# Expense Tracker

A full-stack MERN application for tracking personal income and expenses with charts, data export, and user authentication.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, XLSX, Bcryptjs  
**Frontend:** React 19, React Router 7, Tailwind CSS 4, Recharts, Axios, Moment.js, React Hot Toast

---

## Features

- JWT-based authentication (register, login, protected routes)
- Profile photo upload
- Add, view, and delete income and expense transactions
- Emoji icons for transaction categorization
- Dashboard with balance, income, and expense summaries
- Charts: pie chart (financial overview), bar chart (income/expenses), area chart (expense trends)
- Recent transactions feed
- Export income and expense data to Excel
- Responsive layout with mobile sidebar

---

## Project Structure

```
ExpenseTracker/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection with DNS fix
│   ├── controllers/
│   │   ├── authController.js      # Register, login, get user
│   │   ├── incomeController.js    # Add, get, delete, export income
│   │   ├── expenseController.js   # Add, get, delete, export expense
│   │   └── dashboardController.js # Aggregated dashboard data
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification
│   │   └── uploadMiddleware.js    # Multer image upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Income.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/                   # Uploaded profile images
│   ├── server.js
│   └── .env
│
└── frontend/expense-tracker/
    └── src/
        ├── components/
        │   ├── layouts/           # Navbar, Sidemenu, DashboardLayout, AuthLayout
        │   ├── Dashboard/         # RecentTransactions, FinanceOverview, charts widgets
        │   ├── Income/            # IncomeOverview, IncomeList, AddIncomeForm
        │   ├── Expense/           # ExpenseOverview, ExpenseList, AddExpenseForm
        │   ├── Charts/            # CustomPieChart, CustomBarChart, CustomLineChart
        │   ├── cards/             # InfoCard, TransactionInfoCard, CharAvatar
        │   └── inputs/            # Input, ProfilePhotoSelector, EmojiPickerPopup
        ├── context/
        │   └── UserContext.jsx    # Global user state
        ├── hooks/
        │   └── useUserAuth.jsx    # Auth guard + user fetch on mount
        ├── pages/
        │   ├── Auth/              # Login, SignUp
        │   └── Dashboard/         # Home, Income, Expense
        └── utils/
            ├── apiPaths.js        # API endpoint constants
            ├── axiosinstance.js   # Axios with JWT interceptor
            ├── helper.js          # Validation, formatting, chart data helpers
            ├── uploadImage.js     # Image upload utility
            └── data.js            # Side menu config
```

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint        | Auth | Description           |
| ------ | --------------- | ---- | --------------------- |
| POST   | `/register`     | No   | Register new user     |
| POST   | `/login`        | No   | Login and get JWT     |
| GET    | `/getUser`      | Yes  | Get current user info |
| POST   | `/upload-image` | No   | Upload profile image  |

### Income — `/api/v1/income`

| Method | Endpoint         | Auth | Description            |
| ------ | ---------------- | ---- | ---------------------- |
| POST   | `/add`           | Yes  | Add income entry       |
| GET    | `/get`           | Yes  | Get all income         |
| DELETE | `/:id`           | Yes  | Delete income entry    |
| GET    | `/downloadExcel` | Yes  | Export income to Excel |

### Expense — `/api/v1/expense`

| Method | Endpoint         | Auth | Description              |
| ------ | ---------------- | ---- | ------------------------ |
| POST   | `/add`           | Yes  | Add expense entry        |
| GET    | `/get`           | Yes  | Get all expenses         |
| DELETE | `/:id`           | Yes  | Delete expense entry     |
| GET    | `/downloadExcel` | Yes  | Export expenses to Excel |

### Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Auth | Description                                          |
| ------ | -------- | ---- | ---------------------------------------------------- |
| GET    | `/`      | Yes  | Get totals, recent transactions, last 30/60 day data |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
PORT=8000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend/expense-tracker
npm install
npm run dev
```

The app runs at `http://localhost:5173` and connects to the backend at `http://localhost:8000`.

---

## Implementation Plan

### Phase 1 — Bug Fixes (immediate)

- [x] Fix `setLoading[true]` → `setLoading(true)` in `Income.jsx` and `Expense.jsx`
- [x] Fix dashboard `lastTransactions` sort order (now correctly descending)
- [x] Move `BASE_URL` to environment variable (`VITE_API_BASE_URL`)
- [x] Fix validation comma operator bug in income/expense controllers
- [x] Remove debug `console.log` statements from dashboard controller
- [x] Add `eslint-disable` comments for intentional `useEffect` dependency patterns

### Phase 2 — Core Improvements

- [x] Add edit functionality for income and expense entries (PUT endpoints + pre-filled forms)
- [ ] Add predefined category list for expenses (Food, Transport, Utilities, etc.)
- [ ] Add search and filter on income/expense lists
- [ ] Add date range picker for filtering transactions
- [ ] Add pagination or infinite scroll on transaction lists

### Phase 3 — User Experience

- [x] Add a Settings page (update name, email, password, profile photo)
- [x] Add change password flow with current password verification
- [x] Add loading skeletons for dashboard, income, and expense pages
- [x] Add empty state when no transactions exist
- [ ] Improve mobile responsiveness on dashboard charts

### Phase 4 — Advanced Features

- [ ] Budget limits per category with visual warnings
- [ ] Recurring transactions (weekly, monthly)
- [ ] CSV import for bulk transaction upload
- [ ] Custom date range on dashboard (not just fixed 30/60 days)
- [ ] Savings goals tracker

### Phase 5 — Production Readiness

- [ ] Move secrets to environment variables (no hardcoded URLs)
- [ ] Add rate limiting to auth endpoints
- [ ] Add input sanitization middleware
- [ ] Set up proper error boundaries in React
- [ ] Add a CI/CD pipeline
- [ ] Deploy backend (Railway / Render) and frontend (Vercel / Netlify)

---

## Known Issues

| File                                          | Issue                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- | --- | -------------------------------------- |
| `Income.jsx`, `Expense.jsx`                   | `setLoading[true]` uses array syntax instead of function call — loading state never updates |
| `dashboardController.js`                      | `lastTransactions` sorted ascending instead of descending                                   |
| `apiPaths.js`                                 | `BASE_URL` hardcoded to `localhost:8000` — breaks in production                             |
| `incomeController.js`, `expenseController.js` | Validation uses comma operator `(!source, !amount, !date)` instead of `                     |     | ` — always evaluates to last condition |
