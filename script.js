// HTML要素を取得
const searchButton = document.getElementById('search-button');
const ingredientInputs = document.querySelectorAll('.input-group input');
const recipeContainer = document.getElementById('recipe-list-container');
const loader = document.getElementById('loader');

let allRecipes = [];

// CSVファイルを読み込んで、使いやすい形に変換する関数
async function loadRecipes() {
    try {
        const response = await fetch('cooking_data_1000.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        
        const rows = data.split('\n').filter(row => row.trim() !== '');
        rows.shift(); // ヘッダー行を削除

        allRecipes = rows.map(rowStr => {
            const row = rowStr.split(',');
            return {
                id: row[0],
                categoryID: row[1],
                isMain: row[2],
                name: row[3],
                ingredients: [row[4], row[5], row[6], row[7]].filter(i => i && i.trim() !== '')
            };
        });
        console.log('レシピデータの読み込み完了！');
    } catch (e) {
        console.error("レシピデータの読み込みに失敗しました:", e);
        recipeContainer.innerHTML = '<p>エラー: レシピデータを読み込めませんでした。</p>';
    }
}

// ページ読み込み時にレシピをロード
loadRecipes();

// 検索ボタンのクリック処理
searchButton.addEventListener('click', () => {
    // 入力された食材を取得
    const inputIngredients = Array.from(ingredientInputs)
                                  .map(input => input.value.trim())
                                  .filter(i => i);

    if (inputIngredients.length === 0) {
        recipeContainer.innerHTML = '<p>食材を1つ以上入力してください。</p>';
        return;
    }

    // ローディング表示を開始
    recipeContainer.innerHTML = '';
    loader.classList.remove('hidden');

    // 検索処理を少し遅らせて、ローディングが見えるようにする
    setTimeout(() => {
        const foundRecipes = allRecipes.filter(recipe => {
            return inputIngredients.every(inputIngredient => 
                recipe.ingredients.some(recipeIngredient => recipeIngredient.includes(inputIngredient))
            );
        });

        // ローディング表示を終了
        loader.classList.add('hidden');

        // 結果を表示
        if (foundRecipes.length > 0) {
            foundRecipes.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.className = 'recipe-item';
                recipeElement.textContent = recipe.name;
                recipeContainer.appendChild(recipeElement);
            });
        } else {
            recipeContainer.innerHTML = '<p>ごめんなさい、その組み合わせの料理は見つかりませんでした...</p>';
        }
    }, 500); // 0.5秒後に検索結果を表示
});