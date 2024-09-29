import { useState, useEffect } from "react";
import "./App.css";
import RecipeForm from "./components/RecipeForm";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  portions: number;
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const handleSaveRecipe = (recipe: Recipe) => {
    if (recipe.id) {
      setRecipes(recipes.map((r) => (r.id === recipe.id ? recipe : r)));
    } else {
      const newRecipe = { ...recipe, id: Date.now().toString() };
      setRecipes([...recipes, newRecipe]);
    }
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter((r) => r.id !== id));
    setSelectedRecipe(null);
  };

  return (
    <div className="App">
      <h1>Cooking Recipe Manager</h1>
      <div className="recipe-list">
        <h2>Recipes</h2>
        <button
          onClick={() =>
            setSelectedRecipe({
              id: "",
              name: "",
              ingredients: [],
              portions: 1,
            })
          }
        >
          Add New Recipe
        </button>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              {recipe.name}
              <button onClick={() => setSelectedRecipe(recipe)}>Edit</button>
              <button onClick={() => handleDeleteRecipe(recipe.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedRecipe && (
        <RecipeForm
          recipe={selectedRecipe}
          onSave={handleSaveRecipe}
          onCancel={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default App;
