import React, { useState } from "react";

interface Ingredient {
  name: string;
  amount: number;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  portions: number;
}

interface RecipeFormProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  recipe,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(recipe.name);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [portions, setPortions] = useState(recipe.portions);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: 0 }]);
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updatedIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return {
          ...ingredient,
          [field]: field === "amount" ? Number(value) : value,
        };
      }
      return ingredient;
    });
    setIngredients(updatedIngredients);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...recipe, name, ingredients, portions });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Recipe Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Portions:
        <input
          type="number"
          value={portions}
          onChange={(e) => setPortions(Number(e.target.value))}
          required
          min="1"
        />
      </label>
      <h3>Ingredients (all amounts in grams):</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, "name", e.target.value)
            }
            placeholder="Ingredient name"
            required
          />
          <input
            type="number"
            value={ingredient.amount}
            onChange={(e) =>
              handleIngredientChange(index, "amount", e.target.value)
            }
            placeholder="Amount (g)"
            required
            min="0"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddIngredient}>
        Add Ingredient
      </button>
      <button type="submit">Save Recipe</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default RecipeForm;
