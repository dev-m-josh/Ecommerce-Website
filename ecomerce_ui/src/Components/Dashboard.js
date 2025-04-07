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
    const [sales, setSales] = useState(null); // Initialize with null
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

                if (Array.isArray(data)) {
                    const categories = {};
                    data.forEach(item => {
                        // Only store the first occurrence of each category
                        if (!categories[item.Category]) {
                            categories[item.Category] = item.RevenueByCategory;
                        }
                    });

                    const chartData = {
                        labels: Object.keys(categories),
                        datasets: [
                            {
                                label: 'Category Revenue',
                                data: Object.values(categories),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }
                        ]
                    };

                    setSales(chartData);
                } else {
                    throw new Error("Data is not an array or is malformed");
                }

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
                text: 'Sales Revenue by Category'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        }
    };

    return (
        <div className="dashboard">
            <Bar options={options} data={sales} />
        </div>
    );
};
