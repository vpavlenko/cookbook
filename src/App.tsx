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

const boilerplateRecipes: Recipe[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    ingredients: [
      { name: "Spaghetti", amount: 400, unit: "g" },
      { name: "Pancetta", amount: 150, unit: "g" },
      { name: "Eggs", amount: 4, unit: "pcs" },
      { name: "Parmesan cheese", amount: 50, unit: "g" },
      { name: "Black pepper", amount: 1, unit: "tsp" },
    ],
    portions: 4,
  },
  {
    id: "2",
    name: "Classic Caesar Salad",
    ingredients: [
      { name: "Romaine lettuce", amount: 1, unit: "head" },
      { name: "Croutons", amount: 100, unit: "g" },
      { name: "Parmesan cheese", amount: 50, unit: "g" },
      { name: "Caesar dressing", amount: 60, unit: "ml" },
    ],
    portions: 2,
  },
  {
    id: "3",
    name: "Chocolate Chip Cookies",
    ingredients: [
      { name: "All-purpose flour", amount: 280, unit: "g" },
      { name: "Butter", amount: 230, unit: "g" },
      { name: "Brown sugar", amount: 200, unit: "g" },
      { name: "White sugar", amount: 100, unit: "g" },
      { name: "Eggs", amount: 2, unit: "pcs" },
      { name: "Vanilla extract", amount: 2, unit: "tsp" },
      { name: "Chocolate chips", amount: 340, unit: "g" },
    ],
    portions: 24,
  },
];

function App() {
  console.log("App component rendering");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("Initial useEffect running");
    const storedRecipes = localStorage.getItem("recipes");
    console.log("Stored recipes:", storedRecipes);
    if (storedRecipes) {
      const parsedRecipes = JSON.parse(storedRecipes);
      console.log("Parsed stored recipes:", parsedRecipes);
      if (parsedRecipes.length === 0) {
        console.log("Stored recipes empty, using boilerplate");
        setRecipes(boilerplateRecipes);
      } else {
        setRecipes(parsedRecipes);
      }
    } else {
      console.log("No stored recipes, using boilerplate");
      setRecipes(boilerplateRecipes);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    console.log("Recipes updated:", recipes);
    if (recipes.length > 0) {
      console.log("Saving recipes to localStorage:", recipes);
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }
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

  console.log("Current recipes state:", recipes);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Add this new function to handle the download
  const handleDownloadRecipes = () => {
    const recipesJson = JSON.stringify(recipes, null, 2);
    const blob = new Blob([recipesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recipes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>Cooking Recipe Manager</h1>
      <div className="recipe-list">
        <h2>Recipes ({recipes.length})</h2>
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
        <button onClick={handleDownloadRecipes}>Download Recipes</button>
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
