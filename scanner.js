const video = document.getElementById("scanner-video");
const startScanBtn = document.getElementById("start-scan-btn");
const scannerContainer = document.getElementById("scanner-container");
const statusMessage = document.getElementById("status-message");

let stream = null;
let animationFrameId = null;

// スキャンを開始するボタンのイベントリスナー
startScanBtn.addEventListener("click", async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.play();

        startScanBtn.style.display = "none";
        scannerContainer.style.display = "block";
        statusMessage.textContent = "カメラを起動しました。QRコードをかざしてください。";

        // スキャン処理を開始
        animationFrameId = requestAnimationFrame(tick);
    } catch (err) {
        console.error("Camera Error:", err);
        statusMessage.textContent = "カメラの起動に失敗しました。権限を確認してください。";
    }
});

// 毎フレームごとにQRコードをスキャンする
function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvasElement = document.createElement("canvas");
        const canvas = canvasElement.getContext("2d");
        
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            // QRコードを検出
            statusMessage.textContent = `QRコードを検出しました: ${code.data}`;
            stopScan();
            
            // URLが有効か簡単なチェック
            if (code.data.startsWith("http://") || code.data.startsWith("https://")) {
                window.location.href = code.data;
            } else {
                statusMessage.textContent = "有効なURLではありません。";
            }
            return; // 処理を終了
        }
    }
    // 次のフレームをリクエスト
    animationFrameId = requestAnimationFrame(tick);
}

// URL入力から移動するボタンのイベントリスナー
goBtn.addEventListener("click", (event) => {
    event.preventDefault(); // <a>タグのデフォルトの動作をキャンセル
    const url = urlInput.value.trim();
    if (url && url.includes("result.html?")) {
        statusMessage.textContent = `指定されたURLに移動します...`;
        window.location.assign(url); // より明示的なメソッドに変更
    } else {
        statusMessage.textContent = "有効なURLを入力してください。";
    }
});

// スキャンを停止する
function stopScan() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    scannerContainer.style.display = "none";
}