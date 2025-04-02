const { newProductSchema, editProductSchema } = require("../validators/validators");

//display all products
function getAllActiveProducts(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT * FROM products WHERE inStock = 1 ORDER BY ProductId OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
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

//delete a product compeletely
function deleteProduct(req, res) {
    let pool = req.pool;
    let requestedId = req.params.productId;
    pool.query(`DELETE FROM products WHERE ProductId = ${requestedId}`, (err, result) =>{
        if (err) {
            res.status(500).json({
              success: false,
              message: "Internal server error.",
            });
            console.log("Error occured in query", err);
          }

        if (result.rowsAffected[0] === 0) {
            res.status(400).json({
            success: false,
            message: "Product not found!",
            });
            return;
        }

        res.json({
            success: true,
            message: "Product deleted successfully!",
            result: result.rowsAffected,
        });
    });
};

function getAllProducts(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT * FROM products ORDER BY ProductId OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
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
                message: "Product was successfully restored.",
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
        `INSERT INTO products (ProductName, Description, Price, StockQuantity, Category, ProductImage, ProductDiscount)
        VALUES ('${value.ProductName}', '${value.Description}', ${value.Price}, ${value.StockQuantity}, '${value.Category}', '${value.ProductImage}', ${value.ProductDiscount})`, 
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

//product details
function getProductDetails(req, res) {
    let pool = req.pool;
    let productId = req.params.productId;

    pool.query(
        `SELECT * FROM products WHERE ProductId = ${productId}`,
        (err, result) => {
            if (err) {
                console.log("Error occured in query:", err);
                return res.status(500).json({ message: "Error fetching products!"});
            } else {
                res.json(result.recordset);
            };
        }
    );
};

// edit product
function editProduct(req, res) {
    let pool = req.pool;
    let productToEdit = req.params.productId;
    let productEdits = req.body;

    const {error, value } = editProductSchema.validate(productEdits, {
        abortEarly: false
    });

    if (error) {
        console.log(error);
        return res.status(400).json({ errors: error.details });
    };

    pool.query(
        `UPDATE products
        SET Price = '${value.Price}', StockQuantity = '${value.StockQuantity}', ProductDiscount = '${value.ProductDiscount}'
        WHERE ProductId = '${productToEdit}'`, (err, result) =>{
            if (err) {
                res.status(500).json({
                  success: false,
                  message: "Internal server error.",
                });
                console.log("Error occured in query", err);
                return;
            }

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${productToEdit} not found.`
                });
              } else {
                res.json({
                  success: true,
                  message: "Update successfully done.",
                  rowsAffected: result.rowsAffected,
                  newProductDetails: productEdits,
                });
            };
        } 
    );
};

module.exports = {
    getAllActiveProducts,
    deleteProduct,
    getAllProducts,
    getMostSellingProduct,
    getLowQuantityProducts,
    deactivateProduct,
    activateProduct,
    addNewProduct,
    getProductDetails,
    editProduct,
};