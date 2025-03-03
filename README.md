# AI Chat Web Application

A modern, responsive web application for interacting with various AI models through a chat interface. This application provides a seamless experience for users to engage with AI assistants, manage chat history, and customize their profiles.

## Features

- **Multi-Provider AI Chat**: Interact with different AI models through a unified interface
- **Chat History Management**: Save, browse, and continue previous conversations
- **User Authentication**: Secure login and signup functionality
- **User Profile Management**: Customize user settings and preferences
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS for a sleek, modern look

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/         # UI components
│   ├── chat/           # Chat-related components
│   ├── history/        # History-related components
│   ├── home/           # Home page components
│   ├── layout/         # Layout components (Navbar, MainLayout)
│   ├── theme/          # Theme-related components
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts for state management
│   ├── ChatContext.tsx # Chat state management
│   └── UserContext.tsx # User authentication and profile management
├── data/               # Mock data and constants
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Application pages
│   ├── Chat.tsx        # Chat interface
│   ├── History.tsx     # Chat history
│   ├── Index.tsx       # Landing page
│   ├── Login.tsx       # Login page
│   ├── NotFound.tsx    # 404 page
│   ├── Pricing.tsx     # Pricing information
│   ├── Profile.tsx     # User profile management
│   └── Signup.tsx      # Signup page
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ai-chat-web-app.git
   cd ai-chat-web-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Development

```bash
# Start development server
npm run dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Credits

This MVP Catalyst Prototype was created by [Clever Coding](https://clevercoding.com). The development process was accelerated with the assistance of AI tools:

- **Lovable**: Used for rapid UI prototyping and design
- **Cursor**: AI-powered code editor that enhanced development efficiency

Learn more about Clever Coding's innovative development approaches at [clevercoding.com](https://clevercoding.com).

## License

[MIT](LICENSE)
