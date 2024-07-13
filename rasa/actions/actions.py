from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

class ActionProvideInfo(Action):

    def name(self) -> Text:
        return "action_provide_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        info_type = tracker.get_slot('info_type')
        info_value = tracker.get_slot('info_value')
        user_id = tracker.sender_id  # Assuming user_id is the sender_id
        response = requests.post(f"http://localhost:5000/api/users/info", json={"user_id": user_id, "info_type": info_type, "info_value": info_value})
        if response.status_code == 200:
            dispatcher.utter_message(text=f"Your {info_type} has been updated.")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't update your information.")
        return []

class ActionBookSearch(Action):

    def name(self) -> Text:
        return "action_book_search"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        title = tracker.get_slot('title')
        author = tracker.get_slot('author')
        response = requests.get(f"http://localhost:5000/api/books/search", params={"title": title, "author": author})
        if response.status_code == 200:
            books = response.json()
            dispatcher.utter_message(text=f"Found the following books: {books}")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't find any books matching your search.")
        return []

class ActionOrderStatus(Action):

    def name() -> Text:
        return "action_order_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        order_id = tracker.get_slot('order_id')
        response = requests.get(f"http://localhost:5000/api/orders/status", params={"order_id": order_id})
        if response.status_code == 200:
            order_status = response.json().get('status')
            dispatcher.utter_message(text=f"Your order status is: {order_status}")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't retrieve the order status.")
        return []

class ActionAddToWishlist(Action):

    def name(self) -> Text:
        return "action_add_to_wishlist"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        title = tracker.get_slot('title')
        user_id = tracker.sender_id  # Assuming user_id is the sender_id
        response = requests.post(f"http://localhost:5000/api/wishlist", json={"user_id": user_id, "title": title})
        if response.status_code == 200:
            dispatcher.utter_message(text=f"{title} has been added to your wishlist.")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't add the book to your wishlist.")
        return []

class ActionRemoveFromWishlist(Action):

    def name(self) -> Text:
        return "action_remove_from_wishlist"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        title = tracker.get_slot('title')
        user_id = tracker.sender_id  # Assuming user_id is the sender_id
        response = requests.delete(f"http://localhost:5000/api/wishlist", json={"user_id": user_id, "title": title})
        if response.status_code == 200:
            dispatcher.utter_message(text=f"{title} has been removed from your wishlist.")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't remove the book from your wishlist.")
        return []

class ActionHandleComplaint(Action):

    def name(self) -> Text:
        return "action_handle_complaint"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        user_id = tracker.sender_id  # Assuming user_id is the sender_id
        complaint = tracker.latest_message.get('text')
        response = requests.post(f"http://localhost:5000/api/complaints", json={"user_id": user_id, "complaint": complaint})
        if response.status_code == 201:
            dispatcher.utter_message(text="Your complaint has been registered. We will get back to you shortly.")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't register your complaint.")
        return []

class ActionSellerLogin(Action):

    def name(self) -> Text:
        return "action_seller_login"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        email = tracker.get_slot('email')
        password = tracker.get_slot('password')
        response = requests.post("http://localhost:5000/api/sellers/login", json={"email": email, "password": password})
        if response.status_code == 200:
            dispatcher.utter_message(text="Login successful.")
        else:
            dispatcher.utter_message(text="Login failed. Please check your credentials.")
        return []

class ActionAddBook(Action):

    def name(self) -> Text:
        return "action_add_book"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        title = tracker.get_slot('title')
        author = tracker.get_slot('author')
        genre = tracker.get_slot('genre')
        description = tracker.get_slot('description')
        price = tracker.get_slot('price')
        isbn = tracker.get_slot('isbn')
        response = requests.post("http://localhost:5000/api/books", json={"title": title, "author": author, "genre": genre, "description": description, "price": price, "isbn": isbn})
        if response.status_code == 201:
            dispatcher.utter_message(text=f"Book '{title}' has been added to the catalog.")
        else:
            dispatcher.utter_message(text="Failed to add the book. Please try again.")
        return []

class ActionUpdateOrderStatus(Action):

    def name(self) -> Text:
        return "action_update_order_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        order_id = tracker.get_slot('order_id')
        status = tracker.get_slot('status')
        response = requests.post(f"http://localhost:5000/api/orders/update-status", json={"order_id": order_id, "status": status})
        if response.status_code == 200:
            dispatcher.utter_message(text=f"Order status has been updated to {status}.")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't update the order status.")
        return []

class ActionUpdateShipmentStatus(Action):

    def name(self) -> Text:
        return "action_update_shipment_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        order_id = tracker.get_slot('order_id')
        status = tracker.get_slot('status')
        response = requests.post(f"http://localhost:5000/api/shipments/update-status", json={"order_id": order_id, "status": status})
        if response.status_code == 200:
            dispatcher.utter_message(text=f"Shipment status has been updated to {status}.")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't update the shipment status.")
        return []

class ActionGetSellerDashboard(Action):

    def name(self) -> Text:
        return "action_get_seller_dashboard"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        seller_id = tracker.sender_id  # Assuming seller_id is the sender_id
        response = requests.get(f"http://localhost:5000/api/sellers/dashboard", params={"seller_id": seller_id})
        if response.status_code == 200:
            dashboard_info = response.json()
            dispatcher.utter_message(text=f"Dashboard Info: {dashboard_info}")
        else:
            dispatcher.utter_message(text="Sorry, I couldn't retrieve the dashboard information.")
        return []
