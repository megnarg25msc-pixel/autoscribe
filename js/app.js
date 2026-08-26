/**
 * AutoScribe - Global Web Application Controller
 * Manages user sessions, accessibility shortcuts, and Sarvam AI voice preferences.
 */

document.addEventListener('DOMContentLoaded', () => {
  AutoScribeApp.init();
});

const AutoScribeApp = {
  currentUser: null,
  isNavigating: false,

  init() {
    this.setupAccessibilityListeners();
    this.checkSession();
    this.initKeyboardShortcuts();
    this.initUserInteractionListeners();
  },

  navigateToLogin() {
    if (this.isNavigating) return;
    this.isNavigating = true;

    if (window.AutoScribeSpeech) {
      AutoScribeSpeech.stopSpeaking();
      AutoScribeSpeech.stopListening();
      AutoScribeSpeech.speak("Opening student login.", () => {
        window.location.href = "login.html";
      });
    }

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  },

  navigateToExam(examId = '') {
    if (this.isNavigating) return;
    this.isNavigating = true;

    const targetUrl = examId ? `exam.html?id=${encodeURIComponent(examId)}` : 'exam.html';

    if (window.AutoScribeSpeech) {
      AutoScribeSpeech.stopSpeaking();
      AutoScribeSpeech.stopListening();
      AutoScribeSpeech.speak("Starting exam.", () => {
        window.location.href = targetUrl;
      });
    }

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1000);
  },

  checkSession() {
    let sessionData = sessionStorage.getItem('autoscribe_user');
    if (!sessionData) {
      sessionData = localStorage.getItem('autoscribe_user');
    }
    if (sessionData) {
      try {
        this.currentUser = JSON.parse(sessionData);
      } catch (e) {
        this.currentUser = null;
      }
    }
    this.updateUserDisplay();
  },

  updateUserDisplay() {
    if (!this.currentUser) return;
    const name = this.currentUser.name || this.currentUser.studentName || '';
    const roll = this.currentUser.rollNumber || this.currentUser.studentId || '';

    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
      userDisplay.textContent = `Student: ${name}${roll ? ` (${roll})` : ''} | Voice: ${this.currentUser.gender || 'Male'}`;
    }

    const examStudentName = document.getElementById('examStudentName');
    const examRollNumber = document.getElementById('examRollNumber');
    if (examStudentName && name) examStudentName.textContent = name;
    if (examRollNumber && roll) examRollNumber.textContent = roll;
  },

  loginUser(rollNumber, studentName, gender = 'male', speed = '1.0') {
    const cleanRoll = String(rollNumber || '').trim();
    const cleanName = String(studentName || '').trim();

    const user = {
      studentId: cleanRoll,
      rollNumber: cleanRoll,
      name: cleanName,
      studentName: cleanName,
      gender: gender || 'male',
      speed: speed || '1.0',
      role: 'student',
      loginTime: new Date().toISOString()
    };

    sessionStorage.setItem('autoscribe_user', JSON.stringify(user));
    localStorage.setItem('autoscribe_user', JSON.stringify(user));
    localStorage.setItem('autoscribe_voice_gender', user.gender);
    localStorage.setItem('autoscribe_voice_speed', user.speed);
    this.currentUser = user;
    this.updateUserDisplay();
  },

  logout() {
    sessionStorage.removeItem('autoscribe_user');
    localStorage.removeItem('autoscribe_user');
    this.currentUser = null;
    if (window.AutoScribeSpeech) {
      AutoScribeSpeech.speak("Logging out. Returning to main menu.", () => {
        window.location.href = 'index.html';
      });
    } else {
      window.location.href = 'index.html';
    }
  },

  setupAccessibilityListeners() {
    const contrastBtn = document.getElementById('toggleContrastBtn');
    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => this.toggleHighContrast());
    }

    const voiceAssistBtn = document.getElementById('voiceAssistBtn');
    if (voiceAssistBtn) {
      voiceAssistBtn.addEventListener('click', () => {
        if (window.AutoScribeSpeech) {
          AutoScribeSpeech.speak("Commands: Read question, Start answer, Read answer, Delete sentence, Next question, Previous question, Save answer, Submit exam.");
        }
      });
    }
  },

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isHigh = document.body.classList.contains('high-contrast');
    localStorage.setItem('autoscribe_contrast', isHigh ? 'true' : 'false');
    if (window.AutoScribeSpeech) {
      AutoScribeSpeech.speak(isHigh ? "High contrast mode enabled." : "High contrast mode disabled.");
    }
  },

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        this.toggleHighContrast();
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (window.AutoScribeSpeech) AutoScribeSpeech.stopSpeaking();
      }
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (window.AutoScribeSpeech) {
          AutoScribeSpeech.stopListening();
          AutoScribeSpeech.speak("Microphone paused.");
        }
      }
    });

    if (localStorage.getItem('autoscribe_contrast') === 'true') {
      document.body.classList.add('high-contrast');
    }
  },

  initUserInteractionListeners() {
    const unlockAudio = () => {
      if (window.AutoScribeSpeech) {
        AutoScribeSpeech.getAudioContext();
        if (!AutoScribeSpeech.isListening) {
          AutoScribeSpeech.startListening();
        }
      }
    };

    document.body.addEventListener('click', unlockAudio, { once: true });
    document.body.addEventListener('keydown', unlockAudio, { once: true });
  }
};
