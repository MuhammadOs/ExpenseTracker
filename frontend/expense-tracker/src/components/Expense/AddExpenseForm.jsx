import { useState, useEffect } from "react";
import EmojiPickerPopup from "../EmojiPickerPopup";
import Input from "../inputs/input";

const AddExpenseForm = ({ onAddExpense, initialData }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  useEffect(() => {
    if (initialData) {
      setExpense({
        category: initialData.category || "",
        amount: initialData.amount || "",
        date: initialData.date ? initialData.date.slice(0, 10) : "",
        icon: initialData.icon || "",
      });
    } else {
      setExpense({ category: "", amount: "", date: "", icon: "" });
    }
  }, [initialData]);

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Expense Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />
      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />
      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(expense)}
        >
          {initialData ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
