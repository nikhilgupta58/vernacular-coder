import re

from english_py_parser import EnglishPyParser
from non_english_py_parser import NonEnglishPyParser


class PyTranslator:
    """
    Translates Python code (restricted by ) for python one_lang to anothe
    # :param debug_mode: when True, uses the smaller fixtures/translations file to translate.
        # base_dir = "data/fixtures/translations" if debug_mode else "data/translations"
        # translations_fp = f"{base_dir}/{programming_lang}-{src_human_lang}.txt"
    """

    def __init__(self, all_dict_fps):
        self.all_translation_dicts = []  # from non-en to en
        self.all_reversed_translation_dicts = {}  # from en to known-non-en
        for dict_fp in all_dict_fps:
            # fwd: non_en_symbol to english symbol
            # rev: en_symbol to non_english symbol
            prog_lang, curr_lang = dict_fp.split("/")[-1].split(".")[0].split("-")
            # prog_lang is fixed to be py in this translator.
            if str.lower(prog_lang) != "py":
                continue
            fwd, rev = self._load_translations(dict_fp)
            self.all_translation_dicts.append(fwd)
            self.all_reversed_translation_dicts[curr_lang] = rev
        self.non_en_parser = NonEnglishPyParser(self.all_translation_dicts)
        self.en_parser = EnglishPyParser(self.all_reversed_translation_dicts)

    def _load_translations(self, translations_fp, separator="\t"):
        """
        Loads (non-en => en) translations, e.g.
        :param translations_fp: f"{base_dir}/{programming_lang}-{src_human_lang}.txt"
        :param separator: key value pair separator in the translation dict
        :return: two dictionaries:
                1.) non_en_symbol to english symbol
                2.) en_symbol to non_english symbol
        """
        translations = dict()  # non-en => en mapping.
        reversed_translations = dict()  # non-en => en mapping.
        with open(translations_fp, 'r') as trans_file:
            for line in trans_file:
                line = line.strip()
                cols = line.split(separator)
                if len(cols) == 2 and not line.startswith("#"):
                    translations[cols[1].strip()] = cols[0].strip()
                    reversed_translations[cols[0].strip()] = cols[1].strip()

        return translations, reversed_translations

    def eat_extra_spaces(self, translated_code_lines):
        """
        e.g. a . rjust_in_hindi () => a.rjust_in_hindi()
        Note: as this is a rule based function, it may break for some inputs.
        Need to have more test cases.
        :param translated_code_lines: translated code can sometimes have extra spaces.
        :return: all lines with only relevant spaces.
        """
        fixed_lines = []
        remove_space_around_these = [".", "(", ")", ":", "'"]
        remove_space_after_these = ["'"]

        for line in translated_code_lines:
            for c in remove_space_around_these:
                line = line.replace(" {c}", "{c}").replace("{c} ", "{c}")
            for c in remove_space_after_these:
                line = line.replace("{c} ", "{c}")
            fixed_lines.append(line)
        return fixed_lines

    # NLTK English tokenizer.
    # Would fail on:
    # (i) a!=5 => but work on a != 5,
    # (ii) a.func() => but work on a . func()
    # make this more stable.
    def _translate_lines_using_translator(self, code_lines, translator, target_human_lang):
        """
        Calls the translator for every line of code, and eats any extra spaces
        but preserves indentation.
        :param code_lines: an array of code lines.
        :param translator: either en to non_en or en-to-non_en or the other way.
        :return: translated program as one large string.
        """
        translated_code_lines = []
        for code_line in code_lines:
            translated_code_lines.append(translator.translate_line(
                code_line=code_line,
                target_human_lang=target_human_lang))
        fixed_lines = self.eat_extra_spaces(translated_code_lines)
        # join introduces additional \\ before ' (or may be just on debugger we see it explicitly)
        # e.g. print('hello') => print(\\'hello\\')
        # joined = "".join(fixed_lines)
        joined = ""
        for f in fixed_lines:
            if f.endswith("\n"):
                joined += f
            else:
                joined += f + "\n"  # an extra newline in a python program doesn't hurt.
        # Unescape: print('hello') => print(\\'hello\\')
        # joined = joined.replace("\\\\", "")
        #
        # FIXME Might have to do this before printing to a file?
        # '"Hello,\\nworld!"'.decode('string_escape')
        # "Hello,
        # world!"
        return joined

    def translate_code_lines(self, src_code_lines, src_human_lang, target_human_lang="en"):
        """
        Translate code in src lang to english python or from eng to non-en.
        :param src_code_lines: iterable lines in src lang.
        :param src_human_lang: e.g., hi, cn, ..
        :param target_human_lang: default = en, also supports the rare case src_human_lang=en and target = hi
        :return: translated program as one large string (see ``_translate_lines_given_translations``).
        """
        current_translator = self.en_parser if src_human_lang == "en" else self.non_en_parser
        return self._translate_lines_using_translator(src_code_lines, current_translator, target_human_lang)

    def translate_code_file(self, src_code_fp, src_human_lang="", target_human_lang="en"):
        """
        Reads code lines and then calls ``translate_code_lines``
        :param src_code_fp: e.g., "data/fixtures/vernacular_code/helloworld.hi_py"
        :return: code in en (regular python file).
        """
        if not src_human_lang:
            # Guess the human and programming language
            # my_file.hi_py => hi, py
            src_human_lang, programming_lang = src_code_fp.split(".")[-1].split("_")
        src_lines = []
        with open(src_code_fp, 'r', encoding='UTF8') as f:
            for line in f:
                src_lines.append(line)

        return self.translate_code_lines(src_lines, src_human_lang, target_human_lang)
