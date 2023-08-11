const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/getNearestBar', async (req, res) => {
  try {
    const googlePlacesApiKey = 'AIzaSyApRVlVdcmFLpPPuPtt4Ya3PohFoi4v6Rc';
    const userLocation = `${req.query.lat},${req.query.lng}`;
    const radius = 5000;
    const type = 'bar';

    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation}&radius=${radius}&type=${type}&key=${googlePlacesApiKey}`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
