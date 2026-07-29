// ==UserScript==
// @name         Pickles 车辆过滤器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  过滤掉 sellingPlatesStatus 不是 All 的车辆
// @match        https://www.pickles.com.au/used/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个悬浮按钮
    const btn = document.createElement('button');
    btn.textContent = '🚗 过滤车辆';
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
        // 把你原来的完整脚本内容粘贴到这里
        console.log("🛠️ 开始诊断并解析车辆详情数据...\n");
        const cardElements = Array.from(document.querySelectorAll('main[class*="gridCard"]'));
        if (cardElements.length === 0) {
            console.error("❌ 未找到卡片元素,请确认页面加载完毕。");
            return;
        }
        console.log(`📌 找到 ${cardElements.length} 个卡片,开始逐个分析...\n`);
        let countAll = 0;
        let countHidden = 0;
        for (let i = 0; i < cardElements.length; i++) {
            const card = cardElements[i];
            const linkEl = card.querySelector('a[href*="/used/details/"]');
            if (!linkEl) continue;
            const detailUrl = linkEl.getAttribute('href');
            try {
                const res = await fetch(detailUrl);
                if (!res.ok) continue;
                const htmlText = await res.text();
                const platesMatches = [...htmlText.matchAll(/\\?"sellingPlatesStatus\\?"\s*:\s*(\\?"([^"\\]+)\\?"|null)/gi)];
                let platesStatus = null;
                if (platesMatches.length > 0) {
                    platesStatus = platesMatches[0][2] !== undefined ? platesMatches[0][2] : "null";
                }
                const columnWrapper = card.closest('.column') || card;
                if (platesStatus && platesStatus.toLowerCase() === "all") {
                    countAll++;
                    columnWrapper.style.display = "";
                } else {
                    countHidden++;
                    columnWrapper.style.display = "none";
                }
            } catch (err) {
                console.error(`请求出错:`, err);
            }
        }
        console.log(`\n🎉 完成!保留: ${countAll} 台,隐藏: ${countHidden} 台。`);
        btn.textContent = `✅ 已过滤 (保留${countAll}/隐藏${countHidden})`;
    }
})();
