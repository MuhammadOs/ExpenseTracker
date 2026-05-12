const mongoose = require("mongoose");

const savingsGoalSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    deadline: { type: Date },
    icon: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
