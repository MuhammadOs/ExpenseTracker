import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

const ExpenseTransaction = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        {!Array.isArray(transactions) || transactions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No recent expenses found.
          </p>
        ) : (
          transactions
            .slice(0, 5)
            .map((expense) => (
              <TransactionInfoCard
                key={expense._id}
                title={expense.category}
                amount={expense.amount}
                icon={expense.icon}
                type="expense"
                date={moment(expense.date).format("Do MMM YYYY")}
                hideDeleteBtn
              />
            ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTransaction;
