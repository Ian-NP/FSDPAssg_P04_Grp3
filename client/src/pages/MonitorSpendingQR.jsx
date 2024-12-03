import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from './Loading';
import styles from '../styles/MonitorSpendingQR.module.css';
import HomeIcon from "../assets/HomeIcon.svg";
import ReactQR from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { Chart } from 'chart.js/auto'; // Import Chart.js for standalone usage
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels); // Register the plugin for Chart.js

let fetchInProgress = false; // Declare this outside the component to persist across renders

const MonitorSpendingQR = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLink, setPdfLink] = useState('');
    const fetchInProgress = useRef(false); // Use a ref to track if fetch is in progress
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataAndGeneratePdf = async () => {
            if (!fetchInProgress.current) {
                fetchInProgress.current = true; // Set flag to prevent repeated calls
                console.log('Fetching transaction data and generating PDF...');

                try {
                    const response = await axios.get('http://localhost:3000/api/transactions/getTransactionByAccountNum/4111 1111 1111 1111');
                    const transactions = response.data;

                    console.log(transactions);

                    // Initialize monthly income and expenses objects
                    const monthlyIncome = {};
                    const monthlyExpenses = {};
                    const months = []; // Initialize months array here

                    // Initialize arrays for income, expenses, and category expenses
                    const categoryExpenses = {};

                    // Process transactions to populate monthly income and expenses
                    transactions.forEach(t => {
                        // Extract month key in 'MMM YYYY' format
                        const monthKey = new Date(t.transaction_date).toLocaleString('default', { month: 'short', year: 'numeric' });

                        if (t.cashflow === true) {
                            if (!monthlyIncome[monthKey]) {
                                monthlyIncome[monthKey] = 0;
                            }
                            monthlyIncome[monthKey] += t.amount;
                        } else if (t.cashflow === false) {
                            if (!monthlyExpenses[monthKey]) {
                                monthlyExpenses[monthKey] = 0;
                            }
                            monthlyExpenses[monthKey] += t.amount;

                            // Calculate category expenses
                            if (t.category) {
                                if (!categoryExpenses[t.category]) {
                                    categoryExpenses[t.category] = 0;
                                }
                                categoryExpenses[t.category] += t.amount;
                            }
                        }

                        // Add unique month to months array
                        if (!months.includes(monthKey)) {
                            months.push(monthKey);
                        }
                    });

                    // Create arrays for income and expenses by month
                    const income = months.map(month => monthlyIncome[month] || 0);
                    const expenses = months.map(month => monthlyExpenses[month] || 0);

                    // Debug logs to verify the values
                    console.log('Monthly Income:', monthlyIncome);
                    console.log('Monthly Expenses:', monthlyExpenses);
                    console.log('Income Array:', income);
                    console.log('Expenses Array:', expenses);

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

                    // Fetch insights from Gemini API
                    const insightsResponse = await axios.post('http://localhost:3000/api/analyze-spending', {
                        transactionData: transactions
                    });

                    // Generate and upload the PDF with insights
                    await generateAndUploadPdf(cashflowChartData, categoryChartData, categoryLabels, categoryData, insightsResponse.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching transaction data or insights:', error);
                    setIsLoading(false);
                } finally {
                    fetchInProgress.current = false; // Reset flag after request is complete
                }
            }
        };

        fetchDataAndGeneratePdf();
    }, []); // Empty dependency array ensures this only runs once on mount

    const generateAndUploadPdf = async (cashflowChartData, categoryChartData, categoryLabels, categoryData, insights) => {
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
                layout: {
                    padding: {
                        top: 20,    // Add space above the chart
                        right: 20,  // Add space to the right of the chart
                        bottom: 40, // Add space below the chart (to separate the legend)
                        left: 20    // Add space to the left of the chart
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Months',
                            font: {
                                size: 28, // Increased font size for the title
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            font: {
                                size: 22, // Increased font size for x-axis labels
                                weight: 'bold' // Make x-axis labels bold
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
                                size: 28, // Increased font size for the title
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            font: {
                                size: 22, // Increased font size for y-axis labels
                                weight: 'bold' // Make y-axis labels bold
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 24 // Increased font size for legend labels
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Cash Flow Over the Past 6 Months',
                        font: {
                            size: 36, // Increased font size for the main chart title
                            weight: 'bold'
                        },
                        padding: {
                            bottom: 20 // Add space below the title
                        }
                    }
                }
            }
        });

        // Modify dataset colors to be less light (darker shade)
        cashflowChartData.datasets.forEach(dataset => {
            if (dataset.label === 'Money In (Income)') {
                dataset.backgroundColor = 'rgba(75, 192, 192, 1)'; // Darker teal color
            } else if (dataset.label === 'Money Out (Expenses)') {
                dataset.backgroundColor = 'rgba(255, 99, 132, 1)'; // Darker red color
            }
        });

        // Function to generate random contrasting colors
        const generateContrastingColors = (count) => {
            const colors = [];
            for (let i = 0; i < count; i++) {
                colors.push(`hsl(${Math.floor((360 / count) * i)}, 70%, 50%)`); // Using HSL for better color distribution
            }
            return colors;
        };

        // Create the second chart (category expenses)
        const categoryChart = new Chart(canvas2, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [
                    {
                        data: categoryData,
                        backgroundColor: generateContrastingColors(categoryData.length), // Apply the contrasting colors
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            font: {
                                size: 32 // Increased font size for legend labels
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Expenses by Category (Past 6 months)',
                        font: {
                            size: 36, // Increased font size for the main chart title
                            weight: 'bold'
                        },
                        padding: {
                            bottom: 40 // Add space between the title and chart
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const dataset = tooltipItem.dataset;
                                const currentValue = dataset.data[tooltipItem.dataIndex];
                                const total = dataset.data.reduce((acc, val) => acc + val, 0);
                                const percentage = ((currentValue / total) * 100).toFixed(2);
                                return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                            const percentage = ((value / total) * 100).toFixed(0); // Round to nearest whole number
                            return `${percentage}%`;
                        },
                        color: '#fff',
                        font: {
                            size: 50,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: [ChartDataLabels] // Ensure ChartDataLabels is registered
        });

        // Wait for the charts to render fully before capturing them
        setTimeout(() => {
            try {
                const imgData1 = cashflowChart.toBase64Image();
                const imgData2 = categoryChart.toBase64Image();
                const pdf = new jsPDF('landscape'); // Landscape orientation for a dashboard layout

                // Set width and height for images to fit nicely in the landscape page
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const padding = 20; // Add some padding for aesthetics

                const imageWidth = pageWidth - padding * 2; // Fit within the page width with padding
                const imageHeight = pageHeight - padding * 2; // Fit within the page height with padding

                // Add a new page for the first chart with adjusted dimensions
                pdf.addImage(imgData1, 'PNG', padding, padding, imageWidth, imageHeight);

                // Add a new page for the second chart with adjusted dimensions
                pdf.addPage();
                pdf.addImage(imgData2, 'PNG', padding, padding, imageWidth, imageHeight-20);

                // Add a new page for insights
                pdf.addPage();
                pdf.setFontSize(25);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Insights and Analysis', 10, 15);

                // Add spacing between the header and the generated content
                const spacingAfterHeader = 2; // Adjust this value to increase/decrease the gap

                // Parse and format markdown text, wrapping and handling formatting
                pdf.setFontSize(12);
                const formatTextWithMarkdown = (text, yStart) => {
                    const lines = text.split('\n');
                    let y = yStart;
                    const pageBreakThreshold = 270; // Adjusted page break threshold
                
                    lines.forEach((line) => {
                        // Trim whitespace to handle any spaces before list items or text
                        line = line.trim();
                
                        // Check for numbered list items (e.g., "1. ")
                        if (/^\d+\.\s/.test(line)) {
                            pdf.setFont('helvetica', 'bold');
                            pdf.setFontSize(14);
                            const match = line.match(/^(\d+\.)\s/);
                            pdf.text(10, y, match[1]); // Print the number part
                            line = line.substring(match[0].length);
                
                            // Process inline markdown for the rest of the line
                            processInlineMarkdown(line, 20, y);
                            y += 14; // Add spacing after the numbered item
                        }
                        // Check for unordered list items (e.g., "* ")
                        else if (line.startsWith('* ')) {
                            pdf.setFont('helvetica', 'normal');
                            pdf.setFontSize(12);
                            pdf.text(15, y, '•'); // Bullet point character
                            line = line.substring(2); // Remove the asterisk and space from the line
                
                            // Process inline markdown for the rest of the line
                            processInlineMarkdown(line, 25, y);
                            y += 14; // Add spacing after the bullet point
                        }
                        // Check for bold headers
                        else if (line.startsWith('**')) {
                            pdf.setFont('helvetica', 'bold');
                            pdf.setFontSize(14);
                            line = line.replace(/\*\*/g, ''); // Remove markdown indicators
                            processInlineMarkdown(line, 10, y);
                            y += 14; // Add spacing after the header
                        }
                        // Regular paragraph text with inline markdown
                        else {
                            pdf.setFont('helvetica', 'normal');
                            pdf.setFontSize(12);
                            processInlineMarkdown(line, 10, y);
                            y += 10; // Add spacing after each paragraph
                        }
                
                        // Handle page breaks
                        if (y > pageBreakThreshold) {
                            pdf.addPage();
                            y = 15;
                        }
                    });
                };
                
                const processInlineMarkdown = (line, x, y) => {
                    // Split the line by bold and italic markers and track the formatting state
                    const parts = line.split(/(\*\*|\*)/);
                    let isBold = false;
                    let isItalic = false;
                    let currentLine = '';
                    let currentX = x; // Track current x position for placing text
                
                    parts.forEach((part) => {
                        if (part === '**') {
                            isBold = !isBold;
                            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
                        } else if (part === '*') {
                            isItalic = !isItalic;
                            pdf.setFont('helvetica', isItalic ? 'italic' : 'normal');
                        } else {
                            // Split the part into lines to handle wrapping
                            const wrappedText = pdf.splitTextToSize(part, 270 - (currentX - x)); // Adjust width based on current x position
                
                            wrappedText.forEach((textLine, index) => {
                                if (index === 0) {
                                    pdf.text(currentX, y, textLine);
                                    currentX += pdf.getTextWidth(textLine); // Move currentX for inline text
                                } else {
                                    // Move to the start of the line for subsequent wrapped lines
                                    currentX = x;
                                    y += 7; // Move down for the next line
                                    pdf.text(currentX, y, textLine);
                                    currentX += pdf.getTextWidth(textLine);
                                }
                
                                // Check for page break
                                if (y > 270) {
                                    pdf.addPage();
                                    y = 15;
                                    currentX = x; // Reset currentX for a new page
                                }
                            });
                        }
                    });
                
                    // Reset the font to normal after processing
                    pdf.setFont('helvetica', 'normal');
                };

                // Format insights text and break into pages if needed
                console.log(insights.analysisAndAdvice)
                formatTextWithMarkdown(insights.analysisAndAdvice, 25 + spacingAfterHeader);

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
        }, 3000); // Allow a delay to ensure the charts are fully rendered
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
