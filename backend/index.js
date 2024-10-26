import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());

app.get('/api/v1/categories', async (req, res) => {
  try {
    const response = await fetch('https://tienda.mercadona.es/api/v1/categories/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});
app.get('/api/v1/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
      const response = await fetch('https://tienda.mercadona.es/api/v1/categories/' + id);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error });
    }
  });
  app.get('/api/v1/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
      const response = await fetch('https://tienda.mercadona.es/api/v1/products/' + id);
      const data = await response.json();
      console.log(data);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error });
    }
  });

  app.get('/api/v1/nutritional-info/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const productResponse = await fetch(`https://tienda.mercadona.es/api/v1/products/${id}`);
      const productData = await productResponse.json();
      if (!productData || !productData.ean) {
        return res.status(404).json({ message: 'Product not found or does not have EAN.' });
      }

      const ean = productData.ean;
      console.log(ean);
      const nutritionalResponse = await fetch(`https://world.openfoodfacts.org/api/v1/v0/product/${ean}.json`);
      const nutritionalData = await nutritionalResponse.json();
  
      if (!nutritionalData || nutritionalData.status !== 1) {
        return res.status(404).json({ message: 'Nutritional information not found.' });
      }
  
      res.json(nutritionalData.product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching nutritional information', error });
    }
  });
app.listen(5000, () => {
  console.log('Servidor corriendo en puerto 5000');
});
