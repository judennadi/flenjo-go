import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { locations } from "../../locations";
import { useDispatch } from "react-redux";
import { SET_RES_TERM, SET_BAR_TERM, SET_HOT_TERM } from "../../reducers/restaurants";

const AutoComplete = ({ restaurantSearch, setRestaurantSearch, isST, setIsST }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchTerms, setSearchTerms] = useState([]);
  // fuck

  const handleClick = (e) => {
    if (location.pathname === "/") {
      dispatch(SET_RES_TERM(e.currentTarget.childNodes[0].textContent));
    } else if (location.pathname === "/bars") {
      dispatch(SET_BAR_TERM(e.currentTarget.childNodes[0].textContent));
    } else if (location.pathname === "/hotels") {
      dispatch(SET_HOT_TERM(e.currentTarget.childNodes[0].textContent));
    }
    setSearchTerms([]);
    // if (location.pathname !== "/") history.push("/");
  };

  useEffect(() => {
    if (isST === false) {
      setTimeout(() => {
        document.querySelectorAll(".autocomplete-con ul").forEach((ul) => (ul.style.display = "none"));
      }, 1000);
    } else {
      document.querySelectorAll(".autocomplete-con ul").forEach((ul) => (ul.style.display = "block"));
    }
  }, [isST]);

  useEffect(() => {
    if (restaurantSearch.length >= 3) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/restaurants/search/autocomplete?text=${restaurantSearch}`);
          setSearchTerms(data.terms);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    } else if (!restaurantSearch) {
      setSearchTerms([]);
    } else {
      setSearchTerms([]);
    }
  }, [restaurantSearch]);

  return (
    <div className="autocomplete-con">
      <ul style={{ listStyle: "none" }}>
        {searchTerms.map((x, i) => (
          <li key={i} onClick={handleClick}>
            <p>{x.alias ? x.title : x.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const LocationAutoComplete = () => {
  const handleClick = (e) => {};

  return (
    <div className="loc-autocomplete-con">
      <ul style={{ listStyle: "none" }}>
        {locations.map((x, i) => (
          <li key={i} onClick={handleClick}>
            <p>{x}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// locations.forEach((x, i) => {
//   const location = x.split(", ");
//   console.log(location[0]);
// });

export default AutoComplete;
