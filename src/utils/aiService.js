// src/utils/aiService.js

// IMPORTANT: The Gemini API key is now loaded from environment variables for security.
// Ensure you have a .env file with the key defined as REACT_APP_GEMINI_API_KEY.
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
// Note: It looks like the model name was updated in the original file. Using the latest name.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent?key=${API_KEY}`; // Updated Model Name

/**
 * Calls the Gemini API for general chat purposes (like ChatTutor and SandboxTutor).
 * @param {string} prompt - The user's latest message/prompt.
 * @param {Array<{text: string, sender: 'ai' | 'user'}>} history - The conversation history.
 * @returns {Promise<string>} - The AI's response text.
 */
export const callGeminiAPI = async (prompt, history = []) => {
  // Convert sender ('ai'/'user') to Gemini roles ('model'/'user')
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

     if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API Error Response:", errorBody);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();

    // Add more robust checking for the response structure
    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) {
      return result.candidates[0].content.parts[0].text;
    } else {
       console.error("Unexpected response structure from Gemini API:", result);
       throw new Error("Invalid response structure received from AI.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Provide a user-friendly error message in the chat style
    return "Arre yaar, connection mein thoda issue hai. Refresh karke try kar!";
  }
};

/**
 * Calls the Gemini API specifically for the older, chat-based Equation Tutor (if still needed).
 * This function expects a specific JSON output format for guiding the conversation turn by turn.
 * @param {Array<{role: 'student' | 'tutor', content: object}>} currentConversation - The conversation history.
 * @param {{title: string, formula: string}} equation - Details of the equation being taught.
 * @param {{class: string | number, language: string}} user - User details.
 * @returns {Promise<object>} - The AI's response as a JSON object based on the defined schema.
 */
export const callTutorAPI = async (currentConversation, equation, user) => {
  const systemPrompt = `You are an expert AI tutor for a Class ${user.class} student in India, acting as a friendly and cool 'bhaiyya'. Your task is to help the student deeply understand the equation: '${equation.title}' (${equation.formula}). Your responses must be in English + ${user.language} format (like Hinglish for Hindi).

Your response MUST be a valid JSON object.

⚠️ Core Teaching Rules:
1.  **Socratic & Adaptive Method**: Your main goal is to guide the student. NEVER give direct answers. Based on the conversation history and the student's last answer, decide the best next question to ask.
2.  **Dynamic Question Types**: You MUST vary your question types. Choose only ONE of the following for each turn: "open_ended", "multiple_choice", or "true_false".
3.  **Language Style**: Your responses must be in English text but use ${user.language} just like Hinglish (English + Hindi). For example: "Arre yaar, this equation recipe ki tarah hai- agar aap ingredients mix karte hain, toh final dish milta hai. Samjhe kya?", Keep responses short & fun, 1-2 lines per message. Maintain the 'bhaiyya' persona and use equivalent slang where appropriate.
4.  **End of Lesson**: After several (at least 5-10) interactive turns, if you are confident the student understands, set "is_final_summary" to true. In this final turn, provide the formal definition and simple explanation in the 'summary' object and leave the other question fields null.(Don't move to next concept, until the current one is clear means if the user is answering wrong keep questioning on the same question until they get it right)
5.  **JSON Structure**: Adhere strictly to the provided JSON schema. Ensure all fields are present. For question types that don't need certain fields (e.g., 'options' for open_ended), provide an empty array [] or null.
6.  **Strict Separation**: The 'commentary' field is ONLY for conversational text and explanations. The 'question_text' field is ONLY for the question. DO NOT put the question in the 'commentary' field. For example, if your commentary is "Let's look at the formula." and your question is "What does 'f' represent?", the JSON should be { "commentary": "Let's look at the formula.", "question_text": "What does 'f' represent?", ... }.
7.  **CRITICAL RULE: DO NOT repeat the question. The \`question_text\` field is for the question, and the \`commentary\` field is for commentary. They must not contain the same text.**`;

  const chatHistory = [
    { role: "user", parts: [{ text: systemPrompt }] }, // Start with the system prompt
    // Map conversation history to Gemini roles
    ...currentConversation.map(msg => ({
      role: msg.role === 'student' ? 'user' : 'model',
      // Ensure content sent to API is stringified JSON
      parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }]
    }))
  ];

  const payload = {
    contents: chatHistory,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: { // Define the expected JSON output structure
        type: "OBJECT",
        properties: {
          commentary: { type: "STRING" },
          question_type: { type: "STRING", enum: ["open_ended", "multiple_choice", "true_false", "fill_blank", "error"] }, // Added fill_blank
          question_text: { type: "STRING", nullable: true }, // Made nullable for summary
          options: { type: "ARRAY", items: { type: "STRING" }, nullable: true }, // Made nullable
          correct_answer: { type: "STRING", nullable: true }, // Made nullable
          // Added fields for fill_blank if you implement it later
          // template: { type: "ARRAY", items: { type: "STRING" }, nullable: true },
          // blanks: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "NUMBER" }, correct_answer: { type: "STRING" } } }, nullable: true },
          is_final_summary: { type: "BOOLEAN" },
          summary: {
              type: "OBJECT",
              nullable: true, // Make summary nullable
              properties: {
                  formal_definition: { type: "STRING", nullable: true },
                  simple_explanation: { type: "STRING", nullable: true }
              }
           }
        },
         // Ensure required fields match the logic (e.g., summary fields aren't required if is_final_summary is false)
         // Adjust required fields based on your exact needs and error handling
         required: ["commentary", "question_type", "is_final_summary"]
      }
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Tutor API Error Response:", errorBody);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
     console.log("Received raw response from Tutor API:", JSON.stringify(result, null, 2)); // Debug log

    if (!result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts) {
        console.error("Invalid response structure:", result);
        throw new Error("Unexpected response structure from Tutor API.");
    }

    let jsonText = result.candidates[0].content.parts[0].text;

    try {
        const tutorResponse = JSON.parse(jsonText);
        console.log("Successfully parsed Tutor API response:", tutorResponse); // Debug log
        return tutorResponse;
    } catch (parseError) {
        console.error("Failed to parse JSON response from Tutor API:", jsonText, parseError);
        // Fallback error message in the expected format
        return { commentary: "Arre yaar, response samajh nahi aaya. Refresh karke try kar.", question_type: 'error', is_final_summary: false };
    }

  } catch (error) {
    console.error("Tutor API call failed:", error);
    // Provide a user-friendly error message in the expected JSON format
    return { commentary: "Arre yaar, connection mein thoda issue hai. Refresh karke try kar.", question_type: 'error', is_final_summary: false };
  }
};


/**
 * Calls the Gemini API to generate a multiple-choice quiz for a given topic.
 * @param {{title: string}} topic - The topic object.
 * @param {string | number} userClass - The student's class.
 * @returns {Promise<Array<object>>} - An array of question objects or an empty array on failure.
 */
export const callQuizGeneratorAPI = async (topic, userClass) => {
  const systemPrompt = `You are an AI that generates a 10-question multiple-choice quiz for a given science topic for an Indian student of class ${userClass}. The topic is '${topic.title}'.
Your response MUST be a valid JSON object.
The JSON object should contain a single key "questions" which is an array of 10 question objects. Each object must have the following properties: 'question' (string), 'options' (an array of 4 unique strings), and 'correct_answer' (a string that is one of the options). Ensure questions cover different aspects of the topic and are appropriate for the class level.`;

  const payload = {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: { // Define the expected JSON output structure
        type: "OBJECT",
        properties: {
          questions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" }, minItems: 4, maxItems: 4 },
                correct_answer: { type: "STRING" }
              },
              required: ["question", "options", "correct_answer"]
            },
             minItems: 10, // Ensure exactly 10 questions
             maxItems: 10
          }
        },
        required: ["questions"]
      }
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Quiz API Error Response:", errorBody);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    console.log("Received raw response from Quiz API:", JSON.stringify(result, null, 2)); // Debug log

    if (!result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts) {
        console.error("Invalid response structure:", result);
        throw new Error("Unexpected response structure from Quiz API.");
    }

    let jsonText = result.candidates[0].content.parts[0].text;

     try {
        const quizData = JSON.parse(jsonText);
         console.log("Successfully parsed Quiz API response:", quizData); // Debug log
        if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 10) {
            console.error("Parsed JSON invalid or missing questions:", quizData);
            throw new Error("Generated quiz data is invalid or incomplete.");
        }
        return quizData.questions;
    } catch (parseError) {
        console.error("Failed to parse JSON response from Quiz API:", jsonText, parseError);
        return []; // Return empty array on parse failure
    }

  } catch (error) {
    console.error("Quiz generation failed:", error);
    return []; // Return empty array on general failure
  }
};


/**
 * Calls the Gemini API to generate the structured lesson plan for the interactive Equation Tutor.
 * @param {{title: string, formula: string}} equation - Details of the equation being taught.
 * @param {{class: string | number, language: string}} user - User details.
 * @returns {Promise<object | null>} - The structured lesson plan as a JSON object, or null on failure.
 */
export const callEquationLessonGeneratorAPI = async (equation, user) => {
  const systemPrompt = `
You are an expert AI curriculum designer tasked with creating an interactive, multi-phase lesson plan to teach a specific science equation/concept to a Class ${user.class} student in India. The student prefers explanations in English + ${user.language} (like Hinglish). The lesson should follow the structure detailed in the JSON schema below.

Equation/Concept: '${equation.title}' (${equation.formula})

Lesson Structure Requirements:
1.  **Analogy:** Start with a relatable analogy (1-2 sentences) in the specified language style.
2.  **Concepts:** Identify key elements/components involved (symbols, intuitive names). Include entries for individual elements (like C, H, O) and the reactant/product molecules/compounds (like CO2, H2O, C6H12O6). Use 'element', 'reactant_molecule', 'product' for the 'type' field. Ensure IDs are unique (e.g., C_element, H2O_reactant).
3.  **Phase 1 (Element/Component Roles):**
    * A brief prompt introducing the phase.
    * For each key element/component identified in 'concepts': Explain its role and provide a simple analogy (1-2 sentences each). Use the 'symbol' field for the identifier.
    * Create a matching game prompt.
    * Provide matching pairs ('symbol' mapped to its 'intuitive_name' from concepts).
4.  **Phase 2 (Reactant Build / Input Setup):**
    * A brief prompt introducing the phase.
    * For each reactant molecule/component identified in 'concepts':
        * Provide its formula ('molecule_formula'), intuitive name ('role_analogy'). Use its concept ID for 'molecule_id'.
        * Explain its importance/function ("Why and How it Works", 1-2 sentences).
        * Create a clear build prompt instructing the user which element *symbols* to select and how many (referencing symbols from 'concepts').
        * Specify the 'correct_build' array using element symbols and counts [{symbol: string, count: number}].
        * Provide the coefficient for the balanced equation.
        * Create modal content ('modal_detail': {title: string, content: string}) explaining where this reactant comes from or its significance (HTML format allowed for basic tags like <p>, <strong>).
5.  **Phase 3 (Product Build / Output Generation):**
    * A brief prompt introducing the phase.
    * Follow the same structure as Phase 2 for each product molecule/component identified in 'concepts', using 'product_id' and 'product_formula'.
    * Include 'final_equation_display' array: structure the balanced equation using {type: 'display' | 'operator', value: string}, including coefficients.
    * Include a 'final_story_workflow' summarizing the overall process in simple terms (1-3 sentences).
6.  **Summary:** A concluding title and text (1-2 sentences) congratulating the student.

Language Style: Use simple English text but incorporate ${user.language} words/phrases naturally (like Hinglish). Keep explanations concise and engaging for a Class ${user.class} student. Use 'bhaiyya' persona and relevant slang (e.g., "arre yaar", "samjha na?", "bindaas").

Your response MUST be a valid JSON object strictly adhering to the schema provided in generationConfig. Ensure all required fields are present.
`;

  const payload = {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      // Define the expected JSON structure for the lesson plan
      responseSchema: {
        type: "OBJECT",
        properties: {
          equation: {
            type: "OBJECT",
            properties: { title: { type: "STRING" }, formula: { type: "STRING" } },
            required: ["title", "formula"]
          },
          analogy: { type: "STRING" },
          concepts: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING", description: "Unique ID (e.g., C_element, H2O_reactant)" },
                intuitive_name: { type: "STRING", description: "Simple name (e.g., Carbon Chef, Life ka Paani)" },
                symbol: { type: "STRING", description: "Element symbol or Molecule Formula (e.g., C, H2O)" },
                type: { type: "STRING", enum: ["element", "reactant_molecule", "product"], description: "Type of concept" }
              },
               required: ["id", "intuitive_name", "symbol", "type"]
            }
          },
          phase1_element_roles: {
            type: "OBJECT",
            properties: {
              prompt: { type: "STRING" },
              elements: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    symbol: { type: "STRING", description: "Symbol/Formula of the concept" },
                    role: { type: "STRING", description: "Explanation of its role" },
                    analogy: { type: "STRING", description: "Simple analogy for the role" }
                  },
                   required: ["symbol", "role", "analogy"]
                }
              },
              matching_prompt: { type: "STRING" },
              matching_pairs: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    symbol: { type: "STRING", description: "Symbol/Formula (key)" },
                    role_name: { type: "STRING", description: "Intuitive Name (value)" }
                  },
                   required: ["symbol", "role_name"]
                }
              }
            },
             required: ["prompt", "elements", "matching_prompt", "matching_pairs"]
          },
          phase2_reactant_build: {
            type: "OBJECT",
            properties: {
              prompt: { type: "STRING" },
              steps: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    molecule_id: { type: "STRING" },
                    molecule_formula: { type: "STRING" },
                    role_analogy: { type: "STRING" },
                    why_and_how_it_works: { type: "STRING" },
                    build_prompt: { type: "STRING" },
                    correct_build: {
                      type: "ARRAY",
                      items: { type: "OBJECT", properties: { symbol: { type: "STRING" }, count: { type: "NUMBER" } }, required: ["symbol", "count"] }
                    },
                    coefficient: { type: "NUMBER" },
                    modal_detail: {
                      type: "OBJECT",
                      properties: { title: { type: "STRING" }, content: { type: "STRING" } },
                      required: ["title", "content"]
                    }
                  },
                   required: ["molecule_id", "molecule_formula", "role_analogy", "why_and_how_it_works", "build_prompt", "correct_build", "coefficient", "modal_detail"]
                }
              }
            },
             required: ["prompt", "steps"]
          },
          phase3_product_build: {
            type: "OBJECT",
            properties: {
              prompt: { type: "STRING" },
              products: { // Renamed from 'steps'
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                   properties: {
                    product_id: { type: "STRING" },
                    product_formula: { type: "STRING" },
                    role_analogy: { type: "STRING" },
                    why_and_how_it_works: { type: "STRING" },
                    build_prompt: { type: "STRING" },
                    correct_build: {
                      type: "ARRAY",
                      items: { type: "OBJECT", properties: { symbol: { type: "STRING" }, count: { type: "NUMBER" } }, required: ["symbol", "count"] }
                    },
                    coefficient: { type: "NUMBER" },
                    modal_detail: {
                      type: "OBJECT",
                      properties: { title: { type: "STRING" }, content: { type: "STRING" } },
                       required: ["title", "content"]
                    }
                  },
                   required: ["product_id", "product_formula", "role_analogy", "why_and_how_it_works", "build_prompt", "correct_build", "coefficient", "modal_detail"]
                }
              },
              final_equation_display: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    type: { type: "STRING", enum: ["display", "operator"] },
                    value: { type: "STRING" }
                  },
                   required: ["type", "value"]
                }
              },
              final_story_workflow: { type: "STRING" }
            },
             required: ["prompt", "products", "final_equation_display", "final_story_workflow"]
          },
          summary: {
            type: "OBJECT",
            properties: { title: { type: "STRING" }, text: { type: "STRING" } },
             required: ["title", "text"]
          }
        },
        required: ["equation", "analogy", "concepts", "phase1_element_roles", "phase2_reactant_build", "phase3_product_build", "summary"]
      }
    }
  };

  try {
    console.log("[EquationLessonGenerator] Sending payload:", JSON.stringify(payload, null, 2)); // Debug log
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("[EquationLessonGenerator] API Error Response:", errorBody);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log("[EquationLessonGenerator] Received raw response:", JSON.stringify(result, null, 2)); // Debug log

    if (!result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0].text) {
        console.error("[EquationLessonGenerator] Invalid response structure:", result);
        throw new Error("Unexpected response structure from lesson generator API.");
    }

    let jsonText = result.candidates[0].content.parts[0].text;

    // Attempt to parse the JSON
    try {
        const lessonPlan = JSON.parse(jsonText);
        console.log("[EquationLessonGenerator] Successfully parsed lesson plan:", lessonPlan); // Debug log
        // Basic validation - enhance as needed
        if (!lessonPlan.equation || !lessonPlan.phase1_element_roles || !lessonPlan.phase2_reactant_build || !lessonPlan.phase3_product_build) {
             console.error("[EquationLessonGenerator] Parsed JSON missing required phase fields:", lessonPlan);
             throw new Error("Generated lesson plan is missing required phase fields.");
        }
        return lessonPlan;
    } catch (parseError) {
        console.error("[EquationLessonGenerator] Failed to parse JSON response:", jsonText, parseError);
        throw new Error("Could not parse the lesson plan from the AI.");
    }

  } catch (error) {
    console.error("Equation Lesson generation failed:", error);
    return null; // Return null on failure
  }
};