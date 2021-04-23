from common import *
from sklearn.metrics import pairwise_distances
from ranking import *

def translate_word(word,lang_target):
	client = MongoClient('localhost', 27017)
	db = client["nlprokz"]
	target_words = []

	for i in db.bilingualvec.find({"lang_origin":lang_target}):
		target_words.append(i['vec'])
	target_words = np.array(target_words)
	
	norm_vector = 0.001+1.0*np.sum(target_words,axis=0)   
	elem = db.bilingualvec.find_one({"word":word})
	if elem is not None:
		elem_vec = np.array(elem["vec"])/norm_vector
	else:
		final_list=[["aghyat",0.1],["aghyat",0.1],["aghyat",0.1]]
		return final_list
	max_index = elem_vec.argsort()[-10:][::-1]
	words = sorted(db.hinglish.find({"lang":lang_target}).distinct("words"))
	final_words = []
	top3=[]
	for i in max_index:
		top3.append(i)
		final_words.append(words[i]);
	final_list=[]
	a=max(top3)
	top3.remove(a)
	a=max(top3)
	top3.remove(a)
	final_list.append((words[a],round(a/100000,3)))
	a=max(top3)
	top3.remove(a)
	final_list.append((words[a],round(a/100000,3)))
	a=max(top3)
	top3.remove(a)
	final_list.append((words[a],round(a/100000,3)))
	return final_list

def trans(s):
	return translate_word(s,"hin");

if __name__ == '__main__':
	translate_word("even","hin")