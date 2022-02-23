package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/judennadi/flenjo-go/config"
	"github.com/judennadi/flenjo-go/models"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var reqBody models.User
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		fmt.Println("Couldn't parse body")
	}

	reqBody.HashPassword()
	user = reqBody.CreateUser()

	token := user.GenerateJWT()
	cookie1 := &http.Cookie{Name: "token", Value: token, Path: "/", HttpOnly: true, Expires: time.Now().Add(time.Hour * 12)}
	cookie2 := &http.Cookie{Name: "check", Value: "authorized", Path: "/", HttpOnly: false, Expires: time.Now().Add(time.Hour * 12)}

	http.SetCookie(w, cookie1)
	http.SetCookie(w, cookie2)
	w.WriteHeader(201)
	json.NewEncoder(w).Encode(map[string]interface{}{"data": user})
}

func Login(w http.ResponseWriter, r *http.Request) {
	db := config.GetDB()
	var reqBody models.User
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		fmt.Println("Couldn't parse body")
		return
	}

	findUser := `SELECT * FROM users Where email=$1;`
	err = db.QueryRow(findUser, reqBody.Email).Scan(&user.ID, &user.Name, &user.Username, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		w.WriteHeader(400)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Invalid Username or Password"})
		return
	}

	err = user.ComparePassword(reqBody.Password)
	if err != nil {
		w.WriteHeader(400)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Invalid Username or Password"})
		return
	}

	token := user.GenerateJWT()
	cookie1 := &http.Cookie{Name: "token", Value: token, Path: "/", HttpOnly: true, Expires: time.Now().Add(time.Hour * 12)}
	cookie2 := &http.Cookie{Name: "check", Value: "authorized", Path: "/", HttpOnly: false, Expires: time.Now().Add(time.Hour * 12)}

	http.SetCookie(w, cookie1)
	http.SetCookie(w, cookie2)
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(map[string]interface{}{"data": user})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	cookie1 := &http.Cookie{Name: "token", Value: "", Path: "/", HttpOnly: true, Expires: time.Now().Add(time.Second - 1)}
	cookie2 := &http.Cookie{Name: "check", Value: "", Path: "/", HttpOnly: false, Expires: time.Now().Add(time.Second - 1)}
	http.SetCookie(w, cookie1)
	http.SetCookie(w, cookie2)
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(map[string]interface{}{"user": "logged out"})

}
