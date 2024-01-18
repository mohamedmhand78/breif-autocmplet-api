const endpoint = "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";
const cities = [];
const stateSelect = document.getElementById("state");
const searchInput = document.getElementById("city");
const suggestions = document.querySelector(".suggestions");

fetch(endpoint)
  .then((blob) => blob.json())
  .then((data) => {
    cities.push(...data);
    populateStateOptions();
  });

function populateStateOptions() {
  const states = [...new Set(cities.map(city => city.state))];

  states.forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  stateSelect.addEventListener("change", displayMatches);
  searchInput.addEventListener("keyup", displayMatches);
}

function findMatches(keyword, selectedState) {
  const regex = new RegExp(keyword, "gi");
  return cities.filter((place) => {
    return (
      (place.city.match(regex) || place.state.match(regex)) &&
      (!selectedState || place.state === selectedState)
    );
  });
}

function displayMatches() {
  const selectedState = stateSelect.value;
  const matchArray = findMatches(searchInput.value, selectedState);
  const html = matchArray.map((place) => {
    const regex = new RegExp(searchInput.value, "gi");
    const cityName = place.city.replace(
      regex,
      `<span class="highlight">${searchInput.value}</span>`
    );
    

    return `<li>
      <span class="name">${cityName}</span>
    </li>`;
  }).join("");

  suggestions.innerHTML = html;
}