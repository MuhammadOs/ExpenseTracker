# Expense Tracker

A full-stack MERN application for tracking personal income and expenses with charts, budgets, savings goals, data export, and user authentication.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, XLSX, Bcryptjs, Moment.js
**Frontend:** React 19, React Router 7, Tailwind CSS 4, Recharts, Axios, Moment.js, React Hot Toast

---

## Features

- JWT-based authentication (register, login, protected routes)
- Profile photo upload and settings management
- Add, edit, view, and delete income and expense transactions
- Emoji icons for transaction categorization
- Date range filtering on income and expense lists
- Bulk import from CSV or Excel files
- Export income and expense data to Excel
- Dashboard with balance, income, and expense summaries
- Charts: pie chart (financial overview), bar chart (income/expenses), area chart (expense trends)
- Recent transactions feed
- Budget limits per category with visual progress bars and over-budget warnings
- Savings goals tracker with progress, deadlines, and emoji icons
- Loading skeletons and empty states throughout
- Responsive layout with mobile sidebar

---

## Project Structure

```
ExpenseTracker/
├── backend/
│   ├── config/
│   │   └── db.js                       # MongoDB connection with Cloudflare DNS fix
│   ├── controllers/
│   │   ├── authController.js           # Register, login, get/update user, change password
│   │   ├── incomeController.js         # Add, get (with date filter), edit, delete, export, import
│   │   ├── expenseController.js        # Add, get (with date filter), edit, delete, export, import
│   │   ├── dashboardController.js      # Aggregated totals, recent transactions, 30/60 day data
│   │   ├── budgetController.js         # Set, get (with live spending), delete budgets
│   │   └── savingsGoalController.js    # Create, get, update, delete savings goals
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT token verification
│   │   └── uploadMiddleware.js         # Multer for images, xlsx, csv
│   ├── models/
│   │   ├── User.js
│   │   ├── Income.js
│   │   ├── Expense.js
│   │   ├── Budget.js
│   │   └── SavingsGoal.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── savingsGoalRoutes.js
│   ├── uploads/                        # Uploaded profile images and import files
│   ├── server.js
│   └── .env
│
└── frontend/expense-tracker/
    └── src/
        ├── components/
        │   ├── layouts/                # Navbar, Sidemenu, DashboardLayout, AuthLayout
        │   ├── Dashboard/              # RecentTransactions, FinanceOverview, chart widgets
        │   ├── Income/                 # IncomeOverview, IncomeList, AddIncomeForm
        │   ├── Expense/                # ExpenseOverview, ExpenseList, AddExpenseForm
        │   ├── Charts/                 # CustomPieChart, CustomBarChart, CustomLineChart
        │   ├── cards/                  # InfoCard, TransactionInfoCard, CharAvatar
        │   ├── inputs/                 # Input, ProfilePhotoSelector, EmojiPickerPopup
        │   ├── Skeleton.jsx            # Loading skeleton components
        │   └── EmptyState.jsx          # Empty state component
        ├── context/
        │   └── UserContext.jsx         # Global user state
        ├── hooks/
        │   └── useUserAuth.jsx         # Auth guard + user fetch on mount
        ├── pages/
        │   ├── Auth/                   # Login, SignUp
        │   └── Dashboard/              # Home, Income, Expense, Budget, Goals, Settings
        └── utils/
            ├── apiPaths.js             # API endpoint constants (env-based BASE_URL)
            ├── axiosinstance.js        # Axios with JWT interceptor and error handling
            ├── helper.js               # Validation, formatting, chart data helpers
            ├── uploadImage.js          # Image upload utility
            └── data.js                 # Side menu config
```

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint          | Auth | Description                        |
| ------ | ----------------- | ---- | ---------------------------------- |
| POST   | `/register`       | No   | Register new user                  |
| POST   | `/login`          | No   | Login and get JWT                  |
| GET    | `/getUser`        | Yes  | Get current user info              |
| PUT    | `/updateUser`     | Yes  | Update name, email, profile photo  |
| PUT    | `/changePassword` | Yes  | Change password (requires current) |
| POST   | `/upload-image`   | No   | Upload profile image               |

### Income — `/api/v1/income`

| Method | Endpoint         | Auth | Description                            |
| ------ | ---------------- | ---- | -------------------------------------- |
| POST   | `/add`           | Yes  | Add income entry                       |
| GET    | `/get`           | Yes  | Get all income (supports `?from=&to=`) |
| PUT    | `/:id`           | Yes  | Update income entry                    |
| DELETE | `/:id`           | Yes  | Delete income entry                    |
| GET    | `/downloadExcel` | Yes  | Export income to Excel                 |
| POST   | `/import`        | Yes  | Bulk import from CSV/Excel             |

### Expense — `/api/v1/expense`

| Method | Endpoint         | Auth | Description                              |
| ------ | ---------------- | ---- | ---------------------------------------- |
| POST   | `/add`           | Yes  | Add expense entry                        |
| GET    | `/get`           | Yes  | Get all expenses (supports `?from=&to=`) |
| PUT    | `/:id`           | Yes  | Update expense entry                     |
| DELETE | `/:id`           | Yes  | Delete expense entry                     |
| GET    | `/downloadExcel` | Yes  | Export expenses to Excel                 |
| POST   | `/import`        | Yes  | Bulk import from CSV/Excel               |

### Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Auth | Description                                      |
| ------ | -------- | ---- | ------------------------------------------------ |
| GET    | `/`      | Yes  | Totals, recent transactions, last 30/60 day data |

### Budget — `/api/v1/budget`

| Method | Endpoint          | Auth | Description                                |
| ------ | ----------------- | ---- | ------------------------------------------ |
| POST   | `/`               | Yes  | Set or update a budget (category + month)  |
| GET    | `/?month=YYYY-MM` | Yes  | Get budgets with live spending for a month |
| DELETE | `/:id`            | Yes  | Delete a budget                            |

### Savings Goals — `/api/v1/goals`

| Method | Endpoint | Auth | Description   |
| ------ | -------- | ---- | ------------- |
| POST   | `/`      | Yes  | Create a goal |
| GET    | `/`      | Yes  | Get all goals |
| PUT    | `/:id`   | Yes  | Update a goal |
| DELETE | `/:id`   | Yes  | Delete a goal |

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

Create a `.env` file in `frontend/expense-tracker/`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The app runs at `http://localhost:5173` and connects to the backend at `http://localhost:8000`.

---

## CSV/Excel Import Format

When importing income or expenses, your file should have these columns:

**Income:** `Source`, `Amount`, `Date`, `Icon` (Icon is optional)
**Expense:** `Category`, `Amount`, `Date`, `Icon` (Icon is optional)

Dates should be in a standard format (e.g. `2024-01-15`). Rows with an amount of 0 or missing are skipped.

---

## Implementation Progress

### Phase 1 — Bug Fixes ✅

- Fixed `setLoading[true]` → `setLoading(true)` in Income and Expense pages
- Fixed dashboard `lastTransactions` sort order (descending)
- Moved `BASE_URL` to `VITE_API_BASE_URL` environment variable
- Fixed validation comma operator bug in income/expense controllers
- Removed debug `console.log` statements from dashboard controller

### Phase 2 — Core Improvements ✅

- Edit functionality for income and expense (PUT endpoints + pre-filled forms)
- Date range filtering on income and expense lists
- CSV/Excel bulk import for income and expenses

### Phase 3 — User Experience ✅

- Settings page: update profile (name, email, photo) and change password
- Loading skeletons on dashboard, income, and expense pages
- Empty states with action buttons when no data exists

### Phase 4 — Advanced Features ✅

- Budget limits per category with progress bars, over-budget warnings
- Savings goals tracker with progress, deadlines, and emoji icons
- CSV/Excel import for bulk transaction upload
- Date range filtering on income and expense pages

### Phase 5 — Production Readiness

- [ ] Add rate limiting to auth endpoints
- [ ] Add input sanitization middleware
- [ ] Set up React error boundaries
- [ ] Add a CI/CD pipeline
- [ ] Deploy backend (Railway / Render) and frontend (Vercel / Netlify)
