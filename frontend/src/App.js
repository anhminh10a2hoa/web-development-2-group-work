import React, { useState } from 'react';
import OrderForm from './OrderForm';
import OrderStatus from './OrderStatus';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');

  const handleOrderSubmit = (order) => {
    // Here, you would typically make an API call to submit the order
    // For demonstration, we're just updating the orders state
    setOrders([...orders, order]);
  };

  const handleCheckStatus = (orderId) => {
    // Here, you would make an API call to check the status of the order
    // For demonstration, we're just updating the order status state
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
