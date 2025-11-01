document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. CAROUSEL FUNCTIONALITY (Documentation Section)
    // ==========================================================
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    let itemWidth = 0;
    let currentPosition = 0;

    // Fungsi untuk menghitung lebar item secara akurat
    const calculateItemWidth = () => {
        if (galleryItems.length > 0) {
            // Lebar satu item (termasuk padding/border)
            // offsetWidth adalah perhitungan yang paling aman
            itemWidth = galleryItems[0].offsetWidth;
            return itemWidth;
        }
        return 0;
    };

    // Fungsi untuk menggeser track
    const moveToSlide = (track, targetPosition) => {
        track.style.transform = `translateX(-${targetPosition}px)`;
        currentPosition = targetPosition;
    };

    // Kunci: Menghitung max scroll yang benar untuk looping
    const getMaxScroll = () => {
        const wrapperWidth = document.querySelector('.carousel-wrapper').offsetWidth;
        // Total lebar track dikurangi lebar wrapper
        let maxScroll = carouselTrack.scrollWidth - wrapperWidth;
        
        // Menyesuaikan jika ada sisa padding (CSS padding: 15px)
        // Jika box-sizing benar, maxScroll sudah cukup.
        return maxScroll > 0 ? maxScroll : 0; 
    };

    // --- Setup Inti Carousel ---
    const setupCarousel = () => {
        const width = calculateItemWidth();
        if (width === 0) {
             // Jika lebar masih nol, coba lagi (solusi timing)
             setTimeout(setupCarousel, 100);
             return; 
        }

        const maxScroll = getMaxScroll();

        // Event Listener Tombol Next (Loop ke awal)
        nextBtn.onclick = () => {
            // Geser 1 item
            let targetPosition = currentPosition + width; 
            
            // Jika melebihi batas, kembali ke awal (0)
            if (targetPosition > maxScroll) { 
                targetPosition = 0; 
            }
            moveToSlide(carouselTrack, targetPosition);
        };

        // Event Listener Tombol Previous (Loop ke akhir)
        prevBtn.onclick = () => {
            // Geser 1 item
            let targetPosition = currentPosition - width; 
            
            // Jika kurang dari nol, pindah ke posisi looping terakhir
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

    galleryItems.forEach(item => {
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
});