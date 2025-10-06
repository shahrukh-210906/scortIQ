# ScortIQ - AI Learning Companion

ScortIQ is an interactive AI-powered learning platform designed for Indian students. It provides personalized tutoring using the Socratic method and covers NCERT curriculum for classes 9-12.

## Features

- **AI Tutors**: Interactive conversation-based learning
- **Equation Tutor**: Specialized tutor for mathematical equations and formulas
- **Sandbox Mode**: Learn any topic beyond curriculum
- **Quiz System**: Test your knowledge with AI-generated quizzes
- **Performance Tracking**: Monitor your progress across subjects
- **Multi-language Support**: Supports Hinglish and other Indian languages

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or extract the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure EmailJS (optional):
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Update the service IDs and template IDs in `src/utils/emailService.js`

4. Get a Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key and update it in `src/utils/aiService.js`

5. Start the development server:
   ```bash
   npm start
   ```

### Building for Production

```bash
npm run build
```

## Configuration

### EmailJS Setup
1. Create templates for:
   - Welcome emails
   - Activity tracking
2. Update service IDs in `src/utils/emailService.js`

### AI Configuration
Update your Gemini API key in `src/utils/aiService.js`

## Project Structure

```
src/
├── components/          # React components
│   ├── tutors/         # AI tutor components
│   └── ui/             # UI components
├── data/               # Curriculum data
├── styles/             # CSS and styling
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## License

This project is for educational purposes.
