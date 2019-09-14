import markovify
corpus = open("./datasets/bible.txt").read()

text_model = markovify.Text(corpus, state_size=2)
model_json = text_model.to_json()

with open('./models/bible.json', 'w') as f:
    f = f.write(model_json)
