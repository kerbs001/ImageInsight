document.addEventListener("DOMContentLoaded", function() {
    const registrationForm = document.getElementById('registrationForm');
    let pictureTaken = false;

// Function to start video capture
function startVideo() {
  const videoElement = document.getElementById('video');

  if (!videoElement) {
    return;
  }

  const constraints = {
    video: {
      width: { min: 640 },
      height: { min: 480 }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      videoElement.srcObject = stream;
      videoElement.play();
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
    });
}

    startVideo();

    // Event listener for picture capture
    const pictureButton = document.getElementById('picture-button');
    const retakeButton = document.getElementById('retake-button');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    pictureButton.addEventListener('click', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');

        const photoBox = document.querySelector('.photo-box');
        photoBox.innerHTML = `<img src="${dataUrl}" alt="Captured Photo" width="400" height="300">`;

        const hiddenImageInput = document.createElement('input');
        hiddenImageInput.type = 'hidden';
        hiddenImageInput.name = 'faceImage';
        hiddenImageInput.value = dataUrl;
        registrationForm.appendChild(hiddenImageInput);

        pictureButton.style.display = 'none';
        retakeButton.style.display = 'inline-block';
        video.style.display = 'none';

        pictureTaken = true;
    });

    // Event listener for retake button
    retakeButton.addEventListener('click', function() {
        const photoBox = document.querySelector('.photo-box');
        photoBox.innerHTML = '';

        const hiddenImageInput = document.querySelector('input[name="faceImage"]');
        if (hiddenImageInput) {
            hiddenImageInput.remove();
        }

        video.style.display = 'block';
        retakeButton.style.display = 'none';
        pictureButton.style.display = 'inline-block';

        pictureTaken = false;
    });

    // Event listener for form submission
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!pictureTaken) {
            alert('Please take a picture before submitting the form.');
            return;
        }

        // Validation
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const employeeNumber = document.getElementById('employeeNumber').value;
        const department = document.getElementById('department').value;
        const employmentStatus = document.getElementById('employmentStatus').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;

        if (!firstName || !lastName || !employeeNumber || !department || !employmentStatus || !phoneNumber || !email) {
            alert('Please fill in all fields.');
            return;
        }

        if (!/^\d{2}-\d{3}-\d{4}$/.test(employeeNumber)) {
            alert('Employee number should be in the format 12-345-6789.');
            return;
        }

        if (!/^\d{4} \d{3} \d{4}$/.test(phoneNumber)) {
            alert('Phone number should be in the format 0987 654 3210.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Form data
        const formData = new FormData(registrationForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        data['faceImage'] = document.querySelector('input[name="faceImage"]').value;

        // Submit form
        fetch('/submit_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message === "Employee data submitted successfully!") {
                document.getElementById('confirmation-message').style.display = 'block';
                alert("Form submitted successfully");
            } else {
                alert("Error: " + data.error + "\nReason: " + data.reason);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to submit form. Please try again.");
        });
    });
});
