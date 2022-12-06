import execjs

def js_from_file(file_name):
    with open(file_name, 'r', encoding='UTF-8') as file:
        result = file.read()
    
    return result

input = '123+456-66+55-66'
mathsteps = execjs.compile(js_from_file('./mathsteps.js'))
StepsText = mathsteps.call('steps', input)

print(StepsText)