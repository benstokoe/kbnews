const themes = [
  { name: "BOW", class: "light" },
  { name: "WOB", class: "dark" },
  { name: "DSA Milkshake", class: "milkshake" },
  { name: "Matt3o Susuwatari", class: "susuwatari" },
  { name: "GMK Modern Dolch", class: "modern-dolch" },
  { name: "GMK 8008", class: "gmk-8008" },
  { name: "GMK 9009", class: "gmk-9009" },
  { name: "GMK Red Samurai", class: "red-samurai" },
  { name: "GMK Laser", class: "laser" },
  { name: "SA Carbon", class: "carbon" },
  { name: "SA Bliss", class: "bliss" },
];

function compare(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

export default themes.sort(compare);
