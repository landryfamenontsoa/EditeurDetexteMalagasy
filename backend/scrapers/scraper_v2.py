# scraper_v2.py
import requests
import json
import time

class MalagasyScraper:
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': 'MalagasyProject/1.0'})
        self.api_url = "https://mg.wikipedia.org/w/api.php"
        self.articles = []
    
    def get_page_content(self, title):
        """Récupère contenu d'une page par titre"""
        params = {
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "extracts",
            "explaintext": True
        }
        
        try:
            resp = self.session.get(self.api_url, params=params, timeout=10, verify=False)
            pages = resp.json()["query"]["pages"]
            for pid, page in pages.items():
                if pid != "-1" and "extract" in page:
                    return page.get("extract", "")
        except:
            pass
        return ""
    
    def get_category_pages(self, category, limit=50):
        """Récupère pages d'une catégorie"""
        params = {
            "action": "query",
            "format": "json",
            "list": "categorymembers",
            "cmtitle": f"Category:{category}",
            "cmlimit": limit,
            "cmtype": "page"
        }
        
        try:
            resp = self.session.get(self.api_url, params=params, timeout=10, verify=False)
            return resp.json()["query"]["categorymembers"]
        except:
            return []
    
    def scrape_important_pages(self):
        """Scrape pages importantes sur Madagascar"""
        
        important_titles = [
            # Géographie & Pays
            "Madagasikara",
            "Antananarivo",
            "Toamasina", 
            "Antsirabe",
            "Mahajanga",
            "Fianarantsoa",
            "Toliara",
            "Antsiranana",
            
            # Culture
            "Malagasy",
            "Teny Malagasy",
            "Fomba Malagasy",
            "Hira gasy",
            "Kabary",
            "Famadihana",
            "Fady",
            "Lamba",
            
            # Histoire
            "Tantaran'i Madagasikara",
            "Fanjakana Merina",
            "Andrianampoinimerina",
            "Radama I",
            "Ranavalona I",
            "Ranavalona III",
            
            # Nature
            "Lemur",
            "Baobab",
            "Fossa",
            "Tontolo iainana",
            "Ala",
            
            # Société
            "Fianakaviana",
            "Fiangonana",
            "Sekoly",
            "Vary",
            "Omby",
            
            # Sport & Divers
            "Barea",
            "Rugby",
            "Mozika Malagasy"
        ]
        
        print("📥 Scraping pages importantes...")
        
        for title in important_titles:
            content = self.get_page_content(title)
            if content and len(content) > 200:
                self.articles.append({
                    "title": title,
                    "content": content,
                    "source": "important_pages",
                    "word_count": len(content.split())
                })
                print(f"  ✓ {title:<35} ({len(content.split()):>4} mots)")
            else:
                print(f"  ✗ {title:<35} (pas trouvé)")
            time.sleep(0.2)
        
        return len(self.articles)
    
    def scrape_categories(self):
        """Scrape pages de catégories malagasy"""
        
        categories = [
            "Madagasikara",
            "Olomalaza Malagasy",
            "Teny Malagasy",
            "Kolontsaina Malagasy",
            "Tantara",
            "Biby",
            "Zavamaniry"
        ]
        
        print("\n📥 Scraping catégories...")
        
        for cat in categories:
            print(f"\n  📂 Catégorie: {cat}")
            pages = self.get_category_pages(cat, limit=20)
            
            for page in pages:
                title = page["title"]
                
                # Éviter doublons
                if any(a["title"] == title for a in self.articles):
                    continue
                
                content = self.get_page_content(title)
                if content and len(content) > 200:
                    self.articles.append({
                        "title": title,
                        "content": content,
                        "source": f"category:{cat}",
                        "word_count": len(content.split())
                    })
                    print(f"    ✓ {title[:40]:<40} ({len(content.split()):>4} mots)")
                
                time.sleep(0.2)
        
        return len(self.articles)
    
    def scrape_featured_articles(self):
        """Scrape articles de qualité"""
        
        print("\n📥 Scraping articles longs (recherche)...")
        
        # Recherche de termes malagasy
        search_terms = [
            "Malagasy", "Madagasikara", "Antananarivo", "razana",
            "firenena", "tantara", "kolontsaina", "teny"
        ]
        
        for term in search_terms:
            params = {
                "action": "query",
                "format": "json",
                "list": "search",
                "srsearch": term,
                "srlimit": 10
            }
            
            try:
                resp = self.session.get(self.api_url, params=params, timeout=10, verify=False)
                results = resp.json()["query"]["search"]
                
                for result in results:
                    title = result["title"]
                    
                    # Éviter doublons
                    if any(a["title"] == title for a in self.articles):
                        continue
                    
                    content = self.get_page_content(title)
                    if content and len(content) > 500:  # Articles plus longs
                        self.articles.append({
                            "title": title,
                            "content": content,
                            "source": f"search:{term}",
                            "word_count": len(content.split())
                        })
                        print(f"  ✓ {title[:45]:<45} ({len(content.split()):>4} mots)")
                    
                    time.sleep(0.2)
                    
            except Exception as e:
                print(f"  ⚠ Erreur recherche '{term}': {e}")
        
        return len(self.articles)
    
    def save(self, filename="articles_raw.json"):
        """Sauvegarde les articles"""
        
        # Trier par nombre de mots (plus longs en premier)
        self.articles.sort(key=lambda x: x["word_count"], reverse=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.articles, f, ensure_ascii=False, indent=2)
        
        return filename
    
    def stats(self):
        """Affiche statistiques"""
        total_words = sum(a["word_count"] for a in self.articles)
        avg_words = total_words // len(self.articles) if self.articles else 0
        
        print(f"\n{'='*50}")
        print(f"📊 STATISTIQUES")
        print(f"{'='*50}")
        print(f"  Articles collectés : {len(self.articles)}")
        print(f"  Mots totaux       : {total_words:,}")
        print(f"  Moyenne par article: {avg_words}")
        print(f"\n  Top 10 articles:")
        for a in self.articles[:10]:
            print(f"    • {a['title'][:35]:<35} {a['word_count']:>5} mots")


def main():
    print("="*50)
    print("🇲🇬 SCRAPER WIKIPEDIA MALAGASY v2")
    print("="*50 + "\n")
    
    scraper = MalagasyScraper()
    
    # Scraper différentes sources
    scraper.scrape_important_pages()
    scraper.scrape_categories()
    scraper.scrape_featured_articles()
    
    # Stats
    scraper.stats()
    
    # Sauvegarder
    filename = scraper.save()
    print(f"\n💾 Sauvegardé: {filename}")
    print(f"\n✅ Scraping terminé!")


if __name__ == "__main__":
    main()