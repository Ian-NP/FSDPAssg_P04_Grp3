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

    // Spending Pattern Analysis prompt
    const spendingPatternPrompt = `Analyze this user's spending data: ${JSON.stringify(transactionData)}. Identify key spending patterns, highlight frequently spent categories, and provide insights.`;

    // Personalized Financial Advice prompt
    const financialAdvicePrompt = `Based on this user's transaction history: ${JSON.stringify(transactionData)}, provide specific recommendations to optimize expenses and improve their financial health.`;

    // Send the spending pattern analysis prompt
    const spendingAnalysisResponse = await chatInstance.sendMessage(spendingPatternPrompt);

    // Send the financial advice prompt
    const financialAdviceResponse = await chatInstance.sendMessage(financialAdvicePrompt);

    return {
      spendingAnalysis: spendingAnalysisResponse?.response.text() || 'Analysis not provided',
      financialAdvice: financialAdviceResponse?.response.text() || 'Advice not provided',
    };
  } catch (error) {
    console.error('Error generating analysis or advice:', error);
    throw new Error('Failed to generate analysis or advice');
  }
};

module.exports = { analyzeSpendingAndAdvice };
