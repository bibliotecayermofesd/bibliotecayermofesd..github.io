/**
 * Si la página del libro seleccionado incluye en la utm el código del libro, 
 * la página será construida con su información correspondiente.
 */

fetch('./assets/db/secundaria-bachillerato.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return response.json();
    })
    .then(data => {
        const booksContainer = document.querySelector('.books');
        let booksHTML = ''; // Acumulador de HTML

        data.forEach(item => {
            if (document.location.href.includes(item.id)) {
                booksHTML = `<div class="books__item">
                    <div class="books__item-image">
                        <img src="./assets/img/logo/logo-locus-cognitionis.svg" alt="Logo del libro">
                    </div>
                    <div class="books__item-text">
                        <h4 class="books__item-title">${item.titulo}</h4>
                        <h5 class="books__item-subtitle">${item.subtitulo}</h5>
                        <p class="books__item-author">Autor: ${item.autor}</p>
                        <p class="books__item-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate consectetur repellendus numquam est, laboriosam aspernatur itaque impedit sint? Dolores illum atque impedit quas reprehenderit harum. Veniam nihil et recusandae quis?</p>
                    </div>
                </div>`;
            }
        });

        // Establece el contenido de 'booksContainer' una vez fuera del loop
        booksContainer.innerHTML = booksHTML;
    })
    .catch(error => {
        console.error('Error:', error);
    });
