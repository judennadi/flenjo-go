import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { SET_RATING, CLEAR_RATING, CLEAR_TERM } from "../../reducers/restaurants";
import Nav from "./Nav";
import { SwapVert, FilterList, Cancel } from "@mui/icons-material";
import barPri from "../../img/nav/whiskey (1).png";
import barSec from "../../img/nav/whiskey.png";
import deliveryPri from "../../img/nav/delivery-man.png";
import deliverySec from "../../img/nav/delivery-man (1).png";
import hotelSec from "../../img/nav/hotel (1).png";
import hotelPri from "../../img/nav/hotel.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [imgSwap, setImgSwap] = useState("Delivery");
  const [scroll, setScroll] = useState(false);
  const [reset, setReset] = useState(false);
  const mqSm = window.matchMedia("(max-width: 600px)");
  const mqXl = window.matchMedia("(min-width: 601px)");

  const myScroll = () => {
    const filCon = document.querySelector(".filter-con");
    let currentScrollPos = window.scrollY;
    if (mqSm.matches) {
      if (0 >= currentScrollPos) {
        setScroll(false);
      } else {
        setScroll(true);
      }
    } else if (mqXl.matches && filCon) {
      if (currentScrollPos >= filCon.parentNode.offsetTop + 159) {
        filCon.classList.add("fil-sticky");
      } else {
        filCon.classList.remove("fil-sticky");
      }
    }
  };

  const navClick = (e, path) => {
    const li = e.currentTarget;
    setImgSwap(li.innerText);
    document.querySelector(".nav-menu .active").classList.remove("active");
    li.classList.add("active");
    navigate(path);
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    setReset(true);
    // setScroll(false);
    if (document.querySelector(".nav-menu ul")) {
      const ul = document.querySelector(".nav-menu ul").childNodes;

      ul.forEach((li, index) => {
        if (location.pathname === "/bars" && index === 1) {
          document.querySelector(".nav-menu .active").classList.remove("active");
          li.classList.add("active");
        } else if (location.pathname === "/hotels" && index === 2) {
          document.querySelector(".nav-menu .active").classList.remove("active");
          li.classList.add("active");
        } else if (location.pathname === "/" && index === 0) {
          document.querySelector(".nav-menu .active").classList.remove("active");
          li.classList.add("active");
        }
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    setReset(false);
  }, [reset]);

  useEffect(() => {
    window.addEventListener("scroll", myScroll);
    return () => {
      window.removeEventListener("scroll", myScroll);
    };
  });

  return (
    <div className="container">
      <header className={scroll ? "sticky" : ""}>
        <Nav location={location} navigate={navigate} />

        {location.pathname === "/" || location.pathname === "/bars" || location.pathname === "/hotels" ? (
          <>
            <div className="nav-menu">
              <ul>
                <li className="active" onClick={(e) => navClick(e, "/")}>
                  <div>
                    <img src={imgSwap === "Delivery" ? deliverySec : deliveryPri} alt="" />
                  </div>
                  <p>Delivery</p>
                </li>
                <li onClick={(e) => navClick(e, "/bars")}>
                  <div>
                    <img src={imgSwap === "Bars" ? barSec : barPri} alt="" />
                  </div>
                  <p>Bars</p>
                </li>
                <li onClick={(e) => navClick(e, "/hotels")}>
                  <div>
                    <img src={imgSwap === "Hotels" ? hotelSec : hotelPri} alt="" />
                  </div>
                  <p>Hotels</p>
                </li>
              </ul>
            </div>

            <hr className="nav-menu-hr" />

            <div className="filter-con">
              <Filters navigate={navigate} location={location} />
            </div>
            <div className="fil-scroll-backup"></div>
          </>
        ) : (
          <hr className="nav-menu-hr" style={{ marginTop: "5px" }} />
        )}
      </header>
      <div className="scroll-backup"></div>
    </div>
  );
};

// ================ Filter Component ================
function Filters({ navigate, location }) {
  const dispatch = useDispatch();
  const { term, isResSearch, isBarSearch, isHotSearch } = useSelector((state) => state.restaurants);
  const [filtNo, setFiltNo] = useState(0);

  const clearTerm = (e) => {
    dispatch(CLEAR_TERM());
    if (filtNo >= 1) {
      setFiltNo(filtNo - 1);
    } else {
      setFiltNo(0);
    }
    // navigate("/");
  };

  const handleRating = (e) => {
    e.currentTarget.classList.toggle("add-pri");
    if (e.currentTarget.classList.contains("add-pri")) {
      dispatch(SET_RATING(4));
      setFiltNo(filtNo + 1);
    } else {
      dispatch(CLEAR_RATING());
      if (filtNo >= 1) {
        setFiltNo(filtNo - 1);
      } else {
        setFiltNo(0);
      }
    }
  };
  return (
    <div>
      <ul>
        <li>
          {isResSearch || isBarSearch || isHotSearch ? (
            <div
              style={{
                background: "#ed5a6b",
                color: "#fff",
                marginRight: "4px",
                padding: "0 5px",
                borderRadius: "3px",
              }}
            >
              {filtNo + 1}
            </div>
          ) : (
            <div>
              {filtNo ? (
                <div
                  style={{
                    background: "#ed5a6b",
                    color: "#fff",
                    marginRight: "4px",
                    padding: "0 5px",
                    borderRadius: "3px",
                  }}
                >
                  {filtNo}
                </div>
              ) : (
                <FilterList />
              )}
            </div>
          )}
          <p>Filters</p>
        </li>
        {isResSearch || isBarSearch || isHotSearch ? (
          <li style={{ background: "#ed5a6b", color: "#fff" }} onClick={clearTerm}>
            <p>{term}</p>
            <div className="cen-grid" style={{ marginLeft: "4px" }}>
              <Cancel style={{ color: "#ddd" }} fontSize="small" />
            </div>
          </li>
        ) : (
          ""
        )}
        <li onClick={handleRating}>
          <p>Rating: 4.0+</p>
        </li>
        <li>
          <div>
            <SwapVert />
          </div>
          <p>Delivery Time</p>
        </li>
        <li>
          <p>Great Offers</p>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
