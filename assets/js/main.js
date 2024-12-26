/**
 * 
 * @param {*} nombreBiblioteca 
 * Este fetch solicita un archivo JSON correspondiente al nombre de la biblioteca. 
 * Si la respuesta no es válida, lanza un error para manejo adecuado. Si es válida,
 * convierte los datos del JSON a un objeto manipulable en JavaScript.
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
            const paginationContainer = document.getElementById('pagination');

            const epocaPeriodsSelect = document.getElementById('epoca');
            const generoSelect = document.getElementById('genero');
            const idiomaSelect = document.getElementById('idioma');
            const tematicaSelect = document.getElementById('tematica');

            const displayBooks = (books) => {
                const booksHTML = books.map(item => `
                    <div class="books__item">
                        <div class="books__item-image">
                            <img src="/assets/img/logo/logo-locus-cognitionis.svg" alt="Logo del libro">
                        </div>
                        <div class="books__item-text">
                            <h4 class="books__item-title">${item.titulo}</h4>
                            <h5 class="books__item-subtitle">${item.subtitulo}</h5>
                            <p class="books__item-author">Autor: ${item.autor}</p>
                            <p class="books__item-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate consectetur repellendus numquam est, laboriosam aspernatur itaque impedit sint? Dolores illum atque impedit quas reprehenderit harum. Veniam nihil et recusandae quis?</p>
                            <a href='/biblioteca/libro.html?utm_${nombreBiblioteca}=${item.id}' class="button button--primary">Ver más</a>
                        </div>
                    </div>`).join('');
                booksContainer.innerHTML = booksHTML;
            };

            const paginateBooks = (books, itemsPerPage) => {
                let currentPage = 1;
                const totalPages = Math.ceil(books.length / itemsPerPage);

                const renderPage = (page) => {
                    const start = (page - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    displayBooks(books.slice(start, end));
                };

                const renderPagination = () => {
                    const paginationHTML = Array.from({ length: totalPages }, (_, i) => `
                        <button class="pagination__button" data-page="${i + 1}">${i + 1}</button>
                    `).join('');
                    paginationContainer.innerHTML = paginationHTML;
                };

                paginationContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('pagination__button')) {
                        currentPage = parseInt(e.target.dataset.page, 10);
                        renderPage(currentPage);
                    }
                });

                renderPage(currentPage);
                renderPagination();
            };

            const filterBooks = () => {
                const epocaPeriod = epocaPeriodsSelect ? epocaPeriodsSelect.value : '';
                const genero = generoSelect ? generoSelect.value : '';
                const idioma = idiomaSelect ? idiomaSelect.value : '';
                const tematica = tematicaSelect ? tematicaSelect.value : '';

                const filteredBooks = data.filter(book => (
                    (epocaPeriod === '' || book.periodo.toLowerCase() === epocaPeriod) &&
                    (genero === '' || book.genero.toLowerCase() === genero) &&
                    (idioma === '' || book.idioma.toLowerCase() === idioma) &&
                    (tematica === '' || book.tematica.toLowerCase() === tematica)
                ));

                if (paginationContainer) {
                    paginateBooks(filteredBooks, 6);
                } else {
                    displayBooks(filteredBooks);
                }
            };

            const debounce = (func, delay) => {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), delay);
                };
            };

            if (epocaPeriodsSelect) epocaPeriodsSelect.addEventListener('change', filterBooks);
            if (generoSelect) generoSelect.addEventListener('change', filterBooks);
            if (idiomaSelect) idiomaSelect.addEventListener('change', filterBooks);
            if (tematicaSelect) tematicaSelect.addEventListener('change', filterBooks);

            // Filtrar libros basados en la búsqueda
            if (searchInput) {
                /**
                 * Filtra dinámicamente los libros mientras el usuario escribe en el campo de búsqueda.
                 * Si `data-number` está presente, selecciona libros aleatorios de los resultados filtrados. 
                 * De lo contrario, actualiza la paginación para reflejar solo los libros filtrados.
                 */
                searchInput.addEventListener('input', debounce((e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredBooks = data.filter(item =>
                        item.titulo.toLowerCase().includes(searchTerm) ||
                        (item.subtitulo && item.subtitulo.toLowerCase().includes(searchTerm)) ||
                        (item.autor && item.autor.toLowerCase().includes(searchTerm))
                    );
                    if (catalogSection && catalogSection.dataset.number) {
                        displayBooks(getRandomBooks(filteredBooks, parseInt(catalogSection.dataset.number, 10)));
                    } else {
                        paginateBooks(filteredBooks, 6); // Actualizar paginación con resultados filtrados
                    }
                }, 300));
            }

            if (paginationContainer) {
                paginateBooks(data, 4);
            } else {
                displayBooks(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const libraries = ['infantil-primaria', 'secundaria-bachillerato', 'aulas'];

libraries.forEach(library => {
    if (document.querySelector(`.books--${library}`)) {
        allBooks(library);
    }
});
