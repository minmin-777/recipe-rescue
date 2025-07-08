// HTMLの要素を取得して、変数に保存しておく
const searchButton = document.getElementById('search-button');
const ingredient1 = document.getElementById('ingredient1');
const ingredient2 = document.getElementById('ingredient2');
const ingredient3 = document.getElementById('ingredient3');
const recipeList = document.getElementById('recipe-list');

// 読み込んだ全レシピを保存しておくための配列
let allRecipes = [];

// --- ▼ ここからが新しい部分 ▼ ---

// CSVファイルを読み込んで、使いやすい形に変換する関数
async function loadRecipes() {
    // CSVファイルをネットワーク経由で取得
    const response = await fetch('cooking_data_1000.csv');
    const data = await response.text();
    
    // CSVの各行を配列に分割し、ヘッダー（1行目）とデータ（2行目以降）を分ける
    const rows = data.split('\n');
    const header = rows[0].split(',');
    const body = rows.slice(1);

    // データを1行ずつ処理して、オブジェクトの配列に変換する
    allRecipes = body.map(rowStr => {
        const row = rowStr.split(',');
        return {
            id: row[0],
            categoryID: row[1],
            isMain: row[2],
            name: row[3],
            ingredients: [row[4], row[5], row[6], row[7]].filter(i => i) // 具材だけを配列に
        };
    });
    console.log('レシピデータの読み込み完了！', allRecipes);
}

// ページが読み込まれた時に、最初に1回だけレシピを読み込む
loadRecipes();

// --- ▲ ここまでが新しい部分 ▲ ---


// 検索ボタンがクリックされた時の処理
searchButton.addEventListener('click', () => {
    // 結果リストを空にする
    recipeList.innerHTML = '';

    // 入力された食材を取得し、空でなければ配列に入れる
    const inputIngredients = [
        ingredient1.value.trim(),
        ingredient2.value.trim(),
        ingredient3.value.trim()
    ].filter(i => i); // .trim()で余計な空白を削除

    // 入力された食材が1つもなければ、ここで処理を終了
    if (inputIngredients.length === 0) {
        recipeList.innerHTML = '<li>食材を1つ以上入力してください。</li>';
        return;
    }

    // --- ▼ 検索ロジックを本格的に変更 ▼ ---

    // 全レシピの中から、条件に合うものを探し出す
    const foundRecipes = allRecipes.filter(recipe => {
        // 入力された食材が「すべて」含まれているかチェックする
        return inputIngredients.every(inputIngredient => 
            recipe.ingredients.some(recipeIngredient => recipeIngredient.includes(inputIngredient))
        );
    });

    // 結果を表示する
    if (foundRecipes.length > 0) {
        foundRecipes.forEach(recipe => {
            const listItem = document.createElement('li');
            listItem.textContent = recipe.name;
            recipeList.appendChild(listItem);
        });
    } else {
        // 1件も見つからなかった場合
        recipeList.innerHTML = '<li>ごめんなさい、その組み合わせの料理は見つかりませんでした...</li>';
    }
});