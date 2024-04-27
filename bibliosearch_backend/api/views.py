from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

# Create your views here.
from api.wikidata_client import search_book_by_keyword

@require_http_methods(["GET"])
def search_book(request):
    keyword = request.GET.get('keyword')
    limit = request.GET.get('limit', 50)
    page = request.GET.get('page', 1)

    if not keyword:
        return JsonResponse({"status": "error", "message": "Keyword is required"}, status=400)
    

    try:
        limit = int(limit)
        page = int(page)
    except ValueError:

        return JsonResponse({"status": "error", "message": "Invalid limit or page number"}, status=400)
    status, data = search_book_by_keyword(keyword, limit, page)

    
    if status != 200:
        return JsonResponse({"status": "error", "message": "Failed to retrieve data from wikidata"}, status=status)
    else:
        return JsonResponse({"message":"successfully fetched data" ,"data": data})
    