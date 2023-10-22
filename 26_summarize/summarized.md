# Summary of the document Lekcja kursu AI_Devs, S03L03 — Wyszukiwanie i bazy wektorowe

## Notatka S03L03 — Bazy Wektorowe i Wyszukiwanie 

Tworzenie długotrminowej pamięci dla LLM (Language Model Learning) sprzyja **hiper-personalizacji** doświadczeń oraz tworzeniu **częściowo autonomicznych zachowań**. 

**Bazy wektorowe** są narzędziem do przechowywania i wyszukiwania danych, które przybierają formę wielowymiarowych wektorów. Dzięki technikom porównywania wektorów, jak np. metoda **cosine similarity**, możliwe jest określenie podobieństwa pomiędzy danymi.

![Wizualizacja bazy wektorowej](https://cloud.overment.com/word2vec-1695711060.gif)

![Przykładowe wyniki wyszukiwania](https://cloud.overment.com/cosine-cc650e6b-1.png)

Bazy wektorowe są kluczowe dla **budowania dynamicznego kontekstu dla LLM**. Proces dodawania danych do bazy wektorowej opiera się na przygotowaniu odpowiednich dokumentów, wygenerowaniu embeddingu i zapisaniu go w bazie wraz z metadanymi.

![Diagram procesu dodawania danych](https://cloud.overment.com/store-e4ff3078-b.png)

Bezpośrednio w bazach wektorowych wykonuje się wyszukiwanie, czyli **Similarity Search**, na którego podstawie otrzymujemy listę najbardziej zbliżonych semantycznie danych. Działanie jest przedstawione na dolnym schemacie.

![Wyszukiwanie w bazie wektorowej](https://cloud.overment.com/similarty-1695814767.png)

Przykładem realizacji takiego procesu może być kod 21_similarity, w którym budowany jest dynamiczny kontekst na podstawie wpisów użytkownika.

![Przykład](https://cloud.overment.com/search-66da96ba-1.png)

Lekcja S03L03 kursu AI_Devs koncentruje się na wyszukiwaniu i bazach wektorowych. Pokazuje wykorzystanie metody **similaritySearchWithScore**, zależność wyników wyszukiwania od liczby żądanych rekordów (**topK**) oraz możliwość filtrowania wyników na podstawie metadanych. Wysokiej jakości wyszukiwania można dokonać z zastosowaniem **\'*Hybrid Search and Retrieval Augmented Generation*' (HSRAG)**, łącząc różne techniki wyszukiwania. Przykład pokazuje jak rozbita informacja może być niekompletna, jeśli nie uwzględniamy wszystkich relevantnych fragmentów, co w praktyce może prowadzić do utraty precyzji i halucynacji modelu (![](https://cloud.overment.com/miss-12acc7c6-f.png), ![](https://cloud.overment.com/fragmented-500ae0cc-c.png)). 

Lekcja zwraca również uwagę na konieczność pracy z różnymi formatami plików, kładąc nacisk na uniwersalne koncepcje umożliwiające budowanie zestawu danych z różnorodnych źródeł. Podkreśla, jak ważne jest zachowanie jednolitości języka danych i zapytania do bazy. Zilustrowane są dwa przykłady, **11_docs** i **22_simple**, które pokazują jak generować dokumenty i opisywać je z pomocą metadanych i jak wykorzystać prosty vector store do wyszukiwania dokumentów za pomocą similarity search (![](https://cloud.overment.com/simple-2adcdec1-f.png)), oraz przykład **24_files**, który pokazuje pracę z różnymi formatami plików.

W trakcie trzeciej lekcji trzeciego sezonu kursu AI_Devs, uczymy się w jaki sposób przetwarzać pliki HTML na format zrozumiały dla AI. Istotne jest usuwanie szumów, takich jak tagi HTML, style CSS czy skrypty JavaScript, które nie niosą żadnej użytecznej treści. ![html do czyszczenia](https://cloud.overment.com/html-04554502-3.png)

Wykorzystując narzędzie [cheerio](https://www.npmjs.com/package/cheerio), możemy pobrać treść wskazanego tagu - w naszym przykładzie będzie to element div o identyfikatorze **instructors**. ![instruktorzy](https://cloud.overment.com/authors-300c2ea4-c.png)

Po czyszczeniu kodu mamy jeszcze wiele zbędnych elementów. Wykorzystując narzędzie [node-html-markdown](https://www.npmjs.com/package/node-html-markdown), zamieniamy HTML na składnię Markdown, której lepiej rozumieją modele AI. ![kod po konwersji na Markdown](https://cloud.overment.com/markdown-ac61f421-6.png)

Następnie dzielimy tekst na fragmenty, które można opisać metadanymi. Tutaj również znajduje zastosowanie wyrażenie regularne. Widać, jak wygląda podział bez uwzględnienia zdjęć (po lewej) oraz prawidłowy podział tekstu (po prawej), który uwzględnia zdjęcia. ![podział tekstu](https://cloud.overment.com/split-cc2d40ca-5.jpg)

W końcu zamieniamy linki na indeksy, które możemy później wykorzystać jako metadane. ![dokumenty z metadanymi](https://cloud.overment.com/described-17bfed2b-2.png)

To tak przygotowane dokumenty są gotowe do indeksowania w bazie wektorowej i wykorzystania na potrzeby kontekstu dla modelu AI. Porównując te dokumenty z oryginalnymi danymi, zauważamy dużą różnicę, która na pewno wpłynie na efektywność naszego AI. 

Na koniec omówiliśmy różne techniki przetwarzania długich dokumentów, pokazując, jak można zastosować je na przykładzie platformy make.com. ![processing](https://cloud.overment.com/processing-f7af380e-4.png)

