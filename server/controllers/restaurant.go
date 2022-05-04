package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

// func enableCors(w *http.ResponseWriter) {
// (*w).Header().Set("Access-Control-Allow-Origin", "*")
// }

func GetRestaurants(w http.ResponseWriter, r *http.Request) {

	termArr := strings.Split(r.URL.Query().Get("term"), " ")
	term := strings.Join(termArr, "+")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	rating := r.URL.Query().Get("rating")
	token := os.Getenv("YELP_API_KEY")
	header := fmt.Sprintf("Bearer %v", token)
	var url string
	if term != "" {
		url = fmt.Sprintf("https://api.yelp.com/v3/businesses/search?location=USA&term=%v&categories=food,restaurants&limit=30&offset=%v", term, page*30)

	} else {
		url = fmt.Sprintf("https://api.yelp.com/v3/businesses/search?location=USA&categories=food,restaurants&limit=30&offset=%v", page*30)
	}

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	req, err1 := http.NewRequest("GET", url, nil)
	if err1 != nil {
		log.Fatal(err1)
	}
	req.Header.Add("Authorization", header)

	res, err2 := client.Do(req)
	if err2 != nil {
		log.Fatal(err2)
	}

	var resp map[string]interface{}

	err4 := json.NewDecoder(res.Body).Decode(&resp)
	if err4 != nil {
		log.Fatal(err4)
	}

	var data map[string]interface{}
	total := resp["total"].(float64)
	businesses := resp["businesses"].([]interface{})
	if rating != "" {
		ratingNum, _ := strconv.ParseFloat(rating, 64)

		var newBusinesses []interface{}
		for _, v := range businesses {
			val := v.(map[string]interface{})
			bRating := val["rating"].(float64)
			if bRating >= ratingNum {
				newBusinesses = append(newBusinesses, v)
			}
		}

		if len(newBusinesses) > 1000 {
			data = map[string]interface{}{"data": newBusinesses, "total": 1000}
		} else {
			data = map[string]interface{}{"data": newBusinesses, "total": len(newBusinesses)}
		}
	} else {
		if total > 1000 {
			data = map[string]interface{}{"data": businesses, "total": 1000}
		} else {
			data = map[string]interface{}{"data": businesses, "total": total}
		}
	}
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(data)
}

func GetBars(w http.ResponseWriter, r *http.Request) {
	termArr := strings.Split(r.URL.Query().Get("term"), " ")
	term := strings.Join(termArr, "+")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	rating := r.URL.Query().Get("rating")
	token := os.Getenv("YELP_API_KEY")
	header := fmt.Sprintf("Bearer %v", token)
	var url string
	if term != "" {
		url = fmt.Sprintf("https://api.yelp.com/v3/businesses/search?location=USA&term=%v&categories=beergardens,bars&limit=30&offset=%v", term, page*30)

	} else {
		url = fmt.Sprintf("https://api.yelp.com/v3/businesses/search?location=USA&term=bars&categories=beergardens,bars&limit=30&offset=%v", page*30)
	}

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	req, err1 := http.NewRequest("GET", url, nil)
	if err1 != nil {
		log.Fatal(err1)
	}
	req.Header.Add("Authorization", header)
	res, err2 := client.Do(req)
	if err2 != nil {
		log.Fatal(err2)
	}

	var resp map[string]interface{}

	err4 := json.NewDecoder(res.Body).Decode(&resp)
	if err4 != nil {
		log.Fatal(err4)
	}

	defer res.Body.Close()

	var data map[string]interface{}
	total := resp["total"].(float64)
	businesses := resp["businesses"].([]interface{})
	if rating != "" {
		ratingNum, _ := strconv.ParseFloat(rating, 64)

		var newBusinesses []interface{}
		for _, v := range businesses {
			val := v.(map[string]interface{})
			bRating := val["rating"].(float64)
			if bRating >= ratingNum {
				newBusinesses = append(newBusinesses, v)
			}
		}

		if len(newBusinesses) > 1000 {
			data = map[string]interface{}{"data": newBusinesses, "total": 1000}
		} else {
			data = map[string]interface{}{"data": newBusinesses, "total": len(newBusinesses)}
		}
	} else {
		if total > 1000 {
			data = map[string]interface{}{"data": businesses, "total": 1000}
		} else {
			data = map[string]interface{}{"data": businesses, "total": total}
		}
	}
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(data)
}

func GetHotels(w http.ResponseWriter, r *http.Request) {
	termArr := strings.Split(r.URL.Query().Get("term"), " ")
	term := strings.Join(termArr, "+")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	rating := r.URL.Query().Get("rating")
	token := os.Getenv("YELP_API_KEY")
	header := fmt.Sprintf("Bearer %v", token)
	var url string
	if term != "" {
		url = fmt.Sprintf("https://api.yelp.com/v3/businesses/search?location=USA&term=%v&categories=hotels&limit=30&offset=%v", term, page*30)

	} else {
		url = fmt.Sprintf("https://api.yelp.com/v3/businesses/search?location=USA&term=hotels&categories=hotels&limit=30&offset=%v", page*30)
	}

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	req, err1 := http.NewRequest("GET", url, nil)
	if err1 != nil {
		log.Fatal(err1)
	}
	req.Header.Add("Authorization", header)
	res, err2 := client.Do(req)
	if err2 != nil {
		log.Fatal(err2)
	}

	var resp map[string]interface{}

	err4 := json.NewDecoder(res.Body).Decode(&resp)
	if err4 != nil {
		log.Fatal(err4)
	}

	defer res.Body.Close()

	var data map[string]interface{}
	total := resp["total"].(float64)
	businesses := resp["businesses"].([]interface{})
	if rating != "" {
		ratingNum, _ := strconv.ParseFloat(rating, 64)

		var newBusinesses []interface{}
		for _, v := range businesses {
			val := v.(map[string]interface{})
			bRating := val["rating"].(float64)
			if bRating >= ratingNum {
				newBusinesses = append(newBusinesses, v)
			}
		}

		if len(newBusinesses) > 1000 {
			data = map[string]interface{}{"data": newBusinesses, "total": 1000}
		} else {
			data = map[string]interface{}{"data": newBusinesses, "total": len(newBusinesses)}
		}
	} else {
		if total > 1000 {
			data = map[string]interface{}{"data": businesses, "total": 1000}
		} else {
			data = map[string]interface{}{"data": businesses, "total": total}
		}
	}
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(data)
}

func SearchAutocomplete(w http.ResponseWriter, r *http.Request) {
	token := os.Getenv("YELP_API_KEY")
	header := fmt.Sprintf("Bearer %v", token)
	url := fmt.Sprintf("https://api.yelp.com/v3/autocomplete?text=%v", r.URL.Query().Get("text"))

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	req, err1 := http.NewRequest("GET", url, nil)
	if err1 != nil {
		log.Fatal(err1)
	}
	req.Header.Add("Authorization", header)
	res, err2 := client.Do(req)
	if err2 != nil {
		log.Fatal(err2)
	}

	var resp map[string]interface{}

	err4 := json.NewDecoder(res.Body).Decode(&resp)
	if err4 != nil {
		log.Fatal(err4)
	}

	defer res.Body.Close()

	categories := resp["categories"].([]interface{})
	terms := resp["terms"].([]interface{})
	var texts []map[string]interface{}

	// fmt.Printf("%v \n", categories)

	for _, v := range categories {
		t := v.(map[string]interface{})
		texts = append(texts, t)
	}

	for _, v := range terms {
		t := v.(map[string]interface{})
		texts = append(texts, t)
	}

	data := map[string]interface{}{"data": resp, "terms": texts}

	w.WriteHeader(200)
	json.NewEncoder(w).Encode(data)
}

func GetBusiness(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	token := os.Getenv("YELP_API_KEY")
	header := fmt.Sprintf("Bearer %v", token)
	url1 := fmt.Sprintf("https://api.yelp.com/v3/businesses/%v", id)
	url2 := fmt.Sprintf("https://api.yelp.com/v3/businesses/%v/reviews", id)

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	req1, err1 := http.NewRequest("GET", url1, nil)
	if err1 != nil {
		log.Fatal(err1)
	}
	req2, err2 := http.NewRequest("GET", url2, nil)
	if err2 != nil {
		log.Fatal(err2)
	}

	req1.Header.Add("Authorization", header)
	req2.Header.Add("Authorization", header)

	res1, err3 := client.Do(req1)
	if err3 != nil {
		log.Fatal(err3)
	}
	res2, err4 := client.Do(req2)
	if err4 != nil {
		log.Fatal(err4)
	}

	var resp1 map[string]interface{}
	var resp2 map[string]interface{}

	err7 := json.NewDecoder(res1.Body).Decode(&resp1)
	if err7 != nil {
		log.Fatal(err7)
	}
	err8 := json.NewDecoder(res2.Body).Decode(&resp2)
	if err8 != nil {
		log.Fatal(err8)
	}

	defer res1.Body.Close()
	defer res2.Body.Close()

	data := map[string]interface{}{"restaurant": resp1, "reviews": resp2["reviews"]}

	w.WriteHeader(200)
	json.NewEncoder(w).Encode(data)
}
