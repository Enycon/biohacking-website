// Basis-JavaScript für die Biohacking-Website
console.log("[INIT] Biohacking Website Script geladen.");

// Aktiven Navigationslink hervorheben
document.addEventListener('DOMContentLoaded', () => {
    console.log("[INIT] DOM fully loaded and parsed.");

    // --- Active Navigation Link ---
    try {
        const currentLocation = window.location.pathname; 
        const navLinks = document.querySelectorAll('header nav ul li a');
        let activeLinkFound = false;

        if (navLinks.length === 0) {
            console.warn("[NAV] No navigation links found for highlighting.");
        } else {
            navLinks.forEach(link => {
        // Extrahiere den Pfad aus dem href-Attribut des Links
        // new URL(link.href).pathname funktioniert gut, auch mit absoluten URLs
        const linkPath = new URL(link.href).pathname; 

        // Vergleiche den Pfad der aktuellen Seite mit dem Pfad des Links
        // Einfacher Vergleich für diese Struktur:
        // Wir entfernen führende Slashes und vergleichen die Dateinamen
        const currentPageName = currentLocation.substring(currentLocation.lastIndexOf('/') + 1);
        const linkPageName = linkPath.substring(linkPath.lastIndexOf('/') + 1);

        // Wenn die Dateinamen übereinstimmen (oder beide leer sind für index.html)
            if (currentPageName === linkPageName || (currentPageName === '' && linkPageName === 'index.html')) {
                link.classList.add('active');
                activeLinkFound = true;
                // console.log(`[NAV] Active link set for: ${linkPageName || 'index.html'}`); // Optional: Detaillierter Log
            }
            });
            if (activeLinkFound) {
                 console.log("[NAV] Active navigation link highlighting setup complete.");
            } else {
                 console.warn("[NAV] No matching active link found for current page:", currentLocation);
            }
        }
    } catch (error) {
        console.error("[NAV] Error setting up active navigation link:", error);
    }

    // --- Mobile Navigation Toggle (Hamburger Menu) ---
    try {
        const navToggle = document.querySelector('.nav-toggle');
        const mainNav = document.querySelector('#main-nav');

        if (navToggle && mainNav) {
            navToggle.addEventListener('click', () => {
                mainNav.classList.toggle('nav-open');
                navToggle.classList.toggle('active'); // Für die X-Animation des Buttons

                // Aria-Label für Barrierefreiheit aktualisieren
                const isOpen = mainNav.classList.contains('nav-open');
                navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
                console.log(`[MENU] Mobile menu toggled. Is open: ${isOpen}`);
            });
            console.log("[MENU] Mobile menu toggle setup complete.");
        } else {
            if (!navToggle) {
                console.error("[MENU] Navigation toggle button (.nav-toggle) not found.");
            }
            if (!mainNav) {
                 console.error("[MENU] Main navigation element (#main-nav) not found.");
            }
        }
    } catch (error) {
         console.error("[MENU] Error setting up mobile menu toggle:", error);
    }
});

// Hier könnte später weiterer Code für Interaktivität hinzukommen...
