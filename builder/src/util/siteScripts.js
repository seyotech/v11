var document;
export function loadScripts(d) {
    document = d || window.document;
    return {
        toggleNav,
        stickyNav,
    };
}

/*****************************************************
 * Sticky nav
 ******************************************************/
function stickyNav(window) {
    var navbar = document.querySelector('.dorik-navbar');
    if (navbar) {
        var last_known_scroll_position = 0;
        var ticking = false;

        function scroll(scroll_pos) {
            var parent = navbar.parentNode;
            var classList = parent.classList;
            var upWard = scroll_pos <= 50 && classList.contains('sticky');
            var downWard = scroll_pos > 50 && !classList.contains('sticky');
            if (downWard) {
                var height = parent.clientHeight;
                parent.style.top = '-' + height + 'px';
                setTimeout(() => {
                    parent.classList.add('sticky');
                    parent.style.top = null;
                }, 0);
            } else if (upWard) {
                parent.classList.remove('sticky');
            }
        }

        document.addEventListener('scroll', function (e) {
            last_known_scroll_position = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(function () {
                    scroll(last_known_scroll_position);

                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

/*****************************************************
 * Toggle nav
 ******************************************************/
function toggleNav() {
    var toggleBtn = document.querySelector('.dorik-navbar--toggle');
    toggleBtn &&
        toggleBtn.addEventListener('click', function (e) {
            const navbarId = document.querySelector(toggleBtn.dataset.target);
            var hasShow = navbarId.classList.contains('show');
            if (!hasShow) {
                expend();
            } else {
                collapse();
            }
            navbarId.addEventListener('click', function (e) {
                if (e.target.closest('a')) {
                    collapse();
                }
            });

            function expend() {
                navbarId.classList.add('show');
                var height = navbarId.clientHeight + 'px';
                navbarId.classList.add('collapsing');
                setTimeout(() => {
                    navbarId.style.height = height;
                }, 0);
                setTimeout(() => {
                    navbarId.style.height = null;
                    navbarId.classList.remove('collapsing');
                }, 350);
            }
            function collapse() {
                navbarId.style.height = navbarId.clientHeight + 'px';
                navbarId.classList.add('collapsing');
                setTimeout(() => {
                    navbarId.style.height = null;
                }, 0);
                setTimeout(() => {
                    navbarId.classList.remove('show');
                    navbarId.classList.remove('collapsing');
                }, 350);
            }
        });
}
