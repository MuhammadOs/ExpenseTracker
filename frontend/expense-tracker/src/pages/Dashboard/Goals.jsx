import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuTrash2, LuPencil, LuPlus, LuTarget } from "react-icons/lu";
import EmptyState from "../../components/EmptyState";
import { TransactionListSkeleton } from "../../components/Skeleton";
import Modal from "../../components/Modal";
import Input from "../../components/inputs/input";
import EmojiPickerPopup from "../../components/EmojiPickerPopup";
import DeleteAlert from "../../components/DeleteAlert";

const emptyForm = {
  title: "",
  targetAmount: "",
  savedAmount: "",
  deadline: "",
  icon: "",
};

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const percentage = Math.min(
    Math.round((goal.savedAmount / goal.targetAmount) * 100),
    100,
  );
  const remaining = goal.targetAmount - goal.savedAmount;
  const isComplete = goal.savedAmount >= goal.targetAmount;

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-purple-50 rounded-full text-2xl shrink-0">
            {goal.icon ? (
              <img
                src={goal.icon}
                alt={goal.title}
                className="w-8 h-8 object-cover"
              />
            ) : (
              <LuTarget className="text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{goal.title}</p>
            {goal.deadline && (
              <p className="text-xs text-gray-400 mt-0.5">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-primary transition-colors"
            aria-label="Edit goal"
          >
            <LuPencil size={15} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete goal"
          >
            <LuTrash2 size={15} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>${goal.savedAmount.toLocaleString()} saved</span>
          <span className={isComplete ? "text-green-500 font-medium" : ""}>
            {isComplete
              ? "Goal reached! 🎉"
              : `$${remaining.toLocaleString()} to go`}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${isComplete ? "bg-green-500" : "bg-primary"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{percentage}%</span>
          <span className="text-xs text-gray-500 font-medium">
            Target: ${goal.targetAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const Goals = () => {
  useUserAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [deleteAlert, setDeleteAlert] = useState({ show: false, id: null });

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.GOALS.GET_GOALS);
      setGoals(res.data);
    } catch {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openAdd = () => {
    setEditingGoal(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (goal) => {
    setEditingGoal(goal);
    setForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : "",
      icon: goal.icon || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.targetAmount || Number(form.targetAmount) <= 0) {
      setFormError("Target amount must be greater than 0.");
      return;
    }
    setFormError("");
    try {
      if (editingGoal) {
        await axiosInstance.put(
          API_PATHS.GOALS.UPDATE_GOAL(editingGoal._id),
          form,
        );
        toast.success("Goal updated");
      } else {
        await axiosInstance.post(API_PATHS.GOALS.CREATE_GOAL, form);
        toast.success("Goal created");
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save goal");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.GOALS.DELETE_GOAL(deleteAlert.id));
      toast.success("Goal deleted");
      setDeleteAlert({ show: false, id: null });
      fetchGoals();
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  return (
    <DashboardLayout activeMenu="Goals">
      <div className="my-5 mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Savings Goals</h2>
          <button
            className="add-btn add-btn-fill flex items-center gap-2"
            onClick={openAdd}
          >
            <LuPlus /> New Goal
          </button>
        </div>

        {loading ? (
          <TransactionListSkeleton rows={3} />
        ) : goals.length === 0 ? (
          <EmptyState
            message="No savings goals yet"
            subMessage="Set a goal and track your progress toward it."
            action={openAdd}
            actionLabel="Create Goal"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {goals.map((g) => (
              <GoalCard
                key={g._id}
                goal={g}
                onEdit={() => openEdit(g)}
                onDelete={() => setDeleteAlert({ show: true, id: g._id })}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingGoal ? "Edit Goal" : "New Savings Goal"}
      >
        <form onSubmit={handleSubmit}>
          <EmojiPickerPopup
            icon={form.icon}
            onSelect={(icon) => setForm({ ...form, icon })}
          />
          <Input
            label="Goal Title"
            value={form.title}
            onChange={({ target }) => setForm({ ...form, title: target.value })}
            placeholder="e.g. Emergency Fund, New Laptop"
            type="text"
          />
          <Input
            label="Target Amount ($)"
            value={form.targetAmount}
            onChange={({ target }) =>
              setForm({ ...form, targetAmount: target.value })
            }
            placeholder="e.g. 5000"
            type="number"
          />
          <Input
            label="Amount Already Saved ($)"
            value={form.savedAmount}
            onChange={({ target }) =>
              setForm({ ...form, savedAmount: target.value })
            }
            placeholder="0"
            type="number"
          />
          <Input
            label="Deadline (optional)"
            value={form.deadline}
            onChange={({ target }) =>
              setForm({ ...form, deadline: target.value })
            }
            placeholder=""
            type="date"
          />
          {formError && (
            <p className="text-red-500 text-xs mt-2">{formError}</p>
          )}
          <div className="flex justify-end mt-6">
            <button type="submit" className="add-btn add-btn-fill">
              {editingGoal ? "Update Goal" : "Create Goal"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteAlert.show}
        onClose={() => setDeleteAlert({ show: false, id: null })}
        title="Delete Goal"
      >
        <DeleteAlert
          content="Are you sure you want to delete this savings goal?"
          onDelete={handleDelete}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Goals;
