// HTML要素を取得
const searchForm = document.getElementById('search-form'); // form要素を取得
const ingredientInputs = document.querySelectorAll('.input-wrapper input');
const recipeGrid = document.getElementById('recipe-grid');
const loader = document.getElementById('loader');

let allRecipes = [];
const dummyImages = [ /* 画像の配列は変更なしなので省略 */ ];

async function loadRecipes() { /* 関数の中身は変更なしなので省略 */ }
loadRecipes();

// formの「submit」イベントを監視する
searchForm.addEventListener('submit', (event) => {
    // formのデフォルトの送信動作（ページリロード）をキャンセル
    event.preventDefault(); 
    
    const inputIngredients = Array.from(ingredientInputs).map(input => input.value.trim()).filter(i => i);
    if (inputIngredients.length === 0) {
        recipeGrid.innerHTML = '<p>食材を1つ以上入力してください。</p>';
        return;
    }

    recipeGrid.innerHTML = '';
    loader.classList.remove('hidden');

    setTimeout(() => {
        const foundRecipes = allRecipes.filter(recipe => 
            inputIngredients.every(inputIng => 
                recipe.ingredients.some(recipeIng => recipeIng.includes(inputIng))
            )
        );

        loader.classList.add('hidden');

        if (foundRecipes.length > 0) {
            foundRecipes.forEach((recipe, index) => {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                card.style.animationDelay = `${index * 0.1}s`;
                card.innerHTML = `
                    <img src="${dummyImages[index % dummyImages.length]}" alt="${recipe.name}">
                    <div class="recipe-name">${recipe.name}</div>
                `;
                recipeGrid.appendChild(card);
            });
        } else {
            recipeGrid.innerHTML = '<p>該当するレシピは見つかりませんでした。</p>';
        }
    }, 500);
});