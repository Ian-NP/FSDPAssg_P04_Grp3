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
  systemInstruction: `
    You are an assistant that processes user requests into specific actions and extracts relevant details. Respond strictly in JSON format. Do not include any additional text, explanations, or comments in the output.

    Your task is to:
    1. Identify the action requested by the user:
        - "Withdraw Funds" for requests to withdraw money.
        - "Check Balance" for inquiries about account balance.
        - "Monitor Spendings" for requests related to spending analysis.
        - "Unrecognized command" for any other unrecognized input or commands.
    2. For "Withdraw Funds," extract the amount specified by the user:
        - If the amount is not provided, set the amount to "0".
        - If the amount is specified, round it to the nearest multiple of 10 or 50, whichever is closer, but never to 0. If it's rounded off to zero, just change it to 10 instead.
    3. Respond only in the following JSON format:
    {
        "action": "<action_name>",
        "amount": <amount>
    }

    Rounding rules for amounts:
    - Determine the nearest multiple of 10 and 50.
    - Choose the value that is closer to the specified amount.
    - If both multiples are equidistant, choose the higher value.

    Examples:
    - User Input: "I want to withdraw 45 dollars."
      Output: { "action": "Withdraw Funds", "amount": 50 }
    - User Input: "Withdraw 32 dollars."
      Output: { "action": "Withdraw Funds", "amount": 30 }
    - User Input: "Withdraw money."
      Output: { "action": "Withdraw Funds", "amount": 0 }
    - User Input: "Can you check my balance?"
      Output: { "action": "Check Balance", "amount": 0 }
    - User Input: "Show me my spendings report."
      Output: { "action": "Monitor Spendings", "amount": 0 }
  `,
  generationConfig: generationConfig,
  safetySettings: safetySettings,
};

const geminiChatModel = genAI.getGenerativeModel(modelOptions);

const getActionCommand = async (userResponse) => {
  if (!userResponse || typeof userResponse !== "string") {
    throw new Error("Invalid input: userResponse must be a non-empty string.");
  }

  try {
    const chatInstance = await geminiChatModel.startChat();

    const response = await chatInstance.sendMessage(userResponse);
    const editedRawResponse = response?.response?.text().replace(/```[\s\S]*?\n|```/g, "").trim();
    console.log("Raw response from assistant:", editedRawResponse);

    // Validate JSON format
    if (!editedRawResponse.startsWith("{") || !editedRawResponse.endsWith("}")) {
      throw new Error("Response is not valid JSON.");
    }

    const actionToExecute = JSON.parse(editedRawResponse);

    return {
      action: actionToExecute.action || "Unrecognized command",
      amount: actionToExecute.amount || 0,
      status: "success",
    };
  } catch (error) {
    console.error("Error generating command:", error.message);
    return {
      action: "Unrecognized command",
      amount: 0,
      status: "error",
      error: error.message,
    };
  }
};


module.exports = { getActionCommand };
