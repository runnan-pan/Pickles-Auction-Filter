{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // ==UserScript==\
// @name         Pickles \uc0\u36710 \u36742 \u36807 \u28388 \u22120 \
// @namespace    http://tampermonkey.net/\
// @version      1.0\
// @description  \uc0\u36807 \u28388 \u25481  sellingPlatesStatus \u19981 \u26159  All \u30340 \u36710 \u36742 \
// @match        https://www.pickles.com.au/used/*\
// @grant        none\
// ==/UserScript==\
\
(function() \{\
    'use strict';\
\
    // \uc0\u28155 \u21152 \u19968 \u20010 \u24748 \u28014 \u25353 \u38062 \
    const btn = document.createElement('button');\
    btn.textContent = '\uc0\u55357 \u56983  \u36807 \u28388 \u36710 \u36742 ';\
    btn.style.cssText = `\
        position: fixed;\
        top: 100px;\
        right: 20px;\
        z-index: 99999;\
        padding: 10px 16px;\
        background: #0070f3;\
        color: white;\
        border: none;\
        border-radius: 6px;\
        font-size: 14px;\
        font-weight: bold;\
        cursor: pointer;\
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);\
    `;\
    document.body.appendChild(btn);\
\
    btn.addEventListener('click', debugAndFilterCars);\
\
    async function debugAndFilterCars() \{\
        // \uc0\u25226 \u20320 \u21407 \u26469 \u30340 \u23436 \u25972 \u33050 \u26412 \u20869 \u23481 \u31896 \u36148 \u21040 \u36825 \u37324 \
        console.log("\uc0\u55357 \u57056 \u65039  \u24320 \u22987 \u35786 \u26029 \u24182 \u35299 \u26512 \u36710 \u36742 \u35814 \u24773 \u25968 \u25454 ...\\n");\
        const cardElements = Array.from(document.querySelectorAll('main[class*="gridCard"]'));\
        if (cardElements.length === 0) \{\
            console.error("\uc0\u10060  \u26410 \u25214 \u21040 \u21345 \u29255 \u20803 \u32032 ,\u35831 \u30830 \u35748 \u39029 \u38754 \u21152 \u36733 \u23436 \u27605 \u12290 ");\
            return;\
        \}\
        console.log(`\uc0\u55357 \u56524  \u25214 \u21040  $\{cardElements.length\} \u20010 \u21345 \u29255 ,\u24320 \u22987 \u36880 \u20010 \u20998 \u26512 ...\\n`);\
        let countAll = 0;\
        let countHidden = 0;\
        for (let i = 0; i < cardElements.length; i++) \{\
            const card = cardElements[i];\
            const linkEl = card.querySelector('a[href*="/used/details/"]');\
            if (!linkEl) continue;\
            const detailUrl = linkEl.getAttribute('href');\
            try \{\
                const res = await fetch(detailUrl);\
                if (!res.ok) continue;\
                const htmlText = await res.text();\
                const platesMatches = [...htmlText.matchAll(/\\\\?"sellingPlatesStatus\\\\?"\\s*:\\s*(\\\\?"([^"\\\\]+)\\\\?"|null)/gi)];\
                let platesStatus = null;\
                if (platesMatches.length > 0) \{\
                    platesStatus = platesMatches[0][2] !== undefined ? platesMatches[0][2] : "null";\
                \}\
                const columnWrapper = card.closest('.column') || card;\
                if (platesStatus && platesStatus.toLowerCase() === "all") \{\
                    countAll++;\
                    columnWrapper.style.display = "";\
                \} else \{\
                    countHidden++;\
                    columnWrapper.style.display = "none";\
                \}\
            \} catch (err) \{\
                console.error(`\uc0\u35831 \u27714 \u20986 \u38169 :`, err);\
            \}\
        \}\
        console.log(`\\n\uc0\u55356 \u57225  \u23436 \u25104 !\u20445 \u30041 : $\{countAll\} \u21488 ,\u38544 \u34255 : $\{countHidden\} \u21488 \u12290 `);\
        btn.textContent = `\uc0\u9989  \u24050 \u36807 \u28388  (\u20445 \u30041 $\{countAll\}/\u38544 \u34255 $\{countHidden\})`;\
    \}\
\})();}