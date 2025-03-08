import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";

export class HashPackConnector {
  private hashConnect: HashConnect;
  private appMetadata: HashConnectTypes.AppMetadata;
  private savedData: HashConnectTypes.SavedPairingData | null = null;

  constructor() {
    this.hashConnect = new HashConnect();
    this.appMetadata = {
      name: "Hedera Airdrop Tool",
      description: "A tool for distributing HBAR and HTS tokens",
      icon: "https://www.hedera.com/logo-capital-hbar-wordmark.png",
    };
  }

  async init(): Promise<void> {
    try {
      await this.hashConnect.init(this.appMetadata);
      await this.hashConnect.connect();
    } catch (error) {
      console.error("Error initializing HashPack connection:", error);
      throw error;
    }
  }

  async connectToWallet(): Promise<HashConnectTypes.SavedPairingData> {
    try {
      const state = await this.hashConnect.connect();
      const pairingString = await this.hashConnect.generatePairingString(state, "testnet", false);
      
      // Open HashPack wallet for connection
      this.hashConnect.openPairingString(pairingString);
      
      return new Promise((resolve) => {
        this.hashConnect.pairingEvent.once((data) => {
          this.savedData = data;
          resolve(data);
        });
      });
    } catch (error) {
      console.error("Error connecting to HashPack:", error);
      throw error;
    }
  }

  async sendTransaction(trans: Uint8Array): Promise<MessageTypes.TransactionResponse> {
    if (!this.savedData) {
      throw new Error("No wallet connection found");
    }

    try {
      const transaction = {
        topic: this.savedData.topic,
        byteArray: trans,
        metadata: {
          accountToSign: this.savedData.accountIds[0],
          returnTransaction: false,
        },
      };

      return await this.hashConnect.sendTransaction(this.savedData.topic, transaction);
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.savedData !== null;
  }

  disconnect(): void {
    if (this.savedData) {
      this.hashConnect.disconnect(this.savedData.topic);
      this.savedData = null;
    }
  }
} 