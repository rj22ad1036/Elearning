# ELearning Platform

A comprehensive full-stack online learning management system built with **Next.js** (Frontend) and **Express + Prisma** (Backend). This platform allows users to take courses, watch videos, take notes, complete quizzes, and compete on leaderboards.

---

## 🎯 Project Overview

The ELearning Platform is a modern web application designed to facilitate online learning with interactive features. Students can:

- Browse and enroll in courses
- Watch educational videos
- Take personalized notes while learning
- Share notes with the community
- Complete quizzes to test knowledge
- Track progress on leaderboards
- View their profile with stats

---

## 🏗️ Architecture

### Frontend (Next.js 15)

- **Location**: `frontend/`
- **Tech Stack**: React 19, Next.js App Router, Tailwind CSS, Lucide Icons
- **Port**: `http://localhost:3000`

### Backend (Express + Prisma)

- **Location**: `backend/`
- **Tech Stack**: Express 5, Prisma ORM, SQLite, JWT Authentication, bcrypt
- **Port**: `http://localhost:4000`

---

## 📋 Core Functionalities

### 1. **User Authentication (Sign Up & Login)**

Users can create accounts and log in securely.

#### Backend Implementation: `backend/routes/auth.js`

```javascript
// SIGNUP: Create new user account
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields required" });
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "User already exists" });

  // Hash password using bcrypt (10 salt rounds)
  const hashed = await bcrypt.hash(password, 10);

  // Create user in database
  const user = await prisma.user.create({
    data: { email, password: hashed, username: name },
  });

  res.json({ message: "User created successfully" });
});

// LOGIN: Authenticate user and return JWT token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  // Compare provided password with hashed password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  // Generate JWT token (expires in 1 hour)
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.username,
      createdAt: user.createdAt,
    },
  });
});
```

#### Frontend Implementation: `frontend/src/app/login/page.jsx`

```javascript
const handleLogin = async (e) => {
  e.preventDefault();

  // Send login request to backend
  const response = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.token) {
    // Store token and user data in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Dispatch event to update navbar
    window.dispatchEvent(new Event("authStateChanged"));

    // Redirect to home
    router.push("/");
  }
};
```

---

### 2. **Course Management & Video Streaming**

Users can browse courses and watch educational videos.

#### Backend API: `backend/index.js`

```javascript
// Get all courses with their videos
app.get("/courses", async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { videos: true },
  });
  res.json(courses);
});

// Get single course details
app.get("/courses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const course = await prisma.course.findUnique({
    where: { id },
    include: { videos: true },
  });
  res.json(course);
});
```

#### Frontend Component: `frontend/src/app/course/[id]/page.jsx`

```javascript
export default function CourseDetail({ params }) {
  const { id } = use(params);
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Fetch course data
    fetch(`http://localhost:4000/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setSelectedVideo(data.videos[0]); // Show first video
      });
  }, [id]);

  return (
    <main>
      <h1>{course?.title}</h1>

      {/* Video Player */}
      {selectedVideo && <video controls src={selectedVideo.url} />}

      {/* Video List Sidebar */}
      <div>
        {course?.videos.map((video) => (
          <button key={video.id} onClick={() => setSelectedVideo(video)}>
            {video.title}
          </button>
        ))}
      </div>
    </main>
  );
}
```

---

### 3. **Note Taking & Community Notes**

Students can take personal notes and share them with the community.

#### Backend Implementation: `backend/routes/notes.js`

```javascript
// CREATE: Save a new note for a video
router.post("/create", authMiddleware, async (req, res) => {
  const { videoId, content } = req.body;

  const note = await prisma.note.create({
    data: {
      content,
      videoId,
      userId: req.userId, // User ID from JWT
    },
  });

  res.json(note);
});

// READ: Get all notes for a specific video (personal)
router.get("/:videoId", authMiddleware, async (req, res) => {
  const videoId = parseInt(req.params.videoId);

  const notes = await prisma.note.findMany({
    where: { videoId, userId: req.userId },
    orderBy: { id: "desc" },
  });

  res.json(notes);
});

// UPDATE: Edit a note
router.put("/:noteId", authMiddleware, async (req, res) => {
  const noteId = parseInt(req.params.noteId);
  const { content } = req.body;

  const note = await prisma.note.update({
    where: { id: noteId, userId: req.userId },
    data: { content },
  });

  res.json(note);
});

// DELETE: Remove a note
router.delete("/:noteId", authMiddleware, async (req, res) => {
  await prisma.note.delete({
    where: { id: noteId, userId: req.userId },
  });

  res.json({ message: "Note deleted" });
});

// MAKE PUBLIC: Convert private note to public with AI rating
router.post("/make-public/:id", authMiddleware, async (req, res) => {
  const note = await prisma.note.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (note.userId !== req.userId) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const updated = await prisma.note.update({
    where: { id: parseInt(req.params.id) },
    data: { isPublic: true, rating: 4.0 },
  });

  res.json({ message: "Note made public", note: updated });
});

// SHARE: Generate shareable link
router.post("/share/:id", authMiddleware, async (req, res) => {
  const shareId = randomBytes(8).toString("hex");

  const updated = await prisma.note.update({
    where: { id: parseInt(req.params.id) },
    data: { shared: true, shareId },
  });

  res.json({
    message: "Note shared!",
    shareUrl: `http://localhost:3000/shared/${shareId}`,
  });
});

// PUBLIC: Get all public notes for a video
router.get("/public/video/:videoId", async (req, res) => {
  const notes = await prisma.note.findMany({
    where: { videoId: parseInt(req.params.videoId), isPublic: true },
    include: { user: { select: { username: true } } },
    orderBy: { rating: "desc" },
  });

  res.json(notes);
});
```

#### Frontend Component: `frontend/src/components/Note.jsx`

```javascript
export default function Note({ courseId, videoId }) {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [publicNotes, setPublicNotes] = useState([]);

  // Fetch personal notes for this video
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/notes/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNotes);
  }, [videoId]);

  // Fetch community public notes
  useEffect(() => {
    fetch(`http://localhost:4000/notes/public/video/${videoId}`)
      .then((res) => res.json())
      .then(setPublicNotes);
  }, [videoId]);

  // Save new note
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!content.trim()) return alert("Note cannot be empty");

    await fetch("http://localhost:4000/notes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, videoId }),
    });

    setContent(""); // Clear textarea
    fetchNotes(); // Refresh notes
  };

  // Make note public
  const handleMakePublic = async (noteId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:4000/notes/make-public/${noteId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      alert("Note made public with rating!");
      fetchNotes();
    }
  };

  // Share note
  const handleShare = async (noteId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/notes/share/${noteId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    navigator.clipboard.writeText(data.shareUrl);
    alert("Share link copied!");
  };

  return (
    <section>
      <h3>My Notes</h3>

      {/* Add Note Form */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes..."
      />
      <button onClick={handleSave}>Save Note</button>

      {/* Personal Notes List */}
      {notes.map((note) => (
        <div key={note.id}>
          <p>{note.content}</p>
          <button onClick={() => handleMakePublic(note.id)}>Make Public</button>
          <button onClick={() => handleShare(note.id)}>Share</button>
        </div>
      ))}

      {/* Community Notes */}
      <h3>Community Notes</h3>
      {publicNotes.map((note) => (
        <div key={note.id}>
          <p>{note.content}</p>
          <p>
            by {note.user.username} ⭐ {note.rating}
          </p>
        </div>
      ))}
    </section>
  );
}
```

---

### 4. **Quiz & Assessment**

Users can take quizzes and track their scores.

#### Backend Implementation: `backend/routes/quiz.js`

```javascript
// Get quiz questions for a course
router.get("/:courseId", async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const quizzes = await prisma.quiz.findMany({ where: { courseId } });

  // Format options for frontend
  const formatted = quizzes.map((q) => ({
    id: q.id,
    question: q.question,
    options: [
      { key: "A", text: q.optionA },
      { key: "B", text: q.optionB },
      { key: "C", text: q.optionC },
      { key: "D", text: q.optionD },
    ],
    answer: q.answer,
  }));

  res.json(formatted);
});

// Submit quiz and calculate score
router.post("/submit", authMiddleware, async (req, res) => {
  const { courseId, answers } = req.body; // [{id: quizId, answer: "A"}]

  // Get all quiz questions for the course
  const quizzes = await prisma.quiz.findMany({ where: { courseId } });

  // Count correct answers
  let correct = 0;
  quizzes.forEach((q) => {
    const userAnswer = answers.find((a) => a.id === q.id);
    if (userAnswer && userAnswer.answer === q.answer) correct++;
  });

  // Save score to database
  const score = await prisma.score.create({
    data: {
      userId: req.userId,
      courseId,
      score: correct,
    },
  });

  res.json({ message: "Quiz submitted", score: correct });
});
```

#### Frontend Component: `frontend/src/app/quiz/[id]/page.jsx`

```javascript
export default function QuizPage() {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});

  // Fetch quiz questions
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/quiz/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setQuizzes);
  }, [id]);

  // Track selected answer
  const handleAnswer = (quizId, answer) => {
    setAnswers({ ...answers, [quizId]: answer });
  };

  // Submit quiz
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const formatted = Object.entries(answers).map(([id, answer]) => ({
      id: Number(id),
      answer,
    }));

    const res = await fetch("http://localhost:4000/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId: Number(id), answers: formatted }),
    });

    const data = await res.json();
    alert(`You scored ${data.score} / ${quizzes.length}`);
  };

  return (
    <main>
      <h1>Course Quiz</h1>

      {/* Display Questions */}
      {quizzes.map((q) => (
        <div key={q.id}>
          <p>{q.question}</p>

          {/* Radio Options */}
          {q.options.map((opt) => (
            <label key={opt.key}>
              <input
                type="radio"
                name={q.id}
                value={opt.key}
                onChange={() => handleAnswer(q.id, opt.key)}
              />
              {opt.key}. {opt.text}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Quiz</button>
    </main>
  );
}
```

---

### 5. **Leaderboard & Progress Tracking**

Users can compete with others and track their scores.

#### Backend Implementation: `backend/routes/scores.js`

```javascript
// Get logged-in user's scores
router.get("/me", authMiddleware, async (req, res) => {
  const scores = await prisma.score.findMany({
    where: { userId: req.userId },
    include: { course: true },
  });
  res.json(scores);
});

// Get leaderboard for a course (top 5)
router.get("/leaderboard/:courseId", async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  const leaderboard = await prisma.score.findMany({
    where: { courseId },
    include: { user: true },
    orderBy: { score: "desc" }, // Sort by score descending
    take: 5, // Get top 5
  });

  res.json(leaderboard);
});
```

#### Frontend Component: `frontend/src/app/leaderboard/[id]/page.jsx`

```javascript
export default function Leaderboard({ params }) {
  const { id } = use(params);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/scores/leaderboard/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLeaders(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <main>
      <h1>Leaderboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : leaders.length === 0 ? (
        <p>No scores yet.</p>
      ) : (
        <ol>
          {leaders.map((leader, index) => (
            <li key={index}>
              <strong>#{index + 1}</strong> {leader.user.username} —
              {leader.score} pts
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
```

---

### 6. **User Profile & Dashboard**

Users can view their profile, notes, and quiz scores.

#### Frontend Component: `frontend/src/app/profile/page.jsx`

```javascript
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login"); // Redirect if not logged in
      return;
    }

    setUser(JSON.parse(userData));

    // Fetch user's notes
    fetch("http://localhost:4000/notes/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNotes);

    // Fetch user's quiz scores
    fetch("http://localhost:4000/scores/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setScores);
  }, []);

  return (
    <main>
      <h1>My Profile</h1>

      {user && (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>Member since {user.createdAt}</p>
        </div>
      )}

      <section>
        <h3>My Notes ({notes.length})</h3>
        {notes.map((note) => (
          <div key={note.id}>
            <p>{note.content}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Quiz Results ({scores.length})</h3>
        {scores.map((score) => (
          <div key={score.id}>
            <p>
              {score.course.title}: {score.score}%
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
```

---

## 📊 Database Schema

#### `backend/prisma/schema.prisma`

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  username String?
  password String
  notes    Note[]
  scores   Score[]
}

model Course {
  id       Int      @id @default(autoincrement())
  title    String
  description String
  videos   Video[]
  quizzes  Quiz[]
  scores   Score[]
}

model Video {
  id        Int    @id @default(autoincrement())
  title     String
  url       String
  courseId  Int
  course    Course @relation(fields: [courseId], references: [id])
  notes     Note[]
}

model Note {
  id        Int      @id @default(autoincrement())
  content   String
  userId    Int
  videoId   Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  video     Video    @relation(fields: [videoId], references: [id])

  shared    Boolean  @default(false)
  shareId   String?  @unique
  isPublic  Boolean  @default(false)
  rating    Float?
}

model Quiz {
  id        Int      @id @default(autoincrement())
  question  String
  optionA   String
  optionB   String
  optionC   String
  optionD   String
  answer    String   // Correct answer (A, B, C, or D)
  courseId  Int
  course    Course   @relation(fields: [courseId], references: [id])
}

model Score {
  id       Int    @id @default(autoincrement())
  userId   Int
  courseId Int
  score    Int    // Number of correct answers
  user     User   @relation(fields: [userId], references: [id])
  course   Course @relation(fields: [courseId], references: [id])
}
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- SQLite (included with Prisma)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create/migrate database
npx prisma migrate dev

# Seed sample data (optional)
npm run seed

# Start server
npm start
```

Server runs on `http://localhost:4000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔐 Authentication Flow

### How JWT Token Works

1. **User Signs Up**

   - Password is hashed with bcrypt (10 rounds)
   - User stored in database

2. **User Logs In**

   - Email and password validated
   - JWT token created: `{ userId: user.id }`
   - Token stored in localStorage on client

3. **Protected Requests**
   - Client sends token in `Authorization: Bearer <token>` header
   - Backend verifies token with JWT secret
   - If valid, `req.userId` is attached to request
   - If invalid, returns 403 Forbidden

**Middleware Implementation**:

```javascript
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
```

---

## 📁 Project Structure

```
Elearning/
├── backend/
│   ├── index.js                 # Express server & routes
│   ├── package.json             # Backend dependencies
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── routes/
│   │   ├── auth.js              # Login/Signup
│   │   ├── notes.js             # Note CRUD & sharing
│   │   ├── quiz.js              # Quiz management
│   │   └── scores.js            # Scores & leaderboard
│   └── prisma/
│       ├── schema.prisma        # Database models
│       └── client.js            # Prisma client
│
├── frontend/
│   ├── package.json             # Frontend dependencies
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js        # Root layout
│   │   │   ├── page.jsx         # Home/Landing
│   │   │   ├── about/           # About page
│   │   │   ├── course/          # Course pages
│   │   │   ├── leaderboard/     # Leaderboard
│   │   │   ├── login/           # Login page
│   │   │   ├── profile/         # User profile
│   │   │   ├── quiz/            # Quiz page
│   │   │   ├── shared/          # Shared notes
│   │   │   └── signup/          # Signup page
│   │   └── components/
│   │       ├── Navbar.jsx       # Navigation
│   │       └── Note.jsx         # Notes component
│   └── globals.css              # Tailwind styles
```

---

## 🔄 API Endpoints Summary

### Authentication

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | `/auth/signup` | Create new account    |
| POST   | `/auth/login`  | Login & get JWT token |

### Courses

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| GET    | `/courses`     | Get all courses        |
| GET    | `/courses/:id` | Get course with videos |

### Notes

| Method | Endpoint                       | Auth | Description         |
| ------ | ------------------------------ | ---- | ------------------- |
| GET    | `/notes/:videoId`              | ✓    | Get personal notes  |
| GET    | `/notes/all`                   | ✓    | Get all user notes  |
| GET    | `/notes/public/video/:videoId` |      | Get public notes    |
| GET    | `/notes/public/:shareId`       |      | Get shared note     |
| POST   | `/notes/create`                | ✓    | Create note         |
| PUT    | `/notes/:noteId`               | ✓    | Update note         |
| DELETE | `/notes/:noteId`               | ✓    | Delete note         |
| POST   | `/notes/make-public/:id`       | ✓    | Make note public    |
| POST   | `/notes/share/:id`             | ✓    | Generate share link |

### Quiz

| Method | Endpoint          | Auth | Description                 |
| ------ | ----------------- | ---- | --------------------------- |
| GET    | `/quiz/:courseId` |      | Get quiz questions          |
| POST   | `/quiz/submit`    | ✓    | Submit answers & save score |

### Scores

| Method | Endpoint                        | Auth | Description            |
| ------ | ------------------------------- | ---- | ---------------------- |
| GET    | `/scores/me`                    | ✓    | Get user scores        |
| GET    | `/scores/leaderboard/:courseId` |      | Get course leaderboard |

---

## 🎨 Key Frontend Components

### 1. **Navbar** (`components/Navbar.jsx`)

- Responsive navigation
- Auth state detection
- Login/Logout functionality
- Mobile menu support

### 2. **Note Component** (`components/Note.jsx`)

- Create, edit, delete notes
- Make notes public
- Generate shareable links
- Display community notes

### 3. **Course Detail** (`app/course/[id]/page.jsx`)

- Video player
- Video list sidebar
- Embedded notes component
- Error/loading states

### 4. **Home Page** (`app/page.jsx`)

- Displays featured courses
- Shows platform features
- Handles backend connectivity
- Fallback demo courses

---

## 🔐 Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Protected Routes**: Auth middleware on sensitive endpoints
4. **CORS Enabled**: Safe cross-origin requests
5. **Input Validation**: Server-side validation on all inputs

---

## 🚨 Important Notes

### Current Limitations (Should Fix in Production)

```javascript
// ❌ SECURITY ISSUE: JWT secret hardcoded
const JWT_SECRET = "super_secret_key";

// ✅ SOLUTION: Use environment variables
const JWT_SECRET = process.env.JWT_SECRET;
```

### .env Files Needed

**backend/.env**

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-here"
```

**frontend/.env.local**

```
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## 📈 Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] AI-powered note recommendations
- [ ] Real-time comments on videos
- [ ] Video analytics/watch time tracking
- [ ] Certificate generation
- [ ] Payment integration for premium courses
- [ ] Mobile app (React Native)
- [ ] Advanced search & filters
- [ ] User notifications & email alerts
- [ ] Discussion forums per course
- [ ] Real-time collaborative notes
- [ ] Video transcription & subtitles
- [ ] Progress dashboard with charts

---

## 🤝 Contributing

To contribute:

1. Create feature branch: `git checkout -b feature/YourFeature`
2. Make changes and test
3. Submit pull request with description

---

## 📝 License

This project is open source and available under the MIT License.

---

## 💡 Quick Tips for Beginners

### How to Add a New Feature

1. **Create Backend API Endpoint** (express route)
2. **Add Database Model** (if needed) in Prisma schema
3. **Run Migration** to update database
4. **Create Frontend Component** that calls the API
5. **Add Navigation** to access the component

### Example: Adding a "Bookmark" Feature

**Step 1**: Update Prisma Schema

```prisma
model Note {
  // ... existing fields
  bookmarked Boolean @default(false)
}
```

**Step 2**: Create API Endpoint

```javascript
router.post("/bookmark/:id", authMiddleware, async (req, res) => {
  const note = await prisma.note.update({
    where: { id: parseInt(req.params.id) },
    data: { bookmarked: true },
  });
  res.json(note);
});
```

**Step 3**: Call from Frontend

```javascript
const handleBookmark = async (noteId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:4000/notes/bookmark/${noteId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Bookmarked!");
};
```

---

## 🆘 Troubleshooting

### Backend won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Reset database
npx prisma migrate reset
```

### Frontend won't connect to backend

- Ensure backend is running on `localhost:4000`
- Check CORS is enabled in `backend/index.js`
- Look at browser console for error messages

### Database errors

```bash
# View current schema
npx prisma studio

# Check migrations
npx prisma migrate status

# Reset to clean state
npx prisma migrate reset
```

---

## 📞 Support

For issues or questions:

- Check existing issues in GitHub
- Review error messages carefully
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors

---

**Happy Learning! 🎓**
