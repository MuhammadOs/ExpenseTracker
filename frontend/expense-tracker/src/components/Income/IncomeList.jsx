import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="test-base" /> Download
        </button>
      </div>
      <div>
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            type="income"
            icon={income.icon}
            amount={income.amount}
            date={moment(income.date).format("Do MMM YYYY")}
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
