const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const moment = require("moment");

// Set or update a budget for a category/month
exports.setBudget = async (req, res) => {
  const userId = req.user.id;
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (Number(limit) <= 0) {
      return res.status(400).json({ message: "Limit must be greater than 0" });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId, category, month },
      { limit: Number(limit) },
      { upsert: true, new: true },
    );

    res.status(200).json(budget);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all budgets for a month with current spending
exports.getBudgets = async (req, res) => {
  const userId = req.user.id;
  try {
    const { month } = req.query; // "YYYY-MM"
    const targetMonth = month || moment().format("YYYY-MM");

    const budgets = await Budget.find({ userId, month: targetMonth });

    // calculate spending per category for the month
    const startOfMonth = moment(targetMonth, "YYYY-MM")
      .startOf("month")
      .toDate();
    const endOfMonth = moment(targetMonth, "YYYY-MM").endOf("month").toDate();

    const spending = await Expense.aggregate([
      {
        $match: {
          userId:
            require("mongoose").Types.ObjectId.createFromHexString(userId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const spendingMap = {};
    spending.forEach((s) => {
      spendingMap[s._id] = s.total;
    });

    const result = budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      limit: b.limit,
      month: b.month,
      spent: spendingMap[b.category] || 0,
      remaining: b.limit - (spendingMap[b.category] || 0),
      percentage: Math.min(
        Math.round(((spendingMap[b.category] || 0) / b.limit) * 100),
        100,
      ),
    }));

    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
