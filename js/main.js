/* ===================================
   MAIN JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSmoothScroll();
});

function initNav() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('navOverlay');
    const links = overlay.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const host = document.querySelector('#us-map-inline');
    if (!host) return;

    const res = await fetch('images/map.svg');
    const svg = new DOMParser().parseFromString(await res.text(), 'image/svg+xml').documentElement;


    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');


    svg.removeAttribute('width');
    svg.removeAttribute('height');


    if (!svg.hasAttribute('viewBox')) {
        const w = parseFloat(svg.getAttribute('width')) || 960;
        const h = parseFloat(svg.getAttribute('height')) || 600;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    }


    const states = 'AL,AK,AZ,AR,CA,CO,CT,DE,FL,GA,HI,IA,ID,IL,IN,KS,KY,LA,MA,MD,ME,MI,MN,MO,MS,MT,NC,ND,NE,NH,NJ,NM,NV,NY,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VA,VT,WA,WI,WY,WV,DC'.split(',');

    const tag = (id, cls) => {
        const el = svg.getElementById(id);
        if (!el) return;
        const targets = el.matches?.('path,polygon,rect,circle') ? [el] : el.querySelectorAll('path,polygon,rect,circle');
        targets.forEach(n => n.classList.add('state', cls));
    };

    states.forEach(s => s !== 'AK' && tag(s, 'visited'));
    tag('AK', 'not-visited');

    host.replaceChildren(svg);

    svg.querySelectorAll('[style],[fill],[stroke]').forEach(el => {
        el.removeAttribute('style');
        el.removeAttribute('fill');
        el.removeAttribute('stroke');
    });
});