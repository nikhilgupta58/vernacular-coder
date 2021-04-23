import sys
import sqlite3
import datetime
import Bigram
import sys
#path of controller.py file
sys.path.append('''vernacular/translator''') 
import controller
import translate
modulename = 'translate'
if modulename not in sys.modules:
    print ('You have not imported the {} module'.format(modulename))

import translate_word
from flask import Flask
from flask import Flask, render_template
from flask import Flask, render_template, json, request
app = Flask(__name__)

@app.route("/")
def main():
     return render_template('index.html')
    
@app.route('/translate',methods=['POST','GET'])
def transltate():
    data=request.form;
    tempStr=''
    for key in data:
        tempStr +=data[key]
    data=tempStr
    res=translate.transliterate(data, 'hk', 'devanagari')
    return json.dumps(res)

@app.route('/token_translate',methods=['POST','GET'])
def token_transltate():
    data=request.form;
    for key in data:
        print(data[key])
    temp=translate_word.translate_word("from","hin");
    return json.dumps("hi")

@app.route('/pushto',methods=['POST','GET'])
def pushto():
    data=request.form;
    for key in data:
        tempStr = str(data[key])
        if (key=='code'):
            hi=tempStr;
        elif(key =='code1'):
            en=tempStr;
        else:
            count=tempStr;
    exist=0;
    conn = sqlite3.connect('data_keyword.sqlite')
    rows=conn.execute("SELECT * from keywords")
    for row in rows:
        if (row[0]==en and row[1]==hi):
            exist=1;
            en_exist=row[0];
            hi_exist=row[1];
    if (exist==0):
        if(count == "NaN" or en==hi or hi==""):
            return "Updated"
        conn.execute("INSERT INTO keywords values(?,?,?,'user58',?)",(en,hi,count,datetime.datetime.now()));
        conn.commit();
    else:
        conn.execute("update keywords set count=? where hi_keyword=? and en_keyword=?",(count,hi_exist,en_exist));
        conn.commit();
    conn.execute("delete from keywords where count=0");
    conn.commit();
    conn.close();
    return "Updated Successfully!!"

@app.route('/getfrom',methods=['POST','GET'])
def getfrom():
    conn = sqlite3.connect('data_keyword.sqlite')
    rows=conn.execute("SELECT * from keywords")
    conn.commit();
    conn.close;
    key_list=[];
    for row in rows:
        t=row[2];
        t=str(t);
        temp=str(row[0])+" "+str(row[1])+" "+str(t);
        key_list.append(temp);
    print(key_list)
    return json.dumps(key_list)

def isCamelCase(s):
    if ("_" in s):
        return 1
    for i in range(1,len(s)):
        if(s[i].isupper()):
            return 1
    return 0

@app.route('/code_translate',methods=['POST','GET'])
def code_translte():
    data=request.form;
    for key in data:
        tempStr = data[key]
    new=""
    word=""
    for i in range(len(tempStr)):
        if(tempStr[i]==" " or tempStr[i]=="\t" or tempStr[i]=="\n" or i==len(tempStr)-1):
            if(isCamelCase(new)):
                if("\n" in new):
                    n=Bigram.convert(new)+"\n"
                else:    
                    if (i==len(tempStr)-1):
                        n=Bigram.convert(new)
                    else:    
                        n=Bigram.convert(new)+" "
                word+=n
            else:
                word+=new
            word+=tempStr[i];
            new=""
        else:
            new+=tempStr[i];
    # print(word)
    res=translate.transliterate(word, 'hk', 'devanagari')
    # if (res.find("उन्देfइनेद्") != -1):
    #     print("dgdgdggseggeg")
    #     conn = sqlite3.connect('data_keyword.sqlite')
    #     conn.execute("delete from keywords;");
    #     conn.commit();
    #     conn.close();
    return res

@app.route('/code_output',methods=['POST','GET'])
def code_output():
    #requesting the data from AJAX in the form of ImmutableMultiDict
    data = request.form
    #extract the data which we want to translate and compile and the source language
    for key in data:
        tempStr = str(data[key])
    print(tempStr)
    # tempStr=translate.transliterate(tempStr, 'devanagari', 'hk')
    #calling function which will translate, compile and return the result
    result=controller.main_translate(tempStr,"hi","en","vernacular/temp/translated.py","vernacular/data/fixtures/translations/")
    loaded_json = json.loads(result)
    resultStr=''
    #properly formatting the output
    for x in loaded_json:    
        resultStr+= str(x)+":"+"\n"
        resultStr+=str(loaded_json[x])+"\n"
    print(resultStr)
    #converting "\n" to "<br>" as in html <br> means line break
    # resultStr=resultStr.replace("\n","<br>")
    return json.dumps(resultStr)

if __name__=="__main__":
    app.run(host='0.0.0.0')
    

