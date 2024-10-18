import express from "express"
import authRoutes from './routes/auth.routes.js'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import connectMongoDB from "./db/connectMongoDB.js";
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

console.log(process.env.MONGO_LOCAL)
app.use("/api/auth", authRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`)
    connectMongoDB()
})