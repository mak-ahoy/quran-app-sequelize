import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user.js";
import { config } from "dotenv";


config({
    path: "./config.env",
  });

let PORT = process.env.PORT || 8000
  

//setting up cross origin 
export const app = express();


app.use(cors())
app.use(express.json())

app.use("/hello", userRouter)
app.use("/", userRouter);



app.listen(PORT,()=>{
    console.log(`Listening on port: ${PORT}`)
})