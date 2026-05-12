const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  updateExpense,
  importExpenses,
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.put("/:id", protect, updateExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);
router.delete("/:id", protect, deleteExpense);
router.post("/import", protect, upload.single("file"), importExpenses);

module.exports = router;
