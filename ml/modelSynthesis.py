
import sys
import markovify
def main(argv):


    with open('../models/obamaSOTU16processed.json') as f:
        obama_json = f.read()
    obama_model = markovify.Text.from_json(obama_json)


    with open('../models/siegel.json') as f:
        siegel_json = f.read()
    siegel_model = markovify.Text.from_json(siegel_json)

    synthesis_model = markovify.combine([ siegel_model, obama_model ], [ 1, 1 ])

    print(siegel_model.make_short_sentence(280))
    print(synthesis_model.make_short_sentence(280))

if __name__ == "__main__":
    main(sys.argv[1:])
