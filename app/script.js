document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const pictureButton = document.getElementById('picture-button');
    const retakeButton = document.getElementById('retake-button');
    const registrationForm = document.getElementById('registrationForm');
    let stream = null;
    let pictureTaken = false; // Variable to track whether a picture has been taken

    // Function to start video stream
    function startVideo() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = {
                video: {
                    width: { min: 640 },
                    height: { min: 480 }
                }
            };

            navigator.mediaDevices.getUserMedia(constraints)
                .then(function(streamObj) {
                    stream = streamObj;
                    video.srcObject = stream;
                    video.play();
                })
                .catch(function(err) {
                    console.error('Error accessing camera:', err);
                });
        }
    }

    // Start video stream initially
    startVideo();

    // Capture the picture when button is clicked
    pictureButton.addEventListener('click', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');

        // Display captured image
        const photoBox = document.querySelector('.photo-box');
        photoBox.innerHTML = `<img src="${dataUrl}" alt="Captured Photo" width="400" height="300">`;

        // Store captured image in a hidden input field to submit with form
        const hiddenImageInput = document.createElement('input');
        hiddenImageInput.type = 'hidden';
        hiddenImageInput.name = 'faceImage';
        hiddenImageInput.value = dataUrl;
        registrationForm.appendChild(hiddenImageInput);

        // Show retake button
        pictureButton.style.display = 'none';
        retakeButton.style.display = 'inline-block';
        video.style.display = 'none'; // Hide video while displaying captured image
        
        // Set pictureTaken to true
        pictureTaken = true;
    });

    // Retake picture when button is clicked
    retakeButton.addEventListener('click', function() {
        // Clear previously captured image
        const photoBox = document.querySelector('.photo-box');
        photoBox.innerHTML = '';

        // Remove hidden input field
        const hiddenImageInput = document.querySelector('input[name="faceImage"]');
        if (hiddenImageInput) {
            hiddenImageInput.remove();
        }

        // Show video again
        video.style.display = 'block';
        
        // Hide retake button
        retakeButton.style.display = 'none';
        pictureButton.style.display = 'inline-block';

        // Stop current video track
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(function(track) {
                track.stop();
            });
        }

        // Restart video stream
        startVideo();
        
        // Set pictureTaken back to false
        pictureTaken = false;
    });

    // Form submission handling
    registrationForm.addEventListener('submit', function(event) {
        // Prevent form submission if picture has not been taken
        if (!pictureTaken) {
            alert('Please take a picture before submitting the form.');
            event.preventDefault(); // Prevent form submission
        } else {
            // Continue with form submission
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const employeeNumber = document.getElementById('employeeNumber').value;
            const department = document.getElementById('department').value;
            const employmentStatus = document.getElementById('employmentStatus').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const email = document.getElementById('email').value;

            // Add your form validation logic here
            if (firstName.trim() === '' || lastName.trim() === '' || !employeeNumber.match(/^\d{2}-\d{3}-\d{4}$/) || department.trim() === '' || !email.includes('@')) {
                alert('Please fill out all required fields correctly.');
                event.preventDefault(); // Prevent form submission
            } else {
                // Submit the form with image and other data
                fetch('/submit_form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        employeeNumber: employeeNumber,
                        department: department,
                        employmentStatus: employmentStatus,
                        phoneNumber: phoneNumber,
                        email: email,
                        faceImage: document.querySelector('input[name="faceImage"]').value
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Handle response from server if needed
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    });
});
