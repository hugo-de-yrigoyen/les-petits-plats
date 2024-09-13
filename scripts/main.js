async function getList(el, subEl = null) {
  let list = [];

  return fetch("../data/recipes.json")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (recipes) {
      list = recipes.flatMap(recipe => {
        const value = recipe[el];
        
        if (Array.isArray(value)) {
          return subEl ? value.map(item => item[subEl]).filter(Boolean) : value;
        }
        
        return [value];
      })

      return [...new Set(list)];
    })
    .catch(function (err) {
      console.log(err);
    });
}

console.log(getList("name"));
console.log(getList("ingredients", "ingredient"));
console.log(getList("ustensils"));
console.log(getList("appliance"));