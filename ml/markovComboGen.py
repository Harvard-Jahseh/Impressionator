import sys
import markovify
def chooseParams(str):
    if str == 'Donald Trump Twitter':
        return 'trump.json'
    elif str == 'Jaden Smith Twitter':
        return 'jaden.json'
    elif str == 'The Office Script':
        return 'theoffice.json'
    elif str == 'The Bible':
        return 'bible.json'
    elif str == 'Obama State of the Union':
        return 'obamaSOTU16processed.json'
    else:
        return 'trump.json'

def main(argv):
    filePath1 = './ml/models/' + chooseParams(argv[0])
    filePath2 = './ml/models/' + chooseParams(argv[1])

    with open(filePath1) as f:
        json_1 = f.read()
    model_1 = markovify.Text.from_json(json_1)


    with open(filePath2) as f:
        json_2 = f.read()
    model_2 = markovify.Text.from_json(json_2)

    synthesis_model = markovify.combine([ model_1, model_2], [ 1, 1 ])

    print(synthesis_model.make_short_sentence(280))

if __name__ == "__main__":
    main(sys.argv[1:])
