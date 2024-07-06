# Apptodoz Dev

Apptodoz Dev is the public repository for the project deployed at [alfzatech.com](https://www.alfzatech.com).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [Contact](#contact)

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/alfonzeta/apptodoz-dev.git
cd apptodoz-dev
```

### Configuration

There are four .env.dist files located in the project, **copy them to .env in same directory and fill them**:

1. Root project folder: Copy .env.dist to .env and fill it.
2. backend/config folder: Copy backend/config/.env.dist to backend/config/.env and fill it.
3. seed-data folder: Copy seed-data/.env.dist to seed-data/.env and fill it. 
4. frontend folder: Copy frontend/.env.dist to frontend/.env and fill it. 

## Running the Application

**Build and run the Docker containers:**

```bash
docker compose up --build
```
This command will build the Docker images and start the containers as defined in the docker-compose.yml file.

## Contributing
We welcome contributions to the project. Please follow these steps to contribute:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes.
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-branch).
Open a pull request.

### Contact
For questions or support, please contact us.