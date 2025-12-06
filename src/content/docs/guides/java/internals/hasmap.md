---
title: HashMap internal working
description: HashMap internal working
---

# **HashMap Internals - Simple & Interview Ready**

## **Overview: What is HashMap?**

A HashMap stores key-value pairs using **hashing** for fast access. Think of it as a **smart dictionary** where words (keys) instantly point to definitions (values).

---

## **HashMap Initialization**

```mermaid
flowchart TD
    Start[<font size=5><b>HashMap Initialization</b></font>]

    Start --> S1

    subgraph S1[<font color=#ff6b6b>Creating a HashMap</font>]
        Code["<font color=#6c5ce7>HashMap<String, Integer> map = new HashMap<>()</font>"]
    end

    S1 --> S2

    subgraph S2[<font color=#ff6b6b>Default Parameters</font>]
        direction TB
        P1["<font color=#45b7d1>• Initial Capacity: 16 buckets</font>"]
        P1 --> P2["<font color=#45b7d1>• Load Factor: 0.75</font>"]
        P2 --> P3["<font color=#45b7d1>• Threshold: 12 (16 × 0.75)</font>"]
        P3 --> P4["<font color=#45b7d1>• Empty bucket array created</font>"]
    end

    S2 --> Visual

    subgraph Visual[<font color=#ff6b6b>Internal Bucket Array</font>]
        direction TB
        B["<font color=#4ecdc4>Bucket Array (size: 16)</font>"]
        B --> B0["<font color=#888>Bucket 0: null</font>"]
        B --> B1["<font color=#888>Bucket 1: null</font>"]
        B --> B2["<font color=#888>Bucket 2: null</font>"]
        B --> B3["<font color=#888>Bucket 3: null</font>"]
        B --> BDots["<font color=#888>...</font>"]
        B --> B14["<font color=#888>Bucket 14: null</font>"]
        B --> B15["<font color=#888>Bucket 15: null</font>"]
    end

    style Start fill:#222,stroke:#444,stroke-width:2px,color:#fff
    style S1 fill:#1a1a2e,stroke:#6c5ce7,stroke-width:2px,color:#fff
    style S2 fill:#1a1a2e,stroke:#45b7d1,stroke-width:2px,color:#fff
    style Visual fill:#1a1a2e,stroke:#4ecdc4,stroke-width:2px,color:#fff
    style B fill:#2a2a3e,stroke:#4ecdc4,stroke-width:1px,color:#fff
```

## **How does put() work?**

```mermaid
flowchart TD
    Start["putkey, value"]
    Start --> Hash["Calculate hash = key.hashCode()"]
    Hash --> Index["index = hash & (capacity - 1)"]
    Index --> Check["Check bucket at index"]
    Check --> Empty["Empty? → Create Node"]
    Check --> Occupied["Occupied? → Handle collision"]
    Occupied --> List["Linked list: add to end"]
    Occupied --> Tree["Tree: insert in tree"]
    List --> SizeCheck["Check size > threshold?"]
    SizeCheck --> Yes["Yes → Resize (double)"]
    SizeCheck --> No["No → Done"]
```

**Interview Answer:** _"HashMap uses an array of buckets. When we insert a key-value pair, it calculates which bucket to use based on the key's hash."_

---

## **HashMap Time Complexity Summary**

| Operation         | Average Case | Worst Case (Pre-Java 8) | Worst Case (Java 8+) |
| ----------------- | ------------ | ----------------------- | -------------------- |
| **get()**         | O(1)         | O(n)                    | O(log n)             |
| **put()**         | O(1)         | O(n)                    | O(log n)             |
| **remove()**      | O(1)         | O(n)                    | O(log n)             |
| **containsKey()** | O(1)         | O(n)                    | O(log n)             |

**Interview Answer:** _"HashMap gives O(1) average time for get/put/remove. Worst case is O(n) with many collisions, improved to O(log n) with trees in Java 8. Load factor 0.75 balances time vs space."_

---

## **Quick Interview Cheat Sheet**

### **Q: How does HashMap work internally?**

**A:** It uses an array of buckets. When you put a key-value pair:

1. Calculate hash of key
2. Find bucket: `hash & (array.length - 1)`
3. If bucket empty → add Node
4. If bucket occupied → handle collision (linked list/tree)
5. If size exceeds threshold → resize (double capacity)

### **Q: What is collision?**

**A:** When two keys end up in the same bucket.

### **Q: What happens during collision?**

**A:** Keys with same bucket form a linked list. In Java 8+, when list exceeds 8 elements, it converts to Red-Black tree for better performance.

### **Q: When does HashMap resize?**

**A:** When number of entries exceeds `capacity × load factor` (default: 16 × 0.75 = 12). It doubles capacity and rehashes all entries.

### **Q: Why is load factor 0.75?**

**A:** It's a trade-off: higher values save memory but cause more collisions, lower values reduce collisions but waste memory. 0.75 is the sweet spot.

### **Q: What's the time complexity?**

**A:** Average case O(1) for all operations. Worst case O(n) with many collisions, improved to O(log n) with trees in Java 8+.

### **Key Points to Remember:**

1. **Buckets array** + **Linked lists** + **Trees** (Java 8+)
2. **Resize when 75% full** (doubles capacity)
3. **Tree conversion at 8+ collisions**
4. **O(1) average**, **O(log n)** worst with trees
5. **Not thread-safe** (use ConcurrentHashMap for threads)
