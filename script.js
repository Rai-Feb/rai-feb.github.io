document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. CAROUSEL FUNCTIONALITY (Documentation Section)
    // ==========================================================
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    // Ambil SEMUA gallery-item di halaman
    const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    // Filter HANYA item yang ada di dalam .carousel-track
    const carouselItems = allGalleryItems.filter(item => item.closest('.carousel-track'));

    let itemWidth = 0;
    let currentPosition = 0;

    // Fungsi untuk menghitung lebar item secara akurat
    const calculateItemWidth = () => {
        if (carouselItems.length > 0) {
            itemWidth = carouselItems[0].offsetWidth; 
            return itemWidth;
        }
        return 0;
    };
    
    // Fungsi untuk menggeser track
    const moveToSlide = (track, targetPosition) => {
        if (track) { // Pastikan track ada
            track.style.transform = `translateX(-${targetPosition}px)`;
            currentPosition = targetPosition;
        }
    };

    // Kunci: Menghitung max scroll yang benar untuk looping
    const getMaxScroll = () => {
        if (!carouselTrack) return 0; 
        const wrapperWidth = document.querySelector('.carousel-wrapper').offsetWidth;
        let maxScroll = carouselTrack.scrollWidth - wrapperWidth;
        return maxScroll > 0 ? maxScroll : 0; 
    };

    // --- Setup Inti Carousel ---
    const setupCarousel = () => {
        if (!carouselTrack) return; // Jangan jalankan jika carousel tidak ada
        
        const width = calculateItemWidth();
        if (width === 0) {
             setTimeout(setupCarousel, 100);
             return; 
        }

        const maxScroll = getMaxScroll();

        // Event Listener Tombol Next (Loop ke awal)
        nextBtn.onclick = () => {
            let targetPosition = currentPosition + width; 
            if (targetPosition > maxScroll) { 
                targetPosition = 0; 
            }
            moveToSlide(carouselTrack, targetPosition);
        };

        // Event Listener Tombol Previous (Loop ke akhir)
        prevBtn.onclick = () => {
            let targetPosition = currentPosition - width; 
            if (targetPosition < 0) {
                targetPosition = maxScroll;
            }
            moveToSlide(carouselTrack, targetPosition);
        };
    };

    // Panggil Setup saat Window Load untuk akurasi rendering maksimum
    window.addEventListener('load', setupCarousel);
    
    // Setup ulang saat terjadi resize
    window.addEventListener('resize', () => {
        currentPosition = 0;
        moveToSlide(carouselTrack, 0);
        setupCarousel();
    });


    // ==========================================================
    // 2. LIGHTBOX (Modal Preview) FUNCTIONALITY
    // ==========================================================
    
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.display = 'none'; 
    document.body.appendChild(lightbox);

    // Terapkan Lightbox ke SEMUA gallery-item
    allGalleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const largeImgSrc = item.getAttribute('data-large-img');
            
            if (!largeImgSrc) return;
            
            lightbox.innerHTML = ''; 

            const img = document.createElement('img');
            img.src = largeImgSrc;
            img.id = 'lightbox-img';

            lightbox.appendChild(img);
            lightbox.style.display = 'flex'; 
        });
    });

    lightbox.addEventListener('click', e => {
        if (e.target !== document.getElementById('lightbox-img')) {
            lightbox.style.display = 'none';
        }
    });

    // ==========================================================
    // 3. TAMBAHAN BARU: Animasi Scroll-on-View
    // ==========================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Hentikan pengamatan setelah animasi berjalan
            }
        });
    }, {
        threshold: 0.1 // Animasi terpicu saat 10% elemen terlihat
    });

    // Amati setiap elemen yang perlu dianimasikan
    animatedElements.forEach(el => {
        observer.observe(el);
    });

});
