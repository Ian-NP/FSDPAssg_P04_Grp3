import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = () => {
  const data = {
    labels: ['Nov 1', 'Nov 2', 'Nov 3', 'Nov 4'],
    datasets: [
      {
        label: 'ATM 001 Cash Balance',
        data: [2000, 1500, 1800, 1000],
        borderColor: '#6E966F',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
