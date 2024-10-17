import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_LOCAL)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        console.error(`Error connen to MongoDB: ${error.message}`)
        process.exit(1)
    }
}
export default connectMongoDB;