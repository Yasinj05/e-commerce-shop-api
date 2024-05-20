# E-Commerce Shop 🛍️

This is an E-Commerce platform backend developed using Express.js and TypeScript, with MongoDB for the database and Stripe for payment processing.

## Features

- **User Authentication**: JWT-based authentication for user login and registration.
- **Product Management**: Create, read, update, and delete products.
- **Cart Management**: Add, update, and remove items from the cart.
- **Order Management**: Place and manage orders.
- **Payment Processing**: Integrated with Stripe for secure payments.
- **Admin Functions**: Additional functionalities for admins to manage users, products, and orders.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- Stripe account for payment processing

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/e-commerce-shop-api.git
```

2. Navigate to the project directory:

```
cd e-commerce-shop-api
```

3. Install the dependencies:

```
npm install
```

4. Create a .env file in the root directory and add the following:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_KEY=your_stripe_secret_key
```

5. Compile TypeScript to JavaScript:

```
npm run build
```

6. Start the server:

```
npm start
```

### Running in Development Mode

To run the server in development mode with hot-reloading:

```
npm start dev
```

The API will be available at http://localhost:8000.

## API Endpoints

### User Endpoints

- **Create User:** `POST /api/users`
- **Update User:** `PUT /api/users/:id`
- **Delete User:** `DELETE /api/users/:id`
- **Find User by ID:** `GET /api/users/find/:id`
- **Get All Users:** `GET /api/users`

### Product Endpoints

- **Create Product:** `POST /api/products`
- **Update Product:** `PUT /api/products/:id`
- **Delete Product:** `DELETE /api/products/:id`
- **Find Product by ID:** `GET /api/products/find/:id`
- **Get All Products:** `GET /api/products`

### Cart Endpoints

- **Create Cart:** `POST /api/carts`
- **Update Cart:** `PUT /api/carts/:id`
- **Delete Cart:** `DELETE /api/carts/:id`
- **Find Cart by User ID:** `GET /api/carts/find/:userId`
- **Get All Carts:** `GET /api/carts`

### Order Endpoints

- **Create Order:** `POST /api/orders`
- **Update Order:** `PUT /api/orders/:id`
- **Delete Order:** `DELETE /api/orders/:id`
- **Find Order by User ID:** `GET /api/orders/find/:userId`
- **Get All Orders:** `GET /api/orders`
- **Get Monthly Income:** `GET /api/orders/income`

### Stripe Payment Endpoint

- **Process Payment:** `POST /api/checkout/payment`

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
