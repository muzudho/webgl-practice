# BOF [O3o2o_1o0g2o_3o0]

"""テスト
# cd {testsのあるディレクトリー}

python -m tests.src1_meta.scripts.auto_generators.urls.file_path
"""
from src1_meta.scripts.auto_generators.urls.file_path import FilePath


def test_ok1():
    # 出力先ファイルパスオブジェクト
    file_path_o, err = FilePath.create_or_err(
        'C:\\this\\is\\a\\urls_path_autogen.py')
    if not err is None:
        print(f"F\n{err}")
        return

    print(".", end="")  # Succeed


def test_not_starts_with_urls():
    # 出力先ファイルパスオブジェクト
    file_path_o, err = FilePath.create_or_err(
        'C:\\this\\is\\a\\path_autogen.py')
    if err == "書き出すファイル名の先頭は `urls_`、 末尾は `_autogen.py` にしてください。 basename:path_autogen.py":
        print(".", end="")
        return

    print("F")  # Failed


def test_not_ends_with_autogen():
    # 出力先ファイルパスオブジェクト
    file_path_o, err = FilePath.create_or_err(
        'C:\\this\\is\\a\\urls_path.py')
    if err == "書き出すファイル名の先頭は `urls_`、 末尾は `_autogen.py` にしてください。 basename:urls_path.py":
        print(".", end="")
        return

    print("F", end="")


if __name__ == '__main__':
    test_ok1()
    test_not_starts_with_urls()
    test_not_ends_with_autogen()

# EOF [O3o2o_1o0g2o_3o0]