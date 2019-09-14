
from keras.models import Sequential
from keras.layers import LSTM, Embedding, Dense, Dropout
from keras.preprocessing.sequence import pad_sequences
from keras.preprocessing.text import Tokenizer
from keras.callbacks import ModelCheckpoint
import keras.utils as ku
#https://github.com/shivsondhi/Text-Generator/blob/master/textGenerator_words.py
from tensorflow import set_random_seed
from numpy.random import seed
set_random_seed(2)
seed(1)
import pandas as pd
import numpy as np
import string, os, csv, random


def get_sequence_of_tokens(corpus, tokenizer):
	#create a dictionary of every word corresponding to a unique number. By default keras.tokenizer class also creates 3 other objects that it may use.
	t.fit_on_texts(corpus)
	total_words = len(tokenizer.word_index) + 1	#word_index is the dictionary ^
	#map each word to an integer value and then create the input_sequences
	input_sequences = []
	for line in corpus:
		token_list = t.texts_to_sequences([line])[0]
		for i in range(1, len(token_list)):
			n_gram_sequence = token_list[:i+1]
			input_sequences.append(n_gram_sequence)
	return input_sequences, total_words

def get_padded_sequences(input_sequences, total_words):
	#pad every input sequence so that we have uniform length inputs.
	max_sequence_len = max([len(x) for x in input_sequences])
	input_sequences = np.array(pad_sequences(input_sequences, maxlen=max_sequence_len, padding='pre'))
	#split the sequences taking the first n-1 columns as input and the last column as the label / output
	predictors, label = input_sequences[:,:-1], input_sequences[:,-1]
	label = ku.to_categorical(label, num_classes=total_words)
	return predictors, label, max_sequence_len

def create_model(max_sequence_len, total_words):
	#Create a sequential model with one LSTM unit
	input_len = max_sequence_len - 1
	model = Sequential()
	model.add(Embedding(total_words, 10, input_length=input_len))
	model.add(LSTM(2))
	model.add(Dropout(0.1))
	model.add(Dense(total_words, activation='softmax'))
	model.compile(optimizer='adam', loss='categorical_crossentropy')
	return model

def generate_text(tokenizer, seed_text, next_words, model, max_sequence_len):
	#predict the next word for the desired number of times. model.predict will output an integer.
    for _ in range(next_words):
        token_list = tokenizer.texts_to_sequences([seed_text])[0]
        token_list = pad_sequences([token_list], maxlen=max_sequence_len-1, padding='pre')
        print("broke")
        predicted = model.predict_classes(token_list, batch_size = 2)
		#map the integer output to the word in the tokenizer dictionary. Append the word to seed_text and continue.
        output_word = ""
        for word, index in tokenizer.word_index.items():
            if index == predicted:
                output_word = word
                break
                seed_text += " " + output_word
        return seed_text


text_sequences = []
modes = ['train', 'generate', 'retrain', 'none']
mode = modes[1]
num_epochs = 4
print(os.getcwd)
location = os.path.realpath( os.path.join(os.getcwd(), os.path.dirname(__file__)))
with open(os.path.join(location,"movie_lines.tsv")) as tsvfile:
    reader = csv.reader(tsvfile, delimiter='\t')
    count = 0
    for row in reader:
        if len(row) < 5:
            continue
        else:
            text_sequences.append(row[4])
            count += 1
        if count > 10000:
            break

#print(len(text_sequences))
t = Tokenizer()
input_sequences, total_words = get_sequence_of_tokens(text_sequences, t)
predictors, label, max_sequence_len = get_padded_sequences(input_sequences, total_words)
model = create_model(max_sequence_len, total_words)

savepath = "model_weights.hdf5"
checkpoint = ModelCheckpoint(savepath, monitor="loss", verbose=1, save_best_only=True, mode="min")
callbacks_list = [checkpoint]
model.fit(predictors, label, epochs=num_epochs, verbose=1, callbacks=callbacks_list)

best_file = "model_weights.hdf5"
model.load_weights("model_weights.hdf5")
model.compile(loss='categorical_crossentropy', optimizer='adam', verbose = 1)
print("compiling")
seed_texts = ['We should',"Do that"]
i = 1
for seed_text in seed_texts:
	print("Seed {0}".format(i))
	next_words = random.randint(6, max_sequence_len)
	generated_headline = generate_text(t, seed_text, next_words, model, max_sequence_len)
	print(generated_headline, end="\n\n")
	i += 1
