# AutoScribe – AI-Powered Exam Writing Aid for Blind Students

**AutoScribe** is a lightweight, laptop-friendly web application designed for 2nd-year M.Sc Computer Science project submission. It provides a fully voice-driven exam writing environment for visually impaired students using Speech-to-Text (STT), Text-to-Speech (TTS), AI text normalization, and Firebase Cloud database synchronization.

---

## 🚀 Quick Start Guide (Run on Any Laptop)

### Method 1: Local HTTP Server (Recommended for Web Speech API Permissions)
Speech recognition in modern web browsers requires an `http://localhost` or `https://` origin.

#### Option A: Using Python 3 (Installed by default on most laptops)
Open your terminal/command prompt in the `autoscribe` directory and run:
```bash
python -m http.server 8000
```
Then open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

#### Option B: Using Node.js / npx
```bash
npx http-server -p 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

---

## 🎙️ Core Voice Commands

| Voice Command | Action | Audio Feedback |
| :--- | :--- | :--- |
| `"Read question"` | Reads active exam question aloud | Synthesized TTS Speech |
| `"Start answer"` | Activates continuous microphone recording | High pitch beep (880Hz) |
| `"Stop recording"` | Pauses microphone | Low pitch beep (440Hz) |
| `"Read my answer"` | Reads back recorded response text | Synthesized TTS Speech |
| `"Next question"` | Saves & moves to next question | Speech notification |
| `"Previous question"` | Saves & moves to previous question | Speech notification |
| `"Delete last sentence"` | Removes last spoken sentence | Confirmation speech |
| `"Clear answer"` | Erases answer field | Confirmation speech |
| `"Save answer"` | Auto-saves answer locally and to cloud | Confirmation speech |
| `"Submit exam"` | Prompts final submission confirmation | Voice confirmation prompt |

---

## ⌨️ Accessibility Keyboard Shortcuts
- `Alt + H`: Toggle WCAG AAA High-Contrast Mode (Yellow text on Black background)
- `Alt + S`: Immediately stop active Text-to-Speech reading
- `Alt + M`: Instantly pause microphone listening

---

## 📁 File Structure
```
autoscribe/
├── index.html            # Main Portal Launcher & Orientation
├── login.html            # Accessible Student Login Screen
├── dashboard.html        # Student Exam Selection Dashboard
├── exam.html             # Core Active Voice Exam Writer Interface
├── confirmation.html     # Submission Confirmation Screen
├── admin.html            # Educator & Admin Exam Management
├── css/
│   └── styles.css        # Accessible Design System & High-Contrast Styling
├── js/
│   ├── firebase-config.js # Firebase Cloud & LocalStorage Fallback DB
│   ├── speech-engine.js   # Web Speech API STT, TTS & Voice Command Router
│   ├── app.js             # Global App & Keyboard Navigation Controller
│   ├── exam-session.js    # Exam State Machine & Auto-Save Timer
│   └── admin.js           # Educator Report Viewer & Exam Creator
└── README.md             # Documentation & Setup Guide
```

---

## 🌐 Browser Compatibility
- **Google Chrome** (Recommended - Best Web Speech API Performance)
- **Microsoft Edge** (Full Support)
- **Brave / Opera** (Full Support)
