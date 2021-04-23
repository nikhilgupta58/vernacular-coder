from pyparsing import *


class NonEnglishPyParser:
    """ PyParsing based parser for vernacular code. 
    Takes a line from any non-english python code (actually, any text) and parses it incl. any translations
    provided by any translation dict. With python code, ensures that the leading indendations are preserved.
    """

    def __init__(self, translation_dicts):
        """
        :param translation_dicts: An array of translation dictionaries. Can be one or more. 
        As looking up multiple dictionaries is cheap, prefer this.
        """
        # an array of dicts.
        self.translation_dicts = translation_dicts
        # any character except space is inspected.
        # exclude puncts: U+0020 to U+007E ([],. etc see https://unicode-table.com/en/#007E)
        any_unicode = u''.join(chr(c) for c in range(65536)
                               if ((not chr(c).isspace()  # ignore space.
                                    and not (c >= 32 and c <= 64)  # ignore puncts.
                                    and not (c >= 91 and c <= 96)  # ignore puncts.
                                    and not (c >= 123 and c <= 126)  # ignore puncts.
                                    )
                                   # or chr(c) == "=" or chr(c) == ":" or chr(c) == "." or chr(c) == "\n")
                                   or chr(c) == "=" or chr(c) == "_")
                               )
        mylangWord = Word(any_unicode)
        mylangWord.setParseAction(self._translate_internals)
        tripleQuote = QuotedString('"""', multiline=True, unquoteResults=False) | \
                      QuotedString("'''", multiline=True, unquoteResults=False)
        self.pythonWord = tripleQuote | quotedString | pythonStyleComment | mylangWord

    def translate_line(self, code_line, target_human_lang="en"):
        """
        Translates any non-English python code line, preserving indentation.
        
        Examples:
         # looks up translation dictionaries.
             input: "nếu năm ==  2018:"
             output: "if năm ==  2018:"
     
         # preserves indentation
             input: "  nếu năm ==  2018:"
             output: "  if năm ==  2018:"    
        :param code_line: code in non-English.  
        :param target_human_lang: en only. Used for consistency with EnglishPyParser.  
        :return: translated code_line
        """
        # seems like padding is not necessary.
        # leading_padding = ""
        # for t in code_line:
        #     if not t.isalpha():
        #         leading_padding += t
        #     else:
        #         break
        translated_line = self.pythonWord.transformString(code_line)
        # seems like padding is not necessary.
        # return f"{leading_padding}{' '.join(translated_line)}"
        return translated_line

    def _translate_internals(self, s, l, t):
        """ Translates one token.
        It is based on pyparsing tokenizing, and subsequent translation of 
        those tokens is performed using translation dictionaries.
        This method may be made multithreaded in the future.
        :param s: - (internal to pyparsing) 
        :param l: - (internal to pyparsing)
        :param t: the token to translate (internal to pyparsing)
        :return: translated single token. 
        """
        token = t[0]
        translated_token = token
        for a_translation_dict in self.translation_dicts:
            if token in a_translation_dict:
                # word = worddict[tmp].decode("utf8")
                translated_token = a_translation_dict[token]
                break
        return translated_token
