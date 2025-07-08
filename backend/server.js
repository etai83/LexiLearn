require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const ollamaRoutes = require('./routes/ollamaRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use('/api/ollama', ollamaRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
