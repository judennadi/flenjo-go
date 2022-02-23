import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import RestaurantCard from "./RestaurantCard";
import { CircularProgress, Button } from "@mui/material";
import Pagination from "./Pagination";
import { meals } from "./Home";

const Hotels = () => {
  const { term, isHotSearch, rating } = useSelector((state) => state.restaurants);
  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [isSubLoading, setIsSubLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const mqXl = window.matchMedia("(min-width: 601px)");

  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data } = await axios.get(
          `/api/restaurants/hotels?term=${term}&page=${page - 1}&rating=${rating ? rating : ""}`,
          {
            cancelToken: source.token,
          }
        );
        if (mounted) {
          setHotels(data.data);
          setTotal(data.total);
          setIsLoading(false);
          setIsError(false);
        }
      } catch (error) {
        if (mounted) {
          setIsError(true);
          setIsLoading(false);
          if (axios.isCancel(error)) {
            console.log("axios cancelled");
          } else {
            console.error(error);
          }
        }
      }
    };
    fetchData();

    return () => {
      mounted = false;
      source.cancel();
    };
  }, [page, term, rating]);

  return (
    <div className="container">
      <section className="nightlife container">
        {!isHotSearch ? (
          <section className="best-food-list container">
            {isLoading ? (
              <div
                className="cen-grid"
                style={mqXl.matches ? { gridColumn: "2/3", height: "100px" } : { height: "100px" }}
              >
                <CircularProgress size="30px" thickness={4} />
              </div>
            ) : isError ? (
              <div style={{ width: "100%", textAlign: "center" }}>
                <h4>Oops! something went wrong</h4>
                <br />
                <Button variant="contained" size="small" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            ) : (
              <>
                <h4>Hotels</h4>
                <div className="best-food-con">
                  {hotels.map((club) => (
                    <RestaurantCard key={club.id} restaurant={club} meals={meals} />
                  ))}
                </div>
                <div>
                  <Pagination page={page} total={total} setPage={setPage} />
                </div>
              </>
            )}
          </section>
        ) : (
          <section className="best-food-list container">
            {isLoading ? (
              <div
                className="cen-grid"
                style={mqXl.matches ? { gridColumn: "2/3", height: "100px" } : { height: "100px" }}
              >
                <CircularProgress size="30px" thickness={4} />
              </div>
            ) : isError ? (
              <div style={{ width: "100%", textAlign: "center" }}>
                <h4>Oops! something went wrong</h4>
              </div>
            ) : (
              <>
                <h4>{term ? `result: ${term[0].toUpperCase() + term.slice(1)}` : ""}</h4>
                <div className="best-food-con">
                  {hotels.map((club) => (
                    <RestaurantCard key={club.id} restaurant={club} meals={meals} />
                  ))}
                </div>
                <div>
                  <Pagination page={page} total={total} setPage={setPage} />
                </div>
              </>
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default Hotels;
