from operate_object import *
import execjs

# 讀取 JS 文件的程式碼
def js_from_file(file_name):
    with open(file_name, 'r', encoding='UTF-8') as file:
        result = file.read()
    
    return result

input = '(5 + 8) * (89 - 43 - 23) * 123 * 5' 

# 編譯加載 JS 文件
mathsteps = execjs.compile(js_from_file('./mathsteps.js'))

# 呼叫 JS 裡面的方法
StepsText = mathsteps.call('steps', input)

# 決定每個步驟（step）的分類標籤
for step in StepsText[:-1]:
    step_solution = Node(step)
    step.append(step_solution.classify())

print(StepsText)