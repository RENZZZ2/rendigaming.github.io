// Fungsi untuk konversi TXT ke VCF
function convertTxtToVcf() {
    const fileInput = document.getElementById('txt-file');
    const contactCount = document.getElementById('contact-count').value;
    const contactName = document.getElementById('contact-name').value;
    const fileInfo = document.getElementById('file-info');

    if (fileInput.files.length === 0) {
        alert('Silakan pilih file TXT terlebih dahulu.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const lines = event.target.result.split('\n');
        let index = 0;

        while (index < lines.length) {
            let vcfFileContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\n`;
            for (let i = 0; i < contactCount && index < lines.length; i++, index++) {
                vcfFileContent += `TEL:+${lines[index].trim()}\n`;
            }
            vcfFileContent += `END:VCARD\n`;
            
            const vcfBlob = new Blob([vcfFileContent], { type: 'text/vcard' });
            const vcfUrl = URL.createObjectURL(vcfBlob);
            const link = document.createElement('a');
            link.href = vcfUrl;
            link.download = `contacts_part_${Math.floor(index / contactCount)}.vcf`;
            link.click();
            URL.revokeObjectURL(vcfUrl);
        }

        fileInfo.textContent = 'Konversi selesai. File VCF telah diunduh.';
    };

    reader.onerror = function(error) {
        console.error('Terjadi kesalahan saat membaca file:', error);
        fileInfo.textContent = 'Terjadi kesalahan saat konversi.';
    };

    reader.readAsText(file);
}

// Fungsi untuk menggabungkan file TXT
function mergeTxtFiles() {
    const fileInput = document.getElementById('merge-files');
    const mergeFileInfo = document.getElementById('merge-file-info');

    if (fileInput.files.length === 0) {
        alert('Silakan pilih file TXT terlebih dahulu.');
        return;
    }

    const files = fileInput.files;
    let combinedText = '';
    let filesProcessed = 0;

    for (const file of files) {
        const reader = new FileReader();

        reader.onload = function(event) {
            combinedText += event.target.result + '\n';
            filesProcessed++;

            if (filesProcessed === files.length) {
                const blob = new Blob([combinedText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'combined.txt';
                link.click();
                URL.revokeObjectURL(url);
                mergeFileInfo.textContent = 'Gabungan selesai. File TXT telah diunduh.';
            }
        };

        reader.onerror = function(error) {
            console.error('Terjadi kesalahan saat membaca file:', error);
            mergeFileInfo.textContent = 'Terjadi kesalahan saat penggabungan.';
        };

        reader.readAsText(file);
    }
}
