package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/judennadi/flenjo-go/routes"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		// if we failed to get the absolute path respond with a 400 bad request
		// and stop
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// prepend the path with the path to the static directory
	path = filepath.Join(h.staticPath, r.URL.Path)

	// check whether a file exists at the given path
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		// file does not exist, serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		// if we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
	godotenv.Load()
	var router = mux.NewRouter().StrictSlash(true)
	routes.AuthRoutes(router)
	routes.RestaurantRoutes(router)

	if os.Getenv("APP_ENV") == "prod" {
		spa := spaHandler{staticPath: "client/build", indexPath: "index.html"}
		router.PathPrefix("/").Handler(spa)

	} else {
		router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			json.NewEncoder(w).Encode(map[string]string{"env": "Dev"})
		})
	}

	http.Handle("/", router)
	port := fmt.Sprintf(":%v", os.Getenv("PORT"))
	log.Fatal(http.ListenAndServe(port, router))
}
