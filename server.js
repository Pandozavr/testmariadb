const express = require("express");
const dotenv = require("dotenv");

dotenv.config({path: ".env-local"})

const PORT = process.env.PORT || "3001";
const app = express();

/*Middleware*/
app.use(express.json());
app.use(express.urlencoded({extended:false}));

/*server listening*/
app.listen(PORT, ()=>{
   console.log(`server is starting on port ${PORT}`)
});


/*routes*/
app.get("/", (req, res) => {
   res.status(200).json({name: "Serj", text: "test"})
});

const userRouter = require("./routes/user");

app.use("/user",userRouter);