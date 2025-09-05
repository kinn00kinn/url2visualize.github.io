document.addEventListener("DOMContentLoaded", () => {
    const resultDisplay = document.getElementById("result-display");
    const downloadBtn = document.getElementById("download-btn");

    // 1. URLからデータを取得して表示
    try {
        const urlParams = new URLSearchParams(window.location.search);

        // クエリパラメータから直接データを取得
        const resultData = {
            songTitle: urlParams.get('title'),
            difficulty: urlParams.get('difficulty'),
            score: parseInt(urlParams.get('score'), 10),
            rank: urlParams.get('rank'),
            details: {
                Perfect: parseInt(urlParams.get('perfect'), 10),
                Great: parseInt(urlParams.get('great'), 10),
                Good: parseInt(urlParams.get('good'), 10),
                Miss: parseInt(urlParams.get('miss'), 10),
            }
        };

        if (resultData.songTitle && resultData.score) {
            renderResult(resultData);
        } else {
            showError("表示するデータがありません。URLを確認してください。");
        }
    } catch (e) {
        console.error("Data parsing error:", e);
        showError("データの解析に失敗しました。URLが正しいか確認してください。");
    }

    // 2. ダウンロードボタンのイベントリスナー
    downloadBtn.addEventListener("click", () => {
        // html2canvasで #result-display をキャプチャ
        html2canvas(resultDisplay, { 
            backgroundColor: '#333', // 背景色を明示的に指定
            useCORS: true // 外部画像がある場合に備える
        }).then(canvas => {
            // canvasを画像(PNG)に変換
            const image = canvas.toDataURL("image/png");

            // ダウンロード用のリンクを作成してクリック
            const link = document.createElement("a");
            link.href = image;
            link.download = "game-result.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    // 結果を描画する関数
    function renderResult(data) {
        // シンプルなリザルト画面のHTMLを生成
        resultDisplay.innerHTML = `
            <div class="result-header">
                <h2>${data.songTitle || 'Unknown Song'}</h2>
                <p class="difficulty ${data.difficulty?.toLowerCase()}">${data.difficulty || 'NORMAL'}</p>
            </div>
            <div class="result-body">
                <div class="score-container">
                    <p class="score-label">SCORE</p>
                    <p class="score-value">${data.score?.toLocaleString() || 0}</p>
                </div>
                <div class="rank-container">
                    <p class="rank-value">${data.rank || 'N/A'}</p>
                </div>
            </div>
            <div class="result-footer">
                <div class="detail-grid">
                    <p>Perfect: <span>${data.details?.Perfect || 0}</span></p>
                    <p>Great: <span>${data.details?.Great || 0}</span></p>
                    <p>Good: <span>${data.details?.Good || 0}</span></p>
                    <p>Miss: <span>${data.details?.Miss || 0}</span></p>
                </div>
            </div>
        `;
    }

    // エラーメッセージを表示する関数
    function showError(message) {
        resultDisplay.innerHTML = `<p class="error-message">${message}</p>`;
        downloadBtn.style.display = 'none'; // エラー時はダウンロードボタンを非表示
    }
});