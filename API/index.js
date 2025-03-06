const express = require("express");
const cors = require("cors");
const sql = require("mssql");
require("dotenv").config();
const { config } = require("./config/db_config");

async function startServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    try {
        let pool = new sql.ConnectionPool(config);
        await pool.connect();
        if (pool.connected) {
            console.log("Database connected successfully");
        };

        // Sample endpoint to test server
        app.get('/', (req, res) => {
            res.send('Hello, World!');
        });

        app.use(function(req, res, next){
            req.pool = pool;
            next();
        });
        const port = 4500;
        app.listen(port, () =>{
            console.log(`Server listening to port ${port}`);
        });

    } catch (error) {
        console.log(error);
    };
};

startServer();