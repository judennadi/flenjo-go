import { useState, useEffect } from "react";
import { Search, LocationOn, Person, ExpandMore, Cancel } from "@mui/icons-material";
import AutoComplete from "./AutoComplete";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_USER } from "../../reducers/auth";
import { SET_RES_TERM, SET_BAR_TERM, SET_HOT_TERM } from "../../reducers/restaurants";

const Nav = ({ location, navigate }) => {
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector((state) => state.auth);
  const [userLoc, setUserLoc] = useState(null);
  const [scroll, setScroll] = useState(false);
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [searchBar, setSearchBar] = useState(false);
  const [isST, setIsST] = useState(true);
  let mql = window.matchMedia("(max-width: 600px)");
  let prevScrollPos = window.pageYOffset;

  const myScroll = () => {
    let currentScrollPos = window.pageYOffset;
    let sticky;
    if (location.pathname === "/" || location.pathname === "/bars" || location.pathname === "/hotels") {
      sticky = document.querySelector(".sticky");
    }

    if (mql.matches) {
      if (prevScrollPos >= currentScrollPos) {
        if (sticky) {
          sticky.style.top = "0";
          setScroll(false);
        }
      } else {
        if (sticky) {
          sticky.style.top = "-54px";
          setScroll(true);
        }
      }
    }
    prevScrollPos = currentScrollPos;
  };

  const handleLogout = async () => {
    const res = await fetch("/auth/logout", { method: "GET" });
    if (res.status === 200) {
      dispatch(REMOVE_USER());
    }
  };

  const handleModal = () => {
    document.querySelector(".user-menu").classList.toggle("dep");
  };

  let currentFocus = -1;
  const handleKeyUp = (e) => {
    const list = document.querySelectorAll(".autocomplete-con ul li");
    const removeActive = (x) => {
      /* a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
      }
    };
    const addActive = (x) => {
      /* a function to classify an item as "active":*/
      if (!x) return false;
      /* start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      /* add class "autocomplete-active":*/
      x[currentFocus].classList.add("active");
    };

    if (list) {
      if (e.key === "Enter") {
        if (location.pathname === "/") {
          if (currentFocus > -1) {
            /* and simulate a click on the "active" item:*/
            list[currentFocus].click();
            dispatch(SET_RES_TERM(list[currentFocus].childNodes[0].textContent));
            setIsST(false);
            e.currentTarget.blur();
          } else {
            dispatch(SET_RES_TERM(e.target.value));
            setIsST(false);
            e.currentTarget.blur();
          }
        } else if (location.pathname === "/bars") {
          if (currentFocus > -1) {
            /* and simulate a click on the "active" item:*/
            list[currentFocus].click();
            dispatch(SET_BAR_TERM(list[currentFocus].childNodes[0].textContent));
            setIsST(false);
            e.currentTarget.blur();
          } else {
            dispatch(SET_BAR_TERM(e.target.value));
            setIsST(false);
            e.currentTarget.blur();
          }
        } else if (location.pathname === "/hotels") {
          if (currentFocus > -1) {
            /* and simulate a click on the "active" item:*/
            list[currentFocus].click();
            dispatch(SET_HOT_TERM(list[currentFocus].childNodes[0].textContent));
            setIsST(false);
            e.currentTarget.blur();
          } else {
            dispatch(SET_HOT_TERM(e.target.value));
            setIsST(false);
            e.currentTarget.blur();
          }
        }
      } else if (e.key === "ArrowUp") {
        currentFocus--;
        addActive(list);
      } else if (e.key === "ArrowDown") {
        currentFocus++;
        addActive(list);
      }
    }
  };

  const handleBlur = (e) => {
    setIsST(false);
  };

  const handleFocus = (e) => {
    setIsST(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    fetch("https://json.geoiplookup.io", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setUserLoc(data))
      .catch((err) => console.log(err));
  }, []);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
  //   function success(position) {
  //     console.log(position);
  //     let lat = position.coords.latitude;
  //     let lng = position.coords.longitude;
  //     console.log(lat, lng);
  //     // setUserGeoPos({ lat, lng });
  //   }
  //   function error(err) {
  //     console.log(err);
  //   }
  // }, []);

  useEffect(() => {
    window.addEventListener("scroll", myScroll);
    return () => {
      window.removeEventListener("scroll", myScroll);
    };
  });

  return (
    <>
      <nav>
        <div className="logo">
          <h1 style={{ letterSpacing: "-1px" }} onClick={() => navigate("/")}>
            FLENJO
          </h1>
        </div>
        <div className="nav-auth-sm" style={isAuth ? { background: "purple" } : null}>
          {!isAuth ? (
            <Link to="/login">
              <Person color="primary" />
            </Link>
          ) : (
            <p style={{ color: "#fff", fontWeight: "500" }}>{user?.email?.substring(0, 1).toUpperCase()}</p>
          )}
        </div>
        <div className="search-xl">
          <div className="input">
            <div className="input-icon">
              <LocationOn color="primary" />
            </div>
            <input
              type="text"
              defaultValue={userLoc && `${userLoc.region}, ${userLoc.country_name}`}
              disabled
              style={{ background: "#fff" }}
            />
          </div>
          <hr />
          <div className="input">
            <div className="input-icon">
              <Search />
            </div>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="cen-grid"
              style={{ width: "100%", paddingLeft: "5px", position: "relative" }}
            >
              <input
                type="text"
                value={restaurantSearch}
                placeholder="Search for restaurants, bars or hotels"
                onKeyUp={handleKeyUp}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => setRestaurantSearch(e.target.value)}
              />
              <AutoComplete
                restaurantSearch={restaurantSearch}
                setRestaurantSearch={setRestaurantSearch}
                isST={isST}
                setIsST={setIsST}
              />
            </form>
          </div>
        </div>
        <div className="nav-auth-xl">
          {!isAuth ? (
            <>
              <button className="login">
                <Link to="/login">Log in</Link>
              </button>
              <button className="signup">
                <Link to="/register">Sign up</Link>
              </button>
            </>
          ) : (
            <div
              style={{
                position: "relative",
                width: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleModal}
            >
              <div
                className="cen-grid"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "purple",
                }}
              >
                <p style={{ color: "#fff", fontWeight: "500", fontSize: "22px" }}>
                  {user?.email?.substring(0, 1).toUpperCase()}
                </p>
              </div>
              <p style={{ marginLeft: "6px" }}>
                <b>{user.name}</b>
              </p>
              <div className="input-icon">
                <ExpandMore />
              </div>
              <div className="user-menu dep">
                <ul>
                  <li>
                    <Link to="/user/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/user/bookmarks">Bookmarks</Link>
                  </li>
                  <li>
                    <Link to="/user/reviews">Reviews</Link>
                  </li>
                  <li>
                    <Link to="/user/settings">Settings</Link>
                  </li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div
        className="search-sm"
        style={scroll || searchBar ? { borderBottom: "none", height: "45px", transition: "0.5s" } : null}
      >
        {!scroll ? (
          <SearchSm
            restaurantSearch={restaurantSearch}
            setRestaurantSearch={setRestaurantSearch}
            searchBar={searchBar}
            setSearchBar={setSearchBar}
            handleKeyUp={handleKeyUp}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isST={isST}
            setIsST={setIsST}
            userLoc={userLoc}
          />
        ) : (
          <div className="search-bar">
            <input
              type="text"
              value={restaurantSearch}
              placeholder="Search for restaurants, bars or hotels"
              onKeyUp={handleKeyUp}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => setRestaurantSearch(e.target.value)}
            />
            <AutoComplete
              restaurantSearch={restaurantSearch}
              setRestaurantSearch={setRestaurantSearch}
              isST={isST}
              setIsST={setIsST}
            />
          </div>
        )}
      </div>
    </>
  );
};

// =============== SearchSm Component ===============
function SearchSm(props) {
  const {
    restaurantSearch,
    setRestaurantSearch,
    searchBar,
    setSearchBar,
    handleKeyUp,
    handleFocus,
    handleBlur,
    setIsST,
    isST,
    userLoc,
  } = props;
  return (
    <>
      {searchBar ? (
        <div className="search-bar">
          <div style={{ width: "100%", height: "100%", display: "relative" }}>
            <input
              type="text"
              value={restaurantSearch}
              placeholder="Search for restaurants, bars or hotels"
              onKeyUp={(e) => handleKeyUp(e)}
              onFocus={(e) => handleFocus(e)}
              onBlur={(e) => handleBlur(e)}
              onChange={(e) => setRestaurantSearch(e.target.value)}
            />
            <div
              style={{
                display: "inline-block",
                position: "absolute",
                top: "calc(50% - 8px)",
                right: "10px",
              }}
            >
              <Cancel size="small" style={{ color: "rgba(0,0,0,0.6)" }} onClick={() => setSearchBar(false)} />
            </div>
          </div>
          <AutoComplete
            restaurantSearch={restaurantSearch}
            setRestaurantSearch={setRestaurantSearch}
            isST={isST}
            setIsST={setIsST}
          />
        </div>
      ) : (
        <>
          <div className="location-sm">
            <div className="input-icon">
              <LocationOn color="primary" />
            </div>
            <p>{userLoc && `${userLoc.region}, ${userLoc.country_name}`}</p>
          </div>
          <div className="search-icon input-icon" onClick={() => setSearchBar(true)}>
            <Search />
          </div>
        </>
      )}
    </>
  );
}

export default Nav;
