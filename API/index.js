const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const { usersRouter } = require("./routes/usersRoutes");
const { verifyToken, undefinedRouteHandler, allErrorsHandler } = require('./middlewares/middleware');
require("dotenv").config();
const { config } = require("./config/db_config");
const { freeRouter } = require("./routes/freeRoutes");
const { authRouter } = require("./routes/authRoute");
const { productsRouter } = require("./routes/productsRoutes");
const { salesRouter } = require("./routes/salesRoutes");
const { ordersRouter } = require("./routes/ordersRoutes");

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

        app.use(function(req, res, next){
            req.pool = pool;
            next();
        });

        app.use(freeRouter);
        app.use(authRouter);
        app.use(verifyToken);
        app.use("/users", usersRouter);
        app.use('/products', productsRouter);
        app.use('/sales', salesRouter);
        app.use("/orders", ordersRouter);
        app.all('*', undefinedRouteHandler);
        app.use(allErrorsHandler);

        const port = 4500;
        app.listen(port, () =>{
            console.log(`Server listening to port ${port}`);
        });

    } catch (error) {
        console.log(error);
    };
};

startServer();