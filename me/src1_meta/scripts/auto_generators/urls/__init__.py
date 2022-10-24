# BOF [O3o2o_1o0g2o0]

import os
import pandas as pd
from pathlib import Path

# [O3o2o_1o0g2o_3o0]
from .file_path import FilePath
#    ]---------        --------
#    12                3
# 1. 同じディレクトリー
# 2. file_path.py
#    ---------
# 3. クラス名

# [O3o2o_1o0g2o_4o1o0]
from .path_renderer import PathRenderer

# [O3o2o_1o0g2o_4o2o0]
from .urls_file_render import UrlsFileRender

# [O3o2o_1o0g2o_4o3o0]
from .urls_summary_render import UrlsSummaryRender

# [O3o2o_1o0g2o_4o4o0]
from .file_collection import FileCollection


class UrlsAutoGenerator:
    def __init__(self):
        self._summary_file_to_export = None

    def execute(self):
        # CSV 読取
        df = pd.read_csv('data/urls.csv')
        #                 -------------
        #                 1
        # 1. `src1_meta/data/urls.csv` を読取
        #               -------------

        # print(df)
        """
        Examples
        --------
                                                       file                                path                         name  ...      class alias  method
        0                  ../src1/project1/urls_autogen.py                                 NaN                          NaN  ...        NaN   NaN     NaN
        1  ../src1/project1/urls_practice_vol1o0_autogen.py  practice/vo1o0/hello-alias/ver1o0/  practice_vol1o0_hello_alias  ...  HelloView   NaN  render
        """

        print(f"Current working directory:{os.getcwd()}")

        # URL設定ファイル自動生成
        urls_file_map = self.create_urls_file_map(df)

        # 集約ファイル自動生成
        urls_summary_render = self.create_url_summary_render(df)

        # 集約ファイルが置いてあるディレクトリー
        path1 = urls_summary_render.parent_directory
        # パスに "this/is/a/pen/../paper" が含まれていれば、 "this/is/a/paper" に解決する処理
        path1 = path1.resolve()
        # 検索対象
        file_collection = FileCollection.find_to(f"{path1}/urls_*_autogen.py")
        # 生成対象のファイルを除外
        file_collection.remove_all(urls_file_map.keys())
        # 残ったファイルは削除対象
        for file_path in file_collection.target_path_str_list:
            abs_path = str(Path(file_path).absolute().resolve())
            print(f"* [ ] Remove {abs_path}")

        # どんなファイルを書き出すかの一覧を出力
        for file_path, urls_file_o in urls_file_map.items():
            abs_path = str(Path(file_path).absolute().resolve())
            print(f"* [ ] Write {abs_path}")

        abs_path = str(Path(self._summary_file_to_export).absolute().resolve())
        print(f"* [ ] Write {abs_path}")
        print(f"Ok? (y/n)")
        key = input()

        if key.upper() == "Y":
            # ファイルの削除
            for file_path in file_collection.target_path_str_list:
                abs_path = str(Path(file_path).absolute().resolve())
                print(f"Remove... {abs_path}")
                os.remove(abs_path)

            # 各ファイル書出し
            for file_path, urls_file_o in urls_file_map.items():
                abs_path = str(Path(file_path).absolute().resolve())
                # ファイル書出し
                with open(abs_path, 'w', encoding="utf8") as f:
                    print(f"Write... {abs_path}")
                    f.write(urls_file_o.create_file_text())

            # ファイル書出し
            abs_path = str(
                Path(self._summary_file_to_export).absolute().resolve())
            with open(abs_path, 'w', encoding="utf8") as f:
                print(f"Write... {abs_path}")
                f.write(urls_summary_render.create_file_text())

    def create_urls_file_map(self, df):
        """URL設定ファイル自動生成"""

        # `urls_*_autogen.py` ファイル描画オブジェクト
        urls_file_map = {}

        # 各行
        df = df.reset_index()  # make sure indexes pair with number of rows
        for index, row in df.iterrows():

            # 出力先ファイルパスオブジェクト
            file_path_o, err = FilePath.create_or_err(row['file'])
            if not err is None:
                print(err)
                continue

            method_temp = row["method"]
            if pd.isnull(method_temp):
                # method列が空なら集約ファイルとします
                self._summary_file_to_export = file_path_o.value
                continue

            path_rdr = PathRenderer()
            path_rdr.method = method_temp
            path_rdr.module = row["module"]
            path_rdr.real_class_name = row["class"]
            path_rdr.alias_class_name = row['alias']
            path_rdr.comment = row["comment"]
            path_rdr.path = row["path"]
            path_rdr.name = row["name"]

            # urls_*_aurogen.py ファイル オブジェクト取得
            if not file_path_o.value in urls_file_map:
                urls_file_map[file_path_o.value] = UrlsFileRender()

            urls_file_o = urls_file_map[file_path_o.value]
            urls_file_o.path_render_list.append(path_rdr)

        return urls_file_map

    def create_url_summary_render(self, df):
        """集約ファイル自動生成"""

        urls_summary_render = UrlsSummaryRender()

        # Distinct
        df = df.reset_index()  # make sure indexes pair with number of rows
        for index, row in df.iterrows():
            # 出力先ファイル名オブジェクト
            file_path_o, err = FilePath.create_or_err(row['file'])
            if not err is None:
                print(err)
                continue

            method_temp = row["method"]
            if pd.isnull(method_temp):
                # Ignored. method列が空なら集約ファイル
                urls_summary_render.file_path = row["file"]
                continue

            # ステムをリストに追加
            urls_summary_render.add_stem(file_path_o.stem)

        return urls_summary_render

# EOF [O3o2o_1o0g2o0]