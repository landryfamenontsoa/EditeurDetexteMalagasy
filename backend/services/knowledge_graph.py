"""Knowledge graph service for semantic suggestions.

Provides build_graph() to load ontology and gazetteers, and
find_related() to suggest related concepts using simple graph traversal.
"""
import json
import os
from functools import lru_cache
from collections import defaultdict, deque
from typing import List, Dict, Any, Optional, Set


def _load_json(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


@lru_cache(maxsize=1)
def build_graph(ontology_path: Optional[str] = None) -> Dict[str, Any]:
    """Load ontology and build adjacency structures.

    Returns dict with 'nodes' and 'adj' adjacency map: adj[node] -> list of (neighbor, rel)
    """
    if ontology_path is None:
        base = os.path.dirname(__file__)
        ontology_path = os.path.normpath(os.path.join(base, '..', 'malagasy_ontology.json'))

    data = _load_json(ontology_path)
    nodes = data.get('ontology', {})
    relations = data.get('relations', [])

    adj = defaultdict(list)
    for r in relations:
        frm = r.get('from')
        to = r.get('to')
        rel = r.get('rel', '')
        if frm and to:
            adj[frm].append((to, rel))
            # add reverse edge for undirected exploration
            adj[to].append((frm, 'rev_' + rel))

    # Integrate gazetteer (cities/regions) if present
    # Try to find ner_gazetteer.json under data dataset
    gaz_path = os.path.normpath(os.path.join(base, '..', 'data', 'dataset', 'lexiques', 'ner_gazetteer.json'))
    try:
        gaz = _load_json(gaz_path)
        for key in ('cities', 'regions'):
            for c in gaz.get(key, []):
                k = c.lower()
                if k not in nodes:
                    nodes[k] = { 'label': c, 'type': key[:-1] }
                # connect city -> tanana (if exists)
                if 'tanana' in nodes:
                    adj[k].append(('tanana', 'is_a'))
                    adj['tanana'].append((k, 'has'))
    except Exception:
        pass

    return { 'nodes': nodes, 'adj': adj }


def reload_graph(ontology_path: Optional[str] = None) -> Dict[str, Any]:
    """Clear cached graph and rebuild (useful in development or tests)."""
    try:
        build_graph.cache_clear()
    except Exception:
        pass
    return build_graph(ontology_path)


def find_related(concept: str, depth: int = 1, rel_types: Optional[Set[str]] = None, limit: int = 10) -> List[Dict[str, Any]]:
    """Return related concepts for a given concept string.

    - concept: concept id or label (case-insensitive)
    - depth: traversal depth
    - rel_types: optional set of relation names to filter
    Returns list of { 'id': id, 'label': label, 'rel': rel, 'distance': d }
    """
    graph = build_graph()
    nodes = graph['nodes']
    adj = graph['adj']

    cid = concept.lower()
    if cid not in nodes:
        # try to match by label
        for nid, meta in nodes.items():
            if meta.get('label', '').lower() == cid:
                cid = nid
                break

    if cid not in nodes:
        return []

    results = []
    seen = {cid}
    q = deque()
    q.append((cid, 0))

    while q:
        node, dist = q.popleft()
        if dist >= depth:
            continue
        for nbr, rel in adj.get(node, []):
            if rel_types and rel not in rel_types and 'rev_' + rel not in rel_types:
                continue
            if nbr in seen:
                continue
            seen.add(nbr)
            q.append((nbr, dist + 1))
            meta = nodes.get(nbr, {})
            results.append({ 'id': nbr, 'label': meta.get('label', nbr), 'rel': rel, 'distance': dist + 1 })
            if len(results) >= limit:
                return results

    return results


def detect_entities(text: str) -> List[Dict[str, Any]]:
    """Naive entity detection by exact string lookup in nodes/labels.

    Returns [{'id', 'label', 'start', 'end'}]
    """
    graph = build_graph()
    nodes = graph['nodes']
    lower = text.lower()
    results = []
    for nid, meta in nodes.items():
        lbl = meta.get('label', nid).lower()
        idx = lower.find(lbl)
        if idx != -1:
            results.append({'id': nid, 'label': meta.get('label', lbl), 'start': idx, 'end': idx + len(lbl)})
    return results


if __name__ == '__main__':
    g = build_graph()
    print(f"Loaded {len(g['nodes'])} nodes, adjacency entries: {len(g['adj'])}")
