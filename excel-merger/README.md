# Excel 批次合併小工具

把一個資料夾內所有格式相同的 `.xlsx` 報表（例如不同機台、班別、日期的日報）
自動合併成一份總表，並產生統計摘要與圖表。

這是一個示範工具，用來展示「Python 腳本 → 自動打包成 Windows exe」的完整流程。

## 功能

- **合併資料**：把所有 `.xlsx` 的資料疊在一起，並加上「來源檔案」欄位。
  欄位以標題名稱對齊，所以各檔案欄位順序不同也沒關係。
- **統計摘要**：自動產生第二個工作表，包含各檔案筆數、數值欄位的
  平均／最小／最大值，以及長條圖。
- **產生示範資料**：一鍵建立三個假的機台日報表，不需要真實資料就能測試。
- 資料完全在本機處理，不會上傳到任何地方。

## 下載 exe（不需要安裝 Python）

1. 到這個 repo 的 **Actions** 頁籤
2. 點最新一次成功的 **Build Windows EXE** 執行紀錄
3. 在頁面下方 **Artifacts** 區塊下載 `ExcelMerger-Windows`
4. 解壓縮後得到 `ExcelMerger.exe`，點兩下即可執行

> **注意**：因為這個 exe 沒有數位簽章，第一次執行時 Windows SmartScreen
> 可能會跳出警告，點「其他資訊」→「仍要執行」即可。
> 部分公司防毒軟體可能會攔截 PyInstaller 打包的程式，
> 必要時請聯絡 IT 加入白名單。

## 直接用 Python 執行（開發者）

```bash
pip install openpyxl
python excel_merger.py
```

## 修改後重新打包

只要把修改推送到 GitHub（或在 Actions 頁面手動觸發 workflow），
`.github/workflows/build-exe.yml` 就會自動在 Windows 環境重新打包 exe。
