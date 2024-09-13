/**
 * NAV
 */

function submenu() {
    var subnav = document.querySelector('.subnav-header');
    if (subnav.style.display === 'none') {
        subnav.style.display = 'flex';
    } else {
        subnav.style.display = 'none';
    }
}


/**
 * FOOTER
 */

var copyright = new Date();
var copy = copyright.getFullYear();
document.querySelector('.copy').innerHTML = `&copy; ${copy} Colegio Santa María de Yermo`;