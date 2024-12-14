/**
 * 
 * @param {*} nombreBiblioteca 
 */

function allBooks(nombreBiblioteca) {
    fetch(`/assets/db/${nombreBiblioteca}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('El formato de los datos no es un array.');
            }

            const booksContainer = document.querySelector(`.books--${nombreBiblioteca}`);
            const searchInput = document.getElementById('search-input');

            const getRandomBooks = (books, count) => {
                const shuffled = books.sort(() => 0.5 - Math.random());
                return shuffled.slice(0, count);
            };

            const displayBooks = (books) => {
                let booksHTML = '';
                books.forEach(item => { // Mostrar solo libros seleccionados aleatoriamente
                    booksHTML += `<div class="books__item">
                        <div class="books__item-image">
                            <img src="/assets/img/logo/logo-locus-cognitionis.svg" alt="Logo del libro">
                        </div>
                        <div class="books__item-text">
                            <h4 class="books__item-title">${item.titulo}</h4>
                            <h5 class="books__item-subtitle">${item.subtitulo}</h5>
                            <p class="books__item-author">Autor: ${item.autor}</p>
                            <p class="books__item-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate consectetur repellendus numquam est, laboriosam aspernatur itaque impedit sint? Dolores illum atque impedit quas reprehenderit harum. Veniam nihil et recusandae quis?</p>
                            <a href='./libro.html?utm_cod=${item.id}' class="button button--primary">Ver más</a>
                        </div>
                    </div>`;
                });
                booksContainer.innerHTML = booksHTML;
            };

            // Mostrar 4 libros aleatorios al cargar la página
            displayBooks(getRandomBooks(data, 4));

            // Filtrar libros basados en la búsqueda
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredBooks = data.filter(item =>
                        item.titulo.toLowerCase().includes(searchTerm) ||
                        (item.subtitulo && item.subtitulo.toLowerCase().includes(searchTerm))
                    );
                    displayBooks(getRandomBooks(filteredBooks, 4)); // Mostrar solo 4 resultados aleatorios
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

if (document.querySelector('.books--infantil-primaria')) {
    allBooks('infantil-primaria');
}

if (document.querySelector('.books--secundaria-bachillerato')) {
    allBooks('secundaria-bachillerato');
}

if (document.querySelector('.books--aulas')) {
    allBooks('aulas');
}
