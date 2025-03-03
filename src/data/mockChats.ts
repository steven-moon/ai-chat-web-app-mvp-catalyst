
import { ChatSession } from "../types/chat";

// Sample mock data for chats
export const mockChats: ChatSession[] = [
  {
    id: "chat1",
    title: "Understanding Quantum Computing",
    preview: "Can you explain the basics of quantum computing in simple terms?",
    messages: [
      {
        id: "msg1-1",
        content: "Can you explain the basics of quantum computing in simple terms?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "msg1-2",
        content: "Quantum computing uses quantum bits or qubits, which can exist in multiple states simultaneously thanks to superposition. This allows quantum computers to process complex problems much faster than classical computers for certain tasks like factoring large numbers or simulating quantum systems.",
        sender: "ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30000), // 30 seconds after
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    provider: "OpenAI",
  },
  {
    id: "chat2",
    title: "Recipe Recommendations",
    preview: "I need some dinner ideas that are quick and healthy...",
    messages: [
      {
        id: "msg2-1",
        content: "I need some dinner ideas that are quick and healthy. I'm vegetarian and have about 20 minutes to cook.",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: "msg2-2",
        content: "Here are some quick vegetarian dinner ideas:\n\n1. Stir-fried vegetables with tofu and rice\n2. Greek yogurt bowl with chickpeas, cucumber, and olive oil\n3. Quick bean quesadillas with avocado\n4. Veggie pasta with garlic and olive oil\n5. Microwave sweet potato with black beans and salsa",
        sender: "ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 45000), // 45 seconds after
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    provider: "Gemini",
  },
  {
    id: "chat3",
    title: "JavaScript Help",
    preview: "How do I use async/await in JavaScript?",
    messages: [
      {
        id: "msg3-1",
        content: "How do I use async/await in JavaScript? I'm struggling with promises.",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
      {
        id: "msg3-2",
        content: "Async/await is a way to work with promises in a more readable, synchronous-like manner.\n\n```javascript\n// Define an async function\nasync function fetchData() {\n  try {\n    // The await keyword pauses execution until the promise resolves\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n}\n\n// Call the async function\nfetchData().then(data => {\n  console.log(data);\n});\n```\n\nKey points:\n1. Mark functions with `async` keyword to use await inside them\n2. Use `await` before promises to wait for their resolution\n3. Error handling with try/catch blocks\n4. Async functions always return promises",
        sender: "ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 60000), // 1 minute after
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    provider: "Claude",
  },
];
