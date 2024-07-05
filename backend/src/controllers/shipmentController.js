// src/controllers/shipmentController.js

import Shipment from '../models/Shipment.js';
import Order from '../models/Order.js';
import axios from 'axios'; // For real-time shipment tracking

const createShipment = async (req, res) => {
    const { orderId, trackingNumber } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const shipment = await Shipment.create({
        orderId,
        trackingNumber,
    });

    res.status(201).json(shipment);
};

const getShipmentByOrderId = async (req, res) => {
    const shipment = await Shipment.findOne({ where: { orderId: req.params.id } });

    if (shipment) {
        res.json(shipment);
    } else {
        res.status(404).json({ message: 'Shipment not found' });
    }
};

const updateShipmentStatus = async (req, res) => {
    const { orderId, status } = req.body;

    const shipment = await Shipment.findOne({ where: { orderId } });

    if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
    }

    shipment.status = status;
    await shipment.save();

    res.status(200).json(shipment);
};

// Real-time tracking (using a placeholder courier API)
const trackShipment = async (req, res) => {
    const { trackingNumber } = req.params;

    try {
        const response = await axios.get(`https://courierapi.example.com/track?number=${trackingNumber}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to track shipment' });
    }
};

export { createShipment, getShipmentByOrderId, updateShipmentStatus, trackShipment };
