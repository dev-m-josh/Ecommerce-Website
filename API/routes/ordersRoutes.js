const ordersRouter = require("express").Router();

const {
    ordersAndTotalSales,
    newOrder,
    addItemsToCart,
    orderItemsDetails,
    removeItemFromCart
} = require("../controllers/ordersController");

ordersRouter.get("/timespan", ordersAndTotalSales);
ordersRouter.post("/", newOrder);
ordersRouter.post("/order-item", addItemsToCart);
ordersRouter.get("/order-details", orderItemsDetails);
ordersRouter.delete("/order-item", removeItemFromCart);
module.exports = {ordersRouter};