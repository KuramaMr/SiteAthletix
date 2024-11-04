document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.style.opacity = '0';
    main.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        main.style.opacity = '1';
        main.style.transform = 'translateY(0)';
    }, 100);
});

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && !link.target && !link.hasAttribute('download')) {
        e.preventDefault();
        const href = link.href;
        
        const main = document.querySelector('main');
        main.style.opacity = '0';
        main.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    }
});