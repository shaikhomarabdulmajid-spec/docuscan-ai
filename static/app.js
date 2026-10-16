document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropZone');
    const fileInput = document.getElementById('docFile');
    const metaBox = document.getElementById('fileInfo');
    const nameLabel = document.getElementById('fileNameDisplay');
    const sizeLabel = document.getElementById('fileSizeDisplay');

    if (!dropArea || !fileInput) return;

    // Direct interaction click maps
    dropArea.addEventListener('click', () => fileInput.click());

    // Setup hover transition focus states
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropArea.classList.add('active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropArea.classList.remove('active');
        }, false);
    });

    // Handle incoming visual node dropping structures
    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            fileInput.files = files;
            displayFileMetadata(files[0]);
        }
    });

    // Handle traditional filesystem selection triggers
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            displayFileMetadata(this.files[0]);
        }
    });

    function displayFileMetadata(file) {
        if (!metaBox || !nameLabel || !sizeLabel) return;
        nameLabel.innerText = file.name;
        sizeLabel.innerText = `${(file.size / 1024).toFixed(2)} KB`;
        metaBox.classList.remove('hidden');
    }
});

// Main async API route controller handler
async function uploadAndAnalyze() {
    const fileInput = document.getElementById('docFile');
    const typeInput = document.getElementById('analysisType');
    const btn = document.getElementById('submitBtn');
    const outputCard = document.getElementById('outputContainer');
    const consoleText = document.getElementById('resultText');
    const indicator = document.getElementById('statusText');

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("Please upload or drag a document file context to parse!");
        return;
    }

    // Capture the explicit target file object boundary correctly as a single stream element
    const targetedFile = fileInput.files[0];

    // Alter visual loading matrices
    btn.disabled = true;
    btn.classList.add('opacity-40', 'cursor-not-allowed');
    btn.innerText = "Processing Data Context...";
    outputCard.classList.remove('hidden');
    indicator.innerText = "STREAMING METRICS TO GROQ CLOUD...";
    consoleText.innerHTML = `<span class="animate-pulse text-sky-400/60 font-mono">Initializing token streams with Llama3-70B model vectors...</span>`;

    // Package the structured multi-part dataset cleanly
    const payload = new FormData();
    payload.append("file", targetedFile);
    payload.append("analysis_type", typeInput.value);

    try {
        const connection = await fetch('/api/analyze', {
            method: 'POST',
            body: payload
        });

        const data = await connection.json();

        if (connection.ok) {
            indicator.innerText = "ANALYSIS COMPLETE ✅";
            consoleText.innerText = data.result;
        } else {
            indicator.innerText = "EXECUTION ABORTED ❌";
            consoleText.innerHTML = `<span class="text-red-400 font-mono font-semibold">${data.error || 'Internal token evaluation crash'}</span>`;
        }
    } catch (networkError) {
        indicator.innerText = "CONNECTION RUNTIME LOSS ❌";
        consoleText.innerHTML = `<span class="text-red-400 font-mono font-semibold">Endpoint communication failure. Check Render container bounds.</span>`;
    } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-40', 'cursor-not-allowed');
        btn.innerText = "Run Context Analysis Pipeline";
    }
}

// Global text logging memory copier tool
function copyToClipboard() {
    const txt = document.getElementById('resultText');
    if (!txt || !txt.innerText) return;
    navigator.clipboard.writeText(txt.innerText);
    alert("Analysis output copied to your clipboard! 📋");
}
