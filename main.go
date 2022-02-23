package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/judennadi/flenjo-go/routes"
)

func main() {
	godotenv.Load()
	var router = mux.NewRouter().StrictSlash(true)
	routes.AuthRoutes(router)
	routes.RestaurantRoutes(router)
	http.Handle("/", router)
	port := fmt.Sprintf(":%v", os.Getenv("PORT"))
	log.Fatal(http.ListenAndServe(port, router))
}
