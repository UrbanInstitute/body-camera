function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'inline-block')
        e.style.display = 'none';
    else
        e.style.display = 'inline-block';
}

$(function () {
    var shrinkHeader = 500;
    $(window).scroll(function () {
        var scroll = getCurrentScroll();
        if (scroll >= shrinkHeader) {
            $('#header-pinned').addClass('is-visible');
            $('#mobile-btns').addClass('is-below-header')
        } else {
            $('#header-pinned').removeClass('is-visible');
            $('#mobile-btns').removeClass('is-below-header')
        }
    });

    function getCurrentScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
});