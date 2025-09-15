  const apiUrl = 'http://localhost:3000/students';

  function fetchStudents() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(students => {
        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = '';

        students.forEach(student => {
          let subjects = [];
          try {
            subjects = Array.isArray(student.subjects) ? student.subjects : JSON.parse(student.subjects);
          } catch {
            subjects = student.subjects ? student.subjects.split(',') : [];
          }

          let marks = {};
          try {
            marks = typeof student.marks === 'object' ? student.marks : JSON.parse(student.marks);
          } catch {
            marks = {};
          }

          const marksHtml = Object.entries(marks)
            .map(([subject, mark]) => `<span>${subject}: ${mark}</span>`)
            .join('');

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.roll_number}</td>
            <td>${student.class}</td>
            <td>${subjects.join(', ')}</td>
            <td class="marks">${marksHtml}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Failed to fetch students:', error);
      });
  }

  // Fetch and display students on page load
  fetchStudents();
</script><script>
  const apiUrl = 'http://localhost:3000/students';

  function fetchStudents() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(students => {
        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = '';

        students.forEach(student => {
          let subjects = [];
          try {
            subjects = Array.isArray(student.subjects) ? student.subjects : JSON.parse(student.subjects);
          } catch {
            subjects = student.subjects ? student.subjects.split(',') : [];
          }

          let marks = {};
          try {
            marks = typeof student.marks === 'object' ? student.marks : JSON.parse(student.marks);
          } catch {
            marks = {};
          }

          const marksHtml = Object.entries(marks)
            .map(([subject, mark]) => `<span>${subject}: ${mark}</span>`)
            .join('');

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.roll_number}</td>
            <td>${student.class}</td>
            <td>${subjects.join(', ')}</td>
            <td class="marks">${marksHtml}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Failed to fetch students:', error);
      });
  }

  // Fetch and display students on page load
  fetchStudents();

