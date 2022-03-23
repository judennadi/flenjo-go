package routes

import (
	"github.com/gorilla/mux"
	"github.com/judennadi/flenjo-go/controllers"
)

func AuthRoutes(router *mux.Router) {
	router.HandleFunc("/auth/login", controllers.Login).Methods("POST")
	router.HandleFunc("/auth/register", controllers.Register).Methods("POST")
	router.HandleFunc("/auth/logout", controllers.Logout).Methods("GET")
}
