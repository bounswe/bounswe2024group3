import requests
import json


def search_book_by_keyword(keyword:str, limit:int=50, page:int=1):
    """
    Query Wikidata for books with a given keyword in the title
    :param keyword: The keyword to search for in the title
    :param limit: The number of results to return per page
    :param page: The page number to return. It starts from 1

    :return: A tuple containing the status code and the JSON response
    """

    # Endpoint URL
    endpoint_url = "https://query.wikidata.org/sparql"

    # SPARQL Query
    query = """
    SELECT ?book ?title (GROUP_CONCAT(DISTINCT ?authorLabel; separator=", ") AS ?authors)
        (SAMPLE(?coverImage) AS ?cover) (GROUP_CONCAT(DISTINCT ?genreLabel; separator=", ") AS ?genres)
        (SAMPLE(?numberOfPages) AS ?pages) ?description (SAMPLE(?publicationYear) AS ?publicationYear)
        (GROUP_CONCAT(DISTINCT ?mainSubjectLabel; separator=", ") AS ?subjects)
        (SAMPLE(?isbn13) AS ?ISBN13)
    WHERE {{
        VALUES ?type {{wd:Q571}}  # Q571 represents books
        ?book wdt:P31 ?type .   # Filter items to only include books
        
        # Title
        ?book rdfs:label ?title FILTER (lang(?title) = "en" && CONTAINS(LCASE(?title), "{0}"))
        
        # Cover Image
        OPTIONAL {{
            ?book wdt:P18 ?coverImage.
        }}

        ?book wdt:P50 ?author . 
        ?author rdfs:label ?authorLabel FILTER (lang(?authorLabel) = "en")

        
        
        OPTIONAL {{ ?book wdt:P1104 ?numberOfPages. }}
        
        # Description
        OPTIONAL {{
            ?book schema:description ?description FILTER (lang(?description) = "en")
        }}
        
        # Publication Year

        ?book wdt:P577 ?date .
        BIND(YEAR(?date) AS ?publicationYear)
        
        
        # Main Subject
        OPTIONAL {{
            ?book wdt:P921 ?mainSubject .
            ?mainSubject rdfs:label ?mainSubjectLabel FILTER (lang(?mainSubjectLabel) = "en")
        }}
        
        # ISBN-13
        ?book wdt:P212 ?isbn13.
        
        # Genre
        OPTIONAL {{
            ?book wdt:P136 ?genre .
            ?genre rdfs:label ?genreLabel FILTER (lang(?genreLabel) = "en")
        }}
    }}
    GROUP BY ?book ?title ?description
    LIMIT {1}
    OFFSET {2}

    """.format(keyword,limit , limit*(page-1) if page>=0 else 0)
    # Set the headers to return JSON
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0',
        'Accept': 'application/sparql-results+json'
    }

    # Send the request
    response = requests.get(endpoint_url, headers=headers, params={'query': query, 'format': 'json'})

    # Check the response status code to see if the request was successful
    if response.status_code == 200:
        # Process the JSON response
        data = response.json()


        json.dump(data["results"]["bindings"], open('data.json', 'w'), indent=4)
        return (200,data["results"]["bindings"])
    else:
        return (response.status_code,None)


if __name__ == "__main__":
    print(search_book_by_keyword("war"))