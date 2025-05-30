import express from 'express';
import carBrandRoutes from './routes/carBrands';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/brands', carBrandRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

