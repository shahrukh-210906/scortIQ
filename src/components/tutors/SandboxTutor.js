import React, { useState, useEffect, useRef } from 'react';
import { BackIcon, BrainIcon, SendIcon } from '../ui/Icons';
import { callGeminiAPI } from '../../utils/aiService';
import { sendActivityEmail } from '../../utils/emailService';

const SandboxTutor = ({ user, onExit }) => {
  const [topic, setTopic] = useState(null);
  const [topicInput, setTopicInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const chatEndRef = useRef(null);

  const handleTopicSubmit = (e) => {
    e.preventDefault();
    if (topicInput.trim()) {
      setTopic(topicInput.trim());
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const createSystemPrompt = (topicName) => {
    return `You are a friendly and cool 'tution wale bhaiyya' for a Class ${user.class} student in India. 
Your job is to teach the topic '${topicName}' using a flexible, Socratic approach. Your responses must be in English + ${user.language} format (like Hinglish for Hindi).

⚠️ Rules:

1. **Socratic Method Only** - No direct textbook definitions.  
   - Always begin with a short analogy or real-life example (cricket, pani puri, Bollywood, etc.).  
   - Then ask a guiding question to connect the analogy to the concept.  

2. **Adaptive Style** - No fixed steps. Ask as many questions as needed until the student gets it.  
   - Use analogies, small puzzles, fill-in, MCQs, true/false, or direct comparisons naturally.  
   - Respond based on student's answers, just like a real tutor.  

3. **Language Style** - Your responses must be in English text but use ${user.language} just like Hinglish (English + Hindi). For example: "Arre yaar, this concept is like cricket - jab aap ball hit karte hain, toh it follows a specific path. Samjhe kya?" Keep them short & fun. 1–2 lines per message. Maintain the 'bhaiyya' persona and use equivalent slang where appropriate (e.g., "arre yaar", "samjha kya", "mast!", "bindaas").  

4. **End of Lesson** - Once the student clearly understands, provide a final wrap-up:  
     a) Formal Definition (English, 1 line).  
     b) Aasaan Bhasha (in the student's chosen language, 1 line).  
   - Finish with encouragement (🎉, 🚀, 👏). After this summary, your final message must be exactly "LESSON_COMPLETE".

5. **Golden Rule** - The focus is **concept clarity**, no matter how many steps it takes.  
   - You are a guide, not a lecturer.`;
  };

  useEffect(() => {
    if (topic) {
      const initialPrompt = `Hello bhaiyya! Let's start with the topic '${topic}'. Please begin with a cool analogy and an opening question.`;
      setIsLoading(true);
      setIsLessonComplete(false);
      setMessages([]);

      callGeminiAPI(initialPrompt + "\n\n" + createSystemPrompt(topic), []).then(aiResponse => {
        setMessages([{ text: aiResponse, sender: 'ai' }]);
        setIsLoading(false);
      });
      sendActivityEmail(user, 'Start Sandbox Tutor', `Topic: ${topic}`);
    }
  }, [topic]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage = { text: userInput, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    const aiResponseText = await callGeminiAPI(userInput, messages);

    if (aiResponseText.includes("LESSON_COMPLETE")) {
      const finalMessage = aiResponseText.replace("LESSON_COMPLETE", "").trim();
      setMessages(prev => [...prev, { text: finalMessage, sender: 'ai' }]);
      setIsLessonComplete(true);
    } else {
      setMessages(prev => [...prev, { text: aiResponseText, sender: 'ai' }]);
    }

    setIsLoading(false);
  };

  if (!topic) {
    return (
      <div>
        <div className="flex flex-col xs:flex-row justify-between items-center mb-4">
          <div className="card w-full xs:w-auto mb-4 xs:mb-0">
            <h1 className="text-xl xs:text-2xl font-bold font-serif text-text-primary">AI Sandbox</h1>
            <p className="text-sm xs:text-base text-text-secondary">What topic would you like to learn about today?</p>
          </div>
          <button onClick={onExit} className="btn-primary w-full xs:w-auto">
            <BackIcon />
            Back to Dashboard
          </button>
        </div>
        <div className="card text-center">
          <form onSubmit={handleTopicSubmit} className="flex flex-col items-center gap-4">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., Quantum Physics, Black Holes..."
              className="w-full max-w-lg p-3 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            />
            <button type="submit" className="btn-primary">
              Start Learning
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col xs:flex-row justify-between items-center mb-4">
        <div className="card w-full xs:w-auto mb-4 xs:mb-0">
          <h1 className="text-xl xs:text-2xl font-bold font-serif text-text-primary">{topic}</h1>
          <p className="text-sm xs:text-base text-text-secondary">AI Sandbox Session</p>
        </div>
        <button onClick={onExit} className="btn-primary w-full xs:w-auto">
          <BackIcon />
          Back to Dashboard
        </button>
      </div>

      <div className="card flex flex-col h-[75vh]">
        <div className="flex-grow p-2 xs:p-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                    <BrainIcon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-lg px-3 py-2 xs:px-4 xs:py-3 rounded-xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-background-alt text-text-primary rounded-bl-none'}`}>
                  <p className="whitespace-pre-wrap text-sm xs:text-base">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                  <BrainIcon className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-lg px-4 py-3 rounded-xl bg-background-alt text-text-primary rounded-bl-none">
                  <div className="flex items-center space-x-2 dot-pulse">
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            {isLessonComplete && (
              <div className="text-center p-4">
                <button onClick={() => setTopic(null)} className="btn-primary">Great! Learn another topic</button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex items-center gap-2 xs:gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question or respond..."
            className="w-full p-3 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            disabled={isLoading || isLessonComplete}
          />
          <button 
            type="submit" 
            disabled={isLoading || !userInput.trim() || isLessonComplete} 
            className="p-3 bg-brand-primary text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-brand-primary/90 transition"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SandboxTutor;