Here it is:

# Ionic Store App – Backend Documentation

This repository contains a simple backend for the Ionic Store App.  
It is designed for demo and learning purposes, with no database required.  
Products and orders are stored in local `.json` files.

---

## How to Run

1. Install dependencies:
   ```bash
   npm install


Start the server:

node api/index.js


The backend will be available at:

http://localhost:3001


For Android emulators, replace localhost with 10.0.2.2 in your environment.ts.

Demo Credentials

Use the following credentials to log in:

Email: demo@demo.com

Password: 1234567

Endpoints Implemented
POST /auth/login

Authenticates a user and returns a token.

Request Body

{
  "email": "demo@demo.com",
  "password": "1234567"
}


Response

{
  "token": "your-jwt-token"
}

GET /products

Returns the list of all products.

Response

[
  {
    "id": 1,
    "sku": "ION-HOOD",
    "name": "Ionic Hoodie",
    "description": "Comfy dev hoodie",
    "price": 39.99,
    "imageUrl": "",
    "category": "Apparel",
    "stock": 25
  },
  {
    "id": 2,
    "sku": "ANG-STICK",
    "name": "Angular Stickers",
    "description": "Sheet of stickers",
    "price": 9.99,
    "imageUrl": "",
    "category": "Accessories",
    "stock": 100
  }
]

GET /products/:id

Returns a single product by ID.

Response

{
  "id": 1,
  "sku": "ION-HOOD",
  "name": "Ionic Hoodie",
  "description": "Comfy dev hoodie",
  "price": 39.99,
  "imageUrl": "",
  "category": "Apparel",
  "stock": 25
}

POST /orders

Creates a new order.

Request Body

{
  "items": [
    { "productId": 1, "qty": 2 },
    { "productId": 2, "qty": 1 }
  ],
  "shipping": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Bogotá",
    "country": "Colombia"
  }
}


Response

{
  "id": 1,
  "total": 89.97,
  "status": "pending",
  "createdAt": "2025-09-27T23:48:51.930Z",
  "userId": 123,
  "email": "demo@demo.com",
  "items": [
    {
      "productId": 1,
      "qty": 2,
      "price": 39.99,
      "name": "Ionic Hoodie"
    },
    {
      "productId": 2,
      "qty": 1,
      "price": 9.99,
      "name": "Angular Stickers"
    }
  ],
  "shipping": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Bogotá",
    "country": "Colombia"
  }
}

GET /orders

Returns all orders for the authenticated user.

Response

[
  {
    "id": 1,
    "total": 89.97,
    "status": "pending",
    "createdAt": "2025-09-27T23:48:51.930Z",
    "userId": 123,
    "email": "demo@demo.com",
    "items": [
      {
        "productId": 1,
        "qty": 2,
        "price": 39.99,
        "name": "Ionic Hoodie"
      },
      {
        "productId": 2,
        "qty": 1,
        "price": 9.99,
        "name": "Angular Stickers"
      }
    ],
    "shipping": {
      "name": "John Doe",
      "address": "123 Main St",
      "city": "Bogotá",
      "country": "Colombia"
    }
  }
]

GET /health

Health check endpoint.

Response

{
  "ok": true
}

Notes

No database required — all data is stored in .json files inside the project.

For Android emulators, always use http://10.0.2.2:3001 instead of http://localhost:3001.

This backend is meant for learning and demo purposes, not for production.


---

💡 That’s one single block, ready for copy–paste as `README.md`.  

Do you want me to also add a **Frontend README** with its commands (`ionic serve`, `ionic build`, etc.) in t