# BOF [O3o2o_1o0g2o_2o0]

import os


class FilePath:
    """ファイルパス

    Examples
    --------
    C:\this\is\a\base.name
                 ---]-----
                 111 112
                 ---------
                 11
    ----------------------
    10

    10. file path
    11. basename
    111. stem
    112. extension with dot
    """

    @staticmethod
    def create_or_err(file_path):
        # ファイル名オブジェクト
        file_path_o = FilePath(file_path)

        if file_path_o.is_valid():
            return file_path_o, None

        return None, file_path_o._last_err

    def __init__(self, value):
        # 値
        self._value = value
        # 最後のエラーメッセージ
        self._last_err = None
        # ベースネーム
        self._basename = None
        # ステム
        self._stem = None

    @property
    def value(self):
        """値"""
        return self._value

    @property
    def last_err(self):
        """最後のエラーメッセージ"""
        return self._last_err

    @property
    def basename(self):
        """ベースネーム"""
        if self._basename is None:
            self._basename = os.path.basename(self.value)

        return self._basename

    @property
    def stem(self):
        """ステム"""
        if self._stem is None:
            # 拡張子を除去
            self._stem = self.basename[:-3]

        return self._stem

    def is_valid(self):
        """ファイル名が `urls_*_autogen.py` な感じかチェックします"""

        basename = os.path.basename(self._value)

        if basename.startswith("urls_") and basename.endswith("_autogen.py"):
            return True

        self._last_err = f"書き出すファイル名の先頭は `urls_`、 末尾は `_autogen.py` にしてください。 basename:{basename}"
        return False

# EOF [O3o2o_1o0g2o_2o0]