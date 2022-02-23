import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBackIos, ArrowForwardIos, ExpandMore } from "@mui/icons-material";
import beef from "../img/foods/beef.jpg";
import fish from "../img/foods/fish.jpg";
import chicken from "../img/foods/chicken.jpg";
import rice from "../img/foods/rice.jpg";
import seafood from "../img/foods/seafood.jpg";
import veggie from "../img/foods/veggies.jpg";
import burger from "../img/foods/burger.webp";
import cake from "../img/foods/cake.jpg";
import pizza from "../img/foods/pizza.webp";
import fries from "../img/foods/fries.webp";
import rolls from "../img/foods/rolls.webp";
import noodles from "../img/foods/noodles.png";
import deliverySec from "../img/nav/delivery-man (1).png";
import burgerking from "../img/brands/burgerking.webp";
import dominos from "../img/brands/dominos.webp";
import kfc from "../img/brands/kfc.webp";
import mcdelivery from "../img/brands/mcdelivery.webp";
import RestaurantCard from "./RestaurantCard";
import { CircularProgress, Button } from "@mui/material";
import Pagination from "./Pagination";
import axios from "axios";
import { SET_RES_TERM } from "../reducers/restaurants";

export const meals = [
  { name: "Chicken", img: chicken },
  { name: "Pizza", img: pizza },
  { name: "Rice", img: rice },
  { name: "Cake", img: cake },
  { name: "Fries", img: fries },
  { name: "Rolls", img: rolls },
  { name: "Burger", img: burger },
  { name: "Beef", img: beef },
  { name: "Seafood", img: seafood },
  { name: "Fish", img: fish },
  { name: "Veggie", img: veggie },
  { name: "Noodles", img: noodles },
];

const brands = [{ img: burgerking }, { img: dominos }, { img: kfc }, { img: mcdelivery }];

const Home = () => {
  const dispatch = useDispatch();
  const { term, isResSearch, rating } = useSelector((state) => state.restaurants);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const [isError, setIsError] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const mealRef = useRef([]);
  const promoRef = useRef([]);
  let mql = window.matchMedia("(max-width: 600px)");
  const mqXl = window.matchMedia("(min-width: 601px)");

  const isInViewport = (el) => {
    let bounding = el.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // const myScroll = () => {
  //   console.log(window.pageYOffset);
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", myScroll);
  //   return () => {
  //     window.removeEventListener("scroll", myScroll);
  //   };
  // });

  const handleClick = (e) => {
    const con = document.querySelector(".food-grid-con .grid-con");
    const btnIcon = e.currentTarget.childNodes[1];
    btnIcon.classList.toggle("rot");
    mealRef.current.forEach((meal, index) => {
      if (index > 5) {
        con.style.marginBottom = "0px";
        meal.classList.toggle("dep");
      }
    });

    if (mealRef.current[6].classList.contains("dep")) {
      con.style.marginBottom = "0px";
    } else {
      con.style.marginBottom = "20px";
    }
  };

  const handleSlide = (e) => {
    const len = mealRef.current.length;

    if (!isInViewport(mealRef.current[0])) {
      document.querySelector(".prev").style.display = "block";
    } else if (isInViewport(mealRef.current[0])) {
      document.querySelector(".prev").style.display = "none";
    }

    if (isInViewport(mealRef.current[len - 1])) {
      document.querySelector(".next").style.display = "none";
    } else if (!isInViewport(mealRef.current[len - 1])) {
      document.querySelector(".next").style.display = "block";
    }

    if (e.currentTarget.className === "next") {
      document.querySelector(".grid-con").scrollLeft += 270;
    } else if (e.currentTarget.className === "prev") {
      document.querySelector(".grid-con").scrollLeft -= 270;
    }
  };

  const selectMenu = (e) => {
    console.log(e.currentTarget.childNodes[1].childNodes[0].textContent);

    dispatch(SET_RES_TERM(e.currentTarget.childNodes[1].childNodes[0].textContent));
    setPage(1);
  };

  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      if (page <= 1 && !term) {
        setIsLoading(true);
        setIsSubLoading(false);
        setIsError(false);
      } else if (rating) {
        setIsSubLoading(true);
        setIsLoading(false);
        setIsError(false);
      } else {
        setIsSubLoading(true);
        setIsLoading(false);
        setIsError(false);
      }

      try {
        const { data } = await axios.get(
          `/api/restaurants?term=${term}&page=${page - 1}&rating=${rating ? rating : ""}`,
          {
            cancelToken: source.token,
          }
        );
        if (mounted) {
          setRestaurants(data.data);
          setTotal(data.total);
          setIsLoading(false);
          setIsSubLoading(false);
          setIsError(false);
          if (!term && page > 1) {
            if (mql.matches) {
              window.scrollTo(0, 620);
            } else {
              window.scrollTo(0, 775);
            }
          } else if (term) {
            window.scrollTo(0, 0);
          }
        }
      } catch (error) {
        if (mounted) {
          setIsError(true);
          setIsLoading(false);
          setIsSubLoading(false);
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
  }, [page, term, mql.matches, rating]);

  // api key
  // AIzaSyBpOkv8EmT8DTL1wnu7PAa7Xt-mRPe1gwQ

  return (
    <div className="container">
      {isLoading && !isSubLoading ? (
        <div className="loader">
          <CircularProgress size="40px" thickness={4} />
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
          {!isResSearch ? (
            <>
              <section className="food-inspire">
                <div className="food-grid-con">
                  <h4>Inspiration for your first order</h4>
                  <div className="grid-con">
                    {meals.map((meal, index) => (
                      <div
                        className={index > 5 ? "grid-item dep" : "grid-item"}
                        key={index}
                        onClick={selectMenu}
                        ref={(el) => {
                          mealRef.current[index] = el;
                        }}
                      >
                        <div>
                          <img src={meal.img} alt="" />
                        </div>
                        <div>
                          <p>{meal.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="prev" onClick={handleSlide}>
                    <ArrowBackIos />
                  </button>
                  <button className="next" onClick={handleSlide}>
                    <ArrowForwardIos />
                  </button>
                  <button className="coll-btn" onClick={handleClick}>
                    see more
                    <div className="input-icon">
                      <ExpandMore />
                    </div>
                  </button>
                </div>
              </section>

              <section className="brands container">
                <div className="app-promotion">
                  <div className="pro-exc" ref={(el) => (promoRef.current[0] = el)}>
                    <div>
                      <h4>Unlock exclusive offers</h4>
                      <p>
                        Enjoy up to <span style={{ color: "#ed5a6b" }}>50% off</span> on ordering <br /> from
                        the app
                      </p>
                      <button className="app-pro-btn">Use App</button>
                    </div>
                    <div>
                      <img src="" alt="" />
                    </div>
                  </div>
                  <div className="pro-del pro-dep" ref={(el) => (promoRef.current[1] = el)}>
                    <div>
                      <h4>Track delivery to your door</h4>
                      <p>
                        Live order tracking only on <br /> our app
                      </p>
                      <button className="app-pro-btn">Use App</button>
                    </div>
                    <div>
                      <img src={deliverySec} alt="" />
                    </div>
                  </div>
                </div>

                <div className="top-brands">
                  <h4>Top brands in spotlight</h4>
                  <div>
                    {brands.map((brand, index) => (
                      <div key={index}>
                        <img src={brand.img} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="best-food-list container">
                <h4>Best Restaurants within your location</h4>
                <div className="best-food-con">
                  {isSubLoading ? (
                    <div
                      className="cen-grid"
                      style={mqXl.matches ? { gridColumn: "2/3", height: "100px" } : { height: "100px" }}
                    >
                      <CircularProgress size="30px" thickness={4} />
                    </div>
                  ) : (
                    restaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} meals={meals} />
                    ))
                  )}
                </div>
                <div>
                  <Pagination page={page} total={total} setPage={setPage} />
                </div>
              </section>
            </>
          ) : (
            <section className="best-food-list container">
              <h4>{term ? `result: ${term[0].toUpperCase() + term.slice(1)}` : ""}</h4>
              <div className="best-food-con">
                {isSubLoading ? (
                  <div
                    className="cen-grid"
                    style={mqXl.matches ? { gridColumn: "2/3", height: "100px" } : { height: "100px" }}
                  >
                    <CircularProgress size="30px" thickness={4} />
                  </div>
                ) : (
                  restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} meals={meals} />
                  ))
                )}
              </div>
              <div>
                <Pagination page={page} total={total} setPage={setPage} />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
