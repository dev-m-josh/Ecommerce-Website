//Total Sales by Product
function totalSalesOfProduct(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
        `SELECT 
    p.ProductId,
    p.ProductName,
    SUM(oi.Quantity * p.Price) AS TotalSales
FROM 
    order_items oi
JOIN 
    products p ON oi.ProductId = p.ProductId
JOIN 
    orders o ON oi.OrderId = o.OrderId
WHERE 
    o.OrderDate >= DATEADD(MONTH, -1, GETDATE()) 
    AND o.isCompeleted = 1
GROUP BY 
    p.ProductId, p.ProductName
ORDER BY 
    TotalSales DESC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, result) =>{
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
        `SELECT 
    p.Category,
    SUM(oi.Quantity * p.Price) AS RevenueByCategory
FROM 
    order_items oi
JOIN 
    products p ON oi.ProductId = p.ProductId
JOIN 
    orders o ON oi.OrderId = o.OrderId
WHERE 
    o.OrderDate >= DATEADD(MONTH, -1, GETDATE()) 
    AND o.isCompeleted = 1
GROUP BY 
    p.Category
ORDER BY 
    RevenueByCategory DESC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, result) =>{
            if (err) {
                console.log("Error occured in query:", err);
                return res.status().json({ message: "Error getting total sales!" });
            } else {
                res.json(result.recordset);
            };
        }
    );
};

//revenue in last one month
function revenueCollected(req, res) {
    let pool = req.pool;
    pool.query(
        `SELECT SUM(TotalAmount) AS TotalRevenue
    FROM orders
    WHERE OrderDate >= DATEADD(MONTH, -1, GETDATE()) 
    AND OrderDate < GETDATE()
    AND isCompeleted = 1`, (err, result) => {
        if (err) {
            console.log("Error occured in query:", err);
            return res.status().json({ message: "Error getting total revenue!" });
        } else {
            res.json(result.recordset);
        };
    }
    );
};

//revenue by product and category
function productAndCategorySales(req, res) {
    let pool = req.pool;
    pool.query(
`SELECT TOP 20
    p.ProductId,
    p.ProductName,
    p.Category,
    SUM(oi.Quantity) AS TotalQuantitySold,
    SUM(oi.Quantity * p.Price) AS ProductRevenue,
    (SELECT SUM(oi2.Quantity * p2.Price)
     FROM order_items oi2
     JOIN products p2 ON oi2.ProductId = p2.ProductId
     JOIN orders o2 ON oi2.OrderId = o2.OrderId
     WHERE o2.OrderDate >= DATEADD(MONTH, -1, GETDATE())
     AND o2.isCompeleted = 1
     AND p2.Category = p.Category) AS RevenueByCategory
FROM 
    order_items oi
JOIN 
    products p ON oi.ProductId = p.ProductId
JOIN 
    orders o ON oi.OrderId = o.OrderId
WHERE 
    o.OrderDate >= DATEADD(MONTH, -1, GETDATE()) 
    AND o.isCompeleted = 1
GROUP BY 
    p.ProductId, p.ProductName, p.Category
ORDER BY 
    TotalQuantitySold DESC`, (err,result) => {
        if (err) {
            console.log("Error occured in query:", err);
            return res.status().json({ message: "Error fetching data!" });
        } else {
            res.json(result.recordset);
        };
    }
    )
}

module.exports = {
    totalSalesOfProduct,
    revenueByCategory,
    revenueCollected,
    productAndCategorySales
};