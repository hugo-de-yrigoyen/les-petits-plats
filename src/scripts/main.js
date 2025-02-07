async function getList() {
  return fetch("../data/recipes.json");
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getIngredients(recipes) {
  return [
    ...new Set(
      recipes.flatMap(({ ingredients }) =>
        ingredients.map(({ ingredient }) => capitalizeFirstLetter(ingredient.toLowerCase()))
      )
    ),
  ];
}

function getUstensils(recipes) {
  return [...new Set(recipes.flatMap(({ ustensils }) => ustensils.map((ustensil) => ustensil.toLowerCase())))].map(
    capitalizeFirstLetter
  );
}

function getAppliances(recipes) {
  return [
    ...new Set(
      recipes.map((recipe) => {
        return recipe["appliance"];
      })
    ),
  ];
}

function updateLists(recipes) {
  let ingredients = getIngredients(recipes);
  let ustensils = getUstensils(recipes);
  let appliances = getAppliances(recipes);

  return {
    ingredients: ingredients,
    ustensils: ustensils,
    appliances: appliances,
  };
}

function filter(ingredients) {
  let ingredientsFiltered = "lait de coco";
  return ingredients.map((ingredient) => {
    return !ingredient.includes(ingredientsFiltered);
  });
}

function searchIngredient() {
  searchBar = document.querySelector("#js-search-ingredient");
  searchBar.addEventListener("input", filter(ingredients));
}

function generateListElements(elArray, list) {
  list.innerHTML = "";
  elArray.forEach((element) => {
    const li = document.createElement("li");
    li.innerText = element;
    li.classList.add("py-2");
    list.appendChild(li);
  });
}

function createLI(recipes, element, list1, list2) {
  const li = document.createElement("li");
  li.innerText = element.innerText;
  li.classList.add("py-2");

  li.addEventListener("click", () => {
    const newLi = createLI(recipes, li, list2, list1);
    list2.appendChild(newLi);
    li.remove();
    generateRecipes(recipes);
  });

  return li;
}

function listManager(listHTML, list, recipes) {
  const listLi = listHTML.querySelectorAll("li");
  const selectedListHTML = listHTML.parentElement.querySelector(".js-dropdown-selected");
  const selectedListLi = selectedListHTML.querySelectorAll("li");
  let activeList = [];
  listLi.forEach((element) => {
    element.addEventListener("click", () => {
      //Create selected element
      const li = createLI(recipes, element, selectedListHTML, listHTML);
      selectedListHTML.appendChild(li);
      activeList.push(element.innerText);

      //Remove element from list
      const elIndex = list.indexOf(element.innerText);
      list.splice(elIndex, 1);
      element.remove();

      generateRecipes(recipes);
    });
  });

  selectedListLi.forEach((element) => {
    element.addEventListener("click", () => {
      //Create selected element
      const li = createLI(recipes, element, listHTML);
      listHTML.appendChild(li);
      list.push(element.innerText);

      //Remove element from list
      const elIndex = activeList.indexOf(element.innerText);
      activeList.splice(elIndex, 1);
      element.remove();

      generateRecipes(recipes);
    });
  });
}

function dropdownSearchInit(searchBarContainer, unselectedListHTML, filteredList, recipes) {
  const searchBar = searchBarContainer.querySelector(".js-search-bar");
  const searchBarErase = searchBarContainer.querySelector(".js-search-bar-erase");
  const searchBarSubmit = searchBarContainer.querySelector(".js-search-bar-submit");

  searchBarInit(searchBar, searchBarErase, searchBarSubmit, function () {
    dropdownSearchFilter(unselectedListHTML, filteredList, searchBar.value, recipes);
  });
}

function generateListContent(unselectedListLi, searchBar) {
  unselectedListLi.forEach((li) => {
    if (li.innerText.toLowerCase().includes(searchBar.value.toLowerCase())) {
      li.classList.remove("hidden");
    } else {
      li.classList.add("hidden");
    }
  });
}

function generateRecipes(recipes) {
  let activeElements = [];

  const searchBar = document.querySelector("#search-bar");
  const searchBarInput = searchBar.value.toLowerCase();
  if (searchBarInput.trim() !== "") {
    activeElements.push(searchBarInput);
  }

  const activeListsLi = document.querySelectorAll(".js-dropdown-selected li");
  activeListsLi.forEach((li) => {
    activeElements.push(li.innerText.toLowerCase());
  });

  const filteredRecipes = filterRecipes(recipes, activeElements);
  const uniqueFilteredRecipes = Array.from(new Set(filteredRecipes));

  updateDropdown(getIngredients, ".js-dropdown-selected", "#js-dropdown-ingredients", uniqueFilteredRecipes);
  listManager(document.querySelector("#js-dropdown-ingredients"), getIngredients(uniqueFilteredRecipes), recipes);

  updateDropdown(getAppliances, ".js-dropdown-selected", "#js-dropdown-appliances", uniqueFilteredRecipes);
  listManager(document.querySelector("#js-dropdown-appliances"), getAppliances(uniqueFilteredRecipes), recipes);

  updateDropdown(getUstensils, ".js-dropdown-selected", "#js-dropdown-ustensils", uniqueFilteredRecipes);
  listManager(document.querySelector("#js-dropdown-ustensils"), getUstensils(uniqueFilteredRecipes), recipes);

  generateRecipesHTML(uniqueFilteredRecipes);
}

function updateDropdown(getItemsFunction, selectedListClass, unselectedListId, recipes) {
  const selectedElements = new Set(
    Array.from(document.querySelectorAll(selectedListClass + " li")).map((li) => li.innerText)
  );

  const unselectedList = document.querySelector(unselectedListId);
  const filteredItems = getItemsFunction(recipes).filter((el) => !selectedElements.has(el));

  generateListElements(filteredItems, unselectedList);
}

function dropdownSearchFilter(unselectedList, filteredList, searchBarInput, recipes) {
  const selectedElements = Array.from(document.querySelectorAll(".js-dropdown-selected li")).map((li) => li.innerText);

  const searchFilteredList =
    searchBarInput.trim() === ""
      ? filteredList
      : filteredList.filter((el) => el.toLowerCase().includes(searchBarInput.toLowerCase()));

  const updatedList = searchFilteredList.filter((el) => !selectedElements.includes(el));

  generateListElements(updatedList, unselectedList);
  listManager(unselectedList, updatedList, recipes);
}

function filterRecipes(recipes, activeElements) {
  if (activeElements.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    return activeElements.every(
      (element) =>
        recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(element)) ||
        recipe.appliance.toLowerCase().includes(element) ||
        recipe.ustensils.some((ustensil) => ustensil.toLowerCase().includes(element))
    );
  });
}

function generateRecipesHTML(filteredRecipes) {
  const recipesContainer = document.querySelector("#js-recipes-container");
  recipesContainer.innerHTML = "";
  filteredRecipes.forEach((recipe) => {
    let section = document.createElement("section");
    section.classList.add("flex", "flex-col", "bg-white", "rounded-xl");

    let img = document.createElement("img");
    img.src = `images/recipes/${recipe.image}`;
    img.alt = recipe.name;
    img.classList.add("object-cover", "h-64", "w-full", "rounded-t-xl");
    section.appendChild(img);

    let textContainer = document.createElement("div");
    textContainer.classList.add("px-6", "pt-8", "pb-16");

    let h2 = document.createElement("h2");
    h2.classList.add("font-normal", "text-lg", "font-title", "mb-8");
    h2.innerText = recipe.name;
    textContainer.appendChild(h2);

    let recipeSubtitle = document.createElement("h3");
    recipeSubtitle.classList.add("text-xs", "font-bold", "text-custom-mid-grey", "mb-4", "font-paragraph");
    recipeSubtitle.innerText = "RECETTE";
    textContainer.appendChild(recipeSubtitle);

    let p = document.createElement("p");
    p.classList.add("text-sm", "font-normal", "mb-8", "font-paragraph");
    p.innerText = recipe.description;
    textContainer.appendChild(p);

    let ingredientsSubtitle = document.createElement("h3");
    ingredientsSubtitle.classList.add("text-xs", "font-bold", "text-custom-mid-grey", "mb-4", "font-paragraph");
    ingredientsSubtitle.innerText = "INGRÉDIENTS";
    textContainer.appendChild(ingredientsSubtitle);

    let ingredientsContainer = document.createElement("div");
    ingredientsContainer.classList.add("grid", "grid-cols-2", "gap-6", "font-paragraph");

    recipe.ingredients.forEach((ing) => {
      const ingredientBlock = document.createElement("div");

      let ingredientName = document.createElement("p");
      ingredientName.classList.add("font-medium", "font-paragraph");
      ingredientName.innerText = ing.ingredient;

      let ingredientQuantity = document.createElement("p");
      ingredientQuantity.classList.add("text-custom-mid-grey", "font-normal", "font-paragraph");
      ingredientQuantity.innerText =
        ing.quantity && ing.unit ? `${ing.quantity} ${ing.unit}` : ing.quantity ? ing.quantity : ing.unit || "";

      ingredientBlock.appendChild(ingredientName);
      ingredientBlock.appendChild(ingredientQuantity);
      ingredientsContainer.appendChild(ingredientBlock);
    });
    textContainer.appendChild(ingredientsContainer);
    section.appendChild(textContainer);
    recipesContainer.appendChild(section);
  });
}

function mainSearchInit(recipes) {
  const searchBar = document.querySelector("#search-bar");
  const searchBarErase = document.querySelector("#search-bar-erase");
  const searchBarSubmit = document.querySelector("#search-bar-submit");

  searchBarInit(searchBar, searchBarErase, searchBarSubmit, function () {
    generateRecipes(recipes);
  });
}

function searchBarInit(searchBar, searchBarErase, searchBarSubmit, search) {
  searchBar.addEventListener("input", () => {
    if (searchBar.value == "") {
      searchBarErase.classList.add("hidden");
    } else {
      searchBarErase.classList.remove("hidden");
    }
  });

  searchBarErase.addEventListener("click", () => {
    searchBar.value = "";
    searchBarErase.classList.add("hidden");
    search();
  });

  searchBarSubmit.addEventListener("click", () => {
    search();
  });
}

async function init() {
  try {
    const response = await getList();
    const recipes = await response.json();

    const ingredients = getIngredients(recipes);
    const unselectedIngredients = document.querySelector("#js-dropdown-ingredients");
    const ingredientsSearch = document.querySelector("#ingredients-search-bar");
    generateListElements(ingredients, unselectedIngredients);
    listManager(unselectedIngredients, ingredients, recipes);
    dropdownSearchInit(ingredientsSearch, unselectedIngredients, ingredients, recipes);

    const appliances = getAppliances(recipes);
    const unselectedAppliances = document.querySelector("#js-dropdown-appliances");
    const appliancesSearch = document.querySelector("#appliances-search-bar");
    generateListElements(appliances, unselectedAppliances);
    listManager(unselectedAppliances, appliances, recipes);
    dropdownSearchInit(appliancesSearch, unselectedAppliances, appliances, recipes);

    const ustensils = getUstensils(recipes);
    const unselectedUstensils = document.querySelector("#js-dropdown-ustensils");
    const ustensilsSearch = document.querySelector("#ustensils-search-bar");
    generateListElements(ustensils, unselectedUstensils);
    listManager(unselectedUstensils, ustensils, recipes);
    dropdownSearchInit(ustensilsSearch, unselectedUstensils, ustensils, recipes);

    mainSearchInit(recipes);

    generateRecipes(recipes);
  } catch (error) {
    console.log("Erreur :", error);
  }
}

init();
