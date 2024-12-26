document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.header__menu');
    const menuToggle = document.querySelector('.header__menu-toggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('header__menu--open');
        });
    }

    /**
     * FOOTER
     */
    const currentYear = new Date().getFullYear();
    const footerCopy = document.querySelector('.footer__copy');
    if (footerCopy) {
        footerCopy.innerHTML = `&copy; ${currentYear} Colegio Santa María de Yermo`;
    }
});