import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import { LuTrash2, LuPlus } from "react-icons/lu";
import EmptyState from "../../components/EmptyState";
import { TransactionListSkeleton } from "../../components/Skeleton";

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Housing & Rent",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Travel",
  "Personal Care",
  "Subscriptions",
  "Other",
];

const BudgetBar = ({ percentage, spent, limit }) => {
  const isOver = spent > limit;
  const barColor = isOver
    ? "bg-red-500"
    : percentage >= 80
      ? "bg-orange-400"
      : "bg-primary";

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>${spent.toLocaleString()} spent</span>
        <span className={isOver ? "text-red-500 font-medium" : ""}>
          {isOver
            ? `$${(spent - limit).toLocaleString()} over`
            : `$${(limit - spent).toLocaleString()} left`}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const Budget = () => {
  useUserAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(moment().format("YYYY-MM"));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: EXPENSE_CATEGORIES[0],
    limit: "",
  });
  const [formError, setFormError] = useState("");

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${API_PATHS.BUDGET.GET_BUDGETS}?month=${month}`,
      );
      setBudgets(res.data);
    } catch {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.limit || Number(form.limit) <= 0) {
      setFormError("Please enter a valid limit.");
      return;
    }
    setFormError("");
    try {
      await axiosInstance.post(API_PATHS.BUDGET.SET_BUDGET, {
        category: form.category,
        limit: Number(form.limit),
        month,
      });
      toast.success("Budget saved");
      setShowForm(false);
      setForm({ category: EXPENSE_CATEGORIES[0], limit: "" });
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save budget");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(id));
      toast.success("Budget removed");
      fetchBudgets();
    } catch {
      toast.error("Failed to delete budget");
    }
  };

  return (
    <DashboardLayout activeMenu="Budget">
      <div className="my-5 mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Budget Limits</h2>
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
            />
            <button
              className="add-btn add-btn-fill flex items-center gap-2"
              onClick={() => setShowForm(!showForm)}
            >
              <LuPlus /> Add Budget
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Set budget for {moment(month, "YYYY-MM").format("MMMM YYYY")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] text-slate-800">Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="input-box mt-1"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[13px] text-slate-800">
                  Monthly Limit ($)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  placeholder="e.g. 500"
                  className="input-box mt-1 w-full bg-transparent outline-none"
                />
              </div>
            </div>
            {formError && (
              <p className="text-red-500 text-xs mt-2">{formError}</p>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="add-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="add-btn add-btn-fill">
                Save Budget
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <TransactionListSkeleton rows={4} />
        ) : budgets.length === 0 ? (
          <EmptyState
            message="No budgets set for this month"
            subMessage="Add a budget limit to track your spending by category."
            action={() => setShowForm(true)}
            actionLabel="Add Budget"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {budgets.map((b) => (
              <div key={b._id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{b.category}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Limit: ${b.limit.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        b.spent > b.limit ? "text-red-500" : "text-gray-700"
                      }`}
                    >
                      {b.percentage}%
                    </span>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete budget"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <BudgetBar
                  percentage={b.percentage}
                  spent={b.spent}
                  limit={b.limit}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Budget;
