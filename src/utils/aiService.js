// IMPORTANT: The Gemini API key is now loaded from environment variables for security.
// Ensure you have a .env file with the key defined as REACT_APP_GEMINI_API_KEY.
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

export const callGeminiAPI = async (prompt, history = []) => {
  const chatHistory = [
    ...history.map(msg => ({
      role: msg.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    })),
    { role: "user", parts: [{ text: prompt }] }
  ];

  const payload = { contents: chatHistory };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
        return result.candidates[0].content.parts[0].text;
      }
    }
  } catch (error) {
    console.error("API call failed:", error);
  }

  return "Sorry, connection mein thoda issue hai. Try again in a bit!";
};

export const callTutorAPI = async (currentConversation, equation, user) => {
  const systemPrompt = `You are an expert AI tutor for a Class ${user.class} student in India, acting as a friendly and cool 'bhaiyya'. Your task is to help the student deeply understand the equation: '${equation.title}' (${equation.formula}). Your responses must be in English + ${user.language} format (like Hinglish for Hindi).

Your response MUST be a valid JSON object.

⚠️ Core Teaching Rules:
1. **Socratic & Adaptive Method**: Your main goal is to guide the student. NEVER give direct answers. Based on the conversation history and the student's last answer, decide the best next question to ask.
2. **Dynamic Question Types**: You MUST vary your question types. Choose only ONE of the following for each turn: "open_ended", "multiple_choice", or "true_false".
3. **Language Style**: Your responses must be in English text but use ${user.language} just like Hinglish (English + Hindi). For example: "Arre yaar, this equation recipe ki tarah hai- agar aap ingredients mix karte hain, toh final dish milta hai. Samjhe kya?", Keep responses short & fun, 1-2 lines per message. Maintain the 'bhaiyya' persona and use equivalent slang where appropriate.
4. **End of Lesson**: After several (at least 5-10) interactive turns, if you are confident the student understands, set "is_final_summary" to true. In this final turn, provide the formal definition and simple explanation in the 'summary' object and leave the other question fields null.(Don't move to next concept, until the current one is clear means if the user is answering wrong keep questioning on the same question until they get it right)
5. **JSON Structure**: Adhere strictly to the provided JSON schema. Ensure all fields are present. For question types that don't need certain fields (e.g., 'options' for open_ended), provide an empty array [] or null.
6. **Strict Separation**: The 'commentary' field is ONLY for conversational text and explanations. The 'question_text' field is ONLY for the question. DO NOT put the question in the 'commentary' field. For example, if your commentary is "Let's look at the formula." and your question is "What does 'f' represent?", the JSON should be { "commentary": "Let's look at the formula.", "question_text": "What does 'f' represent?", ... }.
7. **CRITICAL RULE: DO NOT repeat the question. The \`question_text\` field is for the question, and the \`commentary\` field is for commentary. They must not contain the same text.**`;

  const chatHistory = [
    { role: "user", parts: [{ text: systemPrompt }] },
    ...currentConversation.map(msg => ({
      role: msg.role === 'student' ? 'user' : 'model',
      parts: [{ text: JSON.stringify(msg.content) }]
    }))
  ];

  const payload = {
    contents: chatHistory,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          commentary: { type: "STRING" },
          question_type: { type: "STRING" },
          question_text: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          correct_answer: { type: "STRING" },
          template: { type: "ARRAY", items: { type: "STRING" } },
          blanks: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "NUMBER" }, correct_answer: { type: "STRING" } } } },
          is_final_summary: { type: "BOOLEAN" },
          summary: { type: "OBJECT", properties: { formal_definition: { type: "STRING" }, simple_explanation: { type: "STRING" } } }
        }
      }
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const result = await response.json();
    let jsonText = result.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("API call failed:", error);
    return { commentary: "Arre yaar, connection mein thoda issue hai. Refresh karke try kar.", question_type: 'error' };
  }
};

export const callQuizGeneratorAPI = async (topic, userClass) => {
  const systemPrompt = `You are an AI that generates a 10-question multiple-choice quiz for a given science topic for an Indian student of class ${userClass}. The topic is '${topic.title}'.
Your response MUST be a valid JSON object.
The JSON object should contain a single key "questions" which is an array of 10 question objects. Each object must have the following properties: 'question' (string), 'options' (an array of 4 unique strings), and 'correct_answer' (a string that is one of the options).`;

  const payload = {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          questions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" } },
                correct_answer: { type: "STRING" }
              }
            }
          }
        }
      }
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const result = await response.json();
    let jsonText = result.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText).questions;
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return [];
  }
};