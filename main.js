document.addEventListener("DOMContentLoaded", () => {
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const overlay = document.getElementById("envelope-overlay");

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener("click", () => {
            envelopeWrapper.classList.add("open");
            
            setTimeout(() => {
                overlay.classList.add("fade-out");
                // 💡 Ось ці два рядки видаляємо:
                // const mainContent = document.getElementById("main-content");
                // mainContent.classList.remove("hidden");
                
                document.body.classList.add("opened");
                window.scrollTo({ top: 0, behavior: 'instant' });
            }, 1400);
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const overlay = document.getElementById("envelope-overlay");
    const mainContent = document.getElementById("main-content");

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener("click", () => {
            envelopeWrapper.classList.add("open");
            
            setTimeout(() => {
                overlay.classList.add("fade-out");
                mainContent.classList.remove("hidden");
                document.body.classList.add("opened");
                window.scrollTo({ top: 0, behavior: 'instant' });
            }, 1400);
        });
    }

    /* РОЗУМНИЙ ТРЕКЕР СКРОЛУ ДЛЯ ТРЕТЬОЇ СЕКЦІЇ */
    const invitationSection = document.getElementById("invitation-section");
    if (invitationSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Коли секція з'явилася на екрані хоча б на 20%, вмикаємо анімацію
                    invitationSection.classList.add("scrolled-into-view");
                    observer.unobserve(entry.target); // Вимикаємо стеження, щоб не анімувати повторно
                }
            });
        }, { threshold: 0.2 }); // Поріг чутливості скролу
        
        observer.observe(invitationSection);
    }
});
