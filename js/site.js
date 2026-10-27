/* ===================================
   SITE SCRIPT
   =================================== */

// Porto's entrance animations call $.fn.appear; this stands in for the
// jquery.appear plugin with an IntersectionObserver.
(function ($) {
    $.fn.appear = function (callback) {
        return this.each(function () {
            const el = this;
            if (!('IntersectionObserver' in window)) {
                callback.call(el);
                return;
            }
            const observer = new IntersectionObserver(entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    observer.disconnect();
                    callback.call(el);
                }
            }, { rootMargin: '0px 0px -60px 0px' });
            observer.observe(el);
        });
    };
})(jQuery);

// The address is assembled here so it never appears whole in the HTML.
document.addEventListener('DOMContentLoaded', () => {
    const user = 'arthur.h.raines';
    const domain = 'gmail.com';
    document.querySelectorAll('[data-contact]').forEach(link => {
        link.href = `mailto:${user}@${domain}`;
    });
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});
