# [ 0120 ] Debug combine return data

## 文件說明：

### 修改檔名：

 ~~ChooseTemplate.js~~ ➡️ RuleTable.js

### mathsteps.js 新增讀取陣列維度的函式

```jsx
function getDepth(arr) {
    var list = [];
    var num = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            for (let j = 0; j < arr[i].length; j++) {
                list.push(arr[i][j]);
            }
        }
    }

    if (list.length) {
        num = 1;
        num += getDepth(list);
    }

    return num;
}
```

# [ 0105 ] 將回傳資料符合規則表

## 文件說明：

### Rule_Table.md

`詳解工具規則表，用來規範 mathsteps 的回傳資料，讓 EMA 系統製作對應的動畫`

## **⚠️使用警告⚠️**

1. 因為原本 mathsteps 會將加法與減法用 combine 來表示，因此選擇到 combine 時，會再多一維陣列將加法跟減法記錄下來
    
    例如：123 + 456 - 66 + 77 - 83
    
    回傳為
    
    ```python
    [
    	# combine 123, 456, -66, 77, -83
    	[
    		['add', [123, 456]], ['sub', [579, 66]], ['add', [513, 77]], ['sub', [590, 83]]
    	], 
    
    	# answer is 507
    	['ans', [507]]
    ]
    ```

# [ 1208 ] Python call mathsteps

## 系統運行需求

### Node.js：

- mathsteps 套件需要在 Node.js 環境下使用（版本 > 6.0.0）
- Node.js [官網](https://nodejs.org/en/)，以及[安裝教學](https://phoenixnap.com/kb/install-node-js-npm-on-windows)

### Python：

- 目前 EMA 系統可以穩定在 **Python 3.10.5** 下運行。
- 請至 Python 官方網站下載 3.10.5的版本。

## Node.js 套件：

1. mathsteps
    
    `npm install mathsteps`
    
    數學逐步解題工具
    

## Python 套件：

1. PyExecJS
    
    `pip install PyExecJS`
    
    使 Python 可以讓 JS 程式碼在本機 JS 環境下執行
    

## 文件說明：

以下說明是按照他的依賴順序編排的。

### NodeType.js

`用於確定 math.js 節點的類型`

### ChooseTemplate.js

`根據步驟的化簡方式來決定影片模板順序`

### mathsteps.js

`根據 Python 端輸入的數學題目，產生影片模板順序，並回傳給 python 端`

### test.py

`將輸入的數學題目交由 mathsteps.js 處理，並將回傳的結果顯示出來`

## 使用方式：

### 執行方式：

執行方法建議是直接在終端機輸入：

`python test.py`

### 輸入參數：

數學題目的輸入請於 `test.py` 程式碼中的 `input` 參數更改

```python
input = "題目";
```

## **⚠️使用警告⚠️**

1. 目前只有在化簡方式為 `COLLECT_AND_COMBINE_LIKE_TERMS, SIMPLIFY_ARITHMETIC, SIMPLIFY_FRACTION` 時，才會做影片模板的選擇
2. 分數化簡不是整數時，目前先忽略選擇模板的動作