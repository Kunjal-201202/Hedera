import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { HashPackConnection } from '../utils/hashpack';

const WalletConnect = ({ onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        try {
            setIsConnecting(true);
            const hashpack = HashPackConnection.getInstance();
            await hashpack.connectToWallet();

            const checkConnection = setInterval(() => {
                const accountId = hashpack.getConnectedAccountId();
                if (accountId) {
                    onConnect(accountId);
                    clearInterval(checkConnection);
                    setIsConnecting(false);
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(checkConnection);
                setIsConnecting(false);
            }, 30000);

        } catch (error) {
            console.error('Error connecting wallet:', error);
            setIsConnecting(false);
        }
    };

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Connect Wallet
            </Typography>
            <Button 
                variant="contained" 
                onClick={handleConnect}
                disabled={isConnecting}
                sx={{ mt: 2 }}
            >
                {isConnecting ? 'Connecting...' : 'Connect HashPack'}
            </Button>
        </Box>
    );
};

export default WalletConnect;