
# CMS Portal

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

Follow these steps to set up and run the project locally on your machine.

### 1. Clone the Project Repository

First, clone the project repository from GitHub:

```bash
git clone <repository_url>
cd <project_directory>
npm install
```


# Environment Variables Guide

This guide provides information about the required environment variables for configuring your Node.js application. Ensure these environment variables are properly set in your `.env` file for your application to function correctly.

## JWT Configuration

- **JWT_SECRET**: This is the secret key used for signing JSON Web Tokens (JWT) for authentication and authorization.
  
- **JWT_EXPIRY**: This specifies the expiry duration (in seconds or other time units) for JWT tokens issued by your application.

## Database Configuration

- **DB_HOST**: The host or IP address of your database server.
  
- **DB_USER**: The username used to authenticate with the database.
  
- **DB_NAME**: The name of the database to connect to.
  
- **DB_PASSWORD**: The password used to authenticate with the database.

## Mail Configuration

- **MAIL_PASSWORD**: The password for the email account used by your Node.js application to send emails via SMTP.
  
- **MAIL_USERNAME**: The username or email address associated with the SMTP email account.
  
- **OAUTH_CLIENTID**: The OAuth client ID if using OAuth for SMTP authentication (e.g., Gmail).
  
- **OAUTH_CLIENT_SECRET**: The OAuth client secret associated with the client ID for OAuth-based SMTP authentication.
  
- **OAUTH_REFRESH_TOKEN**: The refresh token obtained for OAuth-based SMTP authentication.

## Node Mailer Configuration

To configure Node Mailer for sending emails from your Node.js server, you can follow this [tutorial](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/).

1. **Install Node Mailer**:
   If you haven't already installed Node Mailer, you can do so using npm:
   ```bash
   npm install nodemailer
    ```
