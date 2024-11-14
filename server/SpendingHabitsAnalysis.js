const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generationConfig = {
  maxOutputTokens: 800,
  temperature: 0.8,
  topP: 0.2,
  topK: 15,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const modelOptions = {
  model: "gemini-1.5-flash",
  systemInstruction: "Provide comprehensive financial insights and recommendations based on transaction data.",
  generationConfig: generationConfig,
  safetySettings: safetySettings,
};

const geminiChatModel = genAI.getGenerativeModel(modelOptions);

const analyzeSpendingAndAdvice = async (transactionData) => {
  try {
    const chatInstance = await geminiChatModel.startChat();

    const combinedPrompt = `Analyze this user's spending data: ${JSON.stringify(transactionData)}. 
      Rules to follow for your response:
        Make sure to use personal language such as "you" and "your" to make the analysis relatable and easy to follow. Keep the response short, simple, and impactful without overwhelming the user with too much information. Do not include any disclaimers or statements at the end of your response.

      Follow this order in your response:
        1. Provide a financial health score to indicate the user's overall financial well-being.
        2. Identify key spending patterns and highlight frequently spent categories.
        3. Offer clear, concise insights based on the spending analysis.
        4. Provide specific and practical recommendations for optimizing expenses and improving financial health.
    `;

    const analysisAndAdvice = await chatInstance.sendMessage(combinedPrompt);

    return {
      analysisAndAdvice: analysisAndAdvice?.response.text() || 'Analysis and advice not provided',
    };
  } catch (error) {
    console.error('Error generating analysis or advice:', error);
    throw new Error('Failed to generate analysis or advice');
  }
};

module.exports = { analyzeSpendingAndAdvice };
