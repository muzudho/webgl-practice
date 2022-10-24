# AutoGenBegin [O3o2o_1o0g4o0]

from django.urls import path

from apps1.warabenture_vol1o0.views.hello.ver1o0 import HelloView


urlpatterns = [
    # O3o2o_1o0g1o0 練習1.0巻 こんにちわ別名1.0版
    path('warabenture/vol1.0/hello-alias/ver1.0/', HelloView.render, name='warabenture_vol1o0_hello_alias'),
]

# AutoGenEnd [O3o2o_1o0g4o0]
