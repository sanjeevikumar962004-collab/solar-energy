/**
 * Stackly Portfolio - Global Engine & Utilities
 */
(function() {
    function initGlobalUtilities() {
        // Dynamic Back to Top Button injection and handler
        if (!document.getElementById('back-to-top')) {
            const bttBtn = document.createElement('button');
            bttBtn.id = 'back-to-top';
            bttBtn.setAttribute('aria-label', 'Back to top');
            bttBtn.className = 'fixed bottom-6 right-6 z-40 bg-[var(--primary)] text-white p-3.5 rounded-full shadow-2xl opacity-0 translate-y-4 pointer-events-none hover:bg-[var(--accent)] hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10 flex items-center justify-center cursor-pointer group';
            bttBtn.innerHTML = `
                <svg class="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            `;
            document.body.appendChild(bttBtn);

            window.addEventListener('scroll', () => {
                if (window.scrollY > 400) {
                    bttBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                    bttBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
                } else {
                    bttBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                    bttBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
                }
            });

            bttBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initGlobalUtilities);
    } else {
        initGlobalUtilities();
    }
})();
