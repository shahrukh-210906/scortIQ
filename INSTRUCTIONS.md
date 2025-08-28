# ScortIQ Setup Instructions

## Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- A text editor (VS Code recommended)

## Quick Setup

1. **Extract the zip file** to your desired location
2. **Navigate to the project directory** in your terminal
3. **Run the setup script**:
   ```bash
   ./setup.sh
   ```
   Or manually:
   ```bash
   npm install
   npm run build
   ```

## Configuration

### 1. Gemini AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update `src/utils/aiService.js` and replace the API_KEY constant

### 2. EmailJS Setup (Optional)
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create two email templates:
   - Welcome email template
   - Activity tracking template
3. Update the service IDs in:
   - `src/utils/emailService.js`
   - `src/index.js` (public key)

### 3. Environment Variables (Advanced)
Copy `.env.example` to `.env` and fill in your actual keys:
```bash
cp .env.example .env
```

## Running the Application

### Development Mode
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```
The `build` folder will contain the optimized production files.

## Project Structure

```
scortiq-ai-tutor/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── tutors/        # AI tutor components
│   │   └── ui/            # UI components
│   ├── data/              # Curriculum data
│   ├── styles/            # CSS styles
│   ├── utils/             # Utility functions
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind CSS config
└── README.md             # Project documentation
```

## Key Features

- **Multi-language Support**: Supports Hinglish, Hindi, English, and other Indian languages
- **AI Tutors**: Interactive conversation-based learning using Gemini AI
- **Equation Tutor**: Specialized tutor for mathematical equations
- **Quiz System**: AI-generated quizzes for knowledge assessment
- **Progress Tracking**: Visual progress monitoring across subjects
- **Sandbox Mode**: Learn any topic beyond the curriculum
- **NCERT Curriculum**: Covers classes 9-12 Physics, Chemistry, and Biology

## Customization

### Adding New Subjects
Edit `src/data/curriculum.js` to add new subjects or chapters.

### Modifying UI Colors
Update `tailwind.config.js` to change the color scheme.

### Adding New Question Types
Create new input components in `src/components/tutors/inputs/`.

## Deployment

### Netlify (Recommended)
1. Run `npm run build`
2. Drag the `build` folder to Netlify Drop
3. Your app is live!

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Other Platforms
The `build` folder can be deployed to any static hosting service.

## Troubleshooting

### Common Issues

1. **"Module not found" errors**: Run `npm install`
2. **API errors**: Check your Gemini API key
3. **Email not working**: Verify EmailJS configuration
4. **Build fails**: Check for syntax errors in your code

### Getting Help

1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify your API keys are correct
4. Make sure you're using a supported Node.js version

## License

This project is for educational purposes. Please respect API usage limits and terms of service for external services.

---

**Happy Learning with ScortIQ! 🚀**
