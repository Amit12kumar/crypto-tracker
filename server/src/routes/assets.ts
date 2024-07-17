import { Router } from 'express';
import Asset from '../models/Asset';

const router = Router();

router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const assets = await Asset.find({ symbol }).sort({ timestamp: -1 }).limit(20);
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  try {
    const asset = await Asset.findByIdAndUpdate(
      id,
      { price },
      { new: true }
    );

    if (!asset) {
      return res.status(404).send('Asset not found');
    }

    res.json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
