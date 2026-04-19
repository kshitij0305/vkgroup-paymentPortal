import { useLocation, useNavigate } from "react-router-dom";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const receiptId = location.state?.receiptId;

  return (
    <div>
      <h2>Payment Successful ✅</h2>
      <p>Receipt ID: {receiptId}</p>

      <button onClick={() => navigate(`/receipt/${receiptId}`)}>
        View Receipt
      </button>
    </div>
  );
}

export default Success;