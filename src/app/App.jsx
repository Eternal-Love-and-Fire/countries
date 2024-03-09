import axios from "axios";
import { useEffect, useState } from "react";

export const App = () => {
  const [countriesList, setCountriesList] = useState(
    "Too many matches, specify another filter"
  );
  const [filteredCountries, setFilteredCountries] = useState([
    "Too many matches, specify another filter",
  ]);
  const [country, setCountry] = useState("");

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => response.data)
      .then((result) =>
        setCountriesList(result.map((country) => country.name.common))
      );
  }, []);

  const findCountry = (event) => {
    const value = event.target.value;

    const result = countriesList.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    const reslen = result.length;

    if (reslen > 10) {
      setCountry("");
      setFilteredCountries(["Too many matches, specify another filter"]);
    } else if (reslen <= 10 && reslen > 1) {
      setCountry("");
      setFilteredCountries(result);
    } else if (reslen === 1) {
      axios
        .get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${result[0]}`
        )
        .then((response) => response.data)
        .then((result) => {
          setCountry(result);
        });
    } else if (reslen === 0) {
      setCountry("");
      setFilteredCountries(["Not Found anything"]);
    }
    // axios
    //   .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${value}`)
    //   .then((response) => response.data)
    //   .then((result) => {
    //     console.log(result);
    //     setCountriesList(result);
    //   });
  };

  return (
    <div>
      <p>
        Find countries:
        <input
          type="text"
          name="country"
          onChange={(event) => findCountry(event)}
        />
      </p>
      <div>
        {country ? (
          <>
            <h1>{country.name.common}</h1>
            <div>
              <p>Capital: {country.capital[0]}</p>
              <p>Area: {country.area}</p>
            </div>
            <h3>Languages</h3>
            <ul>
              {Object.values(country.languages).map((lang, index) => (
                <li key={index}>{lang}</li>
              ))}
            </ul>
            <img src={country.flags.png} alt="" />
          </>
        ) : (
          <div>
            {filteredCountries.map((name) => {
              return <div key={name}>{name}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
