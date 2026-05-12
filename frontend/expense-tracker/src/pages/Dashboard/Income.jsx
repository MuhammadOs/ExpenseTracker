import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";
import { TransactionListSkeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setopenAddIncomeModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const fetchIncomeDetails = async (from = "", to = "") => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      const url = `${API_PATHS.INCOME.GET_ALL_INCOME}${params.toString() ? "?" + params.toString() : ""}`;
      const response = await axiosInstance.get(url);
      if (response.data) setIncomeData(response.data);
    } catch (err) {
      console.error("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;
    if (!source.trim()) {
      toast.error("Source is required.");
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
      if (editingIncome) {
        await axiosInstance.put(
          API_PATHS.INCOME.UPDATE_INCOME(editingIncome._id),
          {
            source,
            amount,
            date,
            icon,
          },
        );
        toast.success("Income updated successfully");
      } else {
        await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
          source,
          amount,
          date,
          icon,
        });
        toast.success("Income added successfully");
      }
      setEditingIncome(null);
      setopenAddIncomeModal(false);
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error saving income",
        error.response?.data?.message || error.message,
      );
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      toast.error(
        "Error deleting income.",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
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
        toast.error(errorJson.message || "Error downloading income excel");
      } else {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Error downloading: ${errorMessage}`);
      }
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axiosInstance.post(
        API_PATHS.INCOME.IMPORT_INCOME,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success(res.data.message);
      fetchIncomeDetails(dateRange.from, dateRange.to);
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    }
    e.target.value = "";
  };

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        {/* Date range filter */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, from: e.target.value }))
              }
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, to: e.target.value }))
              }
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary"
            />
          </div>
          <button
            className="add-btn add-btn-fill text-sm"
            onClick={() => fetchIncomeDetails(dateRange.from, dateRange.to)}
          >
            Filter
          </button>
          {(dateRange.from || dateRange.to) && (
            <button
              className="add-btn text-sm"
              onClick={() => {
                setDateRange({ from: "", to: "" });
                fetchIncomeDetails();
              }}
            >
              Clear
            </button>
          )}
          <label className="add-btn text-sm cursor-pointer ml-auto">
            Import CSV/Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => {
                setEditingIncome(null);
                setopenAddIncomeModal(true);
              }}
            />
          </div>
          {loading ? (
            <TransactionListSkeleton rows={5} />
          ) : incomeData.length === 0 ? (
            <EmptyState
              message="No income recorded yet"
              subMessage="Start by adding your first income entry."
              action={() => {
                setEditingIncome(null);
                setopenAddIncomeModal(true);
              }}
              actionLabel="Add Income"
            />
          ) : (
            <IncomeList
              transactions={incomeData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
              onEdit={(income) => {
                setEditingIncome(income);
                setopenAddIncomeModal(true);
              }}
              onDownload={handleDownloadIncomeDetails}
            />
          )}
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => {
            setopenAddIncomeModal(false);
            setEditingIncome(null);
          }}
          title={editingIncome ? "Edit Income" : "Add Income"}
        >
          <AddIncomeForm
            onAddIncome={handleAddIncome}
            initialData={editingIncome}
          />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income details?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
