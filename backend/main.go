package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Hub struct {
	clients   map[*websocket.Conn]bool
	broadcast chan []byte
	mutex     sync.Mutex
}

var hub = Hub{
	clients:   make(map[*websocket.Conn]bool),
	broadcast: make(chan []byte),
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Upgrade error: %v", err)
		return
	}
	defer conn.Close()

	hub.mutex.Lock()
	hub.clients[conn] = true
	hub.mutex.Unlock()

	fmt.Println("User Connected! Total users:", len(hub.clients))

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			hub.mutex.Lock()
			delete(hub.clients, conn)
			hub.mutex.Unlock()
			fmt.Println("User Disconnected")
			break
		}
		// Log what the server received
		fmt.Printf("Received: %s\n", string(msg))
		hub.broadcast <- msg
	}
}

func handleMessages() {
	for {
		msg := <-hub.broadcast
		hub.mutex.Lock()
		for client := range hub.clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				client.Close()
				delete(hub.clients, client)
			}
		}
		hub.mutex.Unlock()
	}
}

func main() {
	http.HandleFunc("/ws", handleConnections)
	go handleMessages()
	fmt.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}