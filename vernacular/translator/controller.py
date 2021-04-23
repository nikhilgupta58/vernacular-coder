import json
import os
import sys
import py_translation
from subprocess import Popen, PIPE


def main_translate(
        untranslated_script_path,
        src_human_lang,
        target_human_lang,
        outpath,
        translations_base_dir):
    translation_dict_fps = []
    for file in os.listdir(translations_base_dir):
        fp = translations_base_dir + file
        translation_dict_fps.append(fp)

    o = py_translation.PyTranslator(translation_dict_fps)
    if untranslated_script_path.endswith("py"):
        translated_code = o.translate_code_file(src_code_fp=untranslated_script_path,
                                                src_human_lang=src_human_lang,
                                                target_human_lang=target_human_lang)
    else:
        translated_code = o.translate_code_lines(src_code_lines=untranslated_script_path.split("\n"),
                                                 src_human_lang=src_human_lang,
                                                 target_human_lang=target_human_lang)

    outfile = open(outpath, 'w')
    for t in translated_code:
        outfile.write(t)  # t ends with \n.
    outfile.close()
    # os.chmod(outpath, 0o777)  # file must be executable (perhaps give permission chmod 777 manually).
    p = Popen(['python3', outpath], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    out, err = p.communicate()
    result_dict = dict()
    result_dict["translation"] = translated_code
    result_dict["result"] = out.decode('UTF-8')
    result_dict["error"] = err.decode('UTF-8')
    # return {"translation": json.dumps(translated_code), "result": json.dumps(out.decode('UTF-8')), "error": json.dumps(err.decode('UTF-8'))}
    return json.dumps(result_dict)


if __name__ == '__main__':
    untranslated_script_path = sys.argv[1]  # 0 is script name
    src_human_lang = sys.argv[2]
    target_human_lang = sys.argv[3]
    debug_mode = True
    base_dir = "../data/fixtures/translations/" \
        if debug_mode else "../data/translations/"
    temp_translated_code = "../temp/translated.py"

    # Printing to return the output to UI
    print(main_translate(untranslated_script_path=untranslated_script_path,
                         src_human_lang=src_human_lang,
                         target_human_lang=target_human_lang,
                         outpath=temp_translated_code,
                         translations_base_dir=base_dir
                         ))
    print("Translated code is in ", temp_translated_code)
