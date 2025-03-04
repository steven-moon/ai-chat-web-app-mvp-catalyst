/**
 * DEPRECATED: This proxy server is no longer needed as of August 2024.
 * The official Anthropic TypeScript SDK now supports CORS for browser-based applications
 * by setting the `dangerouslyAllowBrowser: true` option when instantiating the SDK.
 * 
 * See README-anthropic-proxy.md for details on the new approach.
 * 
 * This file is kept for reference purposes only.
 */

// This file should be used in a Node.js backend environment
// Save this as a separate backend service

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Proxy endpoint for Anthropic API
app.post('/api/anthropic/messages', async (req, res) => {
  try {
    // Extract the API key from the request headers
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Forward the request to Anthropic API
    const response = await axios({
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15'
      },
      data: req.body
    });
    
    // Return the response from Anthropic
    return res.json(response.data);
  } catch (error) {
    console.error('Error proxying request to Anthropic:', error);
    
    // Forward the error response
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }
    
    return res.status(500).json({
      error: 'Failed to proxy request to Anthropic API'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Anthropic API proxy server running on port ${PORT}`);
});

// To use this proxy:
// 1. Save this file as a separate Node.js application
// 2. Install dependencies: npm install express cors axios body-parser
// 3. Run the server: node anthropicProxy.js
// 4. Update the frontend code to point to this proxy instead of directly to Anthropic API 