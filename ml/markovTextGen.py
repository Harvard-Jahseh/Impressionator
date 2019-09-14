import sys
import markovify
def main(argv):

    with open('./ml/models/trump.json') as f:
        model_json = f.read()
    text_model = markovify.Text.from_json(model_json)
    print(text_model.make_short_sentence(280))

if __name__ == "__main__":
    main(sys.argv[1:])
    sys.stdout.flush()
