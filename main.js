document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. КОНФІГУРАЦІЯ GOOGLE ФОРМ
    // ==========================================
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
    // 5. ВІДПРАВКА ФОРМ (ОПТИМІЗОВАНА ФУНКЦІЯ)
    // ==========================================
    function handleFormSubmit(formId, url, successMsgId) {
        const form = document.getElementById(formId);
        const successMsg = document.getElementById(successMsgId);

        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // Стан завантаження (UX)
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="opacity: 0.7;">Надсилання...</span>';
            submitBtn.style.cursor = 'wait';

            fetch(url, {
                method: "POST",
                mode: "no-cors",
                body: new FormData(form)
            })
            .then(() => {
                form.style.opacity = '0';
                setTimeout(() => {
                    form.style.display = "none";
                    if (successMsg) {
                        successMsg.style.display = "block";
                        // Плавна поява повідомлення
                        successMsg.animate([{opacity: 0}, {opacity: 1}], {duration: 500, fill: 'forwards'});
                    }
                }, 400);
            })
            .catch((error) => {
                alert("Помилка з'єднання. Перевірте інтернет та спробуйте ще раз.");
                console.error("Form error:", error);
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                submitBtn.style.cursor = 'pointer';
            });
        });
    }

    handleFormSubmit("rsvpForm", RSVP_FORM_URL, "rsvpSuccessMessage");
    handleFormSubmit("alcoholForm", ALCOHOL_FORM_URL, "alcoholSuccessMessage");

    // ==========================================
    // 6. ЗВОРОТНИЙ ВІДЛІК ДО ВЕСІЛЛЯ (ОПТИМІЗОВАНО)
    // ==========================================
    const targetDate = new Date("2026-10-24T15:00:00").getTime();
    
    // Кешуємо елементи DOM ОДИН РАЗ (економить ресурси браузера)
    const timerElements = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };

    function updateTimer() {
        if (!timerElements.days) return;

        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            timerElements.days.textContent = days < 10 ? '0' + days : days;
            timerElements.hours.textContent = hours < 10 ? '0' + hours : hours;
            timerElements.minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
            timerElements.seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
        } else {
            clearInterval(timerInterval);
            timerElements.days.textContent = "00";
            timerElements.hours.textContent = "00";
            timerElements.minutes.textContent = "00";
            timerElements.seconds.textContent = "00";
        }
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    // ==========================================
    // 7. КЛІКАБЕЛЬНІСТЬ ЕЛЕМЕНТІВ ТАЙМІНГУ
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