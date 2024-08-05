 
document.addEventListener('DOMContentLoaded', () => {
    const uploadSection = document.getElementById('upload-section');

    // Check if the current user is the main user
    const isMainUser = true; // Replace this with actual authentication logic

    if (isMainUser) {
        uploadSection.style.display = 'block';
    }

    document.getElementById('upload-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const fileInput = document.getElementById('pdf-file');
        const file = fileInput.files[0];

        if (file && file.type === 'application/pdf') {
            const formData = new FormData();
            formData.append('pdf', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('File uploaded successfully!');
                    loadNotes();
                } else {
                    alert('File upload failed.');
                }
            });
        } else {
            alert('Please upload a PDF file.');
        }
    });

    function loadNotes() {
        fetch('/notes')
            .then(response => response.json())
            .then(data => {
                const notesList = document.getElementById('notes-list');
                notesList.innerHTML = '';
                data.notes.forEach(note => {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `/uploads/${note}`;
                    link.textContent = note;
                    link.target = '_blank';
                    li.appendChild(link);
                    notesList.appendChild(li);
                });
            });
    }

    loadNotes();
});
