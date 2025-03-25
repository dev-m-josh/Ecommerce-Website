const ordersRouter = require("express").Router();

const {
    ordersAndTotalSales
} = require("../controllers/ordersController");

ordersRouter.get("/timespan", ordersAndTotalSales);

module.exports = {ordersRouter};