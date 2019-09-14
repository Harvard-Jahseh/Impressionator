import sys
import markovify
def chooseParams(argv):
    if argv[0] == 'Donald Trump Twitter':
        return 'trump.json'
    elif argv[0] == 'Jaden Smith Twitter':
        return 'jaden.json'
    elif argv[0] == 'The Office Script':
        return 'theoffice.json'
    elif argv[0] == 'The Bible':
        return 'bible.json'
    elif argv[0] == 'Obama State of the Union':
        return 'obamaSOTU16processed.json'
    else:
        return 'trump.json'

def main(argv):
    filePath = './ml/models/' + chooseParams(argv)
    with open(filePath) as f:
        model_json = f.read()
    text_model = markovify.Text.from_json(model_json)
    print(text_model.make_short_sentence(280))

if __name__ == "__main__":
    main(sys.argv[1:])
