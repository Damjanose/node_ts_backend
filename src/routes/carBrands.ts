import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/brands — get all brands with their models
router.get('/', async (req, res) => {
  try {
    const brands = await prisma.carBrand.findMany({
      include: { models: true },
    });
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch brands.' });
  }
});

// POST /api/brands — create a new car brand
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const brand = await prisma.carBrand.create({
      data: { name },
    });
    res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Brand may already exist or invalid input.' });
  }
});

// POST /api/brands/:brandId/models — create a car model under a brand
router.post('/:brandId/models', async (req, res) => {
  const { name } = req.body;
  const { brandId } = req.params;

  try {
    const model = await prisma.carModel.create({
      data: {
        name,
        brand: { connect: { id: Number(brandId) } },
      },
    });
    res.status(201).json(model);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not create model.' });
  }
});

export default router;

