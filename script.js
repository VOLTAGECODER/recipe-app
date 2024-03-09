document.addEventListener('DOMContentLoaded', () => {
    let currentRecipeContainer = null;

    const Searchbox = document.querySelector('.Searchbox');
    const Searchbtn = document.querySelector('.Searchbtn');
    const recipecontainer = document.querySelector('.recipecontainer');
    const recipeDetailsContent = document.querySelector('.recipe-details-content');
    const recipeCloseBtn = document.querySelector('.recipe-closebtn');

    const fetchRecipes = async (query) => {
        try {
            // Close existing recipe popup
            closeRecipePopup();

            recipecontainer.innerHTML = "<h2>Fetching Recipes</h2>";
            const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const response = await data.json();
            console.log(response);
            recipecontainer.innerHTML = "";

            response.meals.forEach((meal) => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> category</p>
                `;

                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                button.addEventListener('click', () => {
                    closeRecipePopup();
                    openRecipePopup(meal);
                });

                recipecontainer.appendChild(recipeDiv);
            });
        } catch (error) {
            recipecontainer.innerHTML = "<h2>Error In Fetching Recipes</h2>";
        }
    };

    const fetchIngredients = (meal) => {
        let ingredientList = "";
        for (let i = 1; i < 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient) {
                const measure = meal[`strMeasure${i}`];
                ingredientList += `<li>${measure} ${ingredient}</li>`;
            } else {
                break;
            }
        }
        return ingredientList;
    };

    const openRecipePopup = (meal) => {
        const recipeDetailsContent = document.querySelector('.recipe-details-content');
        recipeDetailsContent.innerHTML = `
            <h2 class="recipename">${meal.strMeal}</h2>
            <h3>Ingredients</h3>
            <ul class="ingredientslist">${fetchIngredients(meal)}</ul>
            <div class="recipeinstructions">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
        `;

        currentRecipeContainer = recipeDetailsContent.parentElement;
        currentRecipeContainer.style.display = "block";
    };

    const closeRecipePopup = () => {
        if (currentRecipeContainer) {
            currentRecipeContainer.style.display = "none";
        }
    };

    recipeCloseBtn.addEventListener('click', closeRecipePopup);

    Searchbtn.addEventListener('click', (e) => {
        e.preventDefault();

        const searchInput = Searchbox.value.trim();
        if (!searchInput) {
            recipecontainer.innerHTML = "<h2>Type the meal in the search box</h2>";
            return;
        }
        fetchRecipes(searchInput);
    });
});





