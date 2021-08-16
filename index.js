let place = [];
let airportId = [];
const AddHere = document.querySelector("#main");
const finalResults = document.querySelector("#final-results");
const ResultsMessage = document.querySelector("#results-message");
const titleAction = document.querySelector("#title-action");
const wrapper = document.querySelector("#wrapper");
const clearButton = document.querySelector(".checker");
let innerSearch = document.querySelector("#search");
let innerSearch2 = document.querySelector("#search2");
let message = document.createElement("p");
message.innerHTML = "Here are your departure airports, choose one!";
let userChoice;
let aid;
innerSearch.placeholder = "What city are you flying from?";

const runner = {
  departingDate: "",
  startingChoice: "",
  arriveChoice: "",
  departingChoice: "",
  arrivalChoice: "",

  triggerWhereFrom: function triggerWhereFrom(starting) {
    fetch(
      `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/FR/GBP/en-GB/?query=${starting}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
          "API-KEY-HERE",
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        places = [...data.Places];
        places.forEach((element) => {
          let child = document.createElement("li");
          child.addEventListener("click", function () {
            userChoice = airportId[child.id - 1];
            departingChoice = userChoice;
            form.classList.add("display");
            form2.classList.remove("display");
            titleAction.innerHTML = "";
          });
          child.onclick = function () {
            innerSearch.value = "";
            innerSearch2.placeholder = "Where are you flying to?";
            AddHere.innerHTML = "";
            message.innerHTML = "";
            titleAction.innerHTML = "Destination place";
            childOfWhere = document.createElement("p");
            AddHere.appendChild(childOfWhere);
            startingChoice = starting;
          };
          let x = 0;
          if (element.PlaceName.includes(`${starting}`)) {
            place.push(element.PlaceName);
            airportId.push(element.PlaceId);
          } else {
            return;
          }
          place.forEach((element) => {
            element = place[x];
            aid = airportId[x];
            x++;
            child.innerHTML = `${element} <br> ${aid.slice(0, -4)}`;
            child.id = x;
            AddHere.appendChild(child);
          });
        });
      })

      .catch((err) => {
        console.error(err);
      });
  },

  triggerWhereTo: function triggerWhereTo(arriving, starting) {
    fetch(
      `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/FR/GBP/en-GB/?query=${arriving}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
          "API-KEY-HERE",
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        places = [...data.Places];
        places.forEach((element) => {
          let child = document.createElement("li");
          child.addEventListener("click", function () {
            userChoice = airportId[child.id - 1];
            arriveChoice = arriving;
            arrivalChoice = userChoice;
            titleAction.innerHTML = "";
            form2.classList.add("display");
            wrapper.classList.remove("display");
            clearButton.addEventListener("click", function () {
              form3.classList.add("display");
            });
          });
          child.onclick = function () {
            AddHere.innerHTML = "";
            message.innerHTML = "";
          };
          let x = 0;
          if (element.PlaceName.includes(`${arriving}`)) {
            place.push(element.PlaceName);
            airportId.push(element.PlaceId);
          } else {
            return;
          }
          place.forEach((element) => {
            element = place[x];
            aid = airportId[x];
            x++;
            child.innerHTML = `${element} <br> ${aid.slice(0, -4)}`;
            child.id = x;
            AddHere.appendChild(child);
          });
        });
      })

      .catch((err) => {
        console.error(err);
      });
  },

  gatherAll: function gatherAll() {
    fetch(
      `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/FR/EUR/en-GB/${departingChoice}/${arrivalChoice}/${departingDate}?`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
          "API-KEY-HERE",
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let carriers = [...data.Carriers];
        if (carriers.length < 1) {
          alert("Sorry we did not find any flights!");
        }
        carriers = carriers.reverse();
        let chosenPlaces = [...data.Places];
        let quotes = [...data.Quotes];
        this.departingDate = quotes.departingDate;
        let showResults = document.createElement("p");
        showResults.innerHTML = `Here are the results for your departure from ${startingChoice} ${departingChoice} <br> and arriving in ${arriveChoice} ${arrivalChoice} on ${departingDate}`;

        carriers.forEach((carrier) => {
          let cards = document.createElement("div");
          cards.classList.add("card");
          cards.innerHTML = `Operator Name: ${carrier.Name}<br>`;
          finalResults.appendChild(cards);
        });

        let direct = "";
        quotes.forEach((element) => {
          let price = document.createElement("div");
          if (element.Direct == false) {
            direct = "No";
          } else {
            direct = "Yes";
          }
          price.innerHTML = `Price: ${element.MinPrice} € <br> Direct flight: ${direct}`;
          cards = document.querySelector(".card");
          cards.appendChild(price);
          finalResults.appendChild(cards);
          AddHere.appendChild(showResults);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let starting = search.value;
  starting = starting.charAt(0).toUpperCase() + starting.slice(1);

  if (starting) {
    runner.triggerWhereFrom(starting);
    ResultsMessage.appendChild(message);
  }
});

form2.addEventListener("submit", (e) => {
  e.preventDefault();

  let arriving = search2.value;
  arriving = arriving.charAt(0).toUpperCase() + arriving.slice(1);

  if (arriving) {
    runner.triggerWhereTo(arriving);
    ResultsMessage.appendChild(message);
  }
});

form3.addEventListener("submit", (e) => {
  e.preventDefault();

  departureDate = start.value;
  departingDate = departureDate;

  if (departureDate) {
    runner.gatherAll();
    ResultsMessage.appendChild(message);
  }
});
