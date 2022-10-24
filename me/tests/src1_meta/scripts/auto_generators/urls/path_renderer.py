# BOF [O3o2o_1o0g2o_4o1o1o0]

"""テスト
# cd {testsのあるディレクトリー}

python -m tests.src1_meta.scripts.auto_generators.urls.path_renderer
"""
from src1_meta.scripts.auto_generators.urls.path_renderer import PathRenderer


def test_ok1():
    # Test data
    path_rdr = PathRenderer()
    path_rdr.method = "render"
    path_rdr.module = "src1.this.is.a.file"
    path_rdr.real_class_name = "HelloClass"
    path_rdr.alias_class_name = "GoodMorningClass"
    path_rdr.comment = "This is a text."
    path_rdr.path = "C:\\This\\Is\\A\\Path\\urls_example_autogen.py"
    path_rdr.name = "home"

    actual = path_rdr.create_header_text()
    expected = """from src1.this.is.a.file import HelloClass as GoodMorningClass
"""

    if not actual == expected:
        print(
            f"F\nimport_statement failed. actual:[{actual}] expected:[{expected}]\n")
        return

    actual = path_rdr.create_urlpatterns_item_text()
    expected = """
    # This is a text.
    path('C:\\This\\Is\\A\\Path\\urls_example_autogen.py', GoodMorningClass.render, name='home'),
"""

    print(".", end="")  # Succeed

    if not actual == expected:
        print(
            f"F\nurlpatterns_item_text failed. actual:[{actual}] expected:[{expected}]\n")
        return

    print(".", end="")


if __name__ == '__main__':
    test_ok1()

# EOF [O3o2o_1o0g2o_4o1o1o0]