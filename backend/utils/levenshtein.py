"""Levenshtein distance helper"""

def distance(a: str, b: str) -> int:
    # Simple implementation
    if a == b:
        return 0
    la, lb = len(a), len(b)
    dp = list(range(lb + 1))
    for i in range(1, la + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, lb + 1):
            cur = min(dp[j] + 1, prev + (a[i-1] != b[j-1]), dp[j-1] + 1)
            prev, dp[j] = dp[j], cur
    return dp[-1]
