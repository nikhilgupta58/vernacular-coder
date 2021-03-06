# -*- coding: utf-8 -*-
import sys
from operator import itemgetter
import datetime
import gensim, logging
from sklearn.neural_network import MLPRegressor
import sys
import numpy as np
import pickle
from scipy import spatial
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
falign=open(sys.argv[1])
ftext=open(sys.argv[2])
dict_words={}
for align,line in zip(falign,ftext):
	line=line.strip().split("|||")
	x=line[0].strip().split()
	y=line[1].strip().split()
	align=align.strip().split()
	#line[0],line[1] two parallel lines
	for a in align:
		a = a.split("-")
		if x[int(a[0])] not in dict_words.keys():
			dict_words[x[int(a[0])]] = {}
			dict_words[x[int(a[0])]][y[int(a[1])]] = 1.0
		else:
			if y[int(a[1])] not in dict_words[x[int(a[0])]].keys() :
				dict_words[x[int(a[0])]][y[int(a[1])]] = 1.0
			else:
				dict_words[x[int(a[0])]][y[int(a[1])]]+=1.0
falign.close()
ftext.close()
list_of_word_x=[]
list_of_word_y=[]
cheat_list={}
X_w_tr=[]
Y_w_tr=[]
for k,v in dict_words.items():
	tot=0
	list_w=[]
	for m,n in v.items():
		tot+=n
	for m,n in v.items():
		n=n/tot
		list_w.append([m,n])
	#print list_w
	list_w=sorted(list_w,key=itemgetter(1),reverse=True)
	#taking just top 1/n verb for each verb
	top_n=0
	for y in list_w:
		if top_n ==5:
			break
		else:
			top_n+=1
			#print k,'%s'%y[0],y[1]
			X_w_tr.append(k)
			Y_w_tr.append(y[0])
	#print list_w
	#list_of_word_x.append(k)
	#list_of_word_y.append(m)
	#print k,m,n
	#cheat_list[k]={list_w[0][0]}
	continue
	list_w=sorted(list_w,key=itemgetter(1),reverse=True)
	rangea=1
	cheat_list[k]={list_w[0][0]}
	for i in range(rangea):
		x_val=[]
		y_val=[]
		for valx,valy in zip(model_s[k],model_t[list_w[i][0]]):
			x_val.append(valx)
			y_val.append(valy)
		list_of_word_x.append(x_val)
		list_of_word_y.append(y_val)

#print list_of_word_x,list_of_word_y
#ftext=open(sys.argv[2]+"")
model_s=gensim.models.Word2Vec.load(sys.argv[3]+".model")
model_t=gensim.models.Word2Vec.load(sys.argv[4]+".model")
#print model_t.vocab
X_v_tr=[]
Y_v_tr=[]
#print model_t[u'???????????????'.encode('utf-8')]
#exit()
for x,y in zip(X_w_tr,Y_w_tr):
	if y in model_t and x in model_s:
		#print model_s[x],model_t[y]
		X_v_tr.append(model_s[x])
		Y_v_tr.append(model_t[y])
		#continue
	else:
		print x,'%s'%y
print len(Y_v_tr)
for i in range(17,18):
		#for mx_itr in range(500,1000):

		now = datetime.datetime.now()
		time=str(now.hour)+"_"+str(now.minute)+"_"+str(now.second)+"-"+str(now.day)+"_"+str(now.month)+"_"+str(now.year)
		clf = MLPRegressor(verbose=True,solver='lbfgs',max_iter=1000, activation='tanh',alpha=1e-5,hidden_layer_sizes=(i), random_state=1,learning_rate='adaptive')
		clf.fit(X_v_tr,Y_v_tr)
		pickle.dump(clf,open('nn'+time+'.pkl','wb'))
		#clf = pickle.load(open('nn.pkl', 'rb'))
		ftestx=open(sys.argv[5])
		ftesty=open(sys.argv[6])
		fout=open("output"+time,"w")
		model_s=gensim.models.Word2Vec.load(sys.argv[3]+".model")
		model_t=gensim.models.Word2Vec.load(sys.argv[4]+".model")
		for linex,liney in zip(ftestx,ftesty):
			linex=linex.strip().split()
			liney=liney.strip().split()
			for wordx in linex:
				if wordx in model_s.vocab:
					temp_v=model_s[wordx]
					temp_v=temp_v.reshape(1,-1)
					output=clf.predict(temp_v)
					op=output[0]
					kyun=[]
					for i in op:
						kyun.append(i)
					model_word_vector = np.array( kyun, dtype='f')
					op_word= model_t.most_similar([model_word_vector], topn=5)
					#print wordx,op_word
					for out in op_word:
						print wordx,out[0]
						fout.write(wordx+" "+out[0])
						fout.write("\n")
		fout.close()
		ftestx.close()
		ftesty.close()
