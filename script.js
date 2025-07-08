// HTMLの要素を取得して、変数に保存しておく
const searchButton = document.getElementById('search-button'); // 検索ボタン
const ingredient1 = document.getElementById('ingredient1');   // 1つ目の食材入力欄
const ingredient2 = document.getElementById('ingredient2');   // 2つ目の食材入力欄
const ingredient3 = document.getElementById('ingredient3');   // 3つ目の食材入力欄
const recipeList = document.getElementById('recipe-list');    // 結果を表示するリスト

// 検索ボタンがクリックされた時の処理を定義する
searchButton.addEventListener('click', () => {
    // ひとまず、結果リストを空にする
    recipeList.innerHTML = '';

    // 入力された食材を取得する
    const ingredients = [
        ingredient1.value,
        ingredient2.value,
        ingredient3.value
    ];

    // まずはテストとして、入力された食材をアラートで表示してみる
    alert(`あなたが入力した食材は「${ingredients.join('、')}」ですね！`);

    // 将来的には、ここにデータベースを検索する処理を書くことになります
    // 今回は仮のデータを表示してみましょう
    const dummyRecipes = ['豚の生姜焼き', '親子丼'];
    
    // 仮の料理名をリストに表示する
    dummyRecipes.forEach(recipe => {
        const listItem = document.createElement('li'); // li要素を作成
        listItem.textContent = recipe; // li要素に料理名を入れる
        recipeList.appendChild(listItem); // リストに追加する
    });
});