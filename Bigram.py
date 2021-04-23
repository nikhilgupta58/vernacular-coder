import csv 
import translate_word

class data(object):
	"""docstring for data"""
	def __init__(self, arg,rows):
		super(data, self).__init__()
		with open(arg, 'r') as csvfile: 
			rows = [] 
			# creating a csv reader object 
			csvreader = csv.reader(csvfile) 
			for row in csvreader: 
				rows.append(row) 
			self.rows=rows = [e for e in rows if e]

	def removeBadChar(self):
		bad_chars = ['/',';', ':', '!', "*", ")", "(", "'", '"', "a", "b", "c", "d", "e", "f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "-", "0","1","2","3","4","5","6","7","8","9"];
		for i in bad_chars:
			self.rows=self.rows.replace(i,'')

	def countLine(self,line):
		self.rows = self.rows.replace(".","\n")
		self.line = (self.rows.count("\n"))

	def listToString(self):
		s=""
		for i in self.rows:
			str1=""
			for ele in i:
				str1+=ele
			s += str1 + "\n"
		self.rows = s;

def listToString(lists):
		s=""
		for i in lists:
			str1=""
			for ele in i:
				str1+=ele
			s += str1 + "\n"
		return s;

def occurenceInWindow(s,context,str):
	words_final = s.split(" ")
	count=0
	for i in range(len(words_final)):
		if (words_final[i] == context):
			if (i!=0):
				if (words_final[i-1] == str):
					count = count +1
			if (i!= len(words_final)-1):
				if (words_final[i+1] == str):
					count = count + 1
	return count

def findSmoothing(s,count,str):
	words_final = s.split(" ")
	n=len(words_final)
	lines = s.split("\n")
	c=0;
	for i in lines:
		try:
			i.index(str)
			c=c+1
		except:
			pass
	count = ((count+1) * c) / (c+n)
	return count

def findBackOff(s,center_word,word):
	count_context=occurenceInWindow(s,center_word,word)
	backoff = findSmoothing(s,count_context,center_word)
	backoff='{:f}'.format(backoff)
	return str(backoff)

def Sort(sub_li): 
    l = len(sub_li) 
    for i in range(0, l): 
        for j in range(0, l-i-1): 
            if (sub_li[j][2] > sub_li[j + 1][2]): 
                tempo = sub_li[j] 
                sub_li[j]= sub_li[j + 1] 
                sub_li[j + 1]= tempo 
    return sub_li 

def get_top(m,data):
	a=Sort(m)
	b=[]
	b.append(a[len(a)-1])
	b.append(a[len(a)-2])
	b.append(a[len(a)-3])
	final_list=[]
	for i in range(len(b)):
		final_list.append((b[i][0],b[i][1],findBackOff(data,b[i][0],b[i][1])))
	final_list=Sort(final_list)
	return final_list[len(final_list)-1]


def matrix(a,b,data):
	matrix_list=[]
	for i in a:
		for j in b:
			matrix_list.append((i[0],j[0],(i[1])*(j[1])))
	return get_top(matrix_list,data)

def isCamelCase(s):
    for i in range(1,len(s)):
        if(s[i].isupper() or s[i]=="-"):
            if("\n" in s):
                return 0
            else:
                return 1
    return 0

def token(s,data):
	l=[]
	l1=s.split("_")
	for j in l1:
		if(isCamelCase(j)):
			word=j[0]
			for i in range(1,len(j)):
				if (j[i].isupper() or i == (len(j)-1)):
					if (word!="-" and word!="_"):
						l.append(word)
					word=""
				word+=j[i]
			l[len(l)-1]=l[len(l)-1]+j[len(j)-1]
		else:
			l.append(j)
	l1=[]
	for i in l:
		l1.append(i.lower())
	l=l1
	a=translate_word.trans(l[0])
	b=translate_word.trans(l[1])
	final_list=matrix(a,b,data)
	new_word=final_list[0]+" "+final_list[1]+" "
	prob=0
	for i in range(len(b)):
		if (b[i][0] == final_list[1]):
			prob=b[i][1]
	for i in range(2,len(l)):
		a=[]
		a.append((final_list[1],prob))
		a.append((final_list[1],prob))
		a.append((final_list[1],prob))
		b=translate_word.trans(l[i])		
		final_list=matrix(a,b,data)
		new_word+=final_list[1]+" "
		for i in range(len(b)):
			if (b[i][0] == final_list[1]):
				prob=b[i][1]
	return new_word

content=data("hindi-train.csv","")
content.listToString()
content.removeBadChar()
line=0
content.countLine(line)

def isCamelCase(s):
    if ("_" in s):
        return 1
    for i in range(1,len(s)):
        if(s[i].isupper()):
            return 1
    return 0

# token("getOdd-Number",content.rows)
def convert(s):
	new=""
	tran=""
	tran1=""
	tran2=""
	count=0
	for i in s:
		if(i=="("):
			count+=1
	if(count==1):
		if("=" in s):
			tran1=s[0:s.index("=")+1]
			new=s[s.index("=")+1:s.index("(")]
			tran2=s[s.index("("):len(s)]

		else:
			tran1=""
			new=s[0:s.index("(")+1]
			tran2=s[s.index("("):len(s)]

	else:
		if("=" in s):
			ind=s.find("(",s.index("(")+1);
			tran1=s[0:s.index("=")+1]
			new=s[s.index("=")+1:ind]
			tran2=s[ind:len(s)]

		else:
			ind=s.find("(",s.index("(")+1);
			tran1=s[0:s.index("(")+1]
			new=s[s.index("(")+1:ind]
			tran2=s[ind:len(s)]

	return tran1+"ढूंढो_अजीब_संख्या"+tran2
	# return token(s,content.rows)