function ordersAndTotalSales(req, res) {
    let pool = req.pool;
    let {start, end} = req.query;

    if (!start || !end) {
        return res.status(400).json({
            success: false,
            message: "Start and End dates are required."
        });
    }

    pool.query(
        `SELECT 
        o.OrderId, 
    SUM(oi.Quantity * p.Price) AS TotalSales,
        o.CreatedAt
    FROM orders o
    JOIN order_items oi ON o.OrderId = oi.OrderId
    JOIN products p ON oi.ProductId = p.ProductId
    WHERE o.OrderDate BETWEEN '${start}' AND '${end}'
    GROUP BY o.OrderId, o.CreatedAt
    ORDER BY o.OrderId DESC`, (err, result) => {
        if (err) {
            res.status(500).json({
              success: false,
              message: "Internal server error.",
            });
            console.log("Error occured in query", err);
        } else {
            console.log(result)
            res.json({
                success: true,
                data: result.recordset
            });
        }
    }
  );
};

module.exports= {
    ordersAndTotalSales
};