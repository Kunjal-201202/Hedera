import axios from 'axios';

const MIRROR_NODE_URL = 'https://mainnet-public.mirrornode.hedera.com';

export class MirrorNodeService {
    async getLatestTransactions(limit = 10) {
        try {
            const response = await axios.get(`${MIRROR_NODE_URL}/api/v1/transactions`, {
                params: {
                    limit,
                    order: 'desc'
                }
            });
            return response.data.transactions;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }

    async getAccountTransactions(accountId, limit = 10) {
        try {
            const response = await axios.get(
                `${MIRROR_NODE_URL}/api/v1/transactions`, {
                    params: {
                        'account.id': accountId,
                        limit,
                        order: 'desc'
                    }
                }
            );
            return response.data.transactions;
        } catch (error) {
            console.error('Error fetching account transactions:', error);
            return [];
        }
    }
}