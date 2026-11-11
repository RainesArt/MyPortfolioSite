/* ===================================
   BOOK READER
   Turns the report's page images into a flip book with StPageFlip.
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('book');
    if (!el || !window.St) return;

    const total = Number(el.dataset.pages);
    const images = [...el.querySelectorAll('img')];
    const count = document.getElementById('bookCount');

    // Load only the pages near the open spread, so the first view is quick.
    const loadAround = index => {
        for (let i = index - 2; i <= index + 5; i++) {
            const img = images[i];
            if (img && !img.src) img.src = img.dataset.src;
        }
    };
    loadAround(0);

    const book = new St.PageFlip(el, {
        width: 612,
        height: 792,
        size: 'stretch',
        minWidth: 280,
        maxWidth: 760,
        minHeight: 362,
        maxHeight: 983,
        showCover: true,
        usePortrait: true,
        mobileScrollSupport: true,
        maxShadowOpacity: 0.4,
    });
    book.loadFromHTML(el.querySelectorAll('.book-page'));

    const update = index => {
        loadAround(index);
        const spread = book.getOrientation() === 'landscape' && index > 0 && index < total - 1;
        const last = Math.min(index + 2, total);
        count.textContent = spread ? `Pages ${index + 1}–${last} of ${total}` : `Page ${index + 1} of ${total}`;
    };

    book.on('flip', e => update(e.data));
    book.on('changeOrientation', () => update(book.getCurrentPageIndex()));

    document.getElementById('bookPrev').addEventListener('click', () => book.flipPrev());
    document.getElementById('bookNext').addEventListener('click', () => book.flipNext());
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') book.flipPrev();
        if (e.key === 'ArrowRight') book.flipNext();
    });
});
