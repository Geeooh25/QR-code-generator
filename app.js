

    let currentQR = null;
    let currentSize = 180;
    let currentText = "";

    const qrContainer = document.getElementById('qrcode');
    const textInput = document.getElementById('qrText');
    const errorLevelSelect = document.getElementById('errorLevel');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toast = document.getElementById('toast');

    function showToast(msg) {
        toast.innerHTML = msg;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 2000);
    }

    function generateQR() {
        const text = textInput.value.trim();
        if (!text) {
            showToast("⚠️ Please enter some content");
            return;
        }
        const errorCorrection = errorLevelSelect.value;
        currentText = text;
        
        // Clear previous QR
        qrContainer.innerHTML = "";
        
        try {
            currentQR = new QRCode(qrContainer, {
                text: text,
                width: currentSize,
                height: currentSize,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: errorCorrection === 'L' ? QRCode.CorrectLevel.L :
                              errorCorrection === 'M' ? QRCode.CorrectLevel.M :
                              errorCorrection === 'Q' ? QRCode.CorrectLevel.Q :
                              QRCode.CorrectLevel.H
            });
            showToast("✅ QR Code generated successfully!");
        } catch (err) {
            showToast("❌ Error generating QR code");
            console.error(err);
        }
    }

    async function downloadQR() {
        const qrElement = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
        if (!qrElement) {
            showToast("⚠️ Generate a QR code first");
            return;
        }
        
        // Create a canvas to capture QR with background
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = currentSize;
        canvas.width = size;
        canvas.height = size;
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Draw QR code
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = qrElement.src;
        
        if (img.complete) {
            ctx.drawImage(img, 0, 0, size, size);
            downloadCanvas(canvas);
        } else {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, size, size);
                downloadCanvas(canvas);
            };
        }
    }
    
    function downloadCanvas(canvas) {
        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showToast("📸 QR Code downloaded!");
    }

    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSize = parseInt(btn.getAttribute('data-size'));
            generateQR();
        });
    });

    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    
    // Auto-generate on load
    generateQR();
    
    // Debounced auto-generate on text change
    let timeout;
    textInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(generateQR, 500);
    });
    errorLevelSelect.addEventListener('change', generateQR);
