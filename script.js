document.addEventListener("DOMContentLoaded", function () {
    
    /* --- 1. SCROLL ANIMATION (Reveal Elements) --- */
    // Menggunakan Intersection Observer untuk mendeteksi kapan elemen masuk viewport
    const observerOptions = {
        root: null, // viewport browser
        rootMargin: "0px",
        threshold: 0.1 // Elemen muncul saat 10% bagiannya terlihat
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Tambahkan class 'visible' untuk memicu transisi CSS
                entry.target.classList.add("visible");
                // Stop observing setelah animasi berjalan sekali (biar gak ulang-ulang)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Pilih semua elemen dengan class 'animate-on-scroll'
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el);
    });


    /* --- 2. MOBILE MENU TOGGLE --- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-icon');
    const navMenu = document.querySelector('.nav');
    const header = document.querySelector('header');
    
    // Pastikan elemen ada sebelum menambahkan event listener
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Ubah icon hamburger menjadi 'X' (opsional, jika pakai FontAwesome fa-times)
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Tutup menu saat link diklik (UX yang baik)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }


    /* --- 3. HEADER BLUR / DARKEN ON SCROLL --- */
    // Efek header berubah background saat discroll ke bawah
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* --- 4. SMOOTH SCROLL FOR ANCHOR LINKS --- */
    // Fallback smooth scroll untuk browser lama atau kontrol lebih presisi
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Mencegah loncat langsung

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Hitung posisi offset (dikurangi tinggi header biar gak ketutupan)
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

});