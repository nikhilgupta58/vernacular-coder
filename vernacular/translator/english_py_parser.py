import tokenize  # https://docs.python.org/3/library/tokenize.html

import re
from io import BytesIO


class EnglishPyParser:
    """ Python built in tokenizer based parser for regular python_en code. 
        so this functionality is only one-way: from en-py to nonen-py.
    """

    def __init__(self, dict_of_reversed_translation_dicts):
        """
        :param reversed_translation_dicts: An array of translation dictionaries. Can be one or more. 
        As looking up multiple dictionaries is cheap, prefer this.
        """
        # an array of dicts.
        self.dict_of_reversed_translation_dicts = dict_of_reversed_translation_dicts

    def translate_line(self, code_line, target_human_lang):
        """
        Translates an English python code line, preserving indentation.
        
        Examples:
         # looks up translation dictionaries.
             input: "if năm ==  2018:"
             output: "nếu năm ==  2018:"
     
         # preserves indentation
             input: "  if năm ==  2018:"    
             output: "  nếu năm ==  2018:"
        :param code_line: code in non-English.  
        :return: translated code_line
        """
        # Not sure if padding is necessary.
        # With pyParsing it is not necessary, but not sure of tokenizer.
        leading_padding = ""
        for t in code_line:
            if not t.isalpha():
                leading_padding += t
            else:
                break
        translated_line = self._translate_internals(code_line, target_human_lang)
        return "{leading_padding}{' '.join(translated_line)}"

    def _translate_internals(self, code_line, target_human_lang):
        """ Translates one token.
        It is based on python tokenizer, and subsequent translation of 
        those tokens is performed using translation dictionaries.
        This method may be made multithreaded in the future.
        """
        ignoreTokens = ['utf-8', '', r'\s+']
        generated = tokenize.tokenize(BytesIO(code_line.encode('utf-8')).readline)
        tokens = []

        for type, token, _, _, _ in generated:
            if token not in ignoreTokens and not re.match(r'\s+', token):
                translated_token = token
                # Can we translate this word using any dictionary?
                for a_translation_dict in self.dict_of_reversed_translation_dicts.get(target_human_lang, []):
                    if token in a_translation_dict:
                        translated_token = a_translation_dict[token]
                        break
                tokens.append(translated_token)
        return tokens
