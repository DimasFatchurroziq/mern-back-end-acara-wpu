import mongoose from "mongoose";

import { DATABASE_URL } from "./env.config.js";

const connect = async () => {
    try {

        if(!DATABASE_URL){
            console.log("Database URL salah");

            return Promise.reject(new Error("salah"));
        }

        await mongoose.connect(DATABASE_URL, {
            dbName : "db-acara",
        });

        console.log("DB connected");

        return Promise.resolve("DB connected");
    } catch (error) {
        console.error("DB not connected");
        return Promise.reject("DB not connected");
    }
}
// connect();
export default connect;