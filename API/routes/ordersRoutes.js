const ordersRouter = require("express").Router();

const {
    ordersAndTotalSales,
    newOrder,
    updateOrder
} = require("../controllers/ordersController");

ordersRouter.get("/timespan", ordersAndTotalSales);
ordersRouter.post("/", newOrder);
ordersRouter.put("/", updateOrder);
module.exports = {ordersRouter};