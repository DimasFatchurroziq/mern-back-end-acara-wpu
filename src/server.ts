import app from './app.js';
import router from './routes/api.route.js';
import connect from './config/database.config.js';
import { PORT } from './config/env.config.js';
import docs from './docs/route.js';
import cors from "cors";
import { errorHandler } from './middlewares/errorHandler.middleware.js';


const init = async () => {
    try{
        await connect();

        app.use(cors());

        app.use('/api', router);

        docs(app);
   
        app.use(errorHandler);
        
        app.listen(PORT, () => {
            console.log(`Tersambung ke ${PORT}`);
        });
    
    } catch (error) {
        console.error(error);
    }
}

init();
