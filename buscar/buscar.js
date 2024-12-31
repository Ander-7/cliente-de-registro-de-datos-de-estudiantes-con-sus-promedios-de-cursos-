
const API_BASE_URL = 'http://192.168.18.14:5000/api/estudiantes';  

const searchForm = document.getElementById('search-form');
const searchQueryInput = document.getElementById('search-query');
const resultsTableBody = document.querySelector('#results-table tbody');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();


  const query = searchQueryInput.value.trim();

  
  if (!query) {
    alert('Por favor ingrese un ID o un Nombre para buscar');
    return;
  }

  try {
    
    const response = await fetch(`${API_BASE_URL}?search=${query}`);
    if (!response.ok) {
      throw new Error('Error al buscar estudiantes');
    }

    const data = await response.json();
    
    
    const filteredResults = data.filter(student => {
      return student.id == query || student.nombre.toLowerCase() === query.toLowerCase();
    });

    renderResults(filteredResults);  
  } catch (error) {
    alert('No se pudieron obtener los datos: ' + error.message);
  }
});


function renderResults(data) {
  
  resultsTableBody.innerHTML = '';

  if (data.length === 0) {
    resultsTableBody.innerHTML = '<tr><td colspan="5">No se encontraron resultados exactos</td></tr>';
    return;
  }

 
  data.forEach((student) => {
    const row = `
      <tr>
        <td>${student.id}</td>
        <td>${student.nombre}</td>
        <td>${student.edad}</td>
        <td>${student.grado}</td>
        <td>${student.promedio}</td>
      </tr>
    `;
    resultsTableBody.innerHTML += row;
  });
}
