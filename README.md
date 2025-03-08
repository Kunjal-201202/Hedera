# Hedera Token Airdrop Tool

A simple and efficient tool for performing token airdrops on the Hedera network. This tool supports both HBAR and HTS token distributions with HashPack wallet integration.

## Features

- Bulk airdrop execution
- Smart contract for efficient token distribution
- HashPack wallet integration
- Input validation and security checks
- Modern UI with real-time status updates

## Prerequisites

- Node.js 16.x or later
- HashPack wallet browser extension
- A Hedera account with sufficient balance
- The token ID you want to airdrop (for HTS tokens)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hedera-airdrop
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your configuration:
```env
NEXT_PUBLIC_NETWORK=testnet # or mainnet
NEXT_PUBLIC_TOKEN_ID=0.0.YOUR_TOKEN_ID
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Connect your HashPack wallet using the "Connect HashPack" button
2. Enter recipient addresses and amounts in the format:
   ```
   accountId,amount
   0.0.123456,100
   0.0.789012,50
   ```
3. Click "Execute Airdrop" to start the distribution
4. Monitor the status in real-time
5. Check transaction status in HashScan

## Security Considerations

- Always verify recipient addresses before executing airdrops
- Test with small amounts on testnet first
- Keep your private keys secure
- Monitor gas costs for large distributions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 