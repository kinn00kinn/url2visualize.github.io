document.addEventListener("DOMContentLoaded", () => {
    const resultDisplay = document.getElementById("result-display");
    const downloadBtn = document.getElementById("download-btn");
    const nextBtn = document.getElementById("next-btn");
    const homeBtn = document.getElementById("home-btn");

    // Attach event listeners
    downloadBtn.addEventListener("click", () => {
        // Use the new result-content for canvas creation
        const elementToCapture = document.querySelector('.result-content') || resultDisplay;
        html2canvas(elementToCapture, { backgroundColor: '#f9fafb' }).then(canvas => {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "cpr-result.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });

    nextBtn.addEventListener("click", () => {
        alert("「次へ」がクリックされました。");
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
        const details = data.details;
        const radar = data.radar_scores;

        resultDisplay.innerHTML = `
            <div class="result-content">
                <!-- 総合スコア -->
                <div class="overall-score-wrapper">
                    <div class="overall-score-container">
                        <div class="score-value">
                            <span class="score-number">${data.totalScore || 'N/A'}</span>
                            <span class="score-unit">点</span>
                        </div>
                        <div class="chart-container">
                            <canvas id="radar-chart"></canvas>
                        </div>
                        <span class="chart-title">総合</span>
                    </div>
                </div>

                <!-- 詳細スコア -->
                <div class="details-grid">
                    <div class="detail-card">
                        <h4>圧迫</h4>
                        <p class="detail-score">${radar.compression || 'N/A'}<span>点</span></p>
                        <ul class="detail-list">
                            <li>最大深度: ${details.depth !== null ? details.depth.toFixed(1) + ' cm' : 'N/A'}</li>
                            <li>圧迫位置: ${details.positionPct !== null ? details.positionPct + ' %' : 'N/A'}</li>
                        </ul>
                    </div>
                    <div class="detail-card">
                        <h4>リコイル</h4>
                        <p class="detail-score">${radar.release || 'N/A'}<span>点</span></p>
                        <ul class="detail-list">
                            <li>解放率: ${details.releasePct !== null ? details.releasePct + ' %' : 'N/A'}</li>
                        </ul>
                    </div>
                    <div class="detail-card">
                        <h4>連続性</h4>
                        <p class="detail-score">${radar.interruption || 'N/A'}<span>点</span></p>
                        <ul class="detail-list">
                            <li>中断回数: ${details.interruptionCount !== null ? details.interruptionCount + ' 回' : 'N/A'}</li>
                        </ul>
                    </div>
                    <div class="detail-card">
                        <h4>レート（間隔）</h4>
                        <p class="detail-score">${radar.speed || 'N/A'}<span>点</span></p>
                        <ul class="detail-list">
                            <li>BPM: ${details.bpm !== null ? details.bpm : 'N/A'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    function renderRadarChart(radarData) {
        const ctx = document.getElementById('radar-chart').getContext('2d');
        const labels = ['圧迫', 'リコイル', '位置', '速さ', '連続性'];
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
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Faint red
                    borderColor: 'rgba(239, 68, 68, 0.8)', // Solid red
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(239, 68, 68, 1)'
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        angleLines: { color: '#e5e7eb' },
                        grid: { color: '#e5e7eb' },
                        pointLabels: { font: { size: 14 }, color: '#4b5563' },
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
        nextBtn.style.display = 'none';
    }
});
