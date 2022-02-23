package routes

import (
	"github.com/gorilla/mux"
	"github.com/judennadi/flenjo-go/controllers"
)

func RestaurantRoutes(router *mux.Router) {
	router.HandleFunc("/api/restaurants", controllers.GetRestaurants).Methods("GET")
	router.HandleFunc("/api/restaurants/bars", controllers.GetBars).Methods("GET")
	router.HandleFunc("/api/restaurants/hotels", controllers.GetHotels).Methods("GET")
	router.HandleFunc("/api/restaurants/search/autocomplete", controllers.SearchAutocomplete).Methods("GET")
	router.HandleFunc("/api/restaurants/{id}", controllers.GetBusiness).Methods("GET")
}
