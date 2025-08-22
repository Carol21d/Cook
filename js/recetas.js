// Llama a la función de forma asíncrona cuando el contenido del DOM se ha cargado
document.addEventListener('DOMContentLoaded', obtenerRecetas);

/**
 * Función principal para obtener recetas de la API de Spoonacular.
 * Lee los ingredientes de la URL, realiza una llamada a la API
 * y muestra los resultados o un mensaje de error.
 */
async function obtenerRecetas() {
    const API_KEY = '628a7e04b0a843d782b0766a0bacfb03';
    const urlParams = new URLSearchParams(window.location.search);
    const ingredientesString = urlParams.get('ingredientes');

    // Muestra un mensaje si no se pasaron ingredientes en la URL
    if (!ingredientesString || ingredientesString === "") {
        console.error('No se encontraron ingredientes en la URL.');
        mostrarMensajeNoRecetas("Por favor, selecciona algunos ingredientes antes de buscar.");
        return;
    }

    // URL de la API con el parámetro 'ranking=2' para mayor flexibilidad en la búsqueda
    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientesString}&number=3&ranking=2`;

    try {
        const response = await fetch(url);
        
        // Maneja errores de respuesta HTTP (ej: 404, 401, 500)
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log(data); // Muestra los datos de la API en la consola para depuración
        
        // Verifica si la API devolvió un array vacío de recetas
        if (data.length === 0) {
            mostrarMensajeNoRecetas("No se encontraron recetas con los ingredientes seleccionados. Intenta con una combinación diferente.");
        } else {
            mostrarRecetas(data); // Muestra las recetas si se encontraron
        }

    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        mostrarMensajeError(); // Muestra un mensaje genérico para errores de red o servidor
    }
}

/**
 * Muestra las recetas obtenidas de la API en el DOM.
 * @param {Array<Object>} recetas - Un array de objetos de receta.
 */
function mostrarRecetas(recetas) {
    const contenedor = document.getElementById('recetas-container');
    if (!contenedor) {
        console.error("El contenedor de recetas no se encontró en el DOM.");
        return;
    }

    // Limpia el contenido previo del contenedor
    contenedor.innerHTML = ''; 

    // Itera sobre cada receta para crear y agregar su tarjeta al DOM
    recetas.forEach(receta => {
        const tarjetaReceta = document.createElement('div');
        tarjetaReceta.classList.add('tarjeta-receta');

        // Crea y configura el elemento de imagen
        const imagen = document.createElement('img');
        imagen.src = receta.image;
        imagen.alt = receta.title;
        tarjetaReceta.appendChild(imagen);

        // Crea y configura el título de la receta
        const titulo = document.createElement('h3');
        titulo.textContent = receta.title;
        tarjetaReceta.appendChild(titulo);

        // Agrega la tarjeta de la receta al contenedor principal
        contenedor.appendChild(tarjetaReceta);
    });
}

/**
 * Muestra un mensaje de que no se encontraron recetas.
 * @param {string} mensaje - El mensaje a mostrar.
 */
function mostrarMensajeNoRecetas(mensaje) {
    const contenedor = document.getElementById('recetas-container');
    if (contenedor) {
        contenedor.innerHTML = `<p class="aviso">${mensaje}</p>`;
    }
}

/**
 * Muestra un mensaje de error genérico cuando la llamada a la API falla.
 */
function mostrarMensajeError() {
    const contenedor = document.getElementById('recetas-container');
    if (contenedor) {
        contenedor.innerHTML = '<p class="aviso">Ha ocurrido un error al cargar las recetas. Por favor, inténtelo de nuevo más tarde.</p>';
    }
}
