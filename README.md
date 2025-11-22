# TinyLink - URL Shortener

A modern, full-stack URL shortener application built with Node.js, Express, React, and PostgreSQL. TinyLink allows users to shorten URLs, optionally choose custom codes, view click statistics, and manage their links through an intuitive dashboard.

## 🌟 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Codes**: Option to create custom short codes (6-8 alphanumeric characters)
- **Click Analytics**: Track clicks and view detailed statistics for each link
- **Link Management**: View all your links, copy them, and delete as needed
- **Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile
- **Real-time Stats**: See click counts and last accessed timestamps
- **HTTP 302 Redirects**: Proper redirect handling with automatic click tracking

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **PostgreSQL** (Neon) - Database for storing links and stats
- **CORS** - Cross-origin resource sharing
- **Validator** - URL validation

### Frontend
- **React** 18 with **Vite** - Fast development and optimized builds
- **React Router** - Client-side routing
- **TailwindCSS** - Modern, utility-first styling
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

## 📋 Prerequisites

- Node.js v22.4.1 or higher
- npm or yarn
- PostgreSQL database (Neon free tier recommended)

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd tinylink_app
\`\`\`

### 2. Setup Backend

\`\`\`bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
\`\`\`

Edit `backend/.env` with your database credentials:

\`\`\`env
DATABASE_URL=postgresql://username:password@host/database
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
\`\`\`

### 3. Setup Database

Create your database on [Neon](https://neon.tech) (or any PostgreSQL provider), then run the schema:

\`\`\`bash
# Connect to your Postgres database and run:
psql <your_database_url> -f db/schema.sql

# Or copy the contents of db/schema.sql and run in your database console
\`\`\`

### 4. Setup Frontend

\`\`\`bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
\`\`\`

Edit `frontend/.env`:

\`\`\`env
VITE_API_URL=http://localhost:3001
\`\`\`

### 5. Run the Application

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm start
# Server runs on http://localhost:3001
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
# App runs on http://localhost:5173
\`\`\`

Visit `http://localhost:5173` in your browser!

## 📚 API Documentation

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthz` | Health check endpoint |
| POST | `/api/links` | Create a new shortened URL |
| GET | `/api/links` | Get all links |
| GET | `/api/links/:code` | Get stats for a specific link |
| DELETE | `/api/links/:code` | Delete a link |
| GET | `/:code` | Redirect to original URL (302) |

### API Examples

**Create Link:**
\`\`\`bash
curl -X POST http://localhost:3001/api/links \\
  -H "Content-Type: application/json" \\
  -d '{"originalUrl": "https://example.com", "customCode": "example"}'
\`\`\`

**Get All Links:**
\`\`\`bash
curl http://localhost:3001/api/links
\`\`\`

**Get Link Stats:**
\`\`\`bash
curl http://localhost:3001/api/links/example
\`\`\`

**Delete Link:**
\`\`\`bash
curl -X DELETE http://localhost:3001/api/links/example
\`\`\`

## 🗄️ Database Schema

\`\`\`sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🎨 Features Walkthrough

### Dashboard
- Create shortened URLs with auto-generated or custom codes
- View all your links in a responsive table
- Copy short URLs to clipboard
- Delete unwanted links
- Click on links to view detailed statistics

### Statistics Page
- View total click count
- See when the link was last accessed
- View creation date
- Access original URL
- Copy short URL to clipboard

### URL Code Rules
- Codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- Custom codes are optional
- Auto-generated codes are 6 characters
- All codes are globally unique

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Neon PostgreSQL setup
- Backend deployment (Railway/Render)
- Frontend deployment (Vercel)

## 📁 Project Structure

\`\`\`
tinylink_app/
├── backend/
│   ├── db/
│   │   ├── database.js      # Database connection pool
│   │   └── schema.sql       # Database schema
│   ├── routes/
│   │   ├── health.js        # Health check endpoint
│   │   ├── links.js         # CRUD API routes
│   │   └── redirect.js      # Redirect handler
│   ├── utils/
│   │   └── codeGenerator.js # Code generation utility
│   ├── server.js            # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── links.js     # API client wrapper
│   │   ├── components/
│   │   │   ├── LinkForm.jsx # URL creation form
│   │   │   └── LinksTable.jsx # Links display table
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Main dashboard
│   │   │   └── StatsPage.jsx # Statistics page
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   └── package.json
│
└── README.md
\`\`\`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create link with auto-generated code
- [ ] Create link with custom code
- [ ] Verify duplicate code returns 409 error
- [ ] Test URL validation
- [ ] Test code validation (6-8 characters)
- [ ] View all links on dashboard
- [ ] Delete a link
- [ ] Redirect via short URL increments click count
- [ ] View statistics page
- [ ] Test responsive design on mobile
- [ ] Copy short URL to clipboard

## 🤝 Contributing

This is a take-home assignment project. Feel free to fork and modify for your own use!

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 🙏 Acknowledgments

Built as a take-home assignment to demonstrate full-stack development skills with modern web technologies.
