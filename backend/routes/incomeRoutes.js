const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
  updateIncome,
  importIncome,
} = require("../controllers/incomeController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.put("/:id", protect, updateIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadExcel", protect, downloadIncomeExcel);
router.delete("/:id", protect, deleteIncome);
router.post("/import", protect, upload.single("file"), importIncome);

module.exports = router;
