const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    month: { type: String, required: true }, // format: "YYYY-MM"
  },
  { timestamps: true },
);

// one budget per category per month per user
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
