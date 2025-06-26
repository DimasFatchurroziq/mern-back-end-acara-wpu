import app from './app.js';
import router from './routes/api.route.js';
import connect from './config/database.config.js';
import { PORT } from './config/env.config.js';


const init = async () => {
    try{
        await connect();

        app.use('/api', router);
        
        app.listen(PORT, () => {
            console.log(`Tersambung ke ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

init();
