const Expense = require("../models/Expense");
const xlsx = require("xlsx");
const fs = require("fs");

//add expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" }, err);
  }
};

//get all expense
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { from, to } = req.query;
    const filter = { userId };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const expense = await Expense.find(filter).sort({ date: -1 });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" }, err);
  }
};

//update expense
exports.updateExpense = async (req, res) => {
  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { icon, category, amount, date: new Date(date) },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

//delete expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Income delete succesfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" }, err);
  }
};

//import expenses from CSV/Excel
exports.importExpenses = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const wb = xlsx.readFile(req.file.path);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(ws);

    if (!rows.length) {
      return res.status(400).json({ message: "File is empty" });
    }

    const expenses = rows
      .map((row) => ({
        userId,
        category: row.Category || row.category || "Uncategorized",
        amount: Number(row.Amount || row.amount) || 0,
        date:
          row.Date || row.date ? new Date(row.Date || row.date) : new Date(),
        icon: row.Icon || row.icon || "",
      }))
      .filter((e) => e.amount > 0);

    await Expense.insertMany(expenses);
    fs.unlinkSync(req.file.path); // clean up uploaded file

    res
      .status(201)
      .json({ message: `${expenses.length} expenses imported successfully` });
  } catch (err) {
    res.status(500).json({ message: "Import failed", error: err.message });
  }
};
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    //prepare data for Excel
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" }, err);
  }
};
