from operate_object import *
import execjs

# 讀取 JS 文件的程式碼
def js_from_file(file_name):
    with open(file_name, 'r', encoding='UTF-8') as file:
        result = file.read()
    
    return result

input = '4 * 8 / 4' 

# 編譯加載 JS 文件
mathsteps = execjs.compile(js_from_file('./mathsteps.js'))

# 呼叫 JS 裡面的方法
StepsText = mathsteps.call('steps', input)

# 將步驟由 list 轉換成物件（object），並決定每個步驟的分類標籤
for i in range(len(StepsText)):
    StepsText[i] = Step(StepsText[i])
    print([StepsText[i].operator, StepsText[i].values, StepsText[i].strategies])

print(StepsText)