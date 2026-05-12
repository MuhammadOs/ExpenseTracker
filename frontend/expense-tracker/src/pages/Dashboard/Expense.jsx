import axiosInstance from "../../utils/axiosinstance";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useEffect, useState } from "react";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import { TransactionListSkeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_ALL_EXPENSE,
      );
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (err) {
      console.error("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }
    try {
      if (editingExpense) {
        await axiosInstance.put(
          API_PATHS.EXPENSE.UPDATE_EXPENSE(editingExpense._id),
          {
            category,
            amount,
            date,
            icon,
          },
        );
        toast.success("Expense updated successfully");
      } else {
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
          category,
          amount,
          date,
          icon,
        });
        toast.success("Expense added successfully");
      }
      setEditingExpense(null);
      setOpenAddExpenseModal(false);
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error saving expense",
        error.response?.data?.message || error.message,
      );
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      toast.error(
        "Error deleting expense.",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Error:", error);

      if (
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type === "application/json"
      ) {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        toast.error(errorJson.message || "Error downloading expense excel");
      } else {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Error downloading: ${errorMessage}`);
      }
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => {
                setEditingExpense(null);
                setOpenAddExpenseModal(true);
              }}
            />
          </div>
          {loading ? (
            <TransactionListSkeleton rows={5} />
          ) : expenseData.length === 0 ? (
            <EmptyState
              message="No expenses recorded yet"
              subMessage="Start by adding your first expense entry."
              action={() => {
                setEditingExpense(null);
                setOpenAddExpenseModal(true);
              }}
              actionLabel="Add Expense"
            />
          ) : (
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
              onEdit={(expense) => {
                setEditingExpense(expense);
                setOpenAddExpenseModal(true);
              }}
              onDownload={handleDownloadExpenseDetails}
            />
          )}
        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => {
            setOpenAddExpenseModal(false);
            setEditingExpense(null);
          }}
          title={editingExpense ? "Edit Expense" : "Add Expense"}
        >
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            initialData={editingExpense}
          />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense details?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
