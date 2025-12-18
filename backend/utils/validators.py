"""Validation helpers"""

def is_text_payload(payload: dict, key: str = "text") -> bool:
    return isinstance(payload, dict) and key in payload and isinstance(payload[key], str)
