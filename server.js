//здесь мы указываем какие прослойки проходит запрос и запускаем сервер
const express = require("express");
require('dotenv').config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/routes");
const pool = require("./helpers/database");
const errorMiddleware = require('./middlewares/errorMiddleware');

const PORT = process.env.PORT || "3001";
const app = express();

/*Middleware*///////////////////////////////
app.use(express.json());
app.use(express.static('public/ava'));
app.use(express.static('public/mus'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "localhost:3000"
}));
app.use("/api",userRouter);
app.use(errorMiddleware);


const start = async () => {
   try {
     await pool.getConnection((err, connection) => {
         if(err){
            if(err.code === "PROTOCOL_CONNECTION_LOST"){
               console.error("Database connection lost")
            }
            if(err.code === "ER_CON_COUNT_ERROR"){
               console.error("Database has to many connection")
            }
            if(err.code === "ECONNREFUSED"){
               console.error("Database connection was refused")
            }
         } if(connection) connection.release();
         return;
      });
      app.listen(PORT, ()=>{
         console.log(`server is starting on port ${PORT}`)
      });
   } catch (e) {
      console.log(e)
   }
}

start();



