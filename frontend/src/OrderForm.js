import React, { useState } from 'react';

const OrderForm = ({ onSubmit }) => {
  const [order, setOrder] = useState('');

  const handleChange = (e) => {
    setOrder(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (order.trim() !== '') {
      onSubmit(order);
      setOrder('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your sandwich order"
        value={order}
        onChange={handleChange}
      />
      <button type="submit">Place Order</button>
    </form>
  );
};

export default OrderForm;
