from rest_framework.pagination import PageNumberPagination

class NoteHomePagination(PageNumberPagination):
    page_size = 13  # 페이지당 항목 수
    page_size_query_param = "page_size"  # URL에서 page_size 변경 가능
    max_page_size = 100
