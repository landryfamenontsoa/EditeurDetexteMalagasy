# cleaner.py
import json
import re
from collections import Counter

def load_articles(filename="articles_raw.json"):
    """Charge les articles scrapés"""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)


def clean_text(text):
    """Nettoie un texte"""
    if not text:
        return ""
    
    # Supprimer références [1], [2]...
    text = re.sub(r'\[\d+\]', '', text)
    
    # Supprimer URLs
    text = re.sub(r'https?://\S+', '', text)
    
    # Supprimer caractères spéciaux (garder ponctuation de base)
    text = re.sub(r'[^\w\s\.,;:!?\'\"-]', ' ', text)
    
    # Normaliser espaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def extract_words(text):
    """Extrait les mots d'un texte"""
    text = clean_text(text).lower()
    words = re.findall(r'\b[a-zA-Z]{2,}\b', text)
    return words


def extract_sentences(text):
    """Extrait les phrases d'un texte"""
    text = clean_text(text)
    sentences = re.split(r'[.!?]+', text)
    # Garder phrases avec au moins 3 mots
    return [s.strip() for s in sentences if len(s.strip().split()) >= 3]


def detect_malagasy_quality(text):
    """Détecte si le texte est bien en malagasy (score 0-1)"""
    # Mots très courants en malagasy
    common_mg = {'ny', 'sy', 'dia', 'ary', 'fa', 'izany', 'izy', 'amin', 
                 'ho', 'tsy', 'na', 'ao', 'an', 'eo', 'io', 'no', 'mba'}
    
    words = extract_words(text)
    if not words:
        return 0
    
    mg_count = sum(1 for w in words if w in common_mg)
    return mg_count / len(words)


def process_articles(articles):
    """Traite tous les articles"""
    
    print("🧹 Nettoyage des articles...")
    
    clean_articles = []
    all_words = []
    all_sentences = []
    
    for article in articles:
        content = article.get("content", "")
        
        # Vérifier qualité malagasy
        quality = detect_malagasy_quality(content)
        
        # Nettoyer
        clean_content = clean_text(content)
        words = extract_words(content)
        sentences = extract_sentences(content)
        
        # Stocker
        clean_articles.append({
            "id": article.get("id"),
            "title": article["title"],
            "content_clean": clean_content,
            "word_count": len(words),
            "sentence_count": len(sentences),
            "quality_score": round(quality, 3)
        })
        
        all_words.extend(words)
        all_sentences.extend(sentences)
        
        # Afficher statut
        status = "✓" if quality > 0.03 else "⚠"
        print(f"  {status} {article['title'][:40]:<40} | {len(words):>4} mots | qualité: {quality:.1%}")
    
    return clean_articles, all_words, all_sentences


def build_word_frequencies(words):
    """Compte fréquence des mots"""
    return dict(Counter(words).most_common())


def save_json(data, filename):
    """Sauvegarde en JSON"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 {filename}")


def save_text(lines, filename):
    """Sauvegarde en texte"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"💾 {filename}")


if __name__ == "__main__":
    
    # Charger articles
    print("📂 Chargement articles_raw.json...")
    articles = load_articles("articles_raw.json")
    print(f"   {len(articles)} articles chargés\n")
    
    # Traiter
    clean_articles, all_words, all_sentences = process_articles(articles)
    
    # Stats
    word_freq = build_word_frequencies(all_words)
    unique_words = list(word_freq.keys())
    
    print(f"\n📊 Statistiques:")
    print(f"   Articles: {len(clean_articles)}")
    print(f"   Mots totaux: {len(all_words)}")
    print(f"   Mots uniques: {len(unique_words)}")
    print(f"   Phrases: {len(all_sentences)}")
    
    # Top 20 mots
    print(f"\n📈 Top 20 mots:")
    for word, count in list(word_freq.items())[:20]:
        print(f"   {word:<15} {count}")
    
    # Sauvegarder
    print(f"\n💾 Sauvegarde...")
    save_json(clean_articles, "articles_clean.json")
    save_json(word_freq, "word_frequencies.json")
    save_json(unique_words, "dictionnaire_mg.json")
    save_text(all_sentences, "sentences.txt")
    
    print(f"\n✅ Nettoyage terminé!")