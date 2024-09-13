function getList(arg) {
  let list = [];

  return fetch(
    "https://hugo-de-yrigoyen.github.io/les-petits-plats/data/photographers.js"
  )
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      list = [...value.arg];
      return list;
    })
    .catch(function (err) {
      console.log(err);
    });
}

console.log(getList("name"));
