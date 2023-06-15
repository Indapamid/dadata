const tokenDaData = 'f7dacb490b81b04b47b284c4f33b4667c6dc502f'
let itemsDaData
onInit()

async function onInit() {
  let searchText = document.querySelector(".container__search-input");
  searchText.addEventListener("keyup", searchCompanies)
  let serarchDiv = searchText.closest('div')
  let searchContainer = document.querySelector(".container");
  searchContainer.addEventListener("click", deletDescriptionSuggestion)
  let infoDiv = document.createElement('div')
  infoDiv.className = 'container__search-info'
  let suggestionDiv = document.createElement('div')
  suggestionDiv.className = 'container__search-suggestion'
  let descriptionDiv = document.createElement('div')
  descriptionDiv.className = 'container__search-description'
  infoDiv.append(suggestionDiv, descriptionDiv)
  serarchDiv.append(infoDiv)
}

onLoad()

async function onLoad() {

}

async function searchCompanies() {
  let searchText = document.getElementById("search_string").value;

  if (searchText.length > 3) {
    const res = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${tokenDaData}`
      },
      body: JSON.stringify({
        query: searchText,
        count: 20
      })
    })

    if (!res.ok) {
      throw new Error('Ошибка выполнения: ' + res.status + ': ' + res.statusText)
    }

    // const res = await fetch("/DaData.json")
    itemsDaData = await res.json()
    showSuggestions(itemsDaData.suggestions)
    console.log(itemsDaData.suggestions)
    // ViewContext.data.showsuggestions(items.suggestions)
  }
}

function showDescription(event) {
  let itemSuggestion = itemsDaData.suggestions[event.target.id].data
  let descriptionDiv = document.querySelector('.container__search-description');
  let descriptionBlockDiv = document.createElement('div')
  descriptionBlockDiv.className = 'container__search-description-block'
  descriptionBlockDiv.innerHTML = `${itemSuggestion.name ? itemSuggestion.name.full_with_opf ?? "" : ""}<br><br>
  ${itemSuggestion.inn ? 'ИНН ' + itemSuggestion.inn : ""}${itemSuggestion.kpp ? ', КПП  ' + itemSuggestion.kpp : ""}<br><br>
  ${itemSuggestion.address ? itemSuggestion.address.unrestricted_value ?? "" : ""}<br><br>
  ${itemSuggestion.okved ? 'ОКВЭД ' + itemSuggestion.okved : ""}`
  descriptionDiv.append(descriptionBlockDiv)
}

function deletDescription() {
  let descriptionDiv = document.querySelector('.container__search-description');
  descriptionDiv.innerHTML = ''
}

function deletDescriptionSuggestion() {
  deletSuggestion()
  deletDescription()
}

function suggestionSaveData(event) {
  deletSuggestion()
  deletDescription()
  console.log(itemsDaData.suggestions[event.target.id])
}

function deletSuggestion() {
  let suggestionsDiv = document.querySelector(".container__search-suggestion");
  suggestionsDiv.innerHTML = ''
}

function showSuggestions(suggestions) {
  let suggestionsDiv = document.querySelector(".container__search-suggestion");
  deletSuggestion()
  deletDescription()
  let suggestionsUl = document.createElement('ul')
  suggestionsUl.className = 'container__search-colum'
  suggestions.forEach((el, index) => {
    let suggestionLi = document.createElement('li')
    suggestionLi.className = 'container__search-row'
    suggestionLi.id = index
    suggestionLi.innerHTML = `${el.value ?? ""}<br>
    ${el.data.inn ? 'ИНН ' + el.data.inn : ""}${el.data.kpp ? ', КПП  ' + el.data.kpp : ""}`
    suggestionLi.addEventListener('mouseover', showDescription)
    suggestionLi.addEventListener('mouseout', deletDescription)
    suggestionLi.addEventListener('click', suggestionSaveData)
    suggestionsUl.append(suggestionLi)
  });
  suggestionsDiv.append(suggestionsUl)
}
