import app from './app.js';
import router from './routes/api.js';

const PORT = 3000;

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Tersambung ke ${PORT}`);
});