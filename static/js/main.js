getfrom_database();
var id = "";
var flag_empty = 0;
var pre = "";
var pos = 0;
var pre_val = "";
var del_val = "";
var new_words = [];
var hi_en_keyword = ["barabar_nahi", "barabar", "yadi", "yafir", "paribasha", "jabtak", "bheje", "chapo", "mala", "poornaank"];
var key_hi = ["बराबर_नहीं", "बराबर", "यदि", "याफिर", "परिभाषा", "जबतक", "भेजें", "छापो", "माला", "पूर्णांक"];
var hi_keyword = ["बराबर_नहीं", "बराबर", "यदि", "याफिर", "परिभाषा", "जबतक", "भेजें", "छापो", "माला", "पूर्णांक"];

var hi_en_token = ["barabar_nahi", "barabar", "yadi", "yafir", "paribasha", "jabtak", "bheje", "chapo", "mala", "poornaank"];
var key_token = ["बराबर_नहीं", "बराबर", "यदि", "याफिर", "परिभाषा", "जबतक", "भेजें", "छापो", "माला", "पूर्णांक"];

var hi_en_count = [0, 0, 0, 0, 0];
var flag_button = 0;
var code_value = "";
var token=0;
var token_convert="";

/*Trie Structure*/
function Node(data) {
    this.data = data;
    this.isWord = false;
    this.prefixes = 0;
    this.children = {};
}

function Trie() {
    this.root = new Node('');
}

Trie.prototype.startsWith = function (prefix) {
    var currNode = this.root; 
    var letter = prefix.slice(0, 1);
    prefix = prefix.slice(1);

    while (letter.length > 0) {
        if (currNode.children[letter]) {
            currNode = currNode.children[letter];
            letter = prefix.slice(0, 1);
            prefix = prefix.slice(1);
        } else {
            return false;
        }
    }
    return currNode;
};

Trie.prototype.add = function (word) {
    if (!this.root) {
        return null;
    }
    this._addNode(this.root, word);
};
Trie.prototype._addNode = function (node, word) {
    if (!node || !word) {
        return null;
    }
    node.prefixes++;
    var letter = word.charAt(0);
    var child = node.children[letter];
    if (!child) {
        child = new Node(letter);
        node.children[letter] = child;
    }
    var remainder = word.substring(1);
    if (!remainder) {
        child.isWord = true;
    }
    this._addNode(child, remainder);
};
Trie.prototype.remove = function (word) {
    if (!this.root) {
        return;
    }
    if (this.contains(word)) {
        this._removeNode(this.root, word);
    }
};
Trie.prototype._removeNode = function (node, word) {
    if (!node || !word) {
        return;
    }
    node.prefixes--;
    var letter = word.charAt(0);

    var child = node.children[letter];
    if (child) {
        var remainder = word.substring(1);
        if (remainder) {
            if (child.prefixes === 1) {
                delete node.children[letter];
            } else {
                this._removeNode(child, remainder);
            }
        } else {
            if (child.prefixes === 0) {
                delete node.children[letter];
            } else {
                child.isWord = false;
            }
        }
    }
};
Trie.prototype.contains = function (word) {
    if (!this.root) {
        return false;
    }
    return this._contains(this.root, word);
};
Trie.prototype._contains = function (node, word) {
    if (!node || !word) {
        return false;
    }
    var letter = word.charAt(0);
    var child = node.children[letter];
    if (child) {
        var remainder = word.substring(1);
        if (!remainder && child.isWord) {
            return true;
        } else {
            return this._contains(child, remainder);
        }
    } else {
        return false;
    }
};
Trie.prototype.countWords = function () {
    if (!this.root) {
        return console.log('No root node found');
    }
    var queue = [this.root];
    var counter = 0;
    while (queue.length) {
        var node = queue.shift();
        if (node.isWord) {
            counter++;
        }
        for (var child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                queue.push(node.children[child]);
            }
        }
    }
    return counter;
};
Trie.prototype.getWords = function () {
    var words = [];
    var word = '';
    this._getWords(this.root, words, words, word);
    return words;
};
Trie.prototype._getWords = function (node, words, word) {
    for (var child in node.children) {
        if (node.children.hasOwnProperty(child)) {
            word += child;
            if (node.children[child].isWord) {
                words.push(word);
            }
            this._getWords(node.children[child], words, word);
            word = word.substring(0, word.length - 1);
        }
    }
};
Trie.prototype.print = function () {
    if (!this.root) {
        return console.log('No root node found');
    }
    var newline = new Node('|');
    var queue = [this.root, newline];
    var string = '';
    while (queue.length) {
        var node = queue.shift();
        string += node.data.toString() + ' ';
        if (node === newline && queue.length) {
            queue.push(newline);
        }
        for (var child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                queue.push(node.children[child]);
            }
        }
    }
    console.log(string.slice(0, -2).trim());
};
Trie.prototype.printByLevel = function () {
    if (!this.root) {
        return console.log('No root node found');
    }
    var newline = new Node('\n');
    var queue = [this.root, newline];
    var string = '';
    while (queue.length) {
        var node = queue.shift();
        string += node.data.toString() + (node.data !== '\n' ? ' ' : '');
        if (node === newline && queue.length) {
            queue.push(newline);
        }
        for (var child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                queue.push(node.children[child]);
            }
        }
    }
    console.log(string.trim());
};
/*Trie Structure*/

var trie = new Trie();
for (ind = 0; ind < hi_en_keyword.length; ind++) {
    trie.add(hi_en_keyword[ind])
}

// --------------------------------------------------------------
//                     Translate btn call
// --------------------------------------------------------------


function myFunction(id_editor) {
    flag_button = 1;
    id = "editor";
    flag_out = 0;
    id += id_editor[id_editor.length - 1]

    call();
}

function myout(id_editor) {
    flag_out = 1;
    flag_button = 0;
    id = "out";
    id += id_editor[id_editor.length - 1]
    call();
}

// --------------------------------------------------------------
//                     ID CALL
// --------------------------------------------------------------

$(document).ready(function () {
    $("#editor1").click(function (event) {
        flag_button = 0;
        flag_out = 0;
        id = event.target.id;
        this.value=this.value.trim()
        inc_height("1",300)
        call();
    });
});

$(document).ready(function () {
   $("#editor2").click(function (event) {
       flag_button = 0;
       flag_out = 0;
       id = event.target.id;
       this.value=this.value.trim()
       inc_height("2",300)
       call();
   });
});

$(document).ready(function () {
   $("#editor3").click(function (event) {
       flag_button = 0;
       flag_out = 0;
       id = event.target.id;
       this.value=this.value.trim()
       inc_height("3",300)
       call();
   });
});

function call() {
    date1=Date().substring(22,24);
    datepaste1=Date().substring(22,24);
    var div_open = 0;
    if (flag_button == 0) {
        $('#' + id).on("mouseup keydown", function (e) {
            pos = $(this).caret();
        });
    }

    function pasteIntoInput(el, text) {
        el.focus();
        if (typeof el.selectionStart == "number" &&
            typeof el.selectionEnd == "number") {
            var val = el.value;
            var selStart = el.selectionStart;
            el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd);
            el.selectionEnd = el.selectionStart = selStart + text.length;
        } else if (typeof document.selection != "undefined") {
            var textRange = document.selection.createRange();
            textRange.text = text;
            textRange.collapse(false)
            textRange.select();
        }
    }

    function numberOfTabs(text) {
        var count = 0;
        var index = 0;
        while (text.charAt(index++) === "\t") {
           count++;
        }
        return count;
    }

    function ReverseString(str) { 
        return str.split('').reverse().join('') 
    } 

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocomp
            leted values*/
            var flag = 0;
            for (i = pos; i >= 0; i--) {
                if (val[i] == " " || val[i] == "\n") {
                    index = i;
                    var newval = "";
                    flag = 1;
                    for (j = index + 1; j <= pos; j++) {
                        if (val[j] == undefined)
                            continue
                        newval = newval + val[j];
                    }
                    break
                }
            }
            if (flag == 1)
                val = newval;
            flag_empty = 0;
            val=val.trim()
            /* do not convert */
            closeAllLists();
            if (!val) {
                if (pre != "" && pre != pre_val) {
                    var cursorPosition = $('#'+id).prop("selectionStart");
                    var first=inp.value.substring(0,cursorPosition-pre_val.length-1)
                    var second=pre
                    var third=inp.value.substring(first.length+pre_val.length,inp.value.length)
                    inp.value=first+second+third
                    code_value = this.value;
                    caret_pos=cursorPosition-pre_val.length+second.length
                    setCaretPosition(id, caret_pos);
                    /*--------------------------------*/
                    /* add non-keywords to dict */
                    if (pre != pre_val) {
                        var exist = 0;
                        for (ind = 0; ind <= new_words.length; ind++) {
                            if (pre == new_words[ind]) {
                                exist = 1;
                                break;
                            }
                        }
                        for (ind = 0; ind <= hi_keyword.length; ind++) {
                            if (pre == hi_keyword[ind]) {
                                exist = 1;
                                hi_en_count[ind]++;
                                pushto_database(pre, hi_en_keyword[ind], hi_en_count[ind]);
                                break;
                            }
                        }
                        if (exist == 0) {
                            for (ind = 0; ind < hi_en_keyword.length; ind++) {
                                if (hi_en_keyword[ind] == pre_val) {
                                    pre_val += "*";
                                    break;
                                }
                            }
                            hi_en_keyword.push(pre_val);
                            trie.add(pre_val);
                            hi_keyword.push(pre);
                            hi_en_count.push(1);
                            new_words.push(pre);
                            pushto_database(pre, pre_val, 1);
                        }
                    }
                }
                else{
                    hi_en_keyword.push(pre_val);
                    trie.add(pre_val);
                    hi_keyword.push(pre);
                    hi_en_count.push(1);
                    new_words.push(pre);
                    pushto_database(pre, pre_val, 1);
                }
                pre = "";
                return false;
            }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            var matching_index = [];
            var flag_inside = 0;
            div_open = 0;


            var node = trie.startsWith(val);
            if (node != false) {
                var words = [];
                var word = '';
                trie._getWords(node, words, word);
                for (indj = 0; indj < words.length; indj++) {
                    words[indj] = val + words[indj];
                }

                for (ind = 0; ind < hi_en_keyword.length; ind++) {
                    for (indj = 0; indj < words.length; indj++) {
                        if (words[indj] == hi_en_keyword[ind]) {
                            matching_index.push(ind);
                            break;
                        }
                    }
                }
                div_open = 1;
                flag_inside = 1;
            }

            if (flag_inside == 1) {
                var matching_count = [];
                for (ind = 0; ind < matching_index.length; ind++) {
                    matching_count.push(hi_en_count[matching_index[ind]]);
                }
                for (ind = 0; ind < matching_count.length; ind++) {
                    for (indj = ind + 1; indj < matching_count.length; indj++) {
                        if (matching_count[ind] < matching_count[indj]) {
                            var temp;
                            temp = matching_count[ind];
                            matching_count[ind] = matching_count[indj];
                            matching_count[indj] = temp;
                            temp = matching_index[ind];
                            matching_index[ind] = matching_index[indj];
                            matching_index[indj] = temp;
                        }
                    }
                }
                for (i = 0; i < matching_index.length; i++) {

                    /*create a DIV element for each matching element:*/
                    var sel = matching_index[i];
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = hi_keyword[sel].substr(0, val.length);
                    b.innerHTML += hi_keyword[sel].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + hi_keyword[sel] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        flag_empty = 1;
                        var cursorPosition = $('#'+id).prop("selectionStart");
                        var first=inp.value.substring(0,cursorPosition-pre_val.length)                
                        var second=this.getElementsByTagName("input")[0].value;
                        var third=inp.value.substring(first.length+pre_val.length,inp.value.length)
                        inp.value=first+second+third                        
                        caret_pos=cursorPosition-pre_val.length+second.length
                        setCaretPosition(id, caret_pos);
                        var len = hi_keyword.length
                        for (co = 0; co <= len; co++) {
                            if (hi_keyword[co] == this.getElementsByTagName("input")[0].value)
                                break;
                        }
                        hi_en_count[co]++;
                        pushto_database(this.getElementsByTagName("input")[0].value, hi_en_keyword[co], hi_en_count[co])
                        pre = "";
                        div_open = 0;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }

            if (pre=="-1"){

                
            }

            if (flag_empty == 0) {
                pre_val = val;
                convert_hindi(val).then((trans) => {
                        if (trans) {
                            val = trans;
                        } else
                            console.log("Error!")
                    }).then(() => {
                        var token="";
                        for (var i_l=1;i_l<pre_val.length;i_l++){
                           if (pre_val.charAt(i_l) == pre_val.charAt(i_l).toUpperCase() || pre_val.charAt(i_l)=="_"){
                                token=pre_val;
                                break;
                            }
                        }
                        if (token!="")
                        {
                            pre=pre_val;
                        }
                        else
                            pre = val;
                    })
                    .catch((err) => console.log(err))
            }

            
            /*do not convert*/
        });
        var ip=0;
        var jp=0;
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                if (div_open == 1) e.preventDefault();
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                if (div_open == 1) e.preventDefault();
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 8) {
                pre = "";
                var d = inp.value[pos - 1];
                var d_1;
                if ((pos - 1) != 0)
                    d_1 = inp.value[pos - 2];
                if (d != undefined && d != " ")
                    del_val += d;
                if (d == " " || (pos - 1) == 0 || d_1 == " ") {
                    del_val = reverse(del_val)
                    var found = 0;
                    for (ind = 0; ind <= hi_keyword.length; ind++) {
                        if (del_val == hi_keyword[ind]) {
                            found = 1;
                            break;
                        }
                    }
                    for (i = 0; i <= key_hi.length; i++) {
                        if (del_val == key_hi[i]) {
                            found = 0;
                            break;
                        }
                    }
                    if (found == 1 && hi_en_count[ind] == 1) {
                        pushto_database(hi_keyword[ind], hi_en_keyword[ind], 0);
                        hi_keyword.splice(ind, 1);
                        hi_en_keyword.splice(ind, 1);
                        trie.remove(del_val);
                        hi_en_count.splice(ind, 1);
                    }
                    if (hi_en_count[ind] > 1) {
                        hi_en_count[ind]--;
                        pushto_database(hi_keyword[ind], hi_en_keyword[ind], hi_en_count[ind]);
                    }
                    for (ind = 0; ind <= new_words.length; ind++) {
                        if (new_words[ind] == del_val) {
                            new_words.splice(ind, 1);
                            break;
                        }
                    }
                    del_val = "";
                }
            } else if (e.keyCode == 9) {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                date2=Date().substring(22,24)
                if(Math.abs(date2-date1) == 0)
                    return
                date1=Date().substring(22,24)
                // set textarea value to: text before caret + tab + text after caret
                $(this).val($(this).val().substring(0, start) +
                    "\t" +
                    $(this).val().substring(end));

                // put caret at right position again
                this.selectionStart =
                    this.selectionEnd = start + 1;
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                date2=Date().substring(22,24)
                if(Math.abs(date2-date1) == 0)
                    return
                date1=Date().substring(22,24)
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                    else
                    {
                        str=this.value.trim();
                        if (str[str.length-1]==":"){
                            var firstnew=""
                            for (var k=str.length-1; k>=0; k--){
                                if (str[k] == '\n'){
                                    break;
                                }
                                firstnew+=str[k]
                            }
                            firstnew=ReverseString(firstnew)
                            var numTab=""
                            for (var k=0;k<=numberOfTabs(firstnew);k++)
                                numTab+="\t"
                            pasteIntoInput(this, "\n"+numTab);
                        }
                        else{
                            var firstnew=""
                            for (var k=str.length-1; k>=0; k--){
                                if (str[k] == '\n'){
                                    break;
                                }
                                firstnew+=str[k]
                            }
                            firstnew=ReverseString(firstnew)
                            var numTab=""
                            for (var k=0;k<numberOfTabs(firstnew);k++)
                                numTab+="\t"
                            pasteIntoInput(this, "\n"+numTab);
                        }
                        inc_height(id[id.length-1],300)
                    }
                } 
                else {
                    str=this.value.trim();
                    if (str[str.length-1]==":"){
                        var firstnew=""
                        for (var k=str.length-1; k>=0; k--){
                            if (str[k] == '\n'){
                                break;
                            }
                            firstnew+=str[k]
                        }
                        firstnew=ReverseString(firstnew)
                        var numTab=""
                        for (var k=0;k<=numberOfTabs(firstnew);k++)
                            numTab+="\t"
                        pasteIntoInput(this, "\n"+numTab);
                    }
                    else{
                        var firstnew=""
                        for (var k=str.length-1; k>=0; k--){
                            if (str[k] == '\n'){
                                break;
                            }
                            firstnew+=str[k]
                        }
                        firstnew=ReverseString(firstnew)
                        var numTab=""
                        for (var k=0;k<numberOfTabs(firstnew);k++)
                            numTab+="\t"
                        pasteIntoInput(this, "\n"+numTab);
                    }
                    inc_height(id[id.length-1],300)
                }

            }
            else{
                // inc_height(id[id.length-1],300)
            }
            code_value = this.value;
        });

        document.addEventListener('paste', function (e) {
            e.preventDefault();
            var data = "";
            if (window.clipboardData) { // IE
                data = window.clipboardData.getData('Text');
            } else { // Standard-compliant browsers
                data = e.clipboardData.getData('text');
            }
            convert_paste_data(data);
        });

        function convert_paste_data(data) {
            date2=Date().substring(22,24)
            if(Math.abs(date2-datepaste1) == 0){
                return
            }
            datepaste1=Date().substring(22,24)
            var j = 0;
            var fl = 0;
            var format = /^[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]*$/;
            var new_data = "";
            for (i_data = 0; i_data < data.length; i_data++) {
                if (data[i_data] == " " || data[i_data] == "\n" || data[i_data].match(format) || i_data == (data.length - 1)) {
                    var k = i_data;
                    if (j == k) {
                        new_data += data[i_data];
                        j = i_data + 1;
                        continue;
                    }
                    if (data[i_data].match(format) == null && i_data == (data.length - 1)) {
                        k = k + 1;
                    }
                    var con_txt = "";
                    for (ind = j; ind < k; ind++)
                        con_txt += data[ind];
                    fl = 0;
                    for (ind = 0; ind < hi_en_keyword.length; ind++) {
                        if (hi_en_keyword[ind] == con_txt) {
                            con_txt = hi_keyword[ind];
                            fl = 1;
                        }
                    }
                    new_data += con_txt;
                    if (data[i_data].match(format) == null && i_data == (data.length - 1)) {
                        break
                    }
                    new_data += data[i_data];
                    j = i_data + 1;
                }
            }
            convert_hindi(new_data).then((trans) => {
                        if (trans) {
                            new_data=trans
                        } else
                            console.log("Error!")
                    }).then(() => {
                        var paste = document.getElementById(id);
                        var first=paste.value.slice(0,pos);
                        var last=paste.value.slice(pos,paste.value.length);
                        paste.value=first+" "+new_data+" "+last;
                    })
                    .catch((err) => console.log(err))
            
        }

        document.getElementById(id).onpaste = function (e) {
            e.preventDefault();
            console.log('Paste Event triggered');
        };

        function setCaretPosition(elemId, caretPos) {
            var elem = document.getElementById(elemId);

            if (elem != null) {
                if (elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                } else {
                    if (elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    } else
                        elem.focus();
                }
            }
        }

        function reverse(str) {
            let reversed = "";
            for (var i = str.length - 1; i >= 0; i--) {
                reversed += str[i];
            }
            return reversed;
        }

        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            div_open = 0;
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    // initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:
    if (id != "")
        autocomplete(document.getElementById(id), hi_en_keyword);

    function convert_hindi(val) {
        return new Promise((resolve, reject) => {
            var trans;
            $(document).ready(function () {
                var code = 'data1'
                var d_1 = val;
                $.ajax({
                    url: "/translate",
                    data: {
                        code: d_1
                    },
                    type: 'POST',
                    success: function (result) {
                        const temp = JSON.parse(result)
                        trans = temp;
                        if (val) {
                            resolve(trans);
                        } else
                            reject("Value must be defined.")
                    }
                });
            });
        })
    }

    function token_hindi(val) {
        return new Promise((resolve, reject) => {
            var trans;
            $(document).ready(function () {
                var code = 'data1'
                var d_1 = val;
                $.ajax({
                    url: "/token_translate",
                    data: {
                        code: d_1
                    },
                    type: 'POST',
                    success: function (result) {
                        const temp = decodeURIComponent(JSON.parse(result))
                        trans = temp;
                        if (val) {
                            resolve(trans);
                        } else
                            reject("Value must be defined.")
                    }
                });
            });
        })
    }

    function pushto_database(hi, en, count) {
        $(document).ready(function () {
            var code = 'data0'
            var code1 = 'data1'
            var code2 = 'data2'
            if (en == "undefined"){
                return
            }
            $.ajax({
                url: "/pushto",
                data: {
                    code: hi,
                    code1: en,
                    code2: count
                },
                type: 'POST',
                success: function (result) {
                }
            });
        });
    }


    if(flag_out==1){
        code_value=document.getElementById(id).value
        code_value=onlyTranslateKeyword(code_value)
        code_output(code_value);
    }

    if (flag_button == 1) {
        code_value=document.getElementById(id).value
        code_value=onlyTranslateKeyword(code_value)
        code_translate(code_value);
    }
    function escapeRegExp(string){
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
     
    /* Define functin to find and replace specified term with replacement string */
    function replaceAll(str, term, replacement) {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }

    function onlyTranslateKeyword(input1){
        for (var i=0;i<hi_en_token.length;i++){
            input1=replaceAll(input1,hi_en_token[i],key_token[i])
        }
        return input1;
    }

    function code_translate(input) {
        $(document).ready(function () {
            var code = 'data0'
            // input = onlyTranslateKeyword(input)
            $.ajax({
                url: "/code_translate",
                data: {
                    code: input
                },
                type: 'POST',
                success: function (result) {
                    document.getElementById(id).value = result;
                }
            });
        });
    }

    function code_output(input) {
        $(document).ready(function () {
            var code = 'data0'
            input=document.getElementById("editor"+id[id.length-1]).value
            $.ajax({
                url: "/code_output",
                data: {
                    code: input
                },
                type: 'POST',
                success: function (result) {
                    const temp = JSON.parse(result)
                    document.getElementById(id).value = temp;
                    has_scrollbar(id,5)
                }
            });
        });
    }
    var cursorPosition = $('#' + id).prop("selectionStart");

}

function getfrom_database() {
    $(document).ready(function () {
        $.ajax({
            url: "/getfrom",
            type: 'POST',
            success: function (result) {
                const temp = decodeURIComponent(JSON.parse(result))
                var tempStr = ""
                var get_data = [];
                for (i = 0; i < temp.length; i++) {
                    if (temp[i] != " " && temp[i] != "," && i != temp.length - 1)
                        tempStr += temp[i];
                    else {
                        if (i == temp.length - 1)
                            tempStr += temp[i];
                        get_data.push(tempStr);
                        tempStr = ""
                    }
                }
                console.log(get_data)
                for (i = 0; i <= get_data.length; i += 3) {
                    if (get_data[i] != undefined) {
                        var found = 0;
                        for (ind = 0; ind <= hi_keyword.length; ind++) {
                            if (hi_keyword[ind] == get_data[i + 1]) {
                                found = 1;
                                hi_en_count[ind] = get_data[i + 2];
                                break;
                            }
                        }
                        if (found == 0 && get_data[i + 2] != 0) {
                            hi_en_keyword.push(get_data[i]);
                            trie.add(get_data[i]);
                            hi_keyword.push(get_data[i + 1]);
                            hi_en_count.push(get_data[i + 2]);
                        }
                    }
                }
            }
        });
    });
}

// -------------------------------------------
// -------------------------------------------

$(document).ready(function(){
    $(".pc").click(function(){
        if ( $("#pc").css("display") === ("block")  ){
            $("#pc").css("display","none");
        }
        else
            $("#pc").css("display","block");
    });

    $(".lv").click(function(){
        if ( $("#lv").css("display") === ("block")  )
            $("#lv").css("display","none");
        else
            $("#lv").css("display","block");
    });

    $(".pe").click(function(){
        if ( $("#pe").css("display") === ("block")  )
            $("#pe").css("display","none");
        else
            $("#pe").css("display","block");
    });
});

var row

function has_scrollbar(elem_id,r)
{
    row=r
    const elem = document.getElementById(elem_id);
    if (elem.clientHeight < elem.scrollHeight){
        row+=10
        $('#'+elem_id).attr('rows', row);
        has_scrollbar(elem_id,row)
    }
    else{
        if (r == 5)
            return
        del_row(elem_id,row)
    }
}

function del_row(elem_id,r){
    row=r
    const elem = document.getElementById(elem_id);
    if (elem.clientHeight < elem.scrollHeight){
        $('#'+elem_id).attr('rows', row+1);
        return
    }
    else{
        row-=1
        $('#'+elem_id).attr('rows', row);
        del_row(elem_id,row)
    }
}

function inc_height(elem_id,r){
    row=r
    const elem = document.getElementById('editor'+elem_id);
    if (elem.clientHeight < elem.scrollHeight){
        row+=50
        $('#auto'+elem_id).css("height",row+"px");
        inc_height(elem_id,row)
    }
    else{
        if (r == 300)
            return
        dec_height(elem_id,row)
    }
}

function dec_height(elem_id,r){
    row=r
    const elem = document.getElementById('editor'+elem_id);
    if (elem.clientHeight < elem.scrollHeight){
        $('#auto'+elem_id).css("height",row+20+"px");
        return
    }
    else{
        row-=10
        $('#auto'+elem_id).css("height",row+"px");
        dec_height(elem_id,row)
    }
}