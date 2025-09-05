document.addEventListener("DOMContentLoaded", () => {
    const resultDisplay = document.getElementById("result-display");
    const downloadBtn = document.getElementById("download-btn");
    const nextBtn = document.getElementById("next-btn");

    const homeBtn = document.getElementById("home-btn");

    // Attach event listeners immediately
    downloadBtn.addEventListener("click", () => {
        html2canvas(resultDisplay, { backgroundColor: '#f0f4f8' }).then(canvas => {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "cpr-result.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    homeBtn.addEventListener("click", () => {
        window.location.href = "/index.html";
    });

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const cprData = parseCprData(urlParams);

        if (cprData.totalScore !== null) {
            renderResult(cprData);
            renderRadarChart(cprData.radar_scores);
        } else {
            showError("表示するデータがありません。URLを確認してください。");
        }
    } catch (e) {
        console.error("Data parsing error:", e);
        showError("データの解析に失敗しました。");
    }

    downloadBtn.addEventListener("click", () => {
        html2canvas(resultDisplay, { backgroundColor: '#f0f4f8' }).then(canvas => {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "cpr-result.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    nextBtn.addEventListener("click", () => {
        alert("「次へ」がクリックされました。");
    });

    function parseCprData(params) {
        const getInt = (p) => params.has(p) ? parseInt(params.get(p), 10) : null;
        const getFloat = (p) => params.has(p) ? parseFloat(params.get(p)) : null;

        return {
            totalScore: getInt('totalScore'),
            radar_scores: {
                compression: getInt('rc_comp'),
                release: getInt('rc_release'),
                position: getInt('rc_pos'),
                speed: getInt('rc_speed'),
                interruption: getInt('rc_int'),
            },
            details: {
                depth: getFloat('depth'),
                bpm: getInt('bpm'),
                releasePct: getInt('releasePct'),
                positionPct: getInt('positionPct'),
                interruptionCount: getInt('interruptionCount'),
            }
        };
    }

    function renderResult(data) {
        resultDisplay.innerHTML = `
            <div class="cpr-layout">
                <div class="main-panel">
                    <div class="score-display">
                        <span class="total-score-label">総合</span>
                        <span class="total-score-value">${data.totalScore}</span>
                        <span class="total-score-unit">点</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="radar-chart"></canvas>
                    </div>
                </div>
                <div class="details-panel">
                    <h3>詳細データ</h3>
                    <div class="detail-item">
                        <label>圧迫の深さ</label>
                        <span>${data.details.depth !== null ? data.details.depth + ' cm' : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <label>圧迫の速さ</label>
                        <span>${data.details.bpm !== null ? data.details.bpm + ' BPM' : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <label>リリース</label>
                        <span>${data.details.releasePct !== null ? data.details.releasePct + ' %' : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <label>圧迫位置</label>
                        <span>${data.details.positionPct !== null ? data.details.positionPct + ' %' : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <label>中断回数</label>
                        <span>${data.details.interruptionCount !== null ? data.details.interruptionCount + ' 回' : 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderRadarChart(radarData) {
        const ctx = document.getElementById('radar-chart').getContext('2d');
        const labels = ['圧迫', 'リリース', '位置', '速さ', '中断'];
        const data = [
            radarData.compression,
            radarData.release,
            radarData.position,
            radarData.speed,
            radarData.interruption
        ];

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: '評価スコア',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(0, 123, 255, 1)'
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        angleLines: { color: '#ddd' },
                        grid: { color: '#ddd' },
                        pointLabels: { font: { size: 14 }, color: '#333' },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { display: false }
                    }
                },
                maintainAspectRatio: false
            }
        });
    }

    function showError(message) {
        resultDisplay.innerHTML = `<p class="error-message">${message}</p>`;
        downloadBtn.style.display = 'none';
    }
});