import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

const App = () => {
  const [showBot, setShowBot] = useState(false);

  const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#00B2FF',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#00B2FF',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

  const steps = [
    {
      id: '1',
      message: 'Hello! Are you a User or Seller?',
      trigger: 'user-seller-choice',
    },
    {
      id: 'user-seller-choice',
      options: [
        { value: 'user', label: 'User', trigger: 'user-info' },
        { value: 'seller', label: 'Seller', trigger: 'seller-info' },
      ],
    },
    {
      id: 'user-info',
      message: 'Please provide your basic information.',
      trigger: 'user-name',
    },
    {
      id: 'user-name',
      user: true,
      trigger: 'user-dob',
    },
    {
      id: 'user-dob',
      message: 'Please provide your date of birth.',
      trigger: 'user-dob-input',
    },
    {
      id: 'user-dob-input',
      user: true,
      trigger: 'user-email',
    },
    {
      id: 'user-email',
      message: 'Please provide your email address.',
      trigger: 'user-email-input',
    },
    {
      id: 'user-email-input',
      user: true,
      trigger: 'user-phone',
    },
    {
      id: 'user-phone',
      message: 'Please provide your phone number with country code.',
      trigger: 'user-phone-input',
    },
    {
      id: 'user-phone-input',
      user: true,
      trigger: 'user-address',
    },
    {
      id: 'user-address',
      message: 'Please provide your address.',
      trigger: 'user-address-input',
    },
    {
      id: 'user-address-input',
      user: true,
      trigger: 'user-menu',
    },
    {
      id: 'user-menu',
      message: 'What would you like to do?',
      trigger: 'user-options',
    },
    {
      id: 'user-options',
      options: [
        { value: 'catalog', label: 'Books Catalogue', trigger: 'catalog' },
        { value: 'order', label: 'Order Check-up', trigger: 'order' },
        { value: 'wishlist', label: 'Wishlist', trigger: 'wishlist' },
        { value: 'exit', label: 'Exit', trigger: 'exit' },
      ],
    },
    {
      id: 'catalog',
      message: 'Showing the books catalogue...',
      trigger: 'user-menu',
    },
    {
      id: 'order',
      message: 'Please provide your order ID.',
      trigger: 'order-id',
    },
    {
      id: 'order-id',
      user: true,
      trigger: 'order-status',
    },
    {
      id: 'order-status',
      message: 'Checking order status...',
      trigger: 'user-menu',
    },
    {
      id: 'wishlist',
      message: 'Managing your wishlist...',
      trigger: 'user-menu',
    },
    {
      id: 'exit',
      message: 'Thank you! Have a great day!',
      end: true,
    },
    {
      id: 'seller-info',
      message: 'Please provide your login credentials.',
      trigger: 'seller-login',
    },
    {
      id: 'seller-login',
      user: true,
      trigger: 'seller-dashboard',
  },
  {
    id: 'seller-dashboard',
    message: 'Welcome to the seller dashboard. What would you like to do?',
    trigger: 'seller-options',
  },
  {
    id: 'seller-options',
    options: [
      { value: 'dashboard', label: 'Dashboard', trigger: 'dashboard' },
      { value: 'catalog', label: 'Catalogue Management', trigger: 'catalog-management' },
      { value: 'orders', label: 'Order Management', trigger: 'order-management' },
      { value: 'shipment', label: 'Shipment Management', trigger: 'shipment-management' },
      { value: 'account', label: 'Seller Account Page', trigger: 'account-page' },
      { value: 'logout', label: 'Logout', trigger: 'logout' },
    ],
  },
  {
    id: 'dashboard',
    message: 'Showing your dashboard...',
    trigger: 'seller-dashboard',
  },
  {
    id: 'catalog-management',
    message: 'Managing your catalogue...',
    trigger: 'seller-dashboard',
  },
  {
    id: 'order-management',
    message: 'Managing your orders...',
    trigger: 'seller-dashboard',
  },
  {
    id: 'shipment-management',
    message: 'Managing your shipments...',
    trigger: 'seller-dashboard',
  },
  {
    id: 'account-page',
    message: 'Showing your account details...',
    trigger: 'seller-dashboard',
  },
  {
    id: 'logout',
    message: 'You have been logged out. Thank you!',
    end: true,
  },
];

return (
  <div className="App">
    <button onClick={() => setShowBot(!showBot)}>
      {showBot ? 'Hide Bot' : 'Show Bot'}
    </button>
    {showBot && (
      <ThemeProvider theme={theme}>
        <ChatBot
          steps={steps}
          handleEnd={() => setShowBot(false)}
          botAvatar="https://via.placeholder.com/150"
          userAvatar="https://via.placeholder.com/150"
          customStyles={{
            botMessageBox: {
              backgroundColor: '#00B2FF',
            },
            chatButton: {
              backgroundColor: '#00B2FF',
            },
          }}
          actionProvider={ActionProvider}
          messageParser={MessageParser}
          {...config}
        />
      </ThemeProvider>
    )}
  </div>
);
};

export default App;
