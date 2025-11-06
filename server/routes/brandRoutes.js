const express = require('express');
const router = express.Router();
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandControllers');

const { protect, admin } = require('../middleware/authMiddleware');
router.route('/')
  .get(protect, getBrands)
  .post(protect, createBrand);

router.route('/:id')
  .get(protect, getBrandById)
  .put(protect, updateBrand)
  .delete(protect, admin, deleteBrand);

module.exports = router;