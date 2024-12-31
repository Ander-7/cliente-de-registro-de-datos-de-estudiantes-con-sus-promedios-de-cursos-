const apiUrl = 'http://192.168.18.14:5000/api/estudiantes'; 


async function checkApiConnection() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('No se pudo conectar a la API');
    console.log('Conexión con la API exitosa.');
  } catch (error) {
    console.error('Error de conexión con la API:', error);
  }
}


async function loadStudents() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('No se pudo obtener la lista de estudiantes');
    const students = await response.json();

    const studentTableBody = document.querySelector('#student-table tbody');
    studentTableBody.innerHTML = '';

    students.forEach((student) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.nombre}</td>
        <td>${student.edad}</td>
        <td>${student.grado}</td>
        <td>${student.promedio}</td>
        <td>
          <button onclick="editStudent(${student.id})">Editar</button>
          <button onclick="deleteStudent(${student.id})">Eliminar</button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar estudiantes:', error);
  }
}

// Agregar estudiante
async function addStudent() {
  const nombre = document.getElementById('student-name').value;
  const edad = document.getElementById('student-age').value;
  const grado = document.getElementById('student-grade').value;
  const promedio = document.getElementById('student-average').value;

  const student = { nombre, edad: parseInt(edad), grado, promedio: parseFloat(promedio) };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });

    if (!response.ok) throw new Error('Error al agregar el estudiante');
    console.log('Estudiante agregado correctamente');
    document.getElementById('student-form').reset();
    hideForm();
    loadStudents();
  } catch (error) {
    console.error('Error al agregar el estudiante:', error);
  }
}

// Actualizar estudiante
async function updateStudent(id) {
  const nombre = document.getElementById('student-name').value;
  const edad = document.getElementById('student-age').value;
  const grado = document.getElementById('student-grade').value;
  const promedio = document.getElementById('student-average').value;

  const student = { nombre, edad: parseInt(edad), grado, promedio: parseFloat(promedio) };

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });

    if (!response.ok) throw new Error('Error al actualizar el estudiante');
    console.log('Estudiante actualizado correctamente');
    document.getElementById('student-form').reset();
    hideForm(); 
    loadStudents();
  } catch (error) {
    console.error('Error al actualizar el estudiante:', error);
  }
}

// Eliminar estudiante
async function deleteStudent(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar el estudiante');
    console.log('Estudiante eliminado correctamente');
    loadStudents();
  } catch (error) {
    console.error('Error al eliminar el estudiante:', error);
  }
}

// Editar estudiante
function editStudent(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(student => {
      document.getElementById('student-id').value = student.id;
      document.getElementById('student-name').value = student.nombre;
      document.getElementById('student-age').value = student.edad;
      document.getElementById('student-grade').value = student.grado;
      document.getElementById('student-average').value = student.promedio;
      showForm();
    })
    .catch(error => console.error('Error al obtener los datos del estudiante:', error));
}


function showForm() {
  document.getElementById('student-form-container').style.display = 'block';
}


function hideForm() {
  document.getElementById('student-form-container').style.display = 'none';
}


document.getElementById('student-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const studentId = document.getElementById('student-id').value;
  if (studentId) {
    updateStudent(studentId);
  } else {
    addStudent();
  }
});

// Mostrar formulario para agregar un estudiante
document.getElementById('add-student-btn').addEventListener('click', () => {
  showForm();
});

// Cancelar acción y ocultar formulario
document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementById('student-form').reset();
  hideForm();
});


checkApiConnection();
loadStudents();
