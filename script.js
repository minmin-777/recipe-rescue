// HTML要素を取得
const searchButton = document.getElementById('search-button');
const ingredientInputs = document.querySelectorAll('.input-area input');
const recipeGrid = document.getElementById('recipe-grid');
const loader = document.getElementById('loader');

let allRecipes = [];

// ダミー画像URLのリスト
const dummyImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGZvb2R8ZW58MHx8fHwxNjI5MDk5MzY0&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZvb2R8ZW58MHx8fHwxNjI5MDk5MzY0&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDR8fGZvb2R8ZW58MHx8fHwxNjI5MDk5MzY0&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1484723051597-626151182a54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDd8fGZvb2R8ZW58MHx8fHwxNjI5MDk5MzY0&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxmb29kfGVufDB8fHx8MTYyOTA5OTM2NA&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEzfHxmb29kfGVufDB8fHx8MTYyOTA5OTM2NA&ixlib=rb-1.2.1&q=80&w=400'
];

async function loadRecipes() {
    // 省略（以前のコードと同じ）
    try {
        const response = await fetch('cooking_data_1000.csv');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.text();
        const rows = data.split('\n').filter(row => row.trim() !== '');
        rows.shift();
        allRecipes = rows.map(rowStr => {
            const row = rowStr.split(',');
            return { name: row[3], ingredients: [row[4], row[5], row[6], row[7]].filter(i => i && i.trim() !== '') };
        });
    } catch (e) {
        console.error("レシピデータの読み込みに失敗:", e);
    }
}

loadRecipes();

searchButton.addEventListener('click', () => {
    const inputIngredients = Array.from(ingredientInputs).map(input => input.value.trim()).filter(i => i);
    if (inputIngredients.length === 0) return;

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

                const img = document.createElement('img');
                img.src = dummyImages[index % dummyImages.length]; // ダミー画像を順番に使う
                img.alt = recipe.name;

                const name = document.createElement('div');
                name.className = 'recipe-name';
                name.textContent = recipe.name;

                card.appendChild(img);
                card.appendChild(name);
                recipeGrid.appendChild(card);
            });
        } else {
            recipeGrid.innerHTML = '<p>該当するレシピは見つかりませんでした。</p>';
        }
    }, 500);
});