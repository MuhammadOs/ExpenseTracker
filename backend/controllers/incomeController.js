const Income = require("../models/Income");
const xlsx = require("xlsx");
const fs = require("fs");
//add income
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" }, err);
  }
};

//get all income
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const { from, to } = req.query;
    const filter = { userId };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const income = await Income.find(filter).sort({ date: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" }, err);
  }
};

//update income
exports.updateIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Income.findByIdAndUpdate(
      req.params.id,
      { icon, source, amount, date: new Date(date) },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

//delete income
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income delete succesfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" }, err);
  }
};

//import income from CSV/Excel
exports.importIncome = async (req, res) => {
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

    const incomes = rows
      .map((row) => ({
        userId,
        source: row.Source || row.source || "Unknown",
        amount: Number(row.Amount || row.amount) || 0,
        date:
          row.Date || row.date ? new Date(row.Date || row.date) : new Date(),
        icon: row.Icon || row.icon || "",
      }))
      .filter((i) => i.amount > 0);

    await Income.insertMany(incomes);
    fs.unlinkSync(req.file.path);

    res
      .status(201)
      .json({
        message: `${incomes.length} income entries imported successfully`,
      });
  } catch (err) {
    res.status(500).json({ message: "Import failed", error: err.message });
  }
};
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    //prepare data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" }, err);
  }
};
