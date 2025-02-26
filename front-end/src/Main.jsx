import React from "react";
import IngredientsList from "./Components/IngredientsList.jsx";
import ClaudeRecipe from "./Components/ClaudeRecipe.jsx";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");

    async function getRecipe() {
        try {
            const response = await fetch("http://localhost:5000/getRecipeFromMistral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch recipe");
            }

            const data = await response.json();
            setRecipe(data.recipe || "No recipe generated.");
        } catch (error) {
            console.error("Error fetching recipe:", error);
            setRecipe("Error fetching recipe. Please try again.");
        }
    }

    function addIngredient(event) {
        event.preventDefault(); // ✅ Prevents full page reload
        const formData = new FormData(event.target);
        const newIngredient = formData.get("ingredient");

        if (newIngredient.trim() !== "") {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
        }

        event.target.reset(); // ✅ Clears input field after adding
    }

    return (
        <main>
            <form onSubmit={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                    required
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 && (
                <IngredientsList ingredients={ingredients} getRecipe={getRecipe} />
            )}

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    );
}
