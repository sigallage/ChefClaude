import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define system prompt
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. 
You don't need to use every ingredient they mention in your recipe. 
The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. 
Format your response in markdown to make it easier to render to a web page.
`;

// Initialize Hugging Face Inference API
const hf = new HfInference(process.env.API_KEY);

/**
 * Generates a recipe using the Hugging Face Mixtral AI model.
 * @param {string[]} ingredientsArr - List of ingredients provided by the user.
 * @returns {Promise<string>} - AI-generated recipe in Markdown format.
 */
export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    
    try {
        console.log("Sending request to Hugging Face with ingredients:", ingredientsString);  // ✅ Debugging Log

        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        });

        console.log("API Response:", response);  // ✅ Log API response for debugging

        return response.choices[0]?.message?.content || "No response received from AI.";
    } catch (err) {
        console.error("Error fetching recipe:", err);  // ❌ Logs full error instead of just err.message
        return "Sorry, I couldn't generate a recipe at this moment.";
    }
}

/**
 * Generates a basic text-based recipe (fallback method).
 * @param {string[]} ingredients - List of ingredients.
 * @returns {string} - Simple text recipe.
 */
export function getRecipeFromChefClaude(ingredients) {
    return `Recipe for: ${ingredients.join(", ")}. Try making a delicious dish with these!`;
}
