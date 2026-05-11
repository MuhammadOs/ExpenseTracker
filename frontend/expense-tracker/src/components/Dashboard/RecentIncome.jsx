import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        {!Array.isArray(transactions) || transactions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No recent income found.
          </p>
        ) : (
          transactions
            .slice(0, 5)
            .map((income) => (
              <TransactionInfoCard
                key={income._id}
                title={income.source}
                amount={income.amount}
                icon={income.icon}
                type="income"
                date={moment(income.date).format("Do MMM YYYY")}
                hideDeleteBtn
              />
            ))
        )}
      </div>
    </div>
  );
};

export default RecentIncome;
