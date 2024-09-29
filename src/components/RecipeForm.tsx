import React, { useState, useRef, useEffect } from "react";

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
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe.ingredients
  );
  const [portions, setPortions] = useState(recipe.portions);
  const [calculatedPortions, setCalculatedPortions] = useState(recipe.portions);
  const newIngredientRef = useRef<HTMLInputElement>(null);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: 0, unit: "" }]);
  };

  useEffect(() => {
    if (ingredients.length > 0 && newIngredientRef.current) {
      newIngredientRef.current.focus();
    }
  }, [ingredients.length]);

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updatedIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setIngredients(updatedIngredients);
  };

  const handleSave = () => {
    onSave({ ...recipe, name, ingredients, portions });
  };

  const calculateAmount = (amount: number) => {
    return (amount * calculatedPortions) / portions;
  };

  return (
    <div className="recipe-form">
      <h2>{recipe.id ? "Edit Recipe" : "New Recipe"}</h2>
      <label>
        Recipe Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Portions:
        <input
          type="number"
          value={portions}
          onChange={(e) => setPortions(Number(e.target.value))}
          min="1"
        />
      </label>
      <h3>Ingredients:</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="ingredient-row">
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, "name", e.target.value)
            }
            placeholder="Ingredient name"
            ref={index === ingredients.length - 1 ? newIngredientRef : null}
          />
          <input
            type="number"
            value={ingredient.amount}
            onChange={(e) =>
              handleIngredientChange(index, "amount", Number(e.target.value))
            }
            placeholder="Amount"
          />
          <input
            type="text"
            value={ingredient.unit}
            onChange={(e) =>
              handleIngredientChange(index, "unit", e.target.value)
            }
            placeholder="Unit"
          />
          <button onClick={() => handleRemoveIngredient(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddIngredient}>Add Ingredient</button>
      <div>
        <button onClick={handleSave}>Save Recipe</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
      <div className="portion-calculator">
        <h3>Portion Calculator</h3>
        <label>
          Calculate for:
          <input
            type="number"
            value={calculatedPortions}
            onChange={(e) => setCalculatedPortions(Number(e.target.value))}
            min="1"
          />
          portions
        </label>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name}: {calculateAmount(ingredient.amount)}{" "}
              {ingredient.unit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeForm;
