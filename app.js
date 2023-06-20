// const express = require('express');
// const cors = require('cors');
// const route = require('./Route/route');
// const connection = require('./database/connection');
// const dotenv = require('dotenv');

// dotenv.config();  //configuring env file

// const app = express();

// app.use(express.json());
// app.use(cors({
//     origin: "*"
// }))
// app.use(route);

// app.get('/', (req, res)=>{
//     res.send({message: "This is home page"});
// })


// const PORT = process.env.PORT;

// app.listen(PORT, async()=>{
//     console.log(`Our server is running ${PORT}`);
//     await connection();
// })


const express = require("express");

const PORT = 8080;
const cors = require('cors');
const route = require('./Route/Router');
const connection = require('./Database/connection');
const dotenv = require('dotenv');


dotenv.config();  //connecting to env file
const app = express();
app.use(express.json())

app.use(cors({
    origin:"*"
}))


app.use(route);

app.get('/', (req, res) => {
    res.send("this is home page");
})


app.listen(PORT,async()=> {
    console.log(`server running on ${PORT}`);
    await connection();
    
});