// ==UserScript==
// @name         Pickles 车辆过滤器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  过滤掉 sellingPlatesStatus 不是 All 的车辆,点击后显示 loading 状态
// @match        https://www.pickles.com.au/used/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 注入 loading 转圈动画所需的 CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pickles-spin {
            to { transform: rotate(360deg); }
        }
        .pickles-spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid rgba(255,255,255,0.4);
            border-top-color: #fff;
            border-radius: 50%;
            animation: pickles-spin 0.8s linear infinite;
            margin-right: 6px;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);

    // 添加悬浮按钮
    const btn = document.createElement('button');
    btn.innerHTML = '🚗 过滤车辆';
    btn.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 99999;
        padding: 10px 16px;
        background: #0070f3;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(btn);

    btn.addEventListener('click', debugAndFilterCars);

    async function debugAndFilterCars() {
        // 进入 loading 状态:禁用按钮 + 显示转圈图标 + "过滤中" 文字
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.85';
        btn.innerHTML = '<span class="pickles-spinner"></span>过滤中...';

        console.log("🛠️ 开始诊断并解析车辆详情数据...\n");
        const cardElements = Array.from(document.querySelectorAll('main[class*="gridCard"]'));
        if (cardElements.length === 0) {
            console.error("❌ 未找到卡片元素,请确认页面加载完毕。");
            btn.disabled = false;
            btn.style.cursor = 'pointer';
            btn.style.opacity = '1';
            btn.innerHTML = '⚠️ 未找到卡片,请重试';
            return;
        }
        console.log(`📌 找到 ${cardElements.length} 个卡片,开始逐个分析...\n`);
        let countAll = 0;
        let countHidden = 0;

        for (let i = 0; i < cardElements.length; i++) {
            const card = cardElements[i];
            const linkEl = card.querySelector('a[href*="/used/details/"]');

            if (!linkEl) {
                console.warn(`[卡片 #${i + 1}] 未找到详情链接`);
                continue;
            }
            const detailUrl = linkEl.getAttribute('href');
            console.group(`🚗 卡片 #${i + 1}: ${detailUrl}`);
            try {
                const res = await fetch(detailUrl);
                console.log(`📡 GET 状态码: ${res.status} ${res.statusText}`);
                if (!res.ok) {
                    console.error(`❌ 请求失败`);
                    console.groupEnd();
                    continue;
                }
                const htmlText = await res.text();

                // 兼容普通引号和转义引号两种格式
                const platesMatches = [...htmlText.matchAll(/\\?"sellingPlatesStatus\\?"\s*:\s*(\\?"([^"\\]+)\\?"|null)/gi)];

                let platesStatus = null;
                if (platesMatches.length > 0) {
                    platesStatus = platesMatches[0][2] !== undefined ? platesMatches[0][2] : "null";
                    console.log(`🔎 正确提取到 sellingPlatesStatus: "%c${platesStatus}%c"`, "color: #0070f3; font-weight: bold", "");
                } else {
                    console.warn(`⚠️ 未匹配到 "sellingPlatesStatus" 关键字!检查返回的 HTML 前 300 字符:`);
                    console.log(htmlText.slice(0, 300));
                    const alternateMatches = [...htmlText.matchAll(/\\?"([^"\\]*plates[^"\\]*)\\?"\s*:\s*([^,}]+)/gi)];
                    if (alternateMatches.length > 0) {
                        console.log(`🔍 找到其他包含 'plates' 的关联字段:`);
                        alternateMatches.forEach(m => console.log(`   - ${m[1]}: ${m[2]}`));
                    }
                }

                const columnWrapper = card.closest('.column') || card;
                if (platesStatus && platesStatus.toLowerCase() === "all") {
                    countAll++;
                    columnWrapper.style.display = "";
                    console.log(`✅ [%c保留%c] sellingPlatesStatus 是 All`, "color: green; font-weight: bold", "");
                } else {
                    countHidden++;
                    columnWrapper.style.display = "none";
                    console.log(`❌ [%c隐藏%c] sellingPlatesStatus 不是 All (实际为: ${platesStatus})`, "color: red; font-weight: bold", "");
                }
            } catch (err) {
                console.error(`💥 请求出错:`, err);
            }
            console.groupEnd();
        }

        console.log(`\n🎉 诊断与过滤完成!保留 (All): ${countAll} 台,隐藏: ${countHidden} 台。`);

        // 恢复按钮状态,显示最终结果
        btn.disabled = false;
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
        btn.innerHTML = `✅ 已过滤 (保留${countAll}/隐藏${countHidden})`;
    }
})();
