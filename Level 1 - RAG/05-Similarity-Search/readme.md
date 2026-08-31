# Similarity Search

**Similarity search** is the mechanism that answers:

> **"Given this query vector, which stored vectors are most similar to it?"**

At this point our RAG pipeline is:

```text
Document
   ↓
Chunking
   ↓
Embedding
   ↓
Vector
   ↓
Vector Database
```

Similarity search is what happens next:

```text
User Query
   ↓
Query Embedding
   ↓
Query Vector
   ↓
Similarity Search
   ↓
Top-K Relevant Vectors
   ↓
Original Chunks
   ↓
LLM
```

---

# 1. Why Do We Need Similarity Search?

Suppose our vector database contains:

```text
Chunk A:
PostgreSQL uses MVCC for concurrency control.

Chunk B:
Employees receive 24 days of paid leave.

Chunk C:
PostgreSQL uses WAL to guarantee durability.

Chunk D:
The company was founded in 2019.
```

Each chunk has an embedding:

```text
A → [0.12, -0.42, 0.81, ...]
B → [0.72,  0.03, -0.11, ...]
C → [0.21, -0.37, 0.76, ...]
D → [-0.42, 0.81, 0.03, ...]
```

User asks:

```text
How does PostgreSQL handle concurrent transactions?
```

The query is embedded:

```text
Query → [0.15, -0.39, 0.79, ...]
```

Now we need to determine:

```text
Which stored vectors are closest to this query?
```

That's **similarity search**.

---

# 2. The Mathematical Problem

Let the query vector be:

$$
q \in \mathbb{R}^d
$$

and our dataset contain:

$$
D = \{x_1,x_2,\ldots,x_N\}
$$

We want the **Top-K most similar vectors**:

$$
TopK(q,D)
$$

For example:

```text
Query
  │
  ├── A → 0.94
  ├── C → 0.89
  ├── F → 0.83
  ├── B → 0.31
  └── D → 0.17
```

If:

```text
K = 3
```

we return:

```text
A
C
F
```

---

# 3. Similarity vs Distance

There are two common ways to think about the problem.

### Similarity

Higher = more similar.

```text
1.0  ← very similar
0.8
0.4
0.1  ← unrelated
```

### Distance

Lower = more similar.

```text
0.0  ← identical
0.2
0.7
2.0  ← far apart
```

So:

```text
Similarity Search
```

and:

```text
Nearest Neighbor Search
```

are often two ways of describing the same general problem.

---

# 4. The Three Important Metrics

The three metrics you should know are:

* **Cosine similarity**
* **Dot product**
* **Euclidean distance**

---

# 5. Cosine Similarity

Cosine similarity measures the **angle** between two vectors.

Given:

$$
q = [q_1,\ldots,q_d]
$$

and:

$$
x = [x_1,\ldots,x_d]
$$

we calculate:

$$
\boxed{
\cos(q,x)=
\frac{q\cdot x}
{\|q\|\|x\|}
}
$$

where:

$$
q\cdot x
=
\sum_{i=1}^{d}q_ix_i
$$

and:

$$
\|q\|
=
\sqrt{\sum_{i=1}^{d}q_i^2}
$$

---

# 6. Cosine Example

Take:

```text
A = [1, 0]

B = [2, 0]

C = [0, 1]
```

A and B point in the same direction:

```text
        B
        ↑
        │
        │
        │
        └────────→
        A
```

Actually, geometrically they lie on the same ray.

Therefore:

$$
\cos(A,B)=1
$$

For A and C:

$$
\cos(A,C)=0
$$

because they're perpendicular.

So:

```text
A ↔ B = 1
A ↔ C = 0
```

---

# 7. Why Cosine Is Popular for Text Embeddings

Text embedding vectors often encode semantic information primarily through their direction.

Cosine similarity ignores vector magnitude.

Consider:

```text
A = [1, 2]

B = [10, 20]
```

B is basically a scaled version of A.

Their magnitudes are very different:

$$
||A|| \neq ||B||
$$

but their directions are identical:

$$
\cos(A,B)=1
$$

Therefore cosine similarity says:

> These representations point in exactly the same semantic direction.

---

# 8. Dot Product

Dot product is:

$$
q\cdot x
=
\sum_{i=1}^{d}q_ix_i
$$

Example:

```text
A = [1, 2]

B = [3, 4]
```

Then:

$$
A\cdot B
=
(1)(3)+(2)(4)
$$

$$
=3+8=11
$$

So:

```text
dot(A, B) = 11
```

---

# 9. Cosine vs Dot Product

Cosine:

$$
\frac{q\cdot x}
{\|q\|\|x\|}
$$

Dot product:

$$
q\cdot x
$$

The difference is normalization.

If vectors are normalized:

$$
\|q\|=\|x\|=1
$$

then:

$$
q\cdot x
=
\cos(q,x)
$$

So:

> **For normalized vectors, cosine similarity and dot product produce the same ranking.**

This is an important optimization used in vector systems.

---

# 10. Euclidean Distance

Euclidean distance is ordinary geometric distance.

For:

$$
q=[q_1,\ldots,q_d]
$$

and:

$$
x=[x_1,\ldots,x_d]
$$

we calculate:

$$
\boxed{
d(q,x)=
\sqrt{
\sum_{i=1}^{d}(q_i-x_i)^2
}
}
$$

Lower distance means more similar.

---

# 11. Euclidean Example

Suppose:

```text
A = [1, 2]

B = [2, 3]
```

Then:

$$
d(A,B)
=
\sqrt{(1-2)^2+(2-3)^2}
$$

$$
=
\sqrt{1+1}
$$

$$
=
\sqrt{2}
$$

So:

```text
distance ≈ 1.414
```

---

# 12. The Important Relationship

For **unit-normalized vectors**:

$$
\|q\|=\|x\|=1
$$

we have:

$$
\|q-x\|^2
=
\|q\|^2+\|x\|^2-2q\cdot x
$$

Therefore:

$$
\|q-x\|^2
=
2-2(q\cdot x)
$$

Since:

$$
q\cdot x = \cos(q,x)
$$

we get:

$$
\boxed{
\|q-x\|^2=2-2\cos(q,x)
}
$$

Therefore:

```text
Max cosine similarity
        ⇔
Max dot product
        ⇔
Min Euclidean distance
```

when vectors are normalized.

This is a very useful mathematical equivalence.

---

# 13. Which Metric Should You Use?

For modern text embeddings:

| Metric          | Meaning                      | Typical use                                        |
| --------------- | ---------------------------- | -------------------------------------------------- |
| **Cosine**      | Angle/directional similarity | Very common for text                               |
| **Dot Product** | Alignment + magnitude        | Common with normalized embeddings / certain models |
| **Euclidean**   | Geometric distance           | Useful when model recommends it                    |

The **embedding model's recommendation should win**.

Don't choose a metric simply because:

> "Cosine is what everyone uses."

The model may have been trained/evaluated with a specific similarity function.

---

# 14. Exact Similarity Search

Now suppose we have:

```text
N = 1,000,000 vectors
```

and:

```text
d = 1536
```

The simplest algorithm is:

```text
Query
 ↓
Compare with Vector 1
 ↓
Compare with Vector 2
 ↓
Compare with Vector 3
 ↓
...
 ↓
Compare with Vector 1,000,000
 ↓
Rank results
 ↓
Top-K
```

Mathematically:

$$
s_i = similarity(q,x_i)
$$

for:

$$
i=1,\ldots,N
$$

Then select:

$$
TopK(s_1,\ldots,s_N)
$$

---

# 15. Complexity

For a dense vector:

$$
q,x \in \mathbb{R}^d
$$

one similarity calculation costs approximately:

$$
O(d)
$$

For N vectors:

$$
\boxed{O(Nd)}
$$

So:

```text
1,000 vectors
```

is easy.

But:

```text
100,000,000 vectors
```

becomes expensive.

This is why vector databases need specialized indexes.

---

# 16. Approximate Nearest Neighbor

**ANN = Approximate Nearest Neighbor**

Instead of searching every vector:

```text
100 million vectors
       ↓
compare all
       ↓
Top-K
```

we use an index:

```text
100 million vectors
       ↓
ANN Index
       ↓
Candidate region
       ↓
Similarity computation
       ↓
Top-K
```

The result is approximately nearest rather than mathematically guaranteed to be exact.

---

# 17. Why Approximation Is Worth It

Suppose exact search gives:

```text
Recall@10 = 100%
Latency = 800ms
```

ANN might give:

```text
Recall@10 = 97%
Latency = 20ms
```

For many production systems:

```text
97% recall + 20ms
```

is dramatically more useful than:

```text
100% recall + 800ms
```

This is a classic systems trade-off:

$$
\text{Recall}
\leftrightarrow
\text{Latency}
$$

---

# 18. HNSW

The most important ANN structure to learn first is:

**HNSW = Hierarchical Navigable Small World**

Instead of storing vectors as an unstructured collection, HNSW creates a graph.

Simplified:

```text
             A
            / \
           B---C
          /     \
         D-------E
                  \
                   F
```

Each vector is connected to other vectors.

Generally, nearby vectors are connected.

---

# 19. Why a Graph Helps

Suppose:

```text
Query
```

is close to:

```text
C
```

Instead of checking:

```text
A
B
C
D
E
F
G
H
...
```

we navigate through the graph:

```text
Entry
  ↓
Candidate
  ↓
Better candidate
  ↓
Even better candidate
  ↓
C
```

This drastically reduces the search space.

---

# 20. Hierarchical HNSW

HNSW isn't just one graph.

It has multiple layers:

```text
Layer 2:

        A -------- F


Layer 1:

     A ---- C ---- F
      \     |
       \    D


Layer 0:

A -- B -- C -- D -- E -- F -- G -- H
```

Higher layers:

```text
Sparse
```

Lower layers:

```text
Dense
```

Search begins at a higher layer to move quickly across the space, then descends toward lower layers for precision.

Conceptually:

```text
Top Layer
    ↓
coarse navigation
    ↓
Lower Layer
    ↓
finer navigation
    ↓
Layer 0
    ↓
nearest neighbors
```

---

# 21. HNSW Search Parameters

Three parameters are particularly important.

### M

Controls approximately how many graph connections each node maintains.

Higher:

```text
M ↑
→ more memory
→ more connections
→ potentially better recall
```

Lower:

```text
M ↓
→ less memory
→ smaller graph
→ potentially lower recall
```

---

### efConstruction

Controls effort during index construction.

Higher:

```text
efConstruction ↑
→ slower indexing
→ potentially better graph
→ better search quality
```

---

### efSearch

Controls search effort.

Higher:

```text
efSearch ↑
→ more candidates explored
→ higher recall
→ higher latency
```

So:

```text
efSearch ↑
      ↓
Recall ↑
      ↓
Latency ↑
```

This is a classic production tuning knob.

---

# 22. Top-K

Similarity search usually doesn't return everything.

Instead:

```text
Top-K
```

means:

> Return the K highest-scoring vectors.

Suppose:

```text
A → 0.97
B → 0.94
C → 0.89
D → 0.71
E → 0.43
```

If:

```text
K = 3
```

return:

```text
A
B
C
```

In RAG:

```text
Query
 ↓
Vector Search
 ↓
Top-K chunks
 ↓
LLM context
```

---

# 23. Why K Matters

Too small:

```text
K = 1
```

You might miss relevant information.

Too large:

```text
K = 100
```

you may introduce:

* irrelevant context
* duplicate information
* larger prompts
* increased latency
* increased token cost
* context dilution

Therefore:

$$
K
$$

is another retrieval parameter that needs evaluation.

---

# 24. Similarity Threshold

You can also introduce a threshold.

Suppose:

```text
A → 0.94
B → 0.91
C → 0.87
D → 0.42
E → 0.21
```

Set:

```text
threshold = 0.80
```

Then:

```text
A
B
C
```

are accepted.

D and E are rejected.

This can prevent obviously irrelevant chunks from reaching the LLM.

But be careful:

> **A fixed similarity threshold is not universally meaningful across embedding models, datasets, or query types.**

Score distributions can vary.

---

# 25. Metadata Filtering + Similarity Search

Real RAG systems often combine:

```text
Semantic Similarity
+
Metadata Filters
```

Suppose:

```json
{
  "department": "engineering",
  "year": 2026
}
```

The query:

```text
How does our authentication system work?
```

can become:

```text
Vector similarity
WHERE
department = "engineering"
AND
year = 2026
```

Conceptually:

```text
Query
 ↓
Query Vector
 ↓
Filter candidate space
 ↓
Similarity Search
 ↓
Top-K
```

This can be much better than searching your entire corpus.

---

# 26. Similarity Search Is Not Semantic Understanding

Important distinction:

```text
Embedding
```

creates a numerical representation.

```text
Similarity Search
```

compares representations.

It does **not** mean:

> "The vector database understands the question."

It performs mathematical retrieval.

The pipeline is:

```text
Text
 ↓
Embedding
 ↓
Vector
 ↓
Mathematical Similarity
 ↓
Retrieved Text
 ↓
LLM
```

The LLM is responsible for reasoning over the retrieved information.

---

# 27. Example End-to-End

Knowledge base:

```text
Chunk A:
PostgreSQL uses MVCC for concurrency control.

Chunk B:
PostgreSQL WAL provides durability.

Chunk C:
Employees receive 24 days of annual leave.

Chunk D:
The company was founded in 2019.
```

Embedding:

```text
A → Vector A
B → Vector B
C → Vector C
D → Vector D
```

Store:

```text
Vector Database
├── A
├── B
├── C
└── D
```

User:

```text
How does PostgreSQL handle concurrent transactions?
```

Query embedding:

```text
Query
 ↓
Vector Q
```

Similarity:

```text
Q ↔ A = 0.94
Q ↔ B = 0.86
Q ↔ C = 0.11
Q ↔ D = 0.04
```

Top-K:

```text
A
B
```

Retrieved context:

```text
PostgreSQL uses MVCC for concurrency control.

PostgreSQL WAL provides durability.
```

Then:

```text
Context
 ↓
LLM
 ↓
Answer
```

---

# 28. Naive Similarity Search in TypeScript

To understand the mechanics, implement it yourself once.

```typescript
type Vector = number[];

function cosineSimilarity(
  a: Vector,
  b: Vector
): number {
  if (a.length !== b.length) {
    throw new Error("Vector dimensions must match");
  }

  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];

    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return (
    dot /
    (Math.sqrt(magnitudeA) *
      Math.sqrt(magnitudeB))
  );
}
```

Now search:

```typescript
type Item = {
  id: string;
  vector: Vector;
};

function similaritySearch(
  query: Vector,
  items: Item[],
  k: number
) {
  return items
    .map((item) => ({
      ...item,
      score: cosineSimilarity(
        query,
        item.vector
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
```

Usage:

```typescript
const results = similaritySearch(
  queryVector,
  vectors,
  5
);

console.log(results);
```

This is basically:

```text
For every vector:
    calculate similarity
    attach score

Sort by score descending

Return top K
```

---

# 29. Why We Don't Use This in Production

Our implementation is approximately:

$$
O(Nd)
$$

and sorting everything adds roughly:

$$
O(N\log N)
$$

So:

```text
1,000 vectors
```

Fine.

```text
1,000,000 vectors
```

Potentially expensive.

```text
100,000,000 vectors
```

You definitely want a proper index.

That's where systems such as:

```text
HNSW
IVF
PQ
DiskANN
```

come in.

---

# 30. Best Practice for RAG

A strong baseline looks like:

```text
Document
   ↓
Structure-aware Chunking
   ↓
Embedding Model
   ↓
Vector Database
   ↓
ANN Index
   ↓
Query Embedding
   ↓
Similarity Search
   ↓
Metadata Filtering
   ↓
Top-K
   ↓
Reranking
   ↓
LLM
```

Don't immediately build an insanely complicated retrieval system.

Start with:

```text
Embedding
+
Cosine / model-recommended metric
+
HNSW
+
Top-K
```

Then measure.

---

# 31. The Most Important Parameters

When tuning similarity search, pay attention to:

| Parameter            | Controls                   |
| -------------------- | -------------------------- |
| **Metric**           | How similarity is measured |
| **K**                | Number of retrieved chunks |
| **Threshold**        | Minimum acceptable score   |
| **Index type**       | Search strategy            |
| **efSearch**         | HNSW search effort         |
| **M**                | HNSW graph connectivity    |
| **Metadata filters** | Candidate restriction      |

These parameters affect:

$$
\text{Recall}
$$

$$
\text{Precision}
$$

$$
\text{Latency}
$$

$$
\text{Memory}
$$

and:

$$
\text{Cost}
$$

---

# 32. Similarity Search vs Reranking

Don't confuse these.

### Similarity Search

Fast first-stage retrieval:

```text
1,000,000 chunks
      ↓
ANN
      ↓
Top 50
```

### Reranking

More expensive second-stage ranking:

```text
Top 50
  ↓
Reranker
  ↓
Top 5
```

So a production retrieval pipeline often looks like:

```text
1,000,000
     ↓
Vector Search
     ↓
50 candidates
     ↓
Reranker
     ↓
5 candidates
     ↓
LLM
```

This is called **two-stage retrieval**.

We'll study reranking separately.

---

# 33. The Core Mental Model

Remember this:

```text
                    VECTOR SPACE

          ● Chunk A
         /
        /
       ● Query
        \
         \
          ● Chunk B


Query Vector
     ↓
Similarity Function
     ↓
Rank stored vectors
     ↓
Top-K
```

The entire mathematical problem is essentially:

$$
\boxed{
TopK_{x\in D}\; similarity(q,x)
}
$$

Everything else is about doing this **quickly, accurately, and at scale**.

---

# 34. What You Should Remember

**1. Vector**

```text
Numerical representation
```

**2. Similarity**

```text
Measure how close two representations are
```

**3. Similarity Search**

```text
Find the most similar stored vectors to a query vector
```

**4. Exact Search**

```text
Compare against everything
```

**5. ANN**

```text
Search intelligently without examining everything
```

**6. HNSW**

```text
Graph-based ANN index
```

**7. Top-K**

```text
Return K best candidates
```

**8. RAG**

```text
Query
 ↓
Embedding
 ↓
Similarity Search
 ↓
Relevant Chunks
 ↓
Reranking
 ↓
LLM
```

The key transition is:

> **Embeddings turn text into points in a vector space. Similarity search turns those points into retrieval.**

Once you understand **cosine/dot-product geometry + exact search + ANN + HNSW + Top-K**, you understand the core mechanics behind modern vector retrieval rather than just knowing how to call a vector DB API.
