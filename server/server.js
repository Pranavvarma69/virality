const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());



app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API is up and running');
});

const userRoutes = require('./routes/userRoutes');
const influencerRoutes = require('./routes/influencerRoutes');
const brandRoutes = require('./routes/brandRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const influencerCampaignRoutes = require('./routes/influencerCampaignRoutes');
const socialAccountRoutes = require('./routes/socialRoutes'); 
const socialPostRoutes = require('./routes/socialpostRoutes');

app.use('/api/posts', socialPostRoutes);

app.use('/api/users', userRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api', influencerCampaignRoutes);
app.use('/api/influencers', socialAccountRoutes); // Mount social accounts routes

// MongoDB Connection
mongoose 
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error(err));