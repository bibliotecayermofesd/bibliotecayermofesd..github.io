function toggleMenu() {
    const menu = document.querySelector('.header__menu');
    menu.classList.toggle('header__menu--open');
}

/**
 * FOOTER
 */

var copyright = new Date();
var copy = copyright.getFullYear();
document.querySelector('.footer__copy').innerHTML = `&copy; ${copy} Colegio Santa María de Yermo`;