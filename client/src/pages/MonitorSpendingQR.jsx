import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from './Loading';
import styles from '../styles/MonitorSpendingQR.module.css';
import HomeIcon from "../assets/HomeIcon.svg";
import ReactQR from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { Chart } from 'chart.js/auto'; // Import Chart.js for standalone usage

let fetchInProgress = false; // Declare this outside the component to persist across renders

const MonitorSpendingQR = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLink, setPdfLink] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataAndGeneratePdf = async () => {
            if (!fetchInProgress) {
                fetchInProgress = true; // Set flag to prevent repeated calls
                try {
                    const response = await axios.get('http://localhost:3000/api/transactions/getTransactionByAccountNum/4111 1111 1111 1111');
                    const transactions = response.data;

                    console.log(transactions);

                    // Initialize arrays for income, expenses, and category expenses
                    const income = [];
                    const expenses = [];
                    const months = [];
                    const categoryExpenses = {};

                    // Process transactions to populate income, expenses, and category data
                    transactions.forEach(t => {
                        if (t.cashflow === true) {
                            income.push(t.amount);
                        } else if (t.cashflow === false) {
                            expenses.push(t.amount);

                            // Calculate category expenses
                            if (t.category) {
                                if (!categoryExpenses[t.category]) {
                                    categoryExpenses[t.category] = 0;
                                }
                                categoryExpenses[t.category] += t.amount;
                            }
                        }

                        // Extract month from transaction date
                        const month = new Date(t.transaction_date).toLocaleString('default', { month: 'short', year: 'numeric' });
                        if (!months.includes(month)) {
                            months.push(month);
                        }
                    });

                    // Fetch insights from Gemini API
                    const insightsResponse = await axios.post('http://localhost:3000/api/analyze-spending', {
                        transactionData: transactions
                    });
                    console.log('Insights:', insightsResponse.data);

                    // Create chart data for cash flow
                    const cashflowChartData = {
                        labels: months,
                        datasets: [
                            {
                                label: 'Money In (Income)',
                                data: income,
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderRadius: 10
                            },
                            {
                                label: 'Money Out (Expenses)',
                                data: expenses,
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                borderRadius: 10
                            }
                        ]
                    };

                    // Create chart data for category expenses
                    const categoryLabels = Object.keys(categoryExpenses);
                    const categoryData = Object.values(categoryExpenses);
                    const categoryChartData = {
                        labels: categoryLabels,
                        datasets: [
                            {
                                label: 'Expenses by Category',
                                data: categoryData,
                                backgroundColor: categoryLabels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
                            }
                        ]
                    };

                    // Generate and upload the PDF with insights
                    await generateAndUploadPdf(cashflowChartData, categoryChartData, insightsResponse.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching transaction data or insights:', error);
                    setIsLoading(false);
                } finally {
                    fetchInProgress = false; // Reset flag after request is complete
                }
            }
        };

        fetchDataAndGeneratePdf();
    }, []); // Empty dependency array ensures this only runs once on mount

    const generateAndUploadPdf = async (cashflowChartData, categoryChartData, insights) => {
        const canvas1 = document.createElement('canvas');
        canvas1.width = 800;
        canvas1.height = 400;
    
        const canvas2 = document.createElement('canvas');
        canvas2.width = 800;
        canvas2.height = 400;
    
        // Append the canvases to the body temporarily for rendering
        document.body.appendChild(canvas1);
        document.body.appendChild(canvas2);
    
        // Create the first chart (cashflow)
        const cashflowChart = new Chart(canvas1, {
            type: 'bar',
            data: cashflowChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Months',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)',
                            borderDash: [5, 5]
                        },
                        title: {
                            display: true,
                            text: 'Amount ($)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 12
                            },
                            padding: 15
                        }
                    },
                    title: {
                        display: true,
                        text: 'Cash Flow Over the Past 6 Months',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    
        // Create the second chart (category expenses)
        const categoryChart = new Chart(canvas2, {
            type: 'pie',
            data: categoryChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Expenses by Category',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    
        // Wait for the charts to render fully before capturing them
        setTimeout(() => {
            try {
                const imgData1 = cashflowChart.toBase64Image();
                const imgData2 = categoryChart.toBase64Image();
                const pdf = new jsPDF('landscape'); // Landscape orientation for a dashboard layout
    
                // Add a title for the dashboard
                pdf.setFontSize(18);
                pdf.text('Spending Analysis Dashboard', 10, 15);
                
                // Add the first chart (cash flow)
                pdf.addImage(imgData1, 'PNG', 10, 25, 140, 75);
    
                // Add the second chart (category expenses) next to the first one
                pdf.addImage(imgData2, 'PNG', 160, 25, 140, 75);
    
                // Add insights below the charts
                pdf.setFontSize(12);
                pdf.text(10, 110, `Insights and Recommendations:\n\n${insights.spendingAnalysis}\n\n${insights.financialAdvice}`);
    
                // Remove the canvases from the document after capturing
                document.body.removeChild(canvas1);
                document.body.removeChild(canvas2);
    
                // Create a Blob from the PDF
                const pdfBlob = pdf.output('blob');
                const formData = new FormData();
                formData.append('pdfFile', new File([pdfBlob], 'spending_analysis_dashboard.pdf', { type: 'application/pdf' }));
    
                // POST the PDF to the backend asynchronously
                axios.post('http://localhost:3000/api/upload-pdf', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    setPdfLink(response.data.pdfUrl); // Set the link for the QR code
                }).catch(error => {
                    console.error('Error uploading PDF:', error);
                });
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }, 1000); // Allow a delay to ensure the charts are fully rendered
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Layout>
            <div className={styles.monitorSpendingQRContainer}>
                <div className={styles.informationContainer}>
                    <h2>Scan the QR code below to download the PDF of your spending analysis</h2>
                    {pdfLink ? (
                        <ReactQR value={pdfLink} size={350} />
                    ) : (
                        <p>Generating QR code...</p>
                    )}
                </div>
                <div className={styles.navigationBtns}>
                    <button onClick={() => navigate('/mainMenu')} className={styles.navButton}>
                        <img src={HomeIcon} width={30} alt="Home Icon" />
                        <p>Main Menu</p>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default MonitorSpendingQR;
