import "./App.css";
import axios from "axios";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [search, setSearch] = useState(""); //state variable to hold the search string
  const [suggestion, setSuggestion] = useState([]); //state variable to hold the suggestion list from fetch request, intially set to empty array
  const [isLoading, setIsLoading] = useState(false); //isLoading flag intially set to false and during fetch toggled to true
  const [debounceTimeout, setDebounceTimeout] = useState(null); //state variable to hold the debounce timer

  //API remote request to get the data
  const fetchSuggestion = async (search) => {
    console.log("Data fetch method is called");
    setIsLoading(true);

    try {
      const response = await axios.get(
        "https://dummyjson.com/product/category/groceries"
      );

      const filteredSuggestions = response.data.products.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );

      setSuggestion(filteredSuggestions);
    } catch (error) {
      console.error("Error in Fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Clear the previous timeout if there is one
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Set a new timeout to call the fetchSuggestion method after a delay (300ms)
    const timeout = setTimeout(() => {
      if (value) {
        fetchSuggestion(value);
      } else {
        setSuggestion([]); // Clear suggestions if input is empty
      }
    }, 300);

    // Save the timeout ID to clear it on the next change
    setDebounceTimeout(timeout);
  };

  const handleSuggestionClick = (suggestionTitle) => {
    setSearch(suggestionTitle);
    setSuggestion([]);
  };

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Auto Complete App</h3>

      <div className="d-flex justify-content-center mb-4 position-relative">
        {/* Search Input */}
        <input
          className="form-control w-50"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={search}
          // onChange={handleSearchChange}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchSuggestion(search);
          }}
        />

        {/* Suggestion List */}
        {suggestion.length > 0 && (
          <div className="position-absolute w-50 mt-1 list-group">
            {suggestion.map((item) => (
              <button
                key={item.id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSuggestionClick(item.title)}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
