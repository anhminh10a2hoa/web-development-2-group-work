import React, { useState } from 'react';
import OrderForm from './OrderForm';
import OrderStatus from './OrderStatus';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');

  const handleOrderSubmit = (order) => {
    setOrders([...orders, order]);
  };

  const handleCheckStatus = (orderId) => {
     setOrderStatus(`Status of order ${orderId}: In Progress`);
  };

  return (
    <div>
      <h1>Sandwich Order App</h1>
      <OrderForm onSubmit={handleOrderSubmit} />
      <OrderStatus onCheckStatus={handleCheckStatus} />
      {orderStatus && <p>{orderStatus}</p>}
      <h2>Orders:</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>{order}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
