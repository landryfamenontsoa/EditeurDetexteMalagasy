# scraper.py
import requests
import json
import time

def scrape_wikipedia_malagasy(num_pages=50):
    """Scrape Wikipedia Malagasy"""
    
    print("🔄 Scraping Wikipedia Malagasy...")
    
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'MalagasyProject/1.0'
    })
    
    articles = []
    api_url = "https://mg.wikipedia.org/w/api.php"
    
    # Étape 1: Récupérer liste de pages aléatoires
    params = {
        "action": "query",
        "format": "json",
        "list": "random",
        "rnlimit": num_pages,
        "rnnamespace": 0
    }
    
    try:
        resp = session.get(api_url, params=params, timeout=15, verify=False)
        pages = resp.json()["query"]["random"]
        print(f"✓ {len(pages)} pages trouvées")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []
    
    # Étape 2: Récupérer contenu de chaque page
    for i, page in enumerate(pages):
        try:
            params = {
                "action": "query",
                "format": "json",
                "pageids": page["id"],
                "prop": "extracts",
                "explaintext": True
            }
            
            resp = session.get(api_url, params=params, timeout=10, verify=False)
            data = resp.json()["query"]["pages"][str(page["id"])]
            
            content = data.get("extract", "")
            
            if content and len(content) > 50:
                articles.append({
                    "id": page["id"],
                    "title": page["title"],
                    "content": content
                })
                print(f"  [{i+1}/{len(pages)}] ✓ {page['title'][:50]}")
            
            time.sleep(0.2)
            
        except Exception as e:
            print(f"  [{i+1}/{len(pages)}] ✗ Erreur: {page['title']}")
            continue
    
    return articles


def save_articles(articles, filename="articles_raw.json"):
    """Sauvegarde les articles"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Sauvegardé: {filename} ({len(articles)} articles)")


if __name__ == "__main__":
    # Lancer le scraping
    articles = scrape_wikipedia_malagasy(50)
    
    if articles:
        save_articles(articles)
        print(f"\n✅ Terminé! {len(articles)} articles récupérés")
    else:
        print("\n❌ Aucun article récupéré")