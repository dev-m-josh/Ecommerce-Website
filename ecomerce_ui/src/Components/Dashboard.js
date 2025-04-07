import React, { useEffect, useState } from "react";
import '../Styles/Dashboard.css';
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sales, setSales] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!token || user.UserRole !== "Admin") {
            navigate('/products');
            return;
        }
    }, [token, user, navigate]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:4500/sales/revenue`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }

                const data = await response.json();
                setSalesData(data);

                const categoryData = data.reduce((dataObject, sale) => {
                    if (dataObject[sale.Category]) {
                        dataObject[sale.Category].totalItems += sale.TotalQuantitySold;
                        dataObject[sale.Category].totalRevenue += sale.ProductRevenue;
                    } else {
                        dataObject[sale.Category] = {
                            totalItems: sale.TotalQuantitySold,
                            totalRevenue: sale.ProductRevenue
                        };
                    }
                    return dataObject;
                }, {});                

                const chartData = {
                    labels: Object.keys(categoryData),
                    datasets: [
                        {
                            label: 'Category Revenue',
                            data: Object.values(categoryData).map(categoryStats => categoryStats.totalRevenue),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1 
                        }
                    ]
                };

                setSales(chartData);

            } catch (err) {
                console.error("Error fetching sales data:", err);
                setErrorMessage("There was an error fetching sales data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [token]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    if (!sales) {
        return <div className="error">No data available for the chart.</div>;
    }

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Most selling products by Category'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: KSh ${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'Ksh ' + value;
                    }
                }
            }
        }
    };

    const categorySummary = Object.entries(salesData.reduce((dataObject, sale) => {
        if (dataObject[sale.Category]) {
            dataObject[sale.Category].totalItems += sale.TotalQuantitySold;
            dataObject[sale.Category].totalRevenue += sale.ProductRevenue;
        } else {
            dataObject[sale.Category] = {
                totalItems: sale.TotalQuantitySold,
                totalRevenue: sale.ProductRevenue
            };
        }
        return dataObject;
    }, {}));

    return (
        <div className="dashboard">
            <div className="bar-graph">
                <Bar options={options} data={sales} />
            </div>
            <div className="table-container">
                <h3>Product Sales Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Quantity Sold</th>
                            <th>Product Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((sale) => (
                            <tr key={sale.ProductId}>
                                <td>{sale.ProductName}</td>
                                <td>{sale.Category}</td>
                                <td>{sale.TotalQuantitySold}</td>
                                <td>KSh {sale.ProductRevenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-container">
                <h3>Category Sales Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total Items Sold</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorySummary.map(([category, categoryStats]) => (
                            <tr key={category}>
                                <td>{category}</td>
                                <td>{categoryStats.totalItems}</td>
                                <td>KSh {categoryStats.totalRevenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="summary">
                <h3>Sales Summary</h3>
                <p><strong>Total Products Sold: </strong>{salesData.reduce((total, sale) => total + sale.TotalQuantitySold, 0)}</p>
                <p><strong>Total Revenue: </strong>Ksh {salesData.reduce((total, sale) => total + sale.ProductRevenue, 0)}</p>
            </div>
        </div>
    );
}
