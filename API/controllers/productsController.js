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

module.exports = {
    getAllProducts
};