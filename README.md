# PassMan

A modern, secure password manager web application with a React frontend and Spring Boot REST API backend. PassMan enables you to store, retrieve, and manage encrypted passwords for different services, using a local JSON file as storage. No database required.

---

## Features

- Add a password for a service (password is encrypted before storage)
- Retrieve the encrypted password for a service
- Retrieve the original (decrypted) password for a service and username
- List all password entries in a modern, filterable table
- Set or load the password storage file location (user-defined JSON file)
- File picker wizard for selecting storage file
- All data is stored in a local `.json` file
- No database required
- Endpoints are open (no authentication) for demo/demo purposes
- Built with Java 17, Spring Boot 3, React, and Tailwind CSS

---

## Project Structure

```
passman-ui/                # React frontend
├── src/
│   ├── pages/
│   │   ├── Home.jsx       # Main UI page
│   │   └── PasswordTable.jsx # Passwords table component
│   ├── App.jsx
│   └── ...
├── public/
├── index.html
└── ...
```

---

## Requirements

- Node.js 18+ and npm (frontend)

---

## Getting Started (Frontend Only)

### 1. Clone the repository

```sh
git clone https://github.com/Abhi181818/passman-ui.git
cd passman-ui
```

### 2. Install dependencies and start the frontend

```sh
npm install
npm run dev
```
The frontend will start on `http://localhost:5173` (or as configured by Vite).

---

## Backend Setup Required

You must also set up and run the backend API for full functionality. Please follow the instructions in the backend repository:

[PassMan Backend Repository](https://github.com/Abhi181818/passman)

---

## API Endpoints (Backend must be running or use hosted API)

### Add a Password
- **URL:** `POST /api/passwords/add`
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "service": "example.com",
    "username": "yourusername",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `"Password added successfully!"` on success

### Get Encrypted Password
- **URL:** `GET /api/passwords/get?service=<serviceName>`
- **Response:**
  - The encrypted password string, or `Service not found` if not present

### Get All Password Entries
- **URL:** `GET /api/passwords/all`
- **Response:**
  - JSON array of all password entries (with encrypted passwords)
  - Example:
    ```json
    [
      {"serviceName":"google.com","username":"abhi18","encryptedPassword":"ljDFNYn+/Qz0yWKdlicANA=="},
      {"serviceName":"github.com","username":"abhi111","encryptedPassword":"PwVl7PYPDavdLSqeb3FQBA=="}
    ]
    ```

### Get Original (Decrypted) Password
- **URL:** `GET /api/passwords/get-original?service=<serviceName>&username=<username>`
- **Response:**
  - The original (decrypted) password string, or `Service not found` if not present

### Set Storage File Location
- **URL:** `POST /api/passwords/set-storage-file?path=/path/to/your/passwords.json`
- **Response:**
  - Confirmation message or error

### Load Passwords from a File
- **URL:** `POST /api/passwords/load-passwords?path=/path/to/your/passwords.json`
- **Response:**
  - JSON array of all password entries from the specified file

---

## Frontend Features

- **Add Password:** Enter service, username, and password. Submits to backend and shows result.
- **Get Encrypted Password:** Enter service name to fetch and display the encrypted password.
- **Show All Passwords:** View all stored passwords in a responsive table. Supports both `service` and `serviceName` fields.
- **Show Original Password:** Click the eye icon to reveal the decrypted password for a service/username.
- **Set Storage File:** Use a text field or file picker wizard to set the backend storage file location.
- **Load Passwords from File:** Load and display passwords from any compatible JSON file.
- **Modern UI:** Built with React and Tailwind CSS for a clean, responsive experience.

---

## Security Notes

- **For demo/learning purposes only.**
- The encryption key is hardcoded and should not be used in production.
- Endpoints are open (no authentication). For real use, add authentication and secure the key.
- File path access is not restricted—do not expose this to the public without validation.

---

## Customization

- To change the encryption key, edit `EncryptUtil.java` in the backend.
- To add authentication, update `SecurityConfig.java`.
- To use a database, refactor `PasswordService.java` and update dependencies.

---

## License

This project is open source and available under the MIT License.
