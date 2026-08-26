/**
 * AutoScribe - Admin & Teacher Management Script
 * Enables teachers to manage question banks, review submitted voice answers, and export final exam papers.
 */

document.addEventListener('DOMContentLoaded', () => {
  AutoScribeAdmin.init();
});

const AutoScribeAdmin = {
  async init() {
    this.renderSubmissions();
    this.setupForm();
  },

  async renderSubmissions() {
    const tableBody = document.getElementById('submissionsTableBody');
    if (!tableBody) return;

    const submissions = JSON.parse(localStorage.getItem('autoscribe_submissions') || '[]');

    if (submissions.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">No student submissions recorded yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = submissions.map(sub => `
      <tr>
        <td><strong>${sub.submissionId}</strong></td>
        <td>${sub.studentName} (${sub.studentId})</td>
        <td>${sub.examId}</td>
        <td>${new Date(sub.submittedAt).toLocaleString()}</td>
        <td>
          <button class="btn btn-secondary" onclick="AutoScribeAdmin.viewAnswers('${sub.submissionId}')">👁️ View Answers</button>
        </td>
      </tr>
    `).join('');
  },

  viewAnswers(submissionId) {
    const submissions = JSON.parse(localStorage.getItem('autoscribe_submissions') || '[]');
    const sub = submissions.find(s => s.submissionId === submissionId);
    if (!sub) return;

    let content = `EXAMINATION RESPONSE REPORT\n`;
    content += `===============================\n`;
    content += `Submission ID: ${sub.submissionId}\n`;
    content += `Student: ${sub.studentName} (${sub.studentId})\n`;
    content += `Exam ID: ${sub.examId}\n`;
    content += `Submitted At: ${sub.submittedAt}\n`;
    content += `===============================\n\n`;

    for (const [qId, ansText] of Object.entries(sub.answers)) {
      content += `Question ${qId}:\n`;
      content += `${ansText || '[No Answer Provided]'}\n`;
      content += `-------------------------------\n\n`;
    }

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';

    modal.innerHTML = `
      <div class="card" style="max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto;">
        <h3 class="card-title">Submission Details (${sub.studentName})</h3>
        <pre style="background: #0f172a; padding: 1.5rem; border-radius: 8px; font-family: monospace; white-space: pre-wrap; color: #38bdf8;">${content}</pre>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button class="btn btn-primary" onclick="AutoScribeAdmin.downloadReport('${sub.submissionId}', \`${encodeURIComponent(content)}\`)">📥 Download Text Report</button>
          <button class="btn btn-secondary" onclick="this.closest('div').parentElement.parentElement.remove()">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  },

  downloadReport(submissionId, encodedContent) {
    const text = decodeURIComponent(encodedContent);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AutoScribe_${submissionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  },

  setupForm() {
    const form = document.getElementById('createExamForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('examTitle').value;
        const code = document.getElementById('examCode').value;
        const duration = parseInt(document.getElementById('examDuration').value);
        const q1 = document.getElementById('q1Text').value;

        const newExam = {
          id: 'exam_' + Date.now(),
          title,
          code,
          durationMinutes: duration,
          totalQuestions: 1,
          questions: [
            { id: 1, text: q1, marks: 10 }
          ]
        };

        const existingExams = JSON.parse(localStorage.getItem('autoscribe_exams') || '[]');
        existingExams.push(newExam);
        localStorage.setItem('autoscribe_exams', JSON.stringify(existingExams));

        alert("Exam created successfully!");
        form.reset();
      });
    }
  }
};
