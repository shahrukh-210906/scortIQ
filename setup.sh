#!/bin/bash
echo "Setting up ScortIQ React App..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

echo "Setup complete! You can now run the app with 'npm start'"
echo ""
echo "Don't forget to:"
echo "1. Update your Gemini API key in src/utils/aiService.js"
echo "2. Configure EmailJS service IDs in src/utils/emailService.js"
echo "3. Update EmailJS public key in src/index.js"
echo ""
echo "Happy coding!"
