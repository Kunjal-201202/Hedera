import { HashConnect } from "hashconnect";

export class HashPackConnection {
    static instance = null;
    
    constructor() {
        this.hashConnect = new HashConnect();
        this.appMetadata = {
            name: "Hedera Dashboard",
            description: "Live Hedera Transaction Monitor",
            icon: "https://www.hedera.com/logo-capital-hbar-wordmark.png",
            version: "1.0.0"
        };
        this.topic = null;
        this.pairingData = null;
    }

    static getInstance() {
        if (!HashPackConnection.instance) {
            HashPackConnection.instance = new HashPackConnection();
        }
        return HashPackConnection.instance;
    }

    async initializeConnection() {
        try {
            const initData = await this.hashConnect.init(
                this.appMetadata,
                "testnet",
                false
            );

            this.hashConnect.connectionStatusChange.on((state) => {
                console.log("Connection status changed:", state);
            });

            const state = await this.hashConnect.connect();
            const pairingString = this.hashConnect.generatePairingString(state, "testnet", false);

            this.hashConnect.openPairingString(pairingString);

            this.hashConnect.pairingEvent.once((pairingData) => {
                this.pairingData = pairingData;
                this.topic = pairingData.topic;
                console.log("Paired with wallet:", pairingData);
            });

            return { initData, state, pairingString };
        } catch (error) {
            console.error("Error initializing connection:", error);
            throw error;
        }
    }

    async connectToWallet() {
        try {
            if (!this.topic) {
                const { pairingString } = await this.initializeConnection();
                return pairingString;
            }
            return this.topic;
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            return null;
        }
    }

    getPairingData() {
        return this.pairingData;
    }

    getConnectedAccountId() {
        if (this.pairingData && this.pairingData.accountIds) {
            return this.pairingData.accountIds[0];
        }
        return null;
    }

    disconnect() {
        if (this.topic) {
            this.hashConnect.disconnect(this.topic);
            this.topic = null;
            this.pairingData = null;
        }
    }
}