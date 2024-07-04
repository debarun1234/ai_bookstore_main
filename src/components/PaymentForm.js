// src/components/PaymentForm.js

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('usd');
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { data: { clientSecret, paymentId } } = await axios.post('/api/payments/create-payment-intent', { amount, currency });

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (paymentResult.error) {
            console.error(paymentResult.error.message);
        } else {
            if (paymentResult.paymentIntent.status === 'succeeded') {
                await axios.post('/api/payments/update-payment-status', {
                    paymentIntentId: paymentResult.paymentIntent.id,
                    status: 'succeeded'
                });
                setPaymentSuccessful(true);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
            />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="inr">INR</option>
                {/* Add other currencies as needed */}
            </select>
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
            {paymentSuccessful && <p>Payment successful!</p>}
        </form>
    );
};

export default PaymentForm;
