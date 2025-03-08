import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import TransactionList from './TransactionList';
import TransactionChart from './TransactionChart';
import WalletConnect from './WalletConnect';
import { MirrorNodeService } from '../services/mirrorNode';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [connectedAccount, setConnectedAccount] = useState('');
    const mirrorNodeService = new MirrorNodeService();

    useEffect(() => {
        const fetchTransactions = async () => {
            const latest = await mirrorNodeService.getLatestTransactions(20);
            setTransactions(latest);
        };

        fetchTransactions();
        const interval = setInterval(fetchTransactions, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Hedera Live Transaction Monitor
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2 }}>
                            <WalletConnect 
                                onConnect={setConnectedAccount}
                            />
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={9}>
                        <Paper sx={{ p: 2 }}>
                            <TransactionChart 
                                transactions={transactions}
                            />
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <TransactionList 
                                transactions={transactions}
                                accountFilter={connectedAccount}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard;