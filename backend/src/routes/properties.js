const express = require('express');
const router = express.Router();
const Property = require('../models/property');

// ✅ Create a new property
router.post('/', async (req, res) => {
  try {
    const { title, description, address, price, owner } = req.body;
    if (!title || !price || !owner)
      return res.status(400).json({ message: 'Missing required fields' });

    const property = await Property.create({ title, description, address, price, owner });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all properties
router.get('/', async (req, res) => {
  const properties = await Property.find().populate('owner', 'name email');
  res.json(properties);

});

// ✅ Get one property by ID
router.get('/:id', async (req, res) => {
  const property = await Property.findById(req.params.id).populate('owner', 'name email');
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
});

// ✅ Update property
router.put('/:id', async (req, res) => {
  const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Property not found' });
  res.json(updated);
});

// ✅ Delete property
router.delete('/:id', async (req, res) => {
  const deleted = await Property.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Property not found' });
  res.json({ message: 'Property deleted successfully' });
});

module.exports = router;
