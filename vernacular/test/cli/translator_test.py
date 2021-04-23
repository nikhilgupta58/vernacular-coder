import os
from unittest import TestCase

import pytest
import re

from translator.non_english_py_parser import NonEnglishPyParser
from translator.py_translation import PyTranslator


class TestCLITranslator(TestCase):

    def setUp(self):
        debug_mode = True
        base_dir = "data/fixtures/translations/" if debug_mode else "data/translations/"
        translation_dict_fps = []
        for file in os.listdir(base_dir):
            fp = base_dir + file
            translation_dict_fps.append(fp)
        self.o = PyTranslator(translation_dict_fps)

    # # This correctly parses only english_py. This is not something we will immediately use as we
    # # are not converting python_english to python_non_english.
    # def test_tokenization_en_python(self):
    #     inputs = dict()
    #     inputs["print(int(a))"] = ['print', '(', 'int', '(', 'a', ')', ')']
    #     inputs["print(a.rjust())"] = ['print', '(', 'a', '.', 'rjust', '(', ')', ')']
    #     inputs[" a = '7' "] = ['a', '=', "'7'"]
    #
    #     for input, expected_value in inputs.items():
    #         self.assertEqual(self.o.en_parser.translate_line(input), expected_value)

    @pytest.mark.skip()
    def test_translate_one_line(self):
        inputs = dict()
        inputs[" a = '7' "] = " a = '7' "
        inputs["छापो(int(a))"] = "print(int(a))"
        inputs["छापो(a.rjust())"] = "print(a.rjust())"
        for input, expected_value in inputs.items():
            self.assertEqual(self.o.non_en_parser.translate_line(input), expected_value)

    @pytest.mark.skip()
    def test_translate_non_en_code_file(self):
        translated_code = self.o.translate_code_file("data/fixtures/vernacular_code/helloworld.hi_py")
        expected_translated_code = "वर्ष = 2018\n" \
                                   "if वर्ष == 2018:\n" \
                                   "\tprint('नमस्कार')\n"
        self.assertEqual(translated_code, expected_translated_code)

    @pytest.mark.skip()
    def test_translate_non_en_code_block(self):
        hi_code = "वर्ष = 2018\n" \
                  "यदि वर्ष बराबर 2018:\n" \
                  "\tछापो('नमस्कार')"
        translated_code = self.o.translate_code_lines(hi_code.split("\n"), "hi")
        print(f"\nTranslated code = \n{translated_code}")
        expected_translated_code = "वर्ष = 2018\n" \
                                   "if वर्ष == 2018:\n" \
                                   "\tprint('नमस्कार')\n"
        self.assertEqual(translated_code, expected_translated_code)

    @pytest.mark.skip()
    def test_vietnamese(self):
        vn_code = "năm = 2018\nnếu năm == 2018:\n\tin('xin chào')"
        translated_code = self.o.translate_code_lines(vn_code.split("\n"), "vn")
        print(f"\nTranslated code = \n{translated_code}")
        expected_translated_code = "năm = 2018\n" \
                                   "if năm == 2018:\n" \
                                   "\tprint('xin chào')\n"
        self.assertEqual(translated_code, expected_translated_code)

    @pytest.mark.skip()
    def test_spanish(self):
        es_code = "año = 2018\nsi año == 2018:\n\timpríma('hola')"
        translated_code = self.o.translate_code_lines(es_code.split("\n"), "es")
        print(f"\nTranslated code = \n{translated_code}")
        expected_translated_code = "año = 2018\n" \
                                   "if año == 2018:\n" \
                                   "\tprint('hola')\n"
        self.assertEqual(translated_code, expected_translated_code)

    @pytest.mark.skip()
    def test_demo_hindi(self):
        translated_code = self.o.translate_code_file("samples/graph_traversal.hi_py", "hi")
        print(f"\nTranslated code hi = \n{translated_code}")
        assert 'if' in translated_code
        assert 'not' in translated_code
        assert 'None' in translated_code

    def test_demo_es(self):
        translated_code = self.o.translate_code_file("samples/graph_traversal.es_py", "es")
        print(f"\nTranslated code es = \n{translated_code}")
        assert 'if' in translated_code
        assert 'not' in translated_code
        assert 'None' in translated_code

    @pytest.mark.skip()
    # limited to left to right languages.
    def test_translate_many_l2r_lang(self):
        dir = "data/fixtures/vernacular_code/"
        for file in os.listdir(dir):
            fp = dir + file
            if file.endswith("il_py"):
                continue
            translated_code = self.o.translate_code_file(fp)
            print(f"\nTranslated code = \n{translated_code}")
            passes = "if" in translated_code and "print" in translated_code
            assert passes, f"\n************Failed to translate correctly: {file}********"

