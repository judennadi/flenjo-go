package models

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/judennadi/flenjo-go/config"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        uuid.UUID
	Name      string `json:"name,omitempty"`
	Username  string `json:"username,omitempty"`
	Email     string `json:"email,omitempty"`
	Password  string `json:"password,omitempty"`
	CreatedAt time.Time
}

func init() {
	db := config.GetDB()
	createTable := `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
		createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`

	_, err := db.Exec(createTable)
	if err != nil {
		fmt.Println(err)
	}
}

func (user User) CreateUser() User {
	db := config.GetDB()
	createStr := `INSERT INTO users (id, name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;`

	id, _ := uuid.NewRandom()
	row := db.QueryRow(createStr, id, user.Name, user.Username, user.Email, user.Password)

	err := row.Scan(&user.ID, &user.Name, &user.Username, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		log.Fatal(err)
	}

	return user
}

func (user User) HashPassword() {
	passwordByte, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	user.Password = string(passwordByte)
}

func (user User) ComparePassword(password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err
}

func (user User) GenerateJWT() string {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	newJwt := jwt.New(jwt.SigningMethodHS256)
	claims := newJwt.Claims.(jwt.MapClaims)
	claims["email"] = user.Email
	claims["exp"] = time.Now().Add(time.Hour * 12).Unix()

	token, _ := newJwt.SignedString(jwtSecret)

	return token
}
