document.addEventListener('DOMContentLoaded', () => {

    // --- Age Verification Modal ---
    const ageModal = document.getElementById('ageModal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    // Check if user already verified
    const isAdult = localStorage.getItem('isAdult');

    if (!isAdult) {
        // Show modal and disable scroll
        ageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    yesBtn.addEventListener('click', () => {
        localStorage.setItem('isAdult', 'true');
        closeModal();
    });

    noBtn.addEventListener('click', () => {
        alert('Musisz mieć ukończone 18 lat, aby wejść na tę stronę.');
        window.location.href = 'https://google.com'; // Redirect away
    });

    function closeModal() {
        ageModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scroll
    }

    // --- Product Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Define brands for "One Model Per Brand" logic on mobile
    const brands = ['Merry-Mi', 'JNR', 'Fumot', 'Adalya', 'Al Fakher', 'AirMez', 'Blur', 'Ghost'];

    function getBrand(card) {
        const title = card.querySelector('h3').innerText;
        // Find which brand is in the title
        return brands.find(b => title.includes(b)) || 'Other';
    }

    function applyFilters() {
        const isMobile = window.innerWidth < 768;
        const activeBtn = document.querySelector('.filter-btn.active');
        if (!activeBtn) return; // Should not happen

        const filterValue = activeBtn.dataset.filter;
        const seenBrands = new Set();

        productCards.forEach(card => {
            const buchy = parseInt(card.dataset.buchy);
            const brand = getBrand(card);

            // 1. Check Buchy Filter (Desktop & Mobile)
            // Existing logic: match exact value if not 'all'
            // NOTE: Requirement was "Keep desktop as is".
            // Previous code used: if (filterValue === 'all') ... else if (buchy == threshold)
            let matchesBuchy = false;

            if (filterValue === 'all') {
                matchesBuchy = true;
            } else {
                const threshold = parseInt(filterValue);
                // Strict match as per previous code
                if (buchy == threshold) {
                    matchesBuchy = true;
                }
            }

            // 2. Check Mobile Limitation
            let shouldShow = matchesBuchy;

            if (isMobile && shouldShow) {
                // If we have already seen this brand, hide it
                if (seenBrands.has(brand)) {
                    shouldShow = false;
                } else {
                    // First time seeing this brand (that matches filter), show it and mark seen
                    seenBrands.add(brand);
                    shouldShow = true;
                }
            }

            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // Attach Click Events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply logic
            applyFilters();
        });
    });

    // Attach Resize Event
    window.addEventListener('resize', applyFilters);

    // Initial Run
    applyFilters();

    // --- Custom Slider ---
    const sliderWrapper = document.getElementById('sliderWrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pagination = document.getElementById('pagination');

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        pagination.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        updateSlider();
    }

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    });

    // Auto Play
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    startAutoPlay();

    // Touch Support (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe Left -> Next
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe Right -> Prev
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        }
    }

    // --- 3D Cube Rotation ---
    const cube = document.getElementById('rubiksCube');
    const cubePrev = document.getElementById('cubePrev');
    const cubeNext = document.getElementById('cubeNext');
    let cubeAngle = 0;
    let cubeInterval;

    function rotateCube(direction = 'next') {
        if (direction === 'next') {
            cubeAngle -= 90;
        } else {
            cubeAngle += 90;
        }
        cube.style.transform = `rotateY(${cubeAngle}deg)`;
        updateActiveFace();
    }

    function updateActiveFace() {
        const faces = document.querySelectorAll('.cube-face');
        const step = Math.round(cubeAngle / 90);
        let index = (-step % 4 + 4) % 4;

        faces.forEach(f => f.classList.remove('active'));
        if (faces[index]) {
            faces[index].classList.add('active');
        }
    }

    function startCubeAutoPlay() {
        clearInterval(cubeInterval);
        cubeInterval = setInterval(() => {
            rotateCube('next');
        }, 3000);
    }

    // Init Auto Rotation
    updateActiveFace();
    startCubeAutoPlay();

    function resetCubeTimer() {
        startCubeAutoPlay();
    }

    // Controls
    if (cubePrev && cubeNext) {
        cubePrev.addEventListener('click', () => {
            rotateCube('prev');
            resetCubeTimer();
        });

        cubeNext.addEventListener('click', () => {
            rotateCube('next');
            resetCubeTimer();
        });
    }

    // Pause on Hover
    const cubeWrapper = document.querySelector('.cube-wrapper');
    if (cubeWrapper) {
        cubeWrapper.addEventListener('mouseenter', () => {
            clearInterval(cubeInterval);
        });
        cubeWrapper.addEventListener('mouseleave', () => {
            startCubeAutoPlay();
        });

        // Touch support
        cubeWrapper.addEventListener('touchstart', () => {
            clearInterval(cubeInterval);
        }, { passive: true });

        cubeWrapper.addEventListener('touchend', () => {
            setTimeout(() => {
                startCubeAutoPlay();
            }, 2000);
        });
    }

    // --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const closeMenu = document.getElementById('closeMenu');
    const menuLinks = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden'; // Block scroll
    });

    closeMenu.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
});
