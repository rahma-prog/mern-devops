const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');

// Create rental
router.post('/', async (req, res) => {
  try {
    const { property, tenant, startDate, endDate, status } = req.body;
    if (!property || !tenant || !startDate || !endDate)
      return res.status(400).json({ message: 'Missing required fields' });

    const rental = await Rental.create({ property, tenant, startDate, endDate, status });
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rentals
router.get('/', async (req, res) => {
  const rentals = await Rental.find()
    .populate('property')
    .populate('tenant', 'name email');
  res.json(rentals);
});

// Get rental by ID
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('property')
    .populate('tenant', 'name email');
  if (!rental) return res.status(404).json({ message: 'Rental not found' });
  res.json(rental);
});

// Update rental
router.put('/:id', async (req, res) => {
  const updated = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Rental not found' });
  res.json(updated);
});

// Delete rental
router.delete('/:id', async (req, res) => {
  const deleted = await Rental.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Rental not found' });
  res.json({ message: 'Rental deleted successfully' });
});

module.exports = router;
