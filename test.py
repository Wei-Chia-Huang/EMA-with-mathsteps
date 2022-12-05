import os

input = '123 + 456'
cmd = 'node -e "require(\\"%s\\").init(%s)"' % ('./mathsteps', input)
print(cmd)
mathsteps = os.popen(cmd)
StepsText = mathsteps.read()

print(StepsText)