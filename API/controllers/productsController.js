const { newProductSchema } = require("../validators/validators");

//display all products
function getAllProducts(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT * FROM products WHERE ProductStatus = 'Active' ORDER BY ProductId OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
        (err, result) =>{
            if (err) {
                console.log("Error occured in query:", err);
                return res.status(500).json({ message: "Error fetching products!"});
            } else {
                res.json(result.recordset);
            };
        }
    );
};

function getAllInActiveProducts(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT * FROM products WHERE ProductStatus = 'Inactive' ORDER BY ProductId OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
        (err, result) =>{
            if (err) {
                console.log("Error occured in query:", err);
                return res.status(500).json({ message: "Error fetching products!"});
            } else {
                res.json(result.recordset);
            };
        }
    );
};

//Get most selling product
function getMostSellingProduct(req, res) {
    let pool = req.pool;

    pool.query(
        `SELECT TOP 20 
            p.ProductId, 
            p.ProductName, 
        SUM(oi.Quantity) AS TotalUnitsSold
        FROM order_items oi
        JOIN products p ON oi.ProductId = p.ProductId
        WHERE p.ProductStatus = 'Active'
        GROUP BY p.ProductId, p.ProductName
        ORDER BY TotalUnitsSold DESC`,
        (err, result) =>{
            if (err) {
                console.log("error occured in query", err);
              } else {
                res.json(result.recordset);
              }
        }
    );
};

//Products with low Quantity in Stock
function getLowQuantityProducts(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);

    pool.query(
        `SELECT ProductId, ProductName, StockQuantity
        FROM products
        WHERE StockQuantity < 20
        ORDER BY ProductId OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
        (err, result) =>{
            if (err) {
                console.log("Error occured in query", err);
              } else {
                res.json(result.recordset);
              };
        }
    );
};

//deactivate a product
function deactivateProduct(req, res) {
    let pool = req.pool;
    let requestedProductId = req.params.productId;

    pool.query(
        `UPDATE products
        SET ProductStatus = 'Inactive'
        WHERE ProductId = ${requestedProductId}`, (err, result) =>{
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Internal server error."
                });
                console.log("Error occured in query", err);
                return;
            };

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({
                success: false,
                message: `Product with ID ${requestedProductId} not found.`,
                });
            } else {
                res.json({
                success: true,
                message: "Product was successfully deactivated.",
                rowsAffected: result.rowsAffected,
                });
            }
        }
    );
};

function activateProduct (req, res){
    let pool = req.pool;
    let requestedProductId = req.params.productId;

    pool.query(
        `UPDATE products
        SET ProductStatus = 'Active'
        WHERE ProductId = ${requestedProductId}`, (err, result) =>{
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Internal server error."
                });
                console.log("Error occured in query", err);
                return;
            };

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({
                success: false,
                message: `Product with ID ${requestedProductId} not found.`,
                });
            } else {
                res.json({
                success: true,
                message: "Product was successfully activated.",
                rowsAffected: result.rowsAffected,
                });
            }
        }
    )
};

//add new product
function addNewProduct(req, res) {
    let pool = req.pool;
    let newProduct = req.body;

    const {error, value } = newProductSchema.validate(newProduct, {
        abortEarly: false
    });

    if (error) {
        console.log(error);
        return res.status(400).json({ errors: error.details });
    };

    pool.query(
        `INSERT INTO products (ProductName, Description, Price, StockQuantity, Category, ProductImage)
        VALUES ('${value.ProductName}', '${value.Description}', '${value.Price}', '${value.StockQuantity}', '${value.Category}', '${value.ProductImage}')`, 
        (err, result) =>{
            if (err) {
                console.log("Error occured in query.", err.message);
                res.json({
                  success: false,
                  message: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: "Product added successfully",
                    newProduct,
                });
            };
        }
    );
};

module.exports = {
    getAllProducts,
    getAllInActiveProducts,
    getMostSellingProduct,
    getLowQuantityProducts,
    deactivateProduct,
    activateProduct,
    addNewProduct
};