const ordersRouter = require("express").Router();

const {
    ordersAndTotalSales,
    newOrder
} = require("../controllers/ordersController");

ordersRouter.get("/timespan", ordersAndTotalSales);
ordersRouter.post("/", newOrder);
module.exports = {ordersRouter};