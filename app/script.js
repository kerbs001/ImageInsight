document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('upload-button');
    const pictureButton = document.getElementById('picture-button');
    const fileInput = document.getElementById('fileInput');

    // Add event listeners to the buttons
    uploadButton.addEventListener('click', function() {
        fileInput.click(); // Trigger file input click
    });

    pictureButton.addEventListener('click', function() {
        takePicture();
    });

    // Add additional event listeners or functions here if needed
});

function takePicture() {
    // Check if the browser supports the getUserMedia API for accessing the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Use getUserMedia to access the camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Create a video element to display the camera feed
                const video = document.createElement('video');
                // Set the video stream as the source
                video.srcObject = stream;
                // Play the video
                video.play();
                // Append the video element to the photo box
                const photoBox = document.querySelector('.photo-box');
                photoBox.innerHTML = ''; // Clear existing content
                photoBox.appendChild(video);
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
            });
    } else {
        console.error('getUserMedia not supported');
    }
}

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const employeeNumber = document.getElementById('employeeNumber').value;
    const department = document.getElementById('department').value;
    const employmentStatus = document.getElementById('employmentStatus').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const employeeNumberError = document.getElementById('employeeNumberError');
    const departmentError = document.getElementById('departmentError');
    const employmentStatusError = document.getElementById('employmentStatusError');
    const phoneNumberError = document.getElementById('phoneNumberError');
    const emailError = document.getElementById('emailError');
    let isValid = true;

    // Clear existing error messages
    firstNameError.textContent = '';
    lastNameError.textContent = '';
    employeeNumberError.textContent = '';
    departmentError.textContent = '';
    employmentStatusError.textContent = '';
    phoneNumberError.textContent = '';
    emailError.textContent = '';

    // First Name Validation
    if (firstName.trim() === '') {
        displayError(firstNameError, 'First name is required');
        isValid = false;
    }

    // Last Name Validation
    if (lastName.trim() === '') {
        displayError(lastNameError, 'Last name is required');
        isValid = false;
    }

    // Employee Number Validation
    if (!employeeNumber.match(/^\d{2}-\d{3}-\d{4}$/)) {
        displayError(employeeNumberError, 'Invalid employee number');
        isValid = false;
    }

    // Department Validation
    if (department.trim() === '') {
        displayError(departmentError, 'Department is required');
        isValid = false;
    }

    // Employment Status Validation
    if (employmentStatus === '') {
        displayError(employmentStatusError, 'Employment status is required');
        isValid = false;
    }

    // Phone Number Validation
    if (!phoneNumber.match(/^\d{3} \d{3} \d{4}$/)) {
        displayError(phoneNumberError, 'Invalid phone number');
        isValid = false;
    }

    // Email Validation
    if (!email.includes('@')) {
        displayError(emailError, 'Invalid email address');
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }
});

function displayError(element, message) {
    element.textContent = message;
}