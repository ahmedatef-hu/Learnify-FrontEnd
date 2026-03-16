# 🎓 Learnify Frontend - AI-Powered Learning Platform

A modern React frontend for the Learnify educational platform that combines student skill exchange with AI-powered study assistance.

## ✨ Features

### 🤖 AI Study Assistant
- **Smart Exam Generation**: AI creates custom exams from your study materials
- **PDF Text Extraction**: Upload PDFs and automatically extract content for AI processing
- **Intelligent Chat Bot**: Get personalized help and explanations
- **Multiple Question Types**: Fill-in-the-blank, multiple choice, and comprehension questions

### 📚 Study Management
- **Material Upload**: Support for PDF, Word, PowerPoint, and text files
- **Study Planner**: Organize subjects and track progress
- **Progress Tracking**: Monitor your learning journey
- **Revision Tools**: Interactive revision sessions with AI assistance

### 👥 Student Network
- **Skill Exchange**: Connect students who want to learn with those who can teach
- **Profile Management**: Showcase your skills and learning goals
- **Student Directory**: Find study partners and mentors

## 🚀 Tech Stack

- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **PDF.js** for PDF processing
- **AOS** for animations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd learnify-frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**

Create a `.env` file:
```env
VITE_API_URL=https://learnify-back-end.vercel.app/api
```

4. **Start Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify
The project is configured for automatic deployment to Netlify:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://learnify-back-end.vercel.app/api` |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddMaterialForm.jsx
│   ├── MaterialUpload.jsx
│   ├── Navbar.jsx
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx
│   ├── StudyPlanner.jsx
│   ├── PdfExam.jsx
│   └── ...
├── services/           # API client services
│   └── apiClient.js
├── utils/              # Utility functions
│   ├── storage.js
│   └── helpers.js
├── assets/             # Static assets
└── App.jsx             # Main app component
```

## 🔧 Key Features Implementation

### PDF Processing
- Client-side PDF text extraction using PDF.js
- Automatic content parsing for AI processing
- Support for multi-page documents
- Fallback handling for protected or image-based PDFs

### Study Material Management
- Local storage for offline access
- File upload with type detection
- Content validation and error handling
- Progress tracking and analytics

### AI Integration
- Real-time communication with backend AI services
- Smart question generation from uploaded materials
- Interactive chat bot for study assistance
- Contextual help and explanations

## 🎨 Styling

The project uses Tailwind CSS for styling with:
- Dark/Light mode support
- Responsive design
- Custom animations with AOS
- Modern UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Related Projects

- [Learnify Backend](https://github.com/username/learnify-backend) - Node.js API server

## 📞 Support

For support, create an issue in this repository.

---

Made with ❤️ for students, by students