// Verify support for camera functionality and initialise camera
var qr = new QrCode();

function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

function initCamera() {
    if (hasGetUserMedia()) {
        const constraints = {
            video: { width: { exact: 480 }, height: { exact: 480 } }
        };

        const video = document.querySelector('video');

        navigator.mediaDevices.getUserMedia(constraints).
            then((stream) => { video.srcObject = stream },
                (reason) => {
                    $("#resultPopup p").html('Please allow use of your device camera to scan the QR codes.');
                    $('#resultPopup').popup();
                    $('#resultPopup').popup("open");
                });
    } else {
        $("#resultPopup p").html('The QR code scanner is not compatible with this browser.');
        $('#resultPopup').popup();
        $('#resultPopup').popup("open");
    }
}

function scanImage() {
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const target = document.getElementById('target');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    let imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    decodeQR(imageData);
}

function decodeQR(imageData) {
    qr.callback = function (err, value) {
        if (err) {
            $("#resultPopup p").html('There was an error. Please try again.');
            $('#resultPopup').popup();
            $('#resultPopup').popup("open");
        }
        if (value) {
            if (value.result.includes('github.com/clennam/alexandria')) {
                window.location.href = value.result;
            } else {
                $("#resultPopup p").html('This QR code leads to an external location. Please use only Alexandria QR codes'
                    + ' with the scanner.');
                $('#resultPopup').popup();
                $('#resultPopup').popup("open");
            }
        }
    };
    qr.decode(imageData);
}

$(function () { initCamera(); });