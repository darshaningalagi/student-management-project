const apiUrl = 'http://localhost:3000/students';

document.getElementById('subjects').addEventListener('change', function() {
  const marksDiv = document.getElementById('marksInputs');
  marksDiv.innerHTML = '';
  Array.from(this.selectedOptions).forEach(option => {
    const wrap = document.createElement('div');
    const label = document.createElement('span');
    label.className = "subject-label";
    label.textContent = option.value;
    const markInput = document.createElement('input');
    markInput.type = 'number';
    markInput.min = 0;
    markInput.max = 100;
    markInput.placeholder = 'Marks';
    markInput.className = "subject-mark-input";
    markInput.name = `mark_${option.value}`;
    wrap.appendChild(label);
    wrap.appendChild(markInput);
    marksDiv.appendChild(wrap);
  });
});

function fetchStudents() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(students => {
      const tbody = document.getElementById('studentsTable');
      tbody.innerHTML = '';
      students.forEach(student => {
        let subs = [];
        try {
          subs = Array.isArray(student.subjects) ? student.subjects : JSON.parse(student.subjects);
        } catch {
          subs = student.subjects ? student.subjects.split(',') : [];
        }
        let marks = {};
        try {
          marks = typeof student.marks === "object" ? student.marks : JSON.parse(student.marks);
        } catch {
          marks = {};
        }
        tbody.innerHTML += `<tr>
          <td>${student.name}</td>
          <td>${student.age}</td>
          <td>${student.roll_number}</td>
          <td>${student.class}</td>
          <td style="color:#2473b3"><b>${subs.join(', ')}</b></td>
          <td>${Object.entries(marks).map(([sub, val]) =>
            `<span style="background:#d2eeff;color:#1362a1;font-weight:600;padding:2px 9px;border-radius:7px;margin:2px 2px;">${sub}: ${val}</span>`
            ).join('<br>')}</td>
          <td>
            <button class="action-btn" onclick='editStudent(${student.id}, "${student.name}", ${student.age}, "${student.roll_number}", "${student.class}", ${JSON.stringify(subs)}, ${JSON.stringify(marks)})'>Edit</button>
            <button class="action-btn delete" onclick="deleteStudent(${student.id})">Delete</button>
          </td>
        </tr>`;
      });
    });
}

document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const subjectsSelect = document.getElementById('subjects');
  const selectedSubjects = Array.from(subjectsSelect.selectedOptions).map(option => option.value);
  const marksInputs = document.querySelectorAll('#marksInputs input');
  let marks = {};
  marksInputs.forEach(input => {
    const subj = input.name.replace('mark_', '');
    marks[subj] = Number(input.value);
  });
  const id = document.getElementById('studentId').value;
  const data = {
    name: document.getElementById('name').value.trim(),
    age: Number(document.getElementById('age').value),
    roll_number: document.getElementById('roll_number').value.trim(),
    class: document.getElementById('class').value.trim(),
    subjects: selectedSubjects,
    marks: marks
  };
  if (id) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      resetForm();
      fetchStudents();
    });
  } else {
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      resetForm();
      fetchStudents();
    });
  }
});

function editStudent(id, name, age, roll_number, className, subjectsArray, marksObject) {
  document.getElementById('studentId').value = id;
  document.getElementById('name').value = name;
  document.getElementById('age').value = age;
  document.getElementById('roll_number').value = roll_number;
  document.getElementById('class').value = className;
  // Select the subjects
  const subjectsSelect = document.getElementById('subjects');
  Array.from(subjectsSelect.options).forEach(option => {
    option.selected = subjectsArray.includes(option.value);
  });
  // Render marks inputs with values
  const marksDiv = document.getElementById('marksInputs');
  marksDiv.innerHTML = '';
  subjectsArray.forEach(subject => {
    const wrap = document.createElement('div');
    const label = document.createElement('span');
    label.className = "subject-label";
    label.textContent = subject;
    const markInput = document.createElement('input');
    markInput.type = 'number';
    markInput.min = 0;
    markInput.max = 100;
    markInput.placeholder = 'Marks';
    markInput.className = "subject-mark-input";
    markInput.name = `mark_${subject}`;
    markInput.value = marksObject[subject] !== undefined ? marksObject[subject] : '';
    wrap.appendChild(label);
    wrap.appendChild(markInput);
    marksDiv.appendChild(wrap);
  });
}

function deleteStudent(id) {
  fetch(`${apiUrl}/${id}`, { method: 'DELETE' }).then(() => fetchStudents());
}

function resetForm() {
  document.getElementById('studentId').value = '';
  document.getElementById('studentForm').reset();
  document.getElementById('marksInputs').innerHTML = '';
  const subjectsSelect = document.getElementById('subjects');
  Array.from(subjectsSelect.options).forEach(option => option.selected = false);
}

fetchStudents();

