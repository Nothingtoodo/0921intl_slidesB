# AI Agent 講義

> 電腦能做的事，它都能做。
> 林冠宇｜永續發展與校務研究中心 · 2026.09.21 國際處分享
> 從「問答對話框」到「會動手的數位同事」——演講用的單頁式網站（純 HTML / CSS / JS，無需建置）。

## 內容架構（38 頁，上下滑動）

| 段落 | 內容 |
|---|---|
| 開場 | 封面（講者資訊）、今天的路線（介紹 → 範例 → 實作 → 回顧） |
| 01 對話框 vs. Agent | 畫面對比、五個差異、Agent 運作迴圈、小結 |
| 02 思維 | 電腦能做的事 Agent 都能做、從「問」到「派」 |
| 任務 01–04 | ① 國際處校友問卷成果分析簡報（讀取資料夾內所有 Excel → insight、結論先行標題、圖表標註母體 n、附錄對應）② 出國交流報告（QS EduSummit 新加坡：錄音＋照片，依韓國版範本改寫成新版本；另附會議紀錄等其他範例）③ 批次查詢公司登記狀態與資本額（依名單逐筆搜尋，是否「核准設立」、資本額、附來源網址）④ 歷年 QS／THE 排名 → 查詢與比較儀表板。**每個任務 4 頁：介紹 → 範例 → 現場實作 → 回顧** |
| 04 AI 近況 | Anthropic 報告：AI 主導 26% 的研發工作（含自評數據提醒） |
| 05 三個層級 | 下指令 → 接流程（含互動小工具）→ 養分身、怎麼往上走 |
| 06 資安提醒 | Agent 為何更需要資安、資料紅／黃／綠分級、Agent 專屬四種風險、八項上線前檢查表（可互動） |
| 結語 | 帶走四件事、Q&A |
| 資料來源 | Claude 報告、Kelly Tsai 影片（僅列標題與連結） |

## 演講時怎麼操作

| 按鍵 | 功能 |
|---|---|
| `↓` `→` `PageDown` `Space` | 下一頁（簡報遙控器的翻頁鍵可直接使用） |
| `↑` `←` `PageUp` `Shift+Space` | 上一頁 |
| `Home` / `End` | 第一頁 / 最後一頁 |
| `M` | 開啟目錄，直接跳到任一頁（Demo 後回到指定頁很方便） |
| `F` | 全螢幕 |
| `T` | 切換深色 / 淺色主題 |
| `R` | 重播目前頁面的動畫（終端機日誌、數字） |

- 網址會隨頁面更新成 `#頁面id`（例如 `#a3`），重新整理不會回到開頭，也可以直接分享某一頁。
- 每個 **現場實作** 頁都有「複製指令」按鈕，可一鍵複製示範用的提示詞。
- 側邊圓點可點選，滑鼠停留會顯示頁名。

## 本機預覽

直接雙擊 `index.html` 即可（所有路徑皆為相對路徑）。
網頁字型（Inter / Space Grotesk / JetBrains Mono / Noto Sans TC）從 Google Fonts 載入；**離線時會自動退回系統字型**（Windows 為微軟正黑體），版面不會壞。

## 部署到 GitHub Pages

1. 在 GitHub 建立一個新的 repository（例如 `ai-agent-talk`），設為 Public。
2. 在本資料夾開啟終端機，執行：

   ```bash
   git init
   git add .
   git commit -m "AI Agent 講義"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/ai-agent-talk.git
   git push -u origin main
   ```

3. 到 repository 的 **Settings → Pages**：Source 選 **Deploy from a branch**，Branch 選 `main` / `/ (root)`，按 Save。
4. 約 1 分鐘後，網站會出現在 `https://<你的帳號>.github.io/ai-agent-talk/`。

要點：
- 已附 `.nojekyll`，GitHub 不會用 Jekyll 處理檔案。
- 所有資源皆用相對路徑，放在 `/<repo名稱>/` 子路徑下也能正常運作。
- **社群分享預覽圖**：`index.html` 的 `og:image` 目前是相對路徑，臉書 / LINE 等平台需要絕對網址。部署後請把它改成
  `https://<你的帳號>.github.io/ai-agent-talk/assets/og.png`。

## 如何修改內容

所有內容都在 `index.html`，每一頁是一個 `<section class="slide" id="…" data-part="…" data-title="…">`：

- **改文字**：直接改標籤內文字。`data-part` / `data-title` 會顯示在上方導覽列、側邊圓點與目錄。
- **改示範指令**：搜尋 `id="pA"`、`pB`、`pC`、`pD`（四個 Live Demo 頁），換成你現場要用的指令。
- **講者資訊**：封面 `id="cover"` 的 `<div class="speaker">` 區塊（姓名、單位、日期），以及最後一頁 `id="end"` 底部那一行。要加 QR Code 也可以放在最後一頁。
- **新增或刪除頁面**：複製一整個 `<section>…</section>` 區塊改內容即可，導覽、頁碼、目錄會自動更新（`id` 不可重複）。
- **改配色**：`assets/style.css` 開頭的 `:root { … }` 變數（`--cyan`、`--violet`、`--grad` 等）。
- 標示「**示意**」的畫面（終端機、對話視窗、儀表板、統計圖）是示意用的假資料，不是真實數據。

## 列印 / 存成 PDF 講義

用 Chrome 或 Edge 開啟 → `Ctrl + P` → 版面配置選 **橫向**、勾選 **背景圖形** → 另存為 PDF。
列印時會自動改成淺色、每頁一張投影片，並隱藏導覽元件。

## 資料來源與核對

「AI 近況」段落整理自 Anthropic 的報告：
<https://www.anthropic.com/institute/measuring-pace-of-ai-development>

頁面中使用的數字（26%、2026 年 2 月不到 1%、>90% 達「AI 協作」以上、約 15,000 個抽樣任務、AL0–AL5 中已定義的等級）皆已對照報告原文核對。
報告是 Anthropic 自己公布的自評數據，講義中已標註。**正式演講前，建議再對照原文確認一次。**

其他頁面中標示「**示意**」的畫面（終端機、對話視窗、儀表板、統計圖、學校與數字）都是示意用的假資料，不是真實數據。

## 公開部署前的資安檢查

這份講義是**公開網站**，請確認 repository 內只有講義本身（`index.html`、`assets/`、`README.md`）：

- 不要把示範用的原始資料（問卷填答、名單、錄音、逐字稿、排名檔案）放進 repository。
- 有授權限制的資料（例如需登入下載的資料庫）不可公開。
- 不要放任何密碼、API 金鑰、Token。

## 檔案結構

```
講義/
├── index.html          # 全部內容（目前使用版本，含「資料來源」頁）
├── index_0920_2026.html # 2026-09-20 的舊版備份（無「資料來源」頁）
├── assets/
│   ├── style.css       # 樣式（深色 / 淺色 / 列印）
│   ├── main.js         # 導覽、鍵盤、動畫、互動小工具
│   ├── favicon.svg
│   └── og.png          # 社群分享預覽圖（1200×630）
├── .nojekyll
└── README.md
```
