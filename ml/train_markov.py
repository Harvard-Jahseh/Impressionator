import markovify
corpus = open("../datasets/siegel.txt", "r")

text_model = markovify.Text(corpus, state_size=2)
model_json = text_model.to_json()

with open('../models/siegel.json', 'w') as f:
    f = f.write(model_json)
