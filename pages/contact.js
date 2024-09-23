document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const status = document.getElementById('status');

    // Contact Form Submission
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);

        // Convert FormData to a plain object
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        console.log('Form Data:', formObject);

        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(result => {
            status.textContent = result.success || result.error;
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            status.textContent = 'There was an error sending your message.';
        });
    });
});
