import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all brands with their models
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

// CREATE a new brand
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const brand = await prisma.carBrand.create({ data: { name } });
    res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Brand may already exist or invalid input.' });
  }
});

// UPDATE a brand by ID
router.put('/:brandId', async (req, res) => {
  const { name } = req.body;
  const { brandId } = req.params;

  try {
    const brand = await prisma.carBrand.update({
      where: { id: Number(brandId) },
      data: { name },
    });
    res.json(brand);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Could not update brand.' });
  }
});

// DELETE a brand by ID
router.delete('/:brandId', async (req, res) => {
  const { brandId } = req.params;

  try {
    await prisma.carModel.deleteMany({ where: { brandId: Number(brandId) } }); // delete models first
    await prisma.carBrand.delete({ where: { id: Number(brandId) } });
    res.json({ message: 'Brand and its models deleted.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Could not delete brand.' });
  }
});

// CREATE a model under a brand
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

// UPDATE a model by ID
router.put('/models/:modelId', async (req, res) => {
  const { name } = req.body;
  const { modelId } = req.params;

  try {
    const model = await prisma.carModel.update({
      where: { id: Number(modelId) },
      data: { name },
    });
    res.json(model);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update model.' });
  }
});

// DELETE a model by ID
router.delete('/models/:modelId', async (req, res) => {
  const { modelId } = req.params;

  try {
    await prisma.carModel.delete({ where: { id: Number(modelId) } });
    res.json({ message: 'Model deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not delete model.' });
  }
});

export default router;
