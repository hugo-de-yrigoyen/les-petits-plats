async function getList() {
  return fetch("../data/recipes.json")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (recipes) {
      let recipe = recipes;

      let ingredients = [
        ...new Set(
          recipes.flatMap((recipe) => {
            return recipe["ingredients"].map((e) => e["ingredient"]);
          })
        ),
      ];
      let ustensils = [
        ...new Set(
          recipes.flatMap((recipe) => {
            return recipe["ustensils"];
          })
        ),
      ];
      let appliances = [
        ...new Set(
          recipes.map((recipe) => {
            return recipe["appliance"];
          })
        ),
      ];

      return {
        recipe: recipe,
        ingredients: ingredients,
        ustensils: ustensils,
        appliances: appliances,
      };
    })
    .catch(function (err) {
      console.log(err);
    });
}

async function init() {
  try {
    const jsonInfos = await getList();
    const recipe = jsonInfos.recipe;
    const ingredients = jsonInfos.ingredients;
    const ustensils = jsonInfos.ustensils;
    const appliances = jsonInfos.appliances;

    let ingredientsFiltered = "lait de coco"
    let recipeFiltered = recipe.map((r) => {
      r.ingredient.contains(ingredientsFiltered) //changer contains
    })
  } catch (error) {
    console.log("Erreur :", error);
  }
}

init();

// let r = function getList2() {};
// let u = function getUstensils(r) {};
// let i = function getIngredients(r) {};
// let a = function getAppareils(r) {};
// // on rajoute un filtre
// let rf = function getListFiltered(filter) {};
// let uf = function getUstensils(rf) {};
// let iff = function getIngredients(rf) {};
// let af = function getAppareils(rf) {};

// let ua = function getSelectedElements(id) {};
// function generateList(ua, uf) {}
