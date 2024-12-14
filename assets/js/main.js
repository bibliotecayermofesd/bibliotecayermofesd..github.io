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
            // Validación: Verifica si los datos son un array.
            // Esto asegura que las operaciones subsiguientes (como iteraciones) no generen errores.
            if (!Array.isArray(data)) {
                throw new Error('El formato de los datos no es un array.');
            }

            // Selección del contenedor donde se renderizan los libros.
            // Este elemento es esencial para insertar dinámicamente los libros recuperados del archivo JSON.
            const booksContainer = document.querySelector(`.books--${nombreBiblioteca}`);
            const searchInput = document.getElementById('search-input');
            const paginationContainer = document.getElementById('pagination'); // Contenedor para paginación

            /**
             * Devuelve un conjunto aleatorio de libros.
             * Esta función utiliza el método sort con un comparador aleatorio
             * para reordenar los elementos del array en posiciones aleatorias. Posteriormente, 
             * utiliza slice para seleccionar los primeros 'count' elementos.
             * @param {Array} books - Lista de libros.
             * @param {number} count - Cantidad de libros a seleccionar.
             * @returns {Array} Subconjunto aleatorio de libros.
             */
            const getRandomBooks = (books, count) => {
                const shuffled = [...books].sort(() => 0.5 - Math.random());
                return shuffled.slice(0, count);
            };

            /**
             * Renderiza una lista de libros en el contenedor correspondiente.
             * @param {Array} books - Lista de libros a mostrar.
             */
            const displayBooks = (books) => {
                let booksHTML = '';
                books.forEach(item => {
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

            /**
             * Implementa paginación para dividir libros en páginas.
             * @param {Array} books - Lista de libros.
             * @param {number} itemsPerPage - Cantidad de elementos por página.
             * 
             * La lógica de paginación divide el array de libros en páginas según el tamaño definido por `itemsPerPage`. 
             * La función renderiza los elementos de la página seleccionada utilizando índices calculados a partir 
             * del número de página. Adicionalmente, se generan botones de navegación para cada página, 
             * permitiendo al usuario cambiar entre ellas.
             */
            const paginateBooks = (books, itemsPerPage) => {
                let currentPage = 1;
                const totalPages = Math.ceil(books.length / itemsPerPage);

                /**
                 * Renderiza los libros de una página específica calculando el rango de elementos.
                 * @param {number} page - Número de la página a renderizar.
                 */
                const renderPage = (page) => {
                    const start = (page - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    displayBooks(books.slice(start, end));
                };

                /**
                 * Genera los botones de navegación de la paginación.
                 * Los botones permiten navegar entre páginas, activando el evento click 
                 * para cambiar a la página correspondiente.
                 */
                const renderPagination = () => {
                    let paginationHTML = '';
                    for (let i = 1; i <= totalPages; i++) {
                        paginationHTML += `<button class="pagination__button" data-page="${i}">${i}</button>`;
                    }
                    paginationContainer.innerHTML = paginationHTML;

                    const buttons = document.querySelectorAll('.pagination__button');
                    buttons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            currentPage = parseInt(e.target.dataset.page, 10);
                            renderPage(currentPage);
                        });
                    });
                };

                // Renderiza la primera página y los botones al cargar
                renderPage(currentPage);
                renderPagination();
            };

            /**
             * Determina la lógica de visualización según la presencia del atributo `data-number` en `catalogSection`.
             * Si `data-number` está presente, selecciona una cantidad específica de libros aleatorios utilizando
             * el valor del atributo como límite. Si no está presente, aplica paginación para dividir todos los
             * libros disponibles en páginas de tamaño fijo.
             */
            const catalogSection = document.querySelector(".catalog");
            if (catalogSection && catalogSection.dataset.number) {
                const numberOfBooks = parseInt(catalogSection.dataset.number, 10);
                displayBooks(getRandomBooks(data, numberOfBooks));
            } else {
                paginateBooks(data, 8); // Paginación con 8 elementos por página
            }

            // Filtrar libros basados en la búsqueda
            if (searchInput) {
                /**
                 * Filtra dinámicamente los libros mientras el usuario escribe en el campo de búsqueda.
                 * Si `data-number` está presente, selecciona libros aleatorios de los resultados filtrados. 
                 * De lo contrario, actualiza la paginación para reflejar solo los libros filtrados.
                 */
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredBooks = data.filter(item =>
                        item.titulo.toLowerCase().includes(searchTerm) ||
                        (item.subtitulo && item.subtitulo.toLowerCase().includes(searchTerm))
                    );
                    if (catalogSection && catalogSection.dataset.number) {
                        displayBooks(getRandomBooks(filteredBooks, parseInt(catalogSection.dataset.number, 10)));
                    } else {
                        paginateBooks(filteredBooks, 2); // Actualizar paginación con resultados filtrados
                    }
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
