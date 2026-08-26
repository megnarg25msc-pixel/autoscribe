const fs = require('fs');
const path = require('path');

// 1. Mock Browser Environment in Node
global.window = global;
global.location = {
  pathname: '/exam.html',
  href: 'http://localhost:8000/exam.html',
  search: '?subject=math'
};

// Create a DOM with the exact textarea element from exam.html
const answerInputTextarea = {
  id: 'answerInput',
  value: '',
  setAttribute: () => {},
  getAttribute: () => null
};

const elements = {
  'answerInput': answerInputTextarea,
  'questionHeader': { innerHTML: '' },
  'questionText': { textContent: '' },
  'questionProgress': { textContent: '' },
  'timerDisplay': { textContent: '' },
  'saveStatus': { textContent: '' },
  'statusDot': { classList: { add: () => {}, remove: () => {} } },
  'speechStatusText': { textContent: '', innerHTML: '' },
  'examStudentName': { textContent: '' },
  'examRollNumber': { textContent: '' }
};

global.document = {
  getElementById: (id) => elements[id] || null,
  body: {
    addEventListener: () => {}
  },
  createElement: (tag) => ({
    id: '',
    style: {},
    setAttribute: () => {},
    appendChild: () => {}
  })
};

global.localStorage = {
  getItem: (key) => {
    if (key === 'autoscribe_exams') {
      return JSON.stringify([
        {
          id: "exam_math",
          title: "Mathematics",
          durationMinutes: 90,
          totalQuestions: 7,
          questions: [
            { id: 1, text: "Solve for x: 3x + 7 = 22.", marks: 2, section: "Part A (2 Marks)" }
          ]
        }
      ]);
    }
    return null;
  },
  setItem: () => {},
  removeItem: () => {}
};

global.sessionStorage = {
  getItem: () => null,
  setItem: () => {}
};

// Mock SpeechRecognition API
class MockSpeechRecognition {
  constructor() {
    this.continuous = true;
    this.interimResults = true;
    this.lang = 'en-IN';
    this.onresult = null;
    this.onend = null;
    this.onerror = null;
  }
  start() {
    console.log("[Mock SpeechRecognition] microphone started in browser!");
  }
  stop() {
    console.log("[Mock SpeechRecognition] microphone stopped.");
  }
}

global.SpeechRecognition = MockSpeechRecognition;
global.webkitSpeechRecognition = MockSpeechRecognition;

// Mock SpeechSynthesis API
global.speechSynthesis = {
  speaking: false,
  cancel: () => {},
  speak: (utterance) => {
    console.log("[Mock SpeechSynthesis] TTS Speaking:", utterance.text.slice(0, 60) + "...");
    // Simulate TTS completion after prompt
    setTimeout(() => {
      if (utterance.onend) utterance.onend();
    }, 100);
  },
  getVoices: () => []
};

global.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
    this.onend = null;
    this.onerror = null;
  }
};

// Load AutoScribe DB, App, Speech Engine, and Exam Session
global.AutoScribeDB = {
  getExams: async () => JSON.parse(localStorage.getItem('autoscribe_exams')),
  saveAnswer: () => {}
};

global.AutoScribeApp = {
  currentUser: { name: "Test Student", rollNumber: "25ISR023" }
};

require('./js/speech-engine.js');
require('./js/exam-session.js');

async function testBrowserMathFlow() {
  console.log("=== TESTING REAL BROWSER EXECUTION PATH FOR MATHEMATICS ===\n");

  // Initialize Exam Session (Simulates DOMContentLoaded in browser)
  await AutoScribeExamSession.initSession();

  // Wait for 400ms initial trigger + 100ms TTS completion + 400ms squelch buffer
  console.log("Waiting for question prompt TTS to finish and microphone to activate...");
  await new Promise(resolve => setTimeout(resolve, 1200));

  console.log("\n--- SIMULATING STUDENT VOICE DICTATION ---");
  // Student speaks: "x squared plus five x equals twenty five"
  const studentSpokenInput = "x squared plus five x equals twenty five";
  console.log(`Student says: "${studentSpokenInput}"\n`);

  // Simulate SpeechRecognition onresult event in browser
  const mockEvent = {
    resultIndex: 0,
    results: [
      [
        { transcript: studentSpokenInput }
      ]
    ]
  };
  mockEvent.results[0].isFinal = true;

  // Trigger speech recognition result callback
  AutoScribeSpeech.recognition.onresult(mockEvent);

  console.log("\n--- VERIFYING ANSWER BOX DISPLAY IN BROWSER ---");
  const actualValueInTextarea = answerInputTextarea.value;
  console.log(`Textarea #answerInput.value in DOM: "${actualValueInTextarea}"`);

  const expectedValue = "x² + 5x = 25";

  if (actualValueInTextarea === expectedValue) {
    console.log("\n✅ SUCCESS: Spoken answer successfully populated #answerInput in DOM as:", actualValueInTextarea);
  } else {
    console.error("\n❌ FAILURE: Expected #answerInput to be", expectedValue, "but got:", actualValueInTextarea);
    process.exit(1);
  }
}

testBrowserMathFlow();
