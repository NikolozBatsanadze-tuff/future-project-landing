document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const responseDiv = document.getElementById('formResponse');

    // Simulate sending message
    responseDiv.style.color = '#34d399';
    responseDiv.innerText = `Thank you, ${name}! Your message has been sent successfully.`;

    // Clear Form
    this.reset();
});