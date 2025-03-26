const ordersRouter = require("express").Router();

const {
    ordersAndTotalSales,
    newOrder,
    addItemsToCart,
    orderItemsDetails
} = require("../controllers/ordersController");

ordersRouter.get("/timespan", ordersAndTotalSales);
ordersRouter.post("/", newOrder);
ordersRouter.post("/order-item", addItemsToCart);
ordersRouter.get("/order-details", orderItemsDetails)
module.exports = {ordersRouter};