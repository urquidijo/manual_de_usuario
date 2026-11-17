/**
 * Manuales de Usuario - Sistema IoT Vehicular UAGRM
 * Frontend Interactivo: Navegación por Actores, Búsqueda en Vivo, TOC Dinámico y Exportación a PDF
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const roleTabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.manual-section');
  const tocNav = document.getElementById('tocNav');
  const tocBadge = document.getElementById('tocBadge');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const searchBanner = document.getElementById('searchBanner');
  const searchQueryText = document.getElementById('searchQueryText');
  const searchCount = document.getElementById('searchCount');
  const resetSearchBtn = document.getElementById('resetSearchBtn');
  const themeToggle = document.getElementById('themeToggle');
  const printBtn = document.getElementById('printBtn');
  const backToTopBtn = document.getElementById('backToTop');
  const toast = document.getElementById('toast');

  // Mobile Drawer Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const mobileTocToggle = document.getElementById('mobileTocToggle');
  const floatingTocBtn = document.getElementById('floatingTocBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');

  function openMobileDrawer() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileTocToggle) mobileTocToggle.addEventListener('click', openMobileDrawer);
  if (floatingTocBtn) floatingTocBtn.addEventListener('click', openMobileDrawer);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileDrawer);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileDrawer);

  let currentRole = localStorage.getItem('taller_manual_role') || 'all';

  // 1. Role Switching
  function setRole(role, save = true) {
    currentRole = role;
    if (save) {
      localStorage.setItem('taller_manual_role', role);
    }

    // Update active tab button
    roleTabs.forEach(tab => {
      if (tab.dataset.role === role) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Show/hide document sections
    sections.forEach(sec => {
      const secRole = sec.dataset.roleSection;
      if (role === 'all' || secRole === role) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    // Update TOC badge & re-generate TOC
    const roleLabels = {
      all: 'Manual Completo',
      parte0: 'Parte 0: Común',
      parte1: 'Parte 1: Administrador',
      parte2: 'Parte 2: Mecánico',
      parte3: 'Parte 3: Inspector'
    };
    tocBadge.textContent = roleLabels[role] || 'Índice';
    buildTOC(role);

    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      clearSearch();
      setRole(tab.dataset.role);
    });
  });

  // 2. Build Dynamic Table of Contents (TOC)
  function buildTOC(filterRole) {
    tocNav.innerHTML = '';

    const roleHeadings = {
      parte0: 'Parte 0 · Introducción',
      parte1: 'Parte 1 · Administrador',
      parte2: 'Parte 2 · Mecánico',
      parte3: 'Parte 3 · Inspector'
    };

    sections.forEach(sec => {
      const secRole = sec.dataset.roleSection;
      if (filterRole !== 'all' && secRole !== filterRole) {
        return;
      }

      // Add group title if in "all" view
      if (filterRole === 'all') {
        const partHeader = document.createElement('div');
        partHeader.className = 'toc-part-title';
        partHeader.textContent = roleHeadings[secRole] || secRole;
        tocNav.appendChild(partHeader);
      }

      // Add items for each section block
      const blocks = sec.querySelectorAll('.guide-block');
      blocks.forEach(block => {
        const heading = block.querySelector('.heading-number');
        if (!heading) return;

        const link = document.createElement('a');
        link.className = 'toc-item';
        link.href = `#${block.id}`;
        link.textContent = heading.textContent.trim();
        link.dataset.targetId = block.id;

        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(block.id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          closeMobileDrawer();
        });

        tocNav.appendChild(link);
      });
    });
  }

  // 3. Highlight TOC on Scroll
  window.addEventListener('scroll', () => {
    // Back to top button visibility
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Scroll spy for TOC
    const guideBlocks = document.querySelectorAll('.manual-section:not([style*="display: none"]) .guide-block');
    let currentActiveId = '';

    guideBlocks.forEach(block => {
      const rect = block.getBoundingClientRect();
      if (rect.top <= 160 && rect.bottom >= 100) {
        currentActiveId = block.id;
      }
    });

    if (currentActiveId) {
      document.querySelectorAll('.toc-item').forEach(item => {
        if (item.dataset.targetId === currentActiveId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. Live Search Feature
  function performSearch(query) {
    query = query.trim().toLowerCase();
    if (!query) {
      clearSearch();
      return;
    }

    clearSearchBtn.style.display = 'block';
    let totalMatches = 0;

    // In search mode, search across all sections
    sections.forEach(sec => {
      sec.style.display = 'block';
      const blocks = sec.querySelectorAll('.guide-block');
      let secHasMatch = false;

      blocks.forEach(block => {
        const text = block.textContent.toLowerCase();
        if (text.includes(query)) {
          block.style.display = 'block';
          secHasMatch = true;
          totalMatches++;
        } else {
          block.style.display = 'none';
        }
      });

      if (!secHasMatch) {
        sec.style.display = 'none';
      }
    });

    searchBanner.style.display = 'flex';
    searchQueryText.textContent = query;
    searchCount.textContent = totalMatches;
  }

  function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchBanner.style.display = 'none';

    // Reset blocks display
    document.querySelectorAll('.guide-block').forEach(b => {
      b.style.display = 'block';
    });

    // Restore role selection view
    setRole(currentRole, false);
  }

  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  clearSearchBtn.addEventListener('click', clearSearch);
  resetSearchBtn.addEventListener('click', clearSearch);

  // 5. Theme Toggle
  const savedTheme = localStorage.getItem('taller_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('taller_theme', newTheme);
    showToast(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  });

  // 6. Print to PDF
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Initialize view
  setRole(currentRole, false);
});

// Helper: Copy Credentials
function copyCred(email) {
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Copiado al portapapeles: ${email}`);
  }).catch(() => {
    showToast(`Usuario: ${email}`);
  });
}

// Helper: Toast Notifications
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
