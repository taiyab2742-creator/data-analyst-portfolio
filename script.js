const cursorGlow = document.querySelector('.cursor-glow');
const reveals = document.querySelectorAll('.reveal');
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
const copyEmailButton = document.getElementById('copyEmail');

// Header/menu elements
const header = document.querySelector('.site-header');


const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.14 }
);

reveals.forEach(section => observer.observe(section));

document.addEventListener('pointermove', event => {
    if (!cursorGlow) return;
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
});

// Inject mobile menu toggle if header exists
if (header) {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    menuToggle.textContent = '\u2630';
    header.insertBefore(menuToggle, header.firstChild);

    const siteNav = header.querySelector('.site-nav');
    menuToggle.addEventListener('click', () => {
        if (!siteNav) return;
        const open = siteNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu when clicking a link
    header.addEventListener('click', e => {
        if (!siteNav) return;
        const target = e.target;
        if (target.tagName === 'A' && siteNav.classList.contains('open')) {
            siteNav.classList.remove('open');
            const btn = header.querySelector('.menu-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });
}

filters.forEach(button => {
    button.addEventListener('click', () => {
        filters.forEach(item => item.classList.remove('active'));
        button.classList.add('active');

        const selected = button.dataset.filter;

        projects.forEach(card => {
            const shouldShow = selected === 'all' || card.dataset.category === selected;
            card.style.display = shouldShow ? 'flex' : 'none';
        });
    });
});

if (copyEmailButton) {
    copyEmailButton.addEventListener('click', async () => {
        const email = 'taiyaburrahman2742@gmail.com';

        try {
            await navigator.clipboard.writeText(email);
            copyEmailButton.textContent = 'Email copied';
            setTimeout(() => {
                copyEmailButton.textContent = 'Copy email';
            }, 1800);
        } catch {
            copyEmailButton.textContent = email;
        }
    });
}

const heroProjectsButton = document.getElementById('heroProjects');
const heroContactButton = document.getElementById('heroContact');

function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
}

if (heroProjectsButton) {
    heroProjectsButton.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection('work');
    });
}

if (heroContactButton) {
    heroContactButton.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection('contact');
    });
}

// Make project cards open a quick modal with details
function openProjectModal(card) {
    const title = card.querySelector('h3')?.textContent || '';
    const tag = card.querySelector('.project-tag')?.textContent || '';
    const desc = card.querySelector('p')?.textContent || '';

    const projectImage = card.dataset.image || 'https://via.placeholder.com/520x280?text=Analytics+Project';
    const projectLink = card.dataset.link || '#';
    const linkHost = projectLink.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
            <button class="close" aria-label="Close">&times;</button>
            <img class="modal-image" src="${projectImage}" alt="Project ${title}" onerror="this.src='https://via.placeholder.com/520x280?text=Analytics+Project'">
            <p class="project-tag">${tag}</p>
            <h3>${title}</h3>
            <p>${desc}</p>
            <p class="modal-link-note">Resource: ${linkHost}</p>
            <a class="button button-secondary" href="${projectLink}" target="_blank" rel="noopener noreferrer" title="Visit ${linkHost}">Learn more</a>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    const closeBtn = overlay.querySelector('.close');
    closeBtn?.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

projects.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openProjectModal(card));
});

// Highlight nav links based on visible sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.target.id) return;
        if (entry.isIntersecting) {
            document.querySelectorAll('.site-nav a').forEach(a => a.classList.remove('active-link'));
            const targetLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
            if (targetLink) targetLink.classList.add('active-link');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

// Smooth in-page scrolling for any anchor with a hash target
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    // In-page hash links
    if (href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // update focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
        // close mobile nav if open
        const nav = document.querySelector('.site-nav.open');
        if (nav) nav.classList.remove('open');
    }
});

// Header CTA: prefer in-page scroll if on the homepage
document.addEventListener('click', (e) => {
    const cta = e.target.closest('.header-cta');
    if (!cta) return;
    const href = cta.getAttribute('href');
    if (!href) return;
    if (href.endsWith('contact.html') && location.pathname.endsWith('index.html')) {
        e.preventDefault();
        const target = document.getElementById('contact');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    }
});

// Contact form handling with Netlify support
const contactForms = document.querySelectorAll('.contact-form');
contactForms.forEach(form => {
    form.addEventListener('submit', e => {
        const name = form.querySelector('input[name="name"]')?.value.trim();
        const email = form.querySelector('input[name="email"]')?.value.trim();
        const message = form.querySelector('textarea[name="message"]')?.value.trim();

        if (!name || !email || !message) {
            e.preventDefault();
            alert('Please fill out name, email, and message.');
            return;
        }

        // submission is handled by Netlify
    });
});