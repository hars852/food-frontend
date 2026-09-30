import React, { useCallback, useEffect, useRef } from 'react';
import "./Verify.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios'; // ✅ Required

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const verificationStarted = useRef(false);
  const verifyPayment = useCallback(async () => {
    if (!token) {
      navigate("/login", { replace: true, state: { from: { pathname: "/verify", search: `?success=${success}&orderId=${orderId}` } } });
      return;
    }
    try {
      const response = await axios.post(url + "/api/order/verify", { success, orderId }, { headers: { token } });
      if (response.data.success) navigate("/myorder");
      else navigate("/");
    } catch {
      navigate("/");
    }
  }, [url, token, success, orderId, navigate]);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;
    verifyPayment();
  }, [verifyPayment]);

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
