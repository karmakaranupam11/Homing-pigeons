# <img src="public/img/pigeon-logo.png" width="40" height="40" style="vertical-align: middle; border-radius: 8px;"> Homing-Pigeons 🕊️

Homing-Pigeons is a modern, real-time messaging web application. Users can instantly create private chat rooms or join existing ones. Built with real-time bidirectional communication, it features an elegant UI and rich media integrations.

### Website Link : [https://homing-pigeons-eah3.onrender.com](https://homing-pigeons.onrender.com) 🚀

<img width="3164" height="1918" alt="image" src="https://github.com/user-attachments/assets/67ba5d56-7f21-4a06-afa9-7655cd370591" />

<img width="3164" height="1918" alt="image" src="https://github.com/user-attachments/assets/563c9cb9-3657-4205-87eb-29e887697890" />

<img width="3164" height="1918" alt="image" src="https://github.com/user-attachments/assets/6fca8d50-10e9-4c5d-832c-fa068f38ec86" />

---

## What's New? ✨
The application has recently undergone a massive overhaul to modernize the user experience:

- **Beautiful Modern UI:** A fully redesigned, Discord/Telegram-inspired interface with animated backgrounds, glassmorphism, and responsive layouts.
- **Dark/Light Mode:** Seamlessly switch between themes with a dedicated toggle. Your preference is saved locally.
- **Smart Room System:**
  - **Create Room:** Automatically generates a unique, human-readable Room ID (e.g., `swift-river-3921`) to start a new space.
  - **Join Room:** Includes server-side validation to ensure users can only join active, existing rooms.
  - **Easy Sharing:** A handy "Copy Room ID" button in the sidebar with a visual toast notification.
- **Rich Media & Emojis:** 
  - Integrated emoji picker for quick reactions.
  - Dedicated GIF panel powered by the Tenor API to search and share animated GIFs effortlessly.
- **Safety First:** Built-in profanity filter prevents the sending of abusive words.
- **Location Sharing:** Quickly share your exact geographical location with the room via Google Maps.

## Tech Stack 🎚️🛠️

- **Frontend:** HTML5, CSS3 (Vanilla with CSS Variables), JavaScript
- **Backend:** Node.js, Express.js
- **Real-Time Engine:** Socket.io
- **Integrations:** Tenor API (for GIFs), `emoji-picker-element`

## Running the Application Locally ⚡

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Homing-pigeons
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   # OR for development with nodemon:
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:4040` to see Homing-Pigeons running on your local machine.
