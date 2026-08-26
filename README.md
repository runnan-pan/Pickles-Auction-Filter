[简体中文](./README.cn.md) | English

# Pickles Auction Vehicle Filter

A Tampermonkey userscript for the [Pickles Auctions](https://www.pickles.com.au) vehicle listing page. It automatically filters vehicles, keeping only those whose `sellingPlatesStatus` is `"All"` and hiding the rest.

## 📖 Background

On the Pickles vehicle listing page, each vehicle's detail data includes a `sellingPlatesStatus` field indicating the selling plates status of that vehicle. Manually opening each vehicle's detail page to check this is time-consuming. This script adds a floating button on the listing page that, when clicked, will:

1. Scan all vehicle cards on the current page;
2. Fetch each vehicle's detail page and extract the `sellingPlatesStatus` field from it;
3. Automatically hide any vehicle card whose status is not `"All"`, keeping only matching vehicles visible.

## ✨ Features

- 🖱️ **One-click trigger**: A floating button on the page runs the filter — no need to open the console.
- 🔍 **Built-in diagnostics**: If a field can't be matched, detailed diagnostic info is logged to the console to help troubleshoot page structure changes.
- 🧩 **Escaped-quote compatible**: The field may appear in the detail page HTML with either plain quotes `"` or escaped quotes `\"` — the script handles both.
- 📊 **Result summary**: After filtering, the button text updates to show how many vehicles were kept vs. hidden.

## 🔧 Installation

1. Install the [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) browser extension (works on Chrome / Edge).
2. In the same browser, open this raw script URL:
   https://raw.githubusercontent.com/runnan-pan/Pickles-Auction-Filter/main/pickles_filter.user.js
3. Tampermonkey will detect the userscript and show an installation page. Click **Install**.
4. Make sure the script is enabled (toggle is green/on in the Tampermonkey dashboard).

Installing from the raw URL also lets Tampermonkey check this repo for later updates.

## 🚀 Usage

1. Open a Pickles vehicle listing page, e.g.:
   `https://www.pickles.com.au/used/search/cars...`
2. Wait for the page to fully load (all vehicle cards visible).
3. A **🚗 Filter Vehicles** floating button will appear on the right side of the page.
4. Click the button. The script will fetch each vehicle's detail page and filter accordingly. You can open the browser console (F12 → Console) to watch the live logs.
5. Once done, the button text updates to something like **✅ Filtered (Kept X / Hidden Y)**, and non-matching vehicle cards will be hidden from the page.

> ⚠️ Note: The script makes one network request per vehicle card. With a large number of vehicles, this may take a bit of time — wait for the button to show the completion status.

## 🧠 How It Works

Core logic of the script:

```js
// 1. Collect all vehicle cards on the current page
document.querySelectorAll('main[class*="gridCard"]')

// 2. Extract the detail page link for each card
card.querySelector('a[href*="/used/details/"]')

// 3. Fetch the detail page HTML and extract sellingPlatesStatus via regex
//    (compatible with both plain and escaped quotes)
/\\?"sellingPlatesStatus\\?"\s*:\s*(\\?"([^"\\]+)\\?"|null)/gi

// 4. Show or hide each card based on the extracted value
columnWrapper.style.display = (platesStatus === "all") ? "" : "none";
```

## 🐛 Troubleshooting

| Symptom | Possible Cause | Fix |
|---|---|---|
| No cards found, script exits immediately | Page structure or class names have changed | Check whether the `main[class*="gridCard"]` selector still matches the current page structure |
| All vehicles show "sellingPlatesStatus not matched" | The site changed the field name or data format | Check the diagnostic HTML snippet logged to the console and adjust the regex/field name if needed |
| Button click causes long delay with no response | Many vehicles to process, or some requests are being rate-limited | Watch the per-card request logs in the console to check for failed or slow requests |

## ⚠️ Disclaimer

This script is intended for personal use to speed up browsing and filtering. Please comply with Pickles' terms of service and applicable local laws, and avoid sending excessive requests that could burden the target website. Use of this script is at your own risk.

## 📄 License

MIT License
