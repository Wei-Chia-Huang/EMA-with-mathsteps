import execjs

# 讀取 JS 文件的程式碼
def js_from_file(file_name):
    with open(file_name, 'r', encoding='UTF-8') as file:
        result = file.read()
    
    return result

input = '( 23 + 35 ) * 2 - 11'

# 編譯加載 JS 文件
mathsteps = execjs.compile(js_from_file('./mathsteps.js'))

# 呼叫 JS 裡面的方法
StepsText = mathsteps.call('steps', input)

print(StepsText)