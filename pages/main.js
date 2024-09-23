document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    const body = document.body;
    const elementsToToggle = [
        'nav', 'header', 'main', 'footer', 'label', 
        'input', 'textarea', 'select', 'button'
    ];

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        elementsToToggle.forEach(element => {
            document.querySelectorAll(element).forEach(el => el.classList.add('dark-mode'));
        });
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        elementsToToggle.forEach(element => {
            document.querySelectorAll(element).forEach(el => el.classList.toggle('dark-mode'));
        });
        const newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    });
    
});