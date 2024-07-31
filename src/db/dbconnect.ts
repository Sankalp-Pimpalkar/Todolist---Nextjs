import mongoose from "mongoose";

type Connection = {
    isConnected?: number;
}

const connection: Connection = {}

export default async function dbconnect() {
    try {

        if (connection.isConnected) {
            console.log("Already connected to MongoDB")
            return;
        }

        const db = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(db.connections[0].readyState)

        connection.isConnected = db.connections[0].readyState;
        console.log("MongoDB connection established successfully!");

    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}