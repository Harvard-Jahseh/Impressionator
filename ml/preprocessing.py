
count = 0
filename = "siegel.txt"
old = open(filename).read()
new = open(filename, "w+")
for line in old.split("\n"):
    if line != "":
        for sentence in line.split("."):
            if sentence != "":
                new.write(sentence.strip("/") + ".\n")
        count += 1
        if count == 50:
            break
