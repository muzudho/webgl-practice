# BOF [O3o2o_1o0g2o_4o1o0]

import pandas as pd


class PathRenderer:
    def __init__(self):
        self._module = ""
        self._real_class_name = ""
        self._alias_class_name = pd.NA
        self._method = ""
        self._comment = pd.NA
        self._path = pd.NA
        self._name = pd.NA

    @property
    def module(self):
        """モジュール"""
        return self._module

    @module.setter
    def module(self, value):
        self._module = value

    @property
    def real_class_name(self):
        """実クラス名"""
        return self._real_class_name

    @real_class_name.setter
    def real_class_name(self, value):
        self._real_class_name = value

    @property
    def alias_class_name(self):
        """クラスの別名"""
        return self._alias_class_name

    @alias_class_name.setter
    def alias_class_name(self, value):
        self._alias_class_name = value

    @property
    def virtual_class_name(self):
        """実際的なクラス名"""
        if pd.isnull(self.alias_class_name):
            return self.real_class_name
        else:
            return self.alias_class_name

    @property
    def method(self):
        """メソッド"""
        return self._method

    @method.setter
    def method(self, value):
        self._method = value

    @property
    def comment(self):
        """コメント"""
        return self._comment

    @comment.setter
    def comment(self, value):
        self._comment = value

    @property
    def path(self):
        """パス"""
        return self._path

    @path.setter
    def path(self, value):
        if pd.isnull(value):
            # 空文字列の指定があり得ます。
            # pandas は空文字列と NaN を区別せず NaN にするので、空文字列に変換します
            self._path = ""
            return

        self._path = value

    @property
    def name(self):
        """名前"""
        return self._name

    @name.setter
    def name(self, value):
        self._name = value

    def create_header_text(self):
        return f"from {self.module} import {self.real_class_name}{self._create_alias_class_name_phrase()}\n"

    def _create_alias_class_name_phrase(self):
        if pd.isnull(self.alias_class_name):
            return ""
        else:
            return f" as {self.alias_class_name}"

    def create_urlpatterns_item_text(self):
        # コメント
        comment_phrase = self._create_comment_phrase()
        # name引数
        name_arg = self._create_name_arg()

        return f"""{comment_phrase}
    path('{self.path}', {self.virtual_class_name}.{self.method}{name_arg}),
"""

    def _create_comment_phrase(self):
        """コメント句"""
        if pd.isnull(self._comment):
            # 省略可
            return ""
        else:
            return f"""
    # {self._comment}"""

    def _create_name_arg(self):
        """名前引数"""
        if pd.isnull(self.name):
            # 省略可
            return ""
        else:
            return f", name='{self.name}'"

# EOF [O3o2o_1o0g2o_4o1o0]