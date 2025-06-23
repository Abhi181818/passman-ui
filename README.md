# PassMan

A modern, secure password manager web application with a React frontend. Passwords are stored locally in your browser (simulating a local file) as a JSON array, with each password hashed before storage. The app features a beautiful UI with glassmorphism effects and Lucide icons.

---

## Features

- User registration and login (with optional backend integration)
- Add, view, show/hide, copy, and delete passwords
- Passwords are stored locally in your browser (localStorage as JSON)
- Passwords are hashed (bcrypt) before storage for security
- Export all passwords as a JSON file
- Modern UI: glassmorphism, blur, and Lucide icons
- No database or server required for password management

---

## Project Structure

```
passman-ui/                # React frontend
├── src/
│   ├── pages/
│   │   ├── Home.jsx       # Auth page (register/login)
│   │   └── Dashboard.jsx  # Password manager dashboard
│   ├── App.jsx            # Routing
│   └── ...
├── public/
├── index.html
└── ...
```

---

## Requirements

- Node.js 18+ and npm

---

## Getting Started

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

## Usage

- Register or login on the Home page.
- After login, you will be redirected to the Dashboard.
- Add new passwords (service, username, password). Passwords are hashed before storage.
- View all stored passwords in a table. You can show/hide, copy, or delete each password.
- Export all passwords as a JSON file for backup.

---

## Password Storage & Security

- Passwords are stored in your browser's localStorage as a JSON array (simulating a local file).
- Each password is hashed using bcrypt before being saved.
- Passwords are never sent to a server or stored in plaintext.
- For demo purposes, you can use the export feature to download your passwords as a JSON file.

---

## Customization

- To use a real backend, connect the registration/login forms to your backend API.
- To store passwords in a real file, implement file system access (e.g., Electron, Tauri, or a backend API).
- To use a stronger hash or encryption, replace the bcrypt logic in `Dashboard.jsx`.

---

## License

This project is open source and available under the MIT License.
