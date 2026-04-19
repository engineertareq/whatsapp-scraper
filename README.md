# WhatsApp Number Scraper - Chrome Extension

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4.svg?logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A lightweight, modern, and powerful Chrome Extension that extracts **unsaved** phone numbers from WhatsApp Web. Perfect for backing up group participants, generating lead lists, or saving unrecorded contacts without the hassle of manual copy-pasting.

## ✨ Features

*  Smart Extraction: Automatically filters out saved contacts and strictly extracts unsaved phone numbers.
*  Auto-Scrolling: Capable of scrolling through long chat lists or large group participant lists to capture numbers that are off-screen.
*  Excel-Ready CSV Export:Formats CSV outputs perfectly (`="\+number"`) to prevent Microsoft Excel from converting long phone numbers into scientific math formulas.
*  TXT Export: Clean, plain-text export option.
*  1-Click Copy: Copy all extracted numbers to your clipboard instantly.
*  Modern UI: Sleek, minimalist glass-like interface built with zero external dependencies (no heavy font libraries or frameworks).
*  Privacy First: All scraping happens locally in your browser. No data is sent to external servers.

## Installation

Since this extension is in development, you can install it manually via Chrome's Developer Mode.

1. **Download the code:**
   * Clone this repository: `git clone https://github.com/engineertareq/whatsapp-scraper.git`
   * *OR* click the green **Code** button and select **Download ZIP**, then extract it.
2. **Open Chrome Extensions:**
   * Open Google Chrome and navigate to `chrome://extensions/` (or click the puzzle piece icon > Manage Extensions).
3. **Enable Developer Mode:**
   * Toggle the **Developer mode** switch in the top right corner.
4. **Load the Extension:**
   * Click the **Load unpacked** button in the top left.
   * Select the folder where you extracted this project.
5. **Pin it:**
   * Click the puzzle piece icon in Chrome and "pin" the WA Scraper icon to your toolbar for easy access.

## 📖 How to Use

1. Open [WhatsApp Web](https://web.whatsapp.com/) and log in.
2. To capture numbers, you have two options:
   * **Recent Chats:** Simply ensure your chat list on the left is visible.
   * **Group Participants:** Open a group chat, click the group name to view info, and scroll down to the "Participants" list.
3. Click the **WA Scraper** icon in your Chrome toolbar.
4. Click **Scan Numbers**. (The extension may scroll down automatically if there are many numbers).
5. Once complete, choose to export as **CSV**, **TXT**, or **Copy All**.

## 📂 Project Structure

```text
whatsapp-scraper/
├── manifest.json       # Extension configuration (Manifest V3)
├── popup.html          # UI layout for the extension popup
├── popup.js            # Logic for popup interactions and exporting
├── styles.css          # Modern styling for the popup
├── content-smart.js    # Core scraping and auto-scroll logic injected into WhatsApp
├── icon16.png          # 16x16 Extension Icon
├── icon48.png          # 48x48 Extension Icon
└── icon128.png         # 128x128 Extension Icon
