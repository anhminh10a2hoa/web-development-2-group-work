import React, { useState } from 'react';

const OrderStatus = ({ onCheckStatus }) => {
  const [orderId, setOrderId] = useState('');

  const handleChange = (e) => {
    setOrderId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId.trim() !== '') {
      onCheckStatus(orderId);
      setOrderId('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your order ID"
        value={orderId}
        onChange={handleChange}
      />
      <button type="submit">Check Status</button>
    </form>
  );
};

export default OrderStatus;
