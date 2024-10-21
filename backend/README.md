# Workout Tracker API Project

This is a RESTful API project developed with NestJS, MongoDB, Docker and Swagger for documentation. The project allows users to track their workouts and create routines.

## Features

- User authentication
- CRUD operations for workouts, routines, logs and more
- Swagger documentation for API endpoints
- Dockerized deployment for easy setup and scalability

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- MongoDB
- Docker
- Yarn

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Ahmed-M-Aboutaleb/2024-Workout-Tracking-API.git
```

2. Install dependencies:

```bash
cd 2024-Workout-Tracking-API
yarn
```

3. Set up environment variables:

Create a `.env`, `.env.development` and `.env.test` files in the root directory and add the following:

```plaintext
PORT=<Your API Port>
DB_USER=<Your DB Username>
DB_PASSWORD=<Your DB Password>
DB_URI=<Your DB URL>
JWT_SECRET=<JWT Token Secret>
```

4. Start the MongoDB server:

```bash
mongod
```

5. Start the application:

```bash
yarn run start:dev
```

6. Access the API documentation:

Open your browser and go to `http://localhost:<PORT>/api`

### Docker

To run the application in a Docker container, follow these steps:

1. Build the Docker Compose file:

```bash
docker compose up --build
```

2. Access the API documentation:

Open your browser and go to `http://localhost:<PORT>/api`

## Testing

To run the tests, use the following command:

```bash
yarn test
```

To generate a test coverage report, use the following command:

```bash
yarn test:cov
```

To run the e2e tests, use the following command:

```bash
yarn test:e2e
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
