const ordersRouter = require("express").Router();

const {
    ordersAndTotalSales,
    newOrder,
    addItemsToCart
} = require("../controllers/ordersController");

ordersRouter.get("/timespan", ordersAndTotalSales);
ordersRouter.post("/", newOrder);
ordersRouter.post("/order-item", addItemsToCart)
module.exports = {ordersRouter};