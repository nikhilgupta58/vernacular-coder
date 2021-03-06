import gensim, logging
import sys
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
f=open(sys.argv[1])
line_s=[]
for line in f:
	line=line.strip().split()
	line_s.append(line)
f.close()
f=open(sys.argv[2])
line_t=[]
for line in f:
	line=line.strip().split()
	line_t.append(line)
f.close()

#sentences = [['first', 'sentence'], ['second', 'sentence']]
# train word2vec on the two sentences
model_s = gensim.models.Word2Vec(line_s,size=100, window=5, min_count=1, workers=4)
model_t = gensim.models.Word2Vec(line_t,size=100, window=5, min_count=1, workers=4)
model_s.save(sys.argv[1]+".model")
model_t.save(sys.argv[2]+".model")
#sentences = [['first', 'sentence'], ['second', 'sentence']]
# train word2vec on the two sentences
#model_s = gensim.models.Word2Vec(line_s,size=100, window=5, min_count=5, workers=4)
#model_t = gensim.models.Word2Vec(line_t,size=100, window=5, min_count=5, workers=4)
#model_s.save(sys.argv[1]+".model")
#model_t.save(sys.argv[2]+".model")
model_s=gensim.models.Word2Vec.load(sys.argv[1]+".model")
print model_s.vocab
