import React, { Suspense, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { AddAPhotoOutlined, Person } from "@mui/icons-material";
import axios from "axios";
import { StarRating, AddStarRating } from "./accessories/StarRating";
import { useParams } from "react-router-dom";
const Map = React.lazy(() => import("./accessories/Map"));

const RestaurantDetails = () => {
  const params = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/restaurants/${params.id}`, {
          cancelToken: source.token,
        });
        if (mounted) {
          console.log(data);
          setRestaurant(data.restaurant);
          setReviews(data.reviews);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
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
  }, [params.id]);

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <section className="restaurant-details">
        {isLoading ? (
          <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
            <CircularProgress size="30px" thickness={4} />
          </div>
        ) : (
          <>
            <div className="details-img-grid">
              <div>
                <img src={restaurant.image_url} alt="" />
              </div>
              <div>
                <img src={restaurant.image_url} alt="" />
              </div>
              <div>
                <AddAPhotoOutlined fontSize="large" style={{ color: "rgba(0,0,0,0.7)" }} />
              </div>
            </div>

            <div className="details-name">
              <div>
                <h4>{restaurant.name}</h4>
                <div className="categories">
                  {restaurant.categories.map((x, idx) =>
                    idx === restaurant.categories.length - 1 ? (
                      <p key={idx}>{x.title}</p>
                    ) : (
                      <p key={idx}>{x.title},</p>
                    )
                  )}
                </div>
                <p>{restaurant.location.address1 + ", " + restaurant.location.city}</p>
                <div className="map-con">
                  <Suspense
                    fallback={
                      <div className="cen-grid">
                        <CircularProgress size="30px" thickness={4} />
                      </div>
                    }
                  >
                    <Map
                      id={"map"}
                      latLng={{ lat: restaurant.coordinates.latitude, lng: restaurant.coordinates.longitude }}
                    />
                  </Suspense>
                </div>
              </div>
              <div>
                <div>
                  <StarRating value={restaurant.rating} />
                  <p>{restaurant.rating}</p>
                </div>
                <p>{restaurant.review_count} Reviews</p>
              </div>
            </div>

            <div className="reviews">
              <h4>Reviews</h4>
              <hr className="hr-xl" />
              <div>
                <div>
                  {reviews.map((review) => (
                    <div key={review.id} className="review">
                      <div className="review-dp">
                        <div>
                          {review.user.image_url ? (
                            <img src={review.user.image_url} alt="" />
                          ) : (
                            <Person style={{ color: "#cfcfcf", fontSize: "30px" }} />
                          )}
                        </div>
                        <div>
                          <p>{review.user.name}</p>
                          <p>{review.time_created}</p>
                        </div>
                      </div>
                      <div>
                        <StarRating value={review.rating} />
                        <p>{review.rating}</p>
                      </div>
                      <p>{review.text}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="add-review">
                    <h4>Rate your experience</h4>
                    <div>
                      <AddStarRating size="large" />
                    </div>
                    <p onClick={() => {}}>Write a Review</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default RestaurantDetails;
