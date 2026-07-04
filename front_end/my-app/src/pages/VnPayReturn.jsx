import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { orderService } from "../services/api";

const VnPayReturn = () => {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    orderService
      .vnPayReturn(params)
      .then(setResult)
      .catch(() => setResult({ success: false, message: "Không thể xác thực giao dịch VNPAY." }))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="container page-section">
      <div className="state-box">
        <h1>{loading ? "Đang xác thực thanh toán..." : result?.success ? "Thanh toán thành công" : "Thanh toán chưa hoàn tất"}</h1>
        {!loading && <p>{result?.message || "Cảm ơn bạn đã mua sách tại Old Bookstore."}</p>}
        {!loading && <Link className="btn btn-primary" to="/profile">Xem đơn hàng</Link>}
      </div>
    </div>
  );
};

export { VnPayReturn };
export default VnPayReturn;
