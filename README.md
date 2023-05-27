# [ 0527 ] 將修改後的 V-MATHER 分類器與 EMA_with_mathsteps 結合

## EMA_with_mathsteps 檔案結構

```python
/EMA_with_mathsteps
|-- __pycache__
|-- test.py                             # 主程式
|-- operate_object.py                   # 各種運算方式的類別（class）
|-- classify
    |-- addition_classify.py            # 兩正整數加法分類
    |-- subtraction_classify.py         # 兩正整數減法分類
    |-- multiplication_classify.py      # 兩正整數乘法分類
    |-- divison_classify.py             # 兩正整數除法分類
|-- mathsteps.js                        # 解題步驟產生器
|-- NodeTypes.js                        # 解題步驟的資料型態
|-- RuleTable.js                        # 規則表
|-- test.ipynb                          # 程式碼測試
|-- system_framework.png                # 系統架構圖
|-- RuleTable.md                        # 規則表說明
|-- README.md
|-- 程式乾貨.docx
```

## 回傳的動畫參數（目前僅在分支 return_object 實作）

### 以數學題目 `(5 + 8) * (89 - 43 - 23) * 123 * 5` 為例

```python
[步驟 1（object）, 步驟 2（object）, 步驟 3（object）, 步驟 4（object）,
 步驟 5（object）, 步驟 6（object）, 步驟 7（object）]
```

### Step 類別擁有的屬性如下

```python
class Step():
    def __init__(self, step):
        self.operator = step[0]   # 步驟的運算子   
        self.values = step[1]     # 步驟擁有的參數
        self.classify_tag = None  # 步驟的分類標籤
        self.strategy = None      # 步驟合適的詳解工具
        self.__classify()         # 預先完成分類
```

### 展開步驟 `[Step.operator, Step.values, Step.strategy, Step.classify_tag]`

✨ 僅為了展示步驟資訊，實際呼叫時，可以直接查閱物件屬性

```python
[
	['mul', [123, 5], '直式乘法', ['三位數乘以一位數', '乘數為一位數']],
	['add', [5, 8], '數數加法', ['20 以內的加法', '十萬以內的加法']],
	['sub', [89, 43], '直式減法', ['二位數的減法（不退位）', '十萬以內的減法']],
	['sub', [46, 23], '直式減法', ['二位數的減法（不退位）', '十萬以內的減法']],
	['mul', [615, 13], '直式乘法', ['乘數為二位數']],
	['mul', [7995, 23], '直式乘法', ['乘數為二位數', '大數乘法']],
	['ans', [183885], None, None]
]
```

# [ 0426 ] 更改回傳的資料型態

## 回傳資料型態：

### 原本的資料型態 — 多維 list

缺點：各步驟都是 list 型態，利用 index 尋找步驟資訊容易出錯

以數學題目 `(5 + 8) * (89 - 43 - 23) * 123 * 5` 為例，結果為

```python
[
	['mul', [123, 5], ['三位數乘以一位數', '乘數為一位數']],  # 步驟 1（list）
	['add', [5, 8], ['20 以內的加法', '十萬以內的加法']],  # 步驟 2（list）
	['sub', [89, 43], ['二位數的減法（不退位）', '十萬以內的減法']],  # 步驟 3（list）
	['sub', [46, 23], ['二位數的減法（不退位）', '十萬以內的減法']],  # 步驟 4（list）
	['mul', [615, 13], ['乘數為二位數']],  # 步驟 5（list）
	['mul', [7995, 23], ['乘數為二位數', '大數乘法']],  # 步驟 6（list）
	['ans', [183885]]  # 步驟 7（list）
]
```

### 修改後的資料型態 — 物件 list（位於 branch：return_object）

優點：各步驟根據 Step 類別（class）建立物件（object），透過物件的屬性（attribute），可以方便查找各步驟所需資訊

目前 Step 類別擁有的屬性如下

```python
class Step():
    def __init__(self, step):
        self.operator = step[0]  # 步驟的運算子
        self.values = step[1]  # 步驟擁有的參數
        self.strategies = self.classify()  # 步驟合適的詳解工具，目前先填入分類標籤
```

回傳的資料型態為

```python
[步驟 1（object）, 步驟 2（object）, 步驟 3（object）,...]
```

# [ 0424 ] 結合步驟解法分類

## 新增文件：

### operate_object.py

`此程式為各種運算方式的類別（class）`

### addition_classify.py

`此程式用來判斷加法物件包含哪些分類目標`

### subtraction_classify.py

`此程式用來判斷減法物件包含哪些分類目標`

### multiplication_classify.py

`此程式用來判斷乘法物件包含哪些分類目標`

### division_classify.py

`此程式用來判斷除法物件包含哪些分類目標`

### 以數學題目 `(5 + 8) * (89 - 43 - 23) * 123 * 5` 為例，結果為

```python
[
	['mul', [123, 5], ['三位數乘以一位數', '乘數為一位數']], 
	['add', [5, 8], ['20 以內的加法', '十萬以內的加法']], 
	['sub', [89, 43], ['二位數的減法（不退位）', '十萬以內的減法']], 
	['sub', [46, 23], ['二位數的減法（不退位）', '十萬以內的減法']], 
	['mul', [615, 13], ['乘數為二位數']], 
	['mul', [7995, 23], ['乘數為二位數', '大數乘法']], 
	['ans', [183885]]
]
```

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