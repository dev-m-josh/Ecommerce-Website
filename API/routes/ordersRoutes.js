const ordersRouter = require("express").Router();

const {
    ordersAndTotalSales,
    newOrder,
    addItemsToCart,
    orderItemsDetails,
    removeItemFromCart,
    updateItemQuantity,
    updateOrder
} = require("../controllers/ordersController");

ordersRouter.get("/timespan", ordersAndTotalSales);
ordersRouter.post("/", newOrder);
ordersRouter.post("/order-item", addItemsToCart);
ordersRouter.get("/order-details", orderItemsDetails);
ordersRouter.delete("/order-item", removeItemFromCart);
ordersRouter.put("/order-item/quantity", updateItemQuantity);
ordersRouter.put("/", updateOrder);
module.exports = {ordersRouter};