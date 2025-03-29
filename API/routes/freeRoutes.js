const freeRouter = require("express").Router();

const { getAllActiveProducts, getProductDetails } = require("../controllers/productsController");
const { addNewUser } = require("../controllers/usersController");
const { orderItemsDetails, updateItemQuantity, addItemsToCart, removeItemFromCart } = require("../controllers/ordersController");

freeRouter.post('/users', addNewUser);
freeRouter.get('/products', getAllActiveProducts);
freeRouter.get("/orders/order-details", orderItemsDetails);
freeRouter.get('/product/:productId', getProductDetails);
freeRouter.put("/order-item/quantity", updateItemQuantity);
freeRouter.post("/order-item", addItemsToCart);
freeRouter.delete("/order-item", removeItemFromCart);


module.exports = { freeRouter };