const SavingsGoal = require("../models/SavingsGoal");

exports.createGoal = async (req, res) => {
  const userId = req.user.id;
  try {
    const { title, targetAmount, savedAmount, deadline, icon } = req.body;

    if (!title || !targetAmount) {
      return res
        .status(400)
        .json({ message: "Title and target amount are required" });
    }
    if (Number(targetAmount) <= 0) {
      return res
        .status(400)
        .json({ message: "Target amount must be greater than 0" });
    }

    const goal = await SavingsGoal.create({
      userId,
      title,
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount) || 0,
      deadline: deadline ? new Date(deadline) : null,
      icon: icon || "",
    });

    res.status(201).json(goal);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.getGoals = async (req, res) => {
  const userId = req.user.id;
  try {
    const goals = await SavingsGoal.find({ userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, deadline, icon } = req.body;

    if (!title || !targetAmount) {
      return res
        .status(400)
        .json({ message: "Title and target amount are required" });
    }

    const goal = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      {
        title,
        targetAmount: Number(targetAmount),
        savedAmount: Number(savedAmount) || 0,
        deadline: deadline ? new Date(deadline) : null,
        icon: icon || "",
      },
      { new: true },
    );

    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    await SavingsGoal.findByIdAndDelete(req.params.id);
    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
