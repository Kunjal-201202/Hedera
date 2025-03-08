import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TransactionChart = ({ transactions }) => {
    const processData = () => {
        const last10Minutes = transactions
            .reduce((acc, tx) => {
                const minute = new Date(Number(tx.consensus_timestamp) * 1000)
                    .toLocaleTimeString([], { minute: '2-digit', hour: '2-digit' });
                acc[minute] = (acc[minute] || 0) + 1;
                return acc;
            }, {});

        return {
            labels: Object.keys(last10Minutes),
            datasets: [
                {
                    label: 'Transactions per Minute',
                    data: Object.values(last10Minutes),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        };
    };

    return (
        <Line
            data={processData()}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Transaction Volume (Last 10 Minutes)'
                    }
                }
            }}
        />
    );
};

export default TransactionChart;