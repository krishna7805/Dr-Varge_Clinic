
const scriptURL = 'https://script.google.com/macros/s/AKfycbxDz0Li3xEtLDdKY6em5ofOTEXiiErAdL-P6Z5dMLlK94r_0foBrj2R2d-JBdG1qZuhZw/exec'; // <--- PASTE YOUR URL HERE
const form = document.forms['submit-to-google-sheet'];
const statusDiv = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', e => {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    statusDiv.style.display = 'none';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            // Success
            statusDiv.style.display = 'block';
            statusDiv.style.color = 'green';
            statusDiv.innerText = "Thank you! Your appointment request has been sent successfully.";

            // Reset form and button
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = "Book Consultation";

            // Hide success message after 5 seconds
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            // Error
            console.error('Error!', error.message);
            statusDiv.style.display = 'block';
            statusDiv.style.color = 'red';
            statusDiv.innerText = "Something went wrong. Please try again or call us directly.";

            submitBtn.disabled = false;
            submitBtn.innerText = "Book Consultation";
        });
});
