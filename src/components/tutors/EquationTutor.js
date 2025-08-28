import React, { useState, useEffect, useRef } from 'react';
import { BackIcon, BrainIcon } from '../ui/Icons';
import { callTutorAPI } from '../../utils/aiService';
import { sendActivityEmail } from '../../utils/emailService';
import OpenEndedInput from './inputs/OpenEndedInput';
import MCQInput from './inputs/MCQInput';
import TrueFalseInput from './inputs/TrueFalseInput';
import FillBlankInput from './inputs/FillBlankInput';

const EquationTutor = ({ equation, chapterTitle, user, onExit }) => {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  useEffect(() => {
    const initialUserMessage = { role: 'student', content: { answer: `Hello bhaiyya! Let's start with '${equation.title}'. Please begin.` } };
    setConversation([initialUserMessage]);
    setIsLoading(true);

    callTutorAPI([initialUserMessage], equation, user).then(aiResponse => {
      setConversation(prev => [...prev, { role: 'tutor', content: aiResponse }]);
      setIsLoading(false);
    });
    sendActivityEmail(user, 'Start Equation Tutor', `Equation: ${equation.title} (${equation.formula})`);
  }, [equation, user]);

  const handleAnswerSubmit = async (answer) => {
    const newUserMessage = { role: 'student', content: { answer } };
    const updatedConversation = [...conversation, newUserMessage];
    setConversation(updatedConversation);
    setIsLoading(true);

    const aiResponse = await callTutorAPI(updatedConversation, equation, user);

    if (aiResponse.is_final_summary) {
      setConversation(prev => [...prev, { role: 'tutor', content: aiResponse }]);
      setIsLessonComplete(true);
    } else {
      setConversation(prev => [...prev, { role: 'tutor', content: aiResponse }]);
    }

    setIsLoading(false);
  };

  const lastTutorMessage = conversation.filter(m => m.role === 'tutor').pop()?.content;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="card">
          <h1 className="text-2xl font-bold font-serif text-text-primary">{equation.title}</h1>
          <p className="text-text-secondary">From Chapter: <span className="font-semibold text-brand-primary">{chapterTitle}</span></p>
        </div>
        <button onClick={onExit} className="btn-primary">
          <BackIcon />
          Back to Subject
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-2">The Equation</h2>
            <p className="text-3xl font-mono text-center py-4 px-2 bg-background-alt text-brand-primary rounded-lg break-all">
              {equation.formula}
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 card flex flex-col h-[75vh]">
          <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {conversation.slice(1).map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'tutor' && (
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                      <BrainIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-lg px-4 py-3 rounded-xl ${msg.role === 'student' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-background-alt text-text-primary rounded-bl-none'}`}>
                    {msg.role === 'student' ? (
                      <p>{msg.content.answer}</p>
                    ) : (
                      <div>
                        <p className="whitespace-pre-wrap">{msg.content.commentary}</p>
                        {msg.content.question_text && <p className="mt-2 font-semibold whitespace-pre-wrap">{msg.content.question_text}</p>}
                        {msg.content.is_final_summary && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm font-bold">Formal Definition:</p>
                            <p className="text-sm italic">{msg.content.summary.formal_definition}</p>
                            <p className="text-sm font-bold mt-2">Aasaan Bhasha Mein:</p>
                            <p className="text-sm italic">{msg.content.summary.simple_explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
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
              <div ref={chatEndRef} />
            </div>
          </div>
          {!isLessonComplete && lastTutorMessage && lastTutorMessage.question_type && (
            <>
              {lastTutorMessage.question_type === 'open_ended' && (
                <OpenEndedInput onSubmit={handleAnswerSubmit} isLoading={isLoading} />
              )}
              {lastTutorMessage.question_type === 'multiple_choice' && (
                <MCQInput question={lastTutorMessage} onSubmit={handleAnswerSubmit} isLoading={isLoading} />
              )}
              {lastTutorMessage.question_type === 'true_false' && (
                <TrueFalseInput question={lastTutorMessage} onSubmit={handleAnswerSubmit} isLoading={isLoading} />
              )}
              {lastTutorMessage.question_type === 'fill_in_the_blank' && (
                <FillBlankInput 
                  key={lastTutorMessage.question_text} 
                  question={lastTutorMessage} 
                  onSubmit={handleAnswerSubmit} 
                  isLoading={isLoading} 
                />
              )}
            </>
          )}
           {isLessonComplete && (
            <div className="text-center p-4 border-t border-border">
              <button onClick={onExit} className="btn-primary">Macha Diya! Back to Subject</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquationTutor;