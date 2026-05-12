import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Categories</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="test-base" /> Download
        </button>
      </div>
      <div>
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            type="expense"
            icon={expense.icon}
            amount={expense.amount}
            date={moment(expense.date).format("Do MMM YYYY")}
            onDelete={() => onDelete(expense._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
