import app from './app.js';
import router from './routes/api.route.js';
import connect from './config/database.config.js';


const init = async () => {
    try{
        await connect();
        
        const PORT = 3000;

        app.use('/api', router);
        
        app.listen(PORT, () => {
            console.log(`Tersambung ke ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

init();
