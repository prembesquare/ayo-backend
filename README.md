Sure, I can help you link the titles to their respective divisions. Here's the modified Table of Contents with the titles linked:

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
   - [Step 1: Clone the Repository](#step-1-clone-the-repository)
   - [Step 2: Install Dependencies](#step-2-install-dependencies)
4. [Database Setup](#database-setup)
   - [Docker and PostgreSQL](#docker-and-postgresql)
   - [Initialize the Database](#initialize-the-database)
5. [Running the Application](#running-the-application)
   - [Using the Makefile](#using-the-makefile)
   - [Manually Running Containers](#manually-running-containers)
6. [API Documentation](#api-documentation)
7. [Technologies Used](#technologies-used)
7. [ERD Diagram](#erd-diagram)

## Introduction

The Ayo Event Management application is designed to manage events and RSVPs. This source code provides endpoints for user registration, event creation, and RSVP management. Users can create events, invite guests via email, and view RSVP statuses. The source code is built using Node.js, Express.js, and PostgreSQL for the database.

## Prerequisites

Before running the application, ensure you have the following software installed:

1. Node.js and npm (Node Package Manager)
2. Docker (for containerization)
3. PostgreSQL (you can use Docker to run a PostgreSQL container)

## Installation

### Step 1: Clone the Repository

To get started, clone this repository to your local machine:

For SSH
```
git clone git@github.com:prembesquare/ayo-backend.git
```

For HTTPS
```
git clone https://github.com/prembesquare/ayo-backend.git
```

### Step 2: Install Dependencies

Navigate to the project folder and install the required dependencies using the make file:

```
cd your-repo
```

```
make install
```

## Database Setup

### Docker and PostgreSQL

This application uses Docker to manage a PostgreSQL database. Docker provides a simple and consistent way to set up and run containers, including the PostgreSQL database container.

### Initialize the Database

The database schema and tables can be created using the provided SQL script. The script sets up the necessary tables for users, events, and RSVPs.

To initialize the database, run the following command inside the project directory:

```
make build
```

## Running the Application

### Using the Makefile

The project comes with a Makefile that provides shortcuts for common tasks. To start the application and the PostgreSQL database using Docker, run the following command:

```
make build
```

To stop the application and the PostgreSQL database containers, run:

```
make down
```

### Manually Running Containers

Alternatively, you can manually run the containers without using the Makefile. First, start the PostgreSQL container:

```
sudo docker-compose up -d ayo_drc_db
```

Next, start the Node.js application:

```
npm start
```

## API Documentation

Sure! Here's an API documentation for your project. I'll provide details on each endpoint, including the HTTP methods, request/response formats, and a brief description.

### Base URL
Replace `your_api_base_url` with the base URL of your API.

### Authentication
Your API may require authentication for certain endpoints. Make sure to include the necessary headers, such as the `Authorization` header, with a valid JWT token.

---

## User Endpoints

### Register a User

**Endpoint:** `POST /your_api_base_url/users/register`

**Description:** Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com",
  "password": "password"
}
```

**Response:**
```json
{
    "message": "User registered successfully",
    "user": "John Doe",
    "email": "john.doe@gmail.com"
}
```

### Login

**Endpoint:** `POST /your_api_base_url/users/login`

**Description:** Authenticate and log in a user.

**Request Body:**
```json
{
  "email": "john.doe@gmail.com",
  "password": "password"
}
```

**Response:**
```json
{
    "message": "User logged in successfully",
    "user": {
        "id": "1",
        "name": "John Doe",
        "email": "john.doe@gmail.com",
        "password": "hashedpassword"
    },
    "accessToken": "your_access_token",
    "refreshToken": "your_refresh_token"
}
```
### Forgot Password

**Endpoint**: `POST /your_api_base_url/users/forgot-password`
**Description**: This endpoint allows users to request a password reset link. An email will be sent to the user's registered email address with instructions on how to reset their password.

**Request Body**:

  ```
  {
    "email": "user@example.com"
  }
  ```

**Response**:
```
{
    "message": "Reset password email sent successfully"
}
```

### Update User Password

**Endpoint:** `PUT /your_api_base_url/users/update`

**Description:** This endpoint allows authenticated users to update their password.

**Request Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body**:

 ```
{
    "currentPassword": "Reset#123456",
    "newPassword": "Pass#123456"
}
  ```

**Response:**
```json
{
    "message": "Password updated successfully"
}
```

### Logout

**Endpoint:** `POST /your_api_base_url/users/update`

**Description:** This endpoint allows authenticated users to log out and invalidate their access token. After logging out, the access token will no longer be valid for API requests.

**Request Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
{
    "message": "User logged out successfully"
}
```

---

## Authentication Endpoints

### Refresh Token

**Endpoint:** `GET /your_api_base_url/refresh`

**Description:** This endpoint allows users to refresh their expired access token using a valid refresh token.

**Response:**
```json
{
    "accessToken": "newAccessToken"
}
```

---

## Event Endpoints

### Get All Events

**Endpoint:** `GET /your_api_base_url/create_event/get`

**Description:** Get a list of all events.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "event_id": 1,
      "event_name": "Graduation",
      "event_date": "2023-07-25",
      "event_time": "10:00:00",
      "event_address": "Harvard",
      "event_detail": "Dress formal",
      "event_rsvp_before_date": "2023-07-20",
      "event_rsvp_before_time": "12:00:00",
      "event_code": "grad",
      "email": "john.doe@gmail.com"
    },
    {
      "event_id": 2,
      "event_name": "Dinner",
      "event_date": "2023-08-05",
      "event_time": "15:30:00",
      "event_address": "Harvard Ballroom",
      "event_detail": "Casual wear",
      "event_rsvp_before_date": "2023-07-30",
      "event_rsvp_before_time": "23:59:59",
      "event_code": "dine",
      "email": "jane.doe@gmail.com"
    }
  ]
}
```

### Create an Event

**Endpoint:** `POST /your_api_base_url/create_event/add`

**Description:** Create a new event.

**Request Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body:**
```json
{
  "event_name": "Graduation",
  "event_date": "2023-08-15",
  "event_time": "14:00:00",
  "event_address": "Oxford",
  "event_detail": "Graduation Robes",
  "event_rsvp_before_date": "2023-08-10",
  "event_rsvp_before_time": "23:59:59",
  "event_code": "grad",
  "invitee_email": ["jane.may@gmail.com", "mary.jane@gmail.com"]


}
```

**Response:**
```json
[
    {
        "event_code": "grad"
    }
]
```

### Get Event by Event Code

**Endpoint:** `GET /your_api_base_url/event/create_event/:event_code`

**Description:** Get details of a specific event by its event code.

**Response:**
```json
{
    "event_id": 1,
    "event_name": "Graduation",
    "event_date": "2023-07-25",
    "event_time": "10:00:00",
    "event_address": "Oxford",
    "event_detail": "Graduation Robes",
    "event_rsvp_before_date": "2023-07-20",
    "event_rsvp_before_time": "12:00:00",
    "event_code": "grad",
    "email": "john.doe@example.com"
  }
}
```

### Update an Event

**Endpoint:** `PUT /your_api_base_url/create_event/update/:event_code`

**Description:** Update an existing event.

**Request Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body:**
```json
{
  "event_name": "Updated Graduation",
  "event_date": "2023-08-15",
  "event_time": "14:00:00",
  "event_address": "Oxford",
  "event_detail": "Graduation Robes",
  "event_rsvp_before_date": "2023-08-10",
  "event_rsvp_before_time": "23:59:59",
  "invitee_email": ["jane.may@gmail.com", "mary.jane@gmail.com"]
}
```

**Response:**
```json
{
  "event_name": "Updated Graduation",
  "event_date": "2023-08-15",
  "event_time": "14:00:00",
  "event_address": "Oxford",
  "event_detail": "Graduation Robes",
  "event_rsvp_before_date": "2023-08-10",
  "event_rsvp_before_time": "23:59:59",
  "invitee_email": ["jane.may@gmail.com", "mary.jane@gmail.com"]
}
```

### Delete an Event

**Endpoint:** `DELETE /your_api_base_url/create_event/delete/:event_code`

**Description:** Delete an event.

**Request Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
[]
```

### Get All Events Created By User

**Endpoint**: `POST /create_event/email/:email`

**Description**: This endpoint allows users to get all the events that they are invited to.

**Request Headers**:

```
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

**Response**:

```
[
    {
        "event_id": "1",
        "event_name": "dinner",
        "event_date": "2024-07-14T00:00:00.000Z",
        "event_time": "04:08:00",
        "event_address": "Home",
        "event_detail": "Formal",
        "event_rsvp_before_date": "2023-07-15T00:00:00.000Z",
        "event_rsvp_before_time": "04:11:00",
        "event_code": "dine",
        "email": "john.doe@gmail.com"
    },
]
```

### Get All Events User Invited To

**Endpoint**: `POST /create_event/invite/:invitee_email`

**Description**: This endpoint allows users to get all the events that they created.

**Request Headers**:

```
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

**Response**:

```
[
    {
        "event_id": "1",
        "event_name": "dinner",
        "event_date": "2024-07-14T00:00:00.000Z",
        "event_time": "04:08:00",
        "event_address": "Home",
        "event_detail": "Formal",
        "event_rsvp_before_date": "2023-07-15T00:00:00.000Z",
        "event_rsvp_before_time": "04:11:00",
        "event_code": "dine",
        "email": "mary.jane@gmail.com"
        "invitee_id": "1",
        "invitee_email": "john.doe@gmail.com"
    },
]
```

---

## RSVP Endpoints

### RSVP for an Event

**Endpoint:** `POST /your_api_base_url/rsvp/add`

**Description:** RSVP for an event.

**Request Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body:**
```json
{
  "event_code": "ABC123",
  "rsvp_status": "Yes"
}
```

**Response:**
```json
{
  RSVP added successfully
}
```

### Get RSVPs by Status

**Endpoint:** `GET /your_api_base_url/rsvp/status/:status`

**Description:** Get RSVPs by status (e.g., "Yes" or "No").

**Response:**
```json
[
    {
        "rsvp_id": "1",
        "event_code": "grad",
        "rsvp_status": "Yes",
        "invitee_id": "4"
    },
    {
        "rsvp_id": "5",
        "event_code": "grad",
        "rsvp_status": "Yes",
        "invitee_id": "11"
    },
]
```

### Get RSVPs with "Yes" Status for an Event

**Endpoint:** `GET /your_api_base_url/rsvp/yes/:event_code`

**Description:** Get RSVPs with "Yes" status for a specific event.

**Response:**
```json
[
    {
        "invitee_email": "john.doe@gmail.com"
    },
    {
        "invitee_email": "mary.jane@gmail.com"
    }
]
```

### Get RSVPs with "No" Status for an Event

**Endpoint:** `GET /your_api_base_url/rsvp/no/:event_code`

**Description:** Get RSVPs with "No" status for a specific event.

**Response:**
```json
[
    {
        "invitee_email": "john.doe@gmail.com"
    },
    {
        "invitee_email": "mary.jane@gmail.com"
    }
]
```

---

This API documentation outlines the available endpoints and the expected request/response formats for your project. Remember to replace `your_api_base_url` with the actual base URL of your API. Additionally, you can include more details, such as error responses and error codes, to provide comprehensive documentation for your users and developers.

## Technologies Used

The Ayo Event Management application backend source code utilizes the following technologies:

1. Node.js - A JavaScript runtime for building scalable applications.
2. Express.js - A fast and minimalist web framework for Node.js.
3. PostgreSQL - A powerful open-source relational database system.
4. Docker - A platform for developing, shipping, and running applications in containers.

## ERD Diagram

![Alt text](<ERD Diagram.png>)
