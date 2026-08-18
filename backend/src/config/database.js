import mongoose from "mongoose";
import { config } from "./index.js";
import { MONGOOSE_OPTIONS } from "../constants/index.js"; 

const connectDatabase = async() => {
    try{
        await mongoose
              .connect(
                config.mongoUri, 
                MONGOOSE_OPTIONS
            )
            console.log(`Database has been connected`);
    }catch(error){
       console.error({err: error}, "Database connection error");
       throw error;
    }
}

export {
    connectDatabase
}