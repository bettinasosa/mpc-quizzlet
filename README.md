# Crypto Personality Quiz

A privacy-first personality assessment tool built on Partisia Blockchain that uses Multi-Party Computation (MPC) to securely analyze user responses and determine their crypto personality type.

## Features

- 🔒 Privacy-Preserving Analysis: Uses MPC on Partisia Blockchain
- 🎨 Interactive UI: Built with Next.js 14 and shadcn/ui
- 🌟 Dynamic Animations: Smooth transitions and engaging visuals
- 🔄 Real-time Results: Instant personality type calculation
- 🎯 Shareable Results: Dynamic OpenGraph images for social sharing
- 🛡️ Type-Safe: Built with TypeScript and Zod validation

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zod

### Blockchain

- Partisia Blockchain
- MPC (Multi-Party Computation)
- Rust Smart Contracts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Rust (for smart contract development)
- Partisia Blockchain account and private key

### Environment Variables

Create a `.env.local` file:

```bash
PARTI_PRIVATE_KEY=your_private_key_here
PARTI_NODE_URL=https://node1.testnet.partisiablockchain.com
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/crypto-personality-quiz.git
cd crypto-personality-quiz
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── actions/           # Server actions and API routes
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions and types
├── public/               # Static assets
├── styles/              # Global styles
└── smart-contracts/     # Rust smart contracts
```

## Smart Contract Integration

The project uses a Rust smart contract deployed on Partisia Blockchain for secure personality analysis:

1. Model Upload: Pre-trained model is uploaded and encrypted
2. User Input: Quiz responses are encrypted and sent to the contract
3. MPC Processing: Secure computation of personality type
4. Result Retrieval: Only the final result is revealed to the user

## Features in Detail

### Privacy-First Architecture

- All quiz responses are encrypted before leaving the browser
- MPC ensures that individual answers remain private
- Only the final personality type is revealed

### Interactive Quiz Flow

1. User starts the quiz
2. Answers personality assessment questions
3. Responses are encrypted and processed
4. Results are displayed with dynamic animations
5. Shareable result cards are generated

### Personality Types

- Degen
- Influencer
- NFT Enthusiast
- DeFi Expert
- Developer
- HODLer
- Privacy Advocate
- Trader

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Partisia Blockchain](https://partisiablockchain.com) for the MPC infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [Next.js](https://nextjs.org) for the amazing framework

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/crypto-personality-quiz](https://github.com/yourusername/crypto-personality-quiz)
