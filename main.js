document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. КОНФІГУРАЦІЯ GOOGLE ФОРМ
    // ==========================================
    // Замініть посилання нижче на власні (в кінці має бути /formResponse)
    const RSVP_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdGCZhZwP1ghQTB581Zcktf7teKajd_Wpxdh0-Fzmz5uhXXFQ/formResponse";
    const ALCOHOL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd60HAvjVk1buz9NNzAwVy5S1mUpUQRXOFt7K7uKfhQFts3ug/formResponse";

    // ==========================================
    // 2. УПРАВЛІННЯ ФОНОВОЮ МУЗИКОЮ
    // ==========================================
    const bgMusic = document.getElementById("bgMusic");
    const musicToggle = document.getElementById("musicToggle");
    let isPlaying = false;

    function toggleMusic() {
        if (!bgMusic || !musicToggle) return;
        
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove("playing");
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicToggle.classList.add("playing");
                isPlaying = true;
            }).catch(e => {
                console.log("Автовідтворення блоковане браузером:", e);
            });
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener("click", toggleMusic);
    }

    // ==========================================
    // 3. ІНТЕРАКТИВ З КОНВЕРТОМ
    // ==========================================
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const overlay = document.getElementById("envelope-overlay");

    if (envelopeWrapper && overlay) {
        envelopeWrapper.addEventListener("click", () => {
            envelopeWrapper.classList.add("open");
            
            if (!isPlaying && bgMusic) {
                toggleMusic();
            }

            setTimeout(() => {
                overlay.classList.add("fade-out");
                document.body.classList.add("opened");
                window.scrollTo({ top: 0, behavior: 'instant' });
            }, 1400);
        });
    }

    // ==========================================
    // 4. СПОСТЕРІГАЧ ЗА ПОЯВОЮ СЕКЦІЙ ПРИ СКРОЛІ
    // ==========================================
    const animatedSections = document.querySelectorAll(
        "#invitation-section, #photo-section, #location-section, #schedule-section, #dresscode-section, #rsvp-section, #alcohol-section, #final-section"
    );

    if (animatedSections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("scrolled-into-view");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        animatedSections.forEach(section => observer.observe(section));
    }

    // ==========================================
    // 5. ВІДПРАВКА ФОРМИ RSVP
    // ==========================================
    const rsvpForm = document.getElementById("rsvpForm");
    const rsvpSuccessMsg = document.getElementById("rsvpSuccessMessage");

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Надсилання...';
            }

            const formData = new FormData(rsvpForm);

            fetch(RSVP_FORM_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            })
            .then(() => {
                rsvpForm.reset();
                rsvpForm.style.display = "none";
                if (rsvpSuccessMsg) {
                    rsvpSuccessMsg.classList.remove("hidden");
                    rsvpSuccessMsg.style.display = "block";
                }
            })
            .catch((error) => {
                alert("Сталася помилка при відправці. Спробуйте ще раз.");
                console.error("Помилка RSVP:", error);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'ПІДТВЕРДИТИ УЧАСТЬ';
                }
            });
        });
    }

    // ==========================================
    // 6. ВІДПРАВКА ФОРМИ АЛКОГОЛЮ
    // ==========================================
    const alcoholForm = document.getElementById("alcoholForm");
    const alcoholSuccessMsg = document.getElementById("alcoholSuccessMessage");

    if (alcoholForm) {
        alcoholForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const submitBtn = alcoholForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Збереження...';
            }

            const formData = new FormData(alcoholForm);

            fetch(ALCOHOL_FORM_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            })
            .then(() => {
                alcoholForm.reset();
                alcoholForm.style.display = "none";
                if (alcoholSuccessMsg) {
                    alcoholSuccessMsg.classList.remove("hidden");
                    alcoholSuccessMsg.style.display = "block";
                }
            })
            .catch((error) => {
                alert("Сталася помилка при відправці. Спробуйте ще раз.");
                console.error("Помилка алкогольної форми:", error);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'ЗБЕРЕГТИ ПОБАЖАННЯ';
                }
            });
        });
    }

    // ==========================================
    // 7. ЗВОРОТНИЙ ВІДЛІК ДО ВЕСІЛЛЯ (24.10.2026)
    // ==========================================
    const targetDate = new Date("2026-10-24T15:00:00").getTime();

    function updateTimer() {
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysEl.innerText = days < 10 ? '0' + days : days;
            hoursEl.innerText = hours < 10 ? '0' + hours : hours;
            minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
        } else {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
        }
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // ==========================================
    // 8. КЛІКАБЕЛЬНІСТЬ ЕЛЕМЕНТІВ ТАЙМІНГУ
    // ==========================================
    const clickableScheduleItems = document.querySelectorAll('.schedule-item.clickable');

    clickableScheduleItems.forEach(item => {
        item.addEventListener('click', () => {
            const link = item.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            }
        });
    });
});