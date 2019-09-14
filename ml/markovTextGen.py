import markovify

with open('./models/trump.json') as f:
    model_json = f.read()

text_model = markovify.Text.from_json(model_json)
print(text_model.make_short_sentence(280))
