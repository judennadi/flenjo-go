package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func init() {
	godotenv.Load()
	database, err := sql.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatal(err)
	}

	err2 := database.Ping()
	if err2 != nil {
		log.Fatal(err2)
	}

	fmt.Println("Connected to DB")

	db = database
}

func GetDB() *sql.DB {
	return db
}
