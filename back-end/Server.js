import express from "express";
import cors from "cors";
import bodyParser from "body-parser";  
import dotenv from "dotenv";
import { getRecipeFromMistral, getRecipeFromChefClaude } from "./recipeService.js";  // ✅ Only import functions

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/getRecipeFromMistral", async (req, res) => {
    const { ingredients } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: "No ingredients provided" });
    }

    try {
        const recipe = await getRecipeFromMistral(ingredients);
        res.json({ recipe });
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ error: "Failed to generate a recipe." });
    }
});

// ✅ Define PORT only in server.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
