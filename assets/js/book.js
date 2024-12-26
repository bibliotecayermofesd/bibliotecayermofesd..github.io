/**
 * Si la página del libro seleccionado incluye en la UTM el código del libro, 
 * la página será construida con su información correspondiente.
 */
function getUtmKey(url = window.location.href) {
    const regex = /[?&]utm_([^=]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Ejemplo de uso con la URL actual
const utmKey = getUtmKey(); // Usará la URL actual del navegador
const booksContainer = document.querySelector('.books');

if (utmKey) {
    fetch(`/assets/db/${utmKey}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            let booksHTML = ''; // Acumulador de HTML

            // Obtener los parámetros de la URL actual
            const urlParams = new URLSearchParams(window.location.search);

            // Detectar el parámetro UTM correspondiente
            const bookId = urlParams.get(`utm_${utmKey}`);

            if (bookId) {
                // Filtrar el libro correspondiente al ID
                const selectedBook = data.find(item => item.id == bookId);

                if (selectedBook) {
                    booksHTML = `
                        <div class="book__item">    
                            <div class="book__item-image">
                                <img src="/assets/img/logo/logo-locus-cognitionis.svg" alt="Logo del libro">
                            </div>
                            <div class="book__item-text">
                                <h4 class="book__item-title">${selectedBook.titulo}</h4>
                                <h5 class="book__item-subtitle">${selectedBook.subtitulo}</h5>
                                <p class="book__item-author">Autor: ${selectedBook.autor}</p>
                                <p class="book__item-ano_publicacion">Primera Edición: ${selectedBook.ano_publicacion}</p>
                                <p class="book__item-editorial">Editorial: ${selectedBook.editorial}</p>
                                <p class="book__item-ano_edicion">Año Edición: ${selectedBook.ano_edicion}</p>
                                <p class="book__item-description">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Voluptate consectetur repellendus numquam est, laboriosam aspernatur itaque impedit sint?
                                    Dolores illum atque impedit quas reprehenderit harum. Veniam nihil et recusandae quis?</p>
                            </div>
                        </div>`;
                } else {
                    // Si no se encuentra ningún libro que coincida
                    booksHTML = `<p class="books__error">No se encontró información del libro solicitado.</p>`;
                }
            } else {
                // Si no hay un parámetro UTM válido en la URL
                booksHTML = `<p class="books__error">No se encontró un código válido en la URL.</p>`;
            }

            // Establece el contenido de 'booksContainer'
            booksContainer.innerHTML = booksHTML;
        })
        .catch(error => {
            console.error('Error:', error);
            booksContainer.innerHTML = `<p class="books__error">Hubo un error al cargar la información. Por favor, intenta nuevamente.</p>`;
        });
} else {
    console.warn('No se encontró el parámetro UTM en la URL.');
    booksContainer.innerHTML = `<p class="books__error">No se encontró un código válido en la URL.</p>`;
}
