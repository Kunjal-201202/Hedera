import {
  Client,
  TransferTransaction,
  TokenAssociateTransaction,
  AccountId,
  TokenId,
  TransactionResponse,
  Status,
} from "@hashgraph/sdk";

export interface AirdropRecipient {
  accountId: string;
  amount: number;
}

export class AirdropContract {
  private client: Client;
  private tokenId: TokenId;

  constructor(client: Client, tokenId: string) {
    this.client = client;
    this.tokenId = TokenId.fromString(tokenId);
  }

  async executeAirdrop(recipients: AirdropRecipient[]): Promise<TransactionResponse> {
    const transaction = new TransferTransaction();
    
    // Add all transfers to the transaction
    recipients.forEach((recipient) => {
      transaction.addTokenTransfer(
        this.tokenId,
        AccountId.fromString(recipient.accountId),
        recipient.amount
      );
    });

    // Execute the transaction
    transaction.freezeWith(this.client);
    const signedTx = await transaction.sign(this.client.operator);
    return await signedTx.execute(this.client);
  }

  async associateToken(accountId: string): Promise<boolean> {
    try {
      const transaction = await new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([this.tokenId])
        .freezeWith(this.client)
        .sign(this.client.operator);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return receipt.status === Status.Success;
    } catch (error) {
      console.error("Error associating token:", error);
      return false;
    }
  }

  async validateRecipients(recipients: AirdropRecipient[]): Promise<boolean[]> {
    return Promise.all(
      recipients.map(async (recipient) => {
        try {
          const accountId = AccountId.fromString(recipient.accountId);
          return accountId.isValid();
        } catch {
          return false;
        }
      })
    );
  }
} 