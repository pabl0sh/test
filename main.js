document.addEventListener("DOMContentLoaded", () => {
    // 1. Управління фоновою музикою
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

    // 2. Інтерактив з конвертом
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const overlay = document.getElementById("envelope-overlay");

    if (envelopeWrapper && overlay) {
        envelopeWrapper.addEventListener("click", () => {
            envelopeWrapper.classList.add("open");
            
            // Запуск музики після відкриття конверта
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

    // 3. Спостерігач за появою секцій при скролі
    const animatedSections = document.querySelectorAll(
        "#invitation-section, #photo-section, #location-section, #schedule-section, #dresscode-section, #rsvp-section, #final-section"
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

    // 4. Відправка RSVP форми
    const rsvpForm = document.getElementById("rsvpForm");
    const successMsg = document.getElementById("rsvpSuccessMessage");

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/ВАШ_ID_ФОРМИ/formResponse";
            const formData = new FormData(rsvpForm);

            fetch(GOOGLE_FORM_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            })
            .then(() => {
                rsvpForm.reset();
                rsvpForm.classList.add("hidden");
                if (successMsg) successMsg.classList.remove("hidden");
            })
            .catch((error) => {
                alert("Помилка відправки. Спробуйте ще раз.");
                console.error(error);
            });
        });
    }

    // 5. Відправка форми алкоголю
    const alcoholForm = document.getElementById("alcoholForm");
    const alcoholSuccessMsg = document.getElementById("alcoholSuccessMessage");

    if (alcoholForm) {
        alcoholForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const GOOGLE_ALCOHOL_FORM_URL = "https://docs.google.com/forms/d/e/ВАШ_ID_ДРУГОЇ_ФОРМИ/formResponse";
            const formData = new FormData(alcoholForm);

            fetch(GOOGLE_ALCOHOL_FORM_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            })
            .then(() => {
                alcoholForm.reset();
                alcoholForm.classList.add("hidden");
                if (alcoholSuccessMsg) alcoholSuccessMsg.classList.remove("hidden");
            })
            .catch((error) => {
                alert("Помилка відправки. Спробуйте ще раз.");
                console.error(error);
            });
        });
    }

    // 6. Таймер зворотного відліку
    const targetDate = new Date("2027-07-29T15:00:00").getTime();

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
});