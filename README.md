# 📚 Study Tracker & Task Manager

A full-stack task management application designed for students, featuring drag-and-drop organization, priority levels, study categories, statistics dashboard, and more.

**🔑 Demo Account:** Click "Try Demo Account" on login page

---

## ✨ Features

### Core Functionality

- 🔐 **Authentication** - Email/Password, Google OAuth, and Demo Account
- ✅ **CRUD Operations** - Create, Read, Update, Delete tasks
- 🎯 **Task Details** - Title, description, priority, category, due date, image upload
- 🖼️ **Image Upload** - Attach images to tasks via Cloudinary
- 📋 **Categories** - Math, Science, Language, History, Programming, Literature, Assignment, Exam, Project
- 🔴🟡🟢 **Priority Levels** - High, Medium, Low with color coding
- 📅 **Due Dates** - Track deadlines with overdue warnings

### Organization & Productivity

- 🔍 **Search** - Filter tasks by title
- 🏷️ **Category Filter** - View tasks by study subject
- ✅ **Status Filter** - All, Active, Completed
- 🎨 **Drag & Drop** - Reorder tasks by dragging
- 📊 **Statistics Dashboard** - Pie charts and bar graphs showing completion status and priority distribution
- 📥 **Export** - Download tasks as CSV

### User Experience

- 🌓 **Dark/Light Theme** - Persistent theme preference
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎭 **Smooth Animations** - Framer Motion transitions
- 🍞 **Toast Notifications** - User-friendly feedback
- ⏳ **Loading Skeletons** - Better perceived performance
- 🛡️ **Error Boundaries** - Graceful error handling

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Bootstrap 5** - CSS framework
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **@dnd-kit** - Drag and drop
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Passport.js** - Google OAuth
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image hosting
- **Resend** - Email service

---

## 📸 Screenshots

> Add screenshots here after deployment

![Dashboard](./screenshots/dashboard.png)
![Task Detail](./screenshots/task-detail.png)
![Statistics](./screenshots/statistics.png)
![Mobile View](./screenshots/mobile.png)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Google OAuth credentials (optional)
- Resend API key (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/charliechinhay/Study-Tracker---Task-Manager.git
cd Study-Tracker---Task-Manager
```

2. **Install dependencies**

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

3. **Environment Variables**

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

4. **Run the application**

**Backend (Terminal 1):**

```bash
cd server
npm run dev
```

**Frontend (Terminal 2):**

```bash
cd client
npm run dev
```

5. **Open the app**

Navigate to `http://localhost:5173`

---

## 📦 Environment Variables Explained

### Backend (`server/.env`)

| Variable                | Description                 | Required    |
| ----------------------- | --------------------------- | ----------- |
| `MONGO_URI`             | MongoDB connection string   | ✅ Yes      |
| `JWT_SECRET`            | Secret key for JWT tokens   | ✅ Yes      |
| `PORT`                  | Server port (default: 5000) | ✅ Yes      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name       | ✅ Yes      |
| `CLOUDINARY_API_KEY`    | Cloudinary API key          | ✅ Yes      |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret       | ✅ Yes      |
| `RESEND_API_KEY`        | Resend email API key        | ⚠️ Optional |
| `CLIENT_URL`            | Frontend URL for CORS       | ✅ Yes      |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID      | ⚠️ Optional |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret  | ⚠️ Optional |

### Frontend (`client/.env`)

| Variable       | Description     | Required |
| -------------- | --------------- | -------- |
| `VITE_API_URL` | Backend API URL | ✅ Yes   |

---

## 🌐 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from `server/.env`
5. Deploy

### Frontend (Vercel)

1. Import project on Vercel
2. Configure:
   - **Root Directory:** `client`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable: `VITE_API_URL` with your Render backend URL
4. Deploy

### Post-Deployment

1. Update `CLIENT_URL` on Render with your Vercel URL
2. Update Google OAuth redirect URIs with production URLs

---

## 🗂️ Project Structure

Study-Tracker---Task-Manager/
├── client/ # Frontend React app
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── contexts/ # React contexts (Theme)
│ │ ├── hooks/ # Custom hooks
│ │ ├── Pages/ # Page components
│ │ ├── services/ # API service
│ │ ├── App.jsx # Main app component
│ │ └── main.jsx # Entry point
│ ├── .env # Frontend env variables
│ └── package.json
│
├── server/ # Backend Node.js app
│ ├── config/ # Configuration files
│ ├── middleware/ # Express middleware
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ ├── .env # Backend env variables
│ ├── db.js # Database connection
│ ├── server.js # Entry point
│ └── package.json
│
└── README.md # You are here!

---

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/demo` - Demo account login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Tasks

- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks` - Reorder tasks
- `DELETE /api/tasks/:id` - Delete task

---

## 👨‍💻 Development

### Available Scripts

**Backend:**

- `npm run dev` - Start server with hot reload
- `npm start` - Start server (production)

**Frontend:**

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome! Feel free to open an issue or submit a pull request.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Charlie Chin Hay**

- GitHub: [@charliechinhay](https://github.com/charliechinhay)
- LinkedIn: [https://www.linkedin.com/in/charlie-chinchay-824393394/]

---

⭐ **If you found this project helpful, please give it a star!** ⭐
