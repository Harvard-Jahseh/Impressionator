file = open("jaden.txt").read()

newFile = ''
for line in file.split('\n'):
    if 'https://t.co/' not in line:
        newFile += line
        newFile += '\n'
with open("jaden.txt", 'w') as f:
    f = f.write(newFile)
