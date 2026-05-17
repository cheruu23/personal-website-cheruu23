// Tab Switching Logic
function switchTab(tabId, event) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// Handle Project Submission
document.getElementById('projectForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const projectData = {
    title: document.getElementById('projTitle').value,
    techStack: document.getElementById('projTech').value.split(',').map(item => item.trim()),
    link: document.getElementById('projLink').value,
    description: document.getElementById('projDesc').value
  };

  // Get existing projects, add new, save back to storage
  const existingProjects = JSON.parse(localStorage.getItem('ca_projects')) || [];
  existingProjects.push(projectData);
  localStorage.setItem('ca_projects', JSON.stringify(existingProjects));

  alert("Project added successfully! Go to the home page to see it.");
  this.reset();
});

// Handle Education Submission
document.getElementById('educationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const educationData = {
    title: document.getElementById('eduTitle').value,
    institution: document.getElementById('eduSchool').value,
    years: document.getElementById('eduYears').value
  };

  const existingEdu = JSON.parse(localStorage.getItem('ca_education')) || [];
  existingEdu.push(educationData);
  localStorage.setItem('ca_education', JSON.stringify(existingEdu));

  alert("Education added successfully!");
  this.reset();
});

// Handle Certification Submission
document.getElementById('certForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const certData = {
    name: document.getElementById('certName').value,
    issuer: document.getElementById('certIssuer').value,
    link: document.getElementById('certLink').value
  };

  const existingCerts = JSON.parse(localStorage.getItem('ca_certs')) || [];
  existingCerts.push(certData);
  localStorage.setItem('ca_certs', JSON.stringify(existingCerts));

  alert("Certification added successfully!");
  this.reset();
});

// Clear Data utility for testing
function clearData() {
    if(confirm("Are you sure you want to delete all dynamically added data? This cannot be undone.")) {
        localStorage.removeItem('ca_projects');
        localStorage.removeItem('ca_education');
        localStorage.removeItem('ca_certs');
        alert("Data cleared. Refreshing index.html will revert to the defaults.");
    }
}