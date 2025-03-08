import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow,
    Paper,
    Typography
} from '@mui/material';

const TransactionList = ({ transactions, accountFilter }) => {
    const filteredTransactions = accountFilter
        ? transactions.filter(tx => tx.transaction_id.includes(accountFilter))
        : transactions;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Recent Transactions
            </Typography>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Fee (ℏ)</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredTransactions.map((tx) => (
                        <TableRow key={tx.transaction_id}>
                            <TableCell>{tx.transaction_id}</TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>
                                {new Date(Number(tx.consensus_timestamp) * 1000).toLocaleString()}
                            </TableCell>
                            <TableCell>{tx.charged_tx_fee / 100000000}</TableCell>
                            <TableCell>{tx.result}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default TransactionList;