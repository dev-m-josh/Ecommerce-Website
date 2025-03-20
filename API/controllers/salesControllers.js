//Total Sales by Product
function totalSalesOfProduct(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT p.ProductId, p.ProductName, SUM(oi.Quantity * p.Price) AS TotalRevenue
        FROM order_items oi
        JOIN products p ON oi.ProductId = p.ProductId
        GROUP BY p.ProductId, p.ProductName
        ORDER BY TotalRevenue DESC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, result) =>{
            if (err) {
                console.log("Error occured in query:", err);
                return res.status().json({ message: "Error getting total sales!" })
            } else {
                res.json(result.recordset);
            }
        }
    );
};
//Revenue by Product Category
function revenueByCategory(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT p.Category, SUM(oi.Quantity * p.Price) AS TotalRevenue
        FROM order_items oi
        JOIN products p ON oi.ProductId = p.ProductId
        GROUP BY p.Category
        ORDER BY TotalRevenue DESC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, result) =>{
            if (err) {
                console.log("Error occured in query:", err);
                return res.status().json({ message: "Error getting total sales!" });
            } else {
                res.json(result.recordset);
            };
        }
    );
};

module.exports = {
    totalSalesOfProduct,
    revenueByCategory
};