from translator.english_py_parser import EnglishPyParser
from tokenize import NAME

en_parser = EnglishPyParser({})
print(en_parser._translate_internals("if वर्ष == 2018:", "hi"))
