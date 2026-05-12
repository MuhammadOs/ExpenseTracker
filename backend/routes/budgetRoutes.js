const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  setBudget,
  getBudgets,
  deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();

router.post("/", protect, setBudget);
router.get("/", protect, getBudgets);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
