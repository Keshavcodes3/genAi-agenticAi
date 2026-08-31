# Embeddings in RAG

**Embedding** is the process of converting text into a **dense numerical vector** that captures its semantic meaning.

In RAG:

**Chunking** answers:

> **What pieces of information should we store?**

**Embeddings** answer:

> **How do we represent those pieces so we can retrieve them semantically?**

---

## 1. Basic Flow

```text
Document
   ↓
Chunking
   ↓
Chunks
   ↓
Embedding Model
   ↓
Vectors
   ↓
Vector Database
```

At query time:

```text
User Query
   ↓
Embedding Model
   ↓
Query Vector
   ↓
Vector Search
   ↓
Top-K Relevant Chunks
```

---

## 2. What Is an Embedding?

Suppose we have a chunk:

```text
PostgreSQL uses MVCC to provide transaction isolation
and allow concurrent transactions to operate safely.
```

An embedding model converts it into something like:

```text
[
  0.021,
 -0.183,
  0.742,
  0.091,
  ...
  0.334
]
```

Mathematically:

**f(text) → ℝᵈ**

where:

* **f** = embedding model
* **d** = embedding dimension
* **ℝᵈ** = d-dimensional vector space

For example:

```text
f(text) → ℝ¹⁵³⁶
```

means the model produces a vector with **1536 dimensions**.

---

## 3. Why Do We Need Embeddings?

Suppose our knowledge base contains:

```text
Chunk A:
PostgreSQL uses MVCC for concurrency control.

Chunk B:
Employees receive 24 days of paid leave.

Chunk C:
PostgreSQL uses WAL to guarantee durability.
```

The user asks:

```text
How does PostgreSQL handle concurrent transactions?
```

A keyword search might focus on exact words.

But embeddings allow us to retrieve based on **semantic similarity**.

The query becomes:

```text
Query
 ↓
Embedding Model
 ↓
[0.02, -0.18, 0.71, ...]
```

Then the vector database compares it with stored vectors:

```text
Chunk A → 0.94
Chunk B → 0.12
Chunk C → 0.81
```

Therefore:

```text
Chunk A
   ↓
Highest semantic similarity
   ↓
Retrieved
```

---

## 4. The Vector Space

Think of every piece of text as being mapped to a point in a high-dimensional space.

Conceptually:

```text
                    Database
                       ●
                      /
                     /
             PostgreSQL
                  ●
                   \
                    ● Transactions


                                      ● Vacation
```

Semantically related text tends to occupy nearby regions.

For example:

```text
"Postgres concurrency"
```

can be close to:

```text
"MVCC transaction isolation"
```

even though the exact words aren't identical.

That's the fundamental power of embeddings.

---

## 5. Embeddings Are Not Keyword Search

Consider:

```text
Query:
How does Postgres handle simultaneous transactions?
```

Document:

```text
PostgreSQL uses MVCC to provide transaction isolation.
```

There isn't strong lexical overlap.

But semantically:

```text
simultaneous transactions
        ↓
concurrency

transaction isolation
        ↓
concurrent transaction handling
```

An embedding model can represent these relationships in vector space.

---

## 6. Similarity

Once we have:

```text
Query Vector
```

and:

```text
Document Vector
```

we need a way to measure how close they are.

One common metric is **cosine similarity**.

Given:

```text
q = query vector

c = chunk vector
```

we calculate:

**cos(q,c) = (q · c) / (||q|| ||c||)**

where:

* **q · c** = dot product
* **||q||** = magnitude of q
* **||c||** = magnitude of c

The value is generally between:

```text
-1 ←──────────────→ 1
```

Higher similarity generally means the vectors are more semantically aligned.

---

## 7. Simple Example

Suppose:

```text
A = [1, 2]
B = [2, 4]
```

Both vectors point in the same direction.

Therefore:

```text
cos(A, B) = 1
```

Their magnitudes are different, but their direction is identical.

That's why cosine similarity is useful for comparing embeddings.

---

## 8. Embedding vs LLM

These are different components.

|                          | **LLM**                | **Embedding Model**        |
| ------------------------ | ---------------------- | -------------------------- |
| Input                    | Text                   | Text                       |
| Output                   | Text / tokens          | Vector                     |
| Primary purpose          | Generation / reasoning | Representation / retrieval |
| Used for retrieval       | Usually indirectly     | Yes                        |
| Produces semantic vector | No                     | Yes                        |

LLM:

```text
Text
 ↓
Model
 ↓
Generated Text
```

Embedding model:

```text
Text
 ↓
Model
 ↓
Vector
```

---

## 9. What Happens Inside an Embedding Model?

At a high level:

```text
Text
 ↓
Tokenizer
 ↓
Token IDs
 ↓
Transformer
 ↓
Hidden Representations
 ↓
Pooling / Projection
 ↓
Embedding Vector
```

For:

```text
"PostgreSQL uses MVCC"
```

the tokenizer converts the text into tokens.

The transformer processes those tokens and their relationships.

Eventually we obtain:

```text
[-0.021, 0.183, 0.742, ...]
```

That vector is what we store.

---

## 10. Embeddings Are Distributed Representations

Don't think:

```text
dimension 37 = database
dimension 812 = concurrency
dimension 1401 = JavaScript
```

Modern embedding representations generally don't work like that.

Meaning is **distributed across many dimensions**.

Conceptually:

**Vector = [x₁, x₂, ..., xᵈ]**

The semantic information emerges from the overall configuration of the vector.

---

## 11. Document Embeddings

During ingestion:

```text
Document
   ↓
Chunking
   ↓
Chunk 1
Chunk 2
Chunk 3
...
   ↓
Embedding Model
   ↓
Vector 1
Vector 2
Vector 3
...
```

For example:

```typescript
const chunks = [
  "PostgreSQL uses MVCC for concurrency control.",
  "Employees receive 24 days of paid leave.",
  "PostgreSQL uses WAL for durability."
];

const vectors = await embeddings.embedDocuments(chunks);
```

Conceptually:

```text
Chunk 1 → [0.12, -0.42, 0.81, ...]
Chunk 2 → [0.72, 0.03, -0.11, ...]
Chunk 3 → [0.21, -0.37, 0.76, ...]
```

These vectors are then stored in the vector database.

---

## 12. Query Embedding

At query time, we embed the user's question too.

```typescript
const queryVector = await embeddings.embedQuery(
  "How does PostgreSQL handle concurrency?"
);
```

Now we have:

```text
User Query
   ↓
Embedding Model
   ↓
Query Vector
```

Then:

```text
Query Vector
      ↓
Vector Database
      ↓
Similarity Search
      ↓
Top-K Chunks
```

---

## 13. Same Vector Space

Generally, the query and documents need to be represented in a **compatible embedding space**.

Conceptually:

```text
Document
   ↓
Embedding Model
   ↓
Vector Space
```

and:

```text
Query
   ↓
Embedding Model
   ↓
Same / Compatible Vector Space
```

Then we can calculate:

```text
similarity(queryVector, documentVector)
```

You cannot casually mix unrelated embedding models.

For example:

```text
Documents → Model A
Queries   → Model B
```

doesn't generally produce meaningful similarity.

If you change embedding models, you typically need to **re-embed your corpus**.

---

## 14. Embedding Dimension

Different models produce different dimensions.

For example:

```text
Model A → 768 dimensions
Model B → 1536 dimensions
Model C → 3072 dimensions
```

Your vector database needs to know the expected dimension.

If your index expects:

```text
1536
```

you can't simply insert:

```text
768-dimensional vector
```

The dimensionality is part of the vector schema.

---

## 15. Vector Database

Suppose we have:

```text
1,000,000 chunks
```

Each chunk has:

```text
{
  content,
  embedding,
  metadata
}
```

Conceptually:

```text
┌──────────────────────────────────────┐
│ Vector Database                      │
├──────────────────────────────────────┤
│ Chunk A → [0.12, -0.42, ...]        │
│ Chunk B → [0.72,  0.03, ...]        │
│ Chunk C → [0.21, -0.37, ...]        │
│ ...                                  │
│ Chunk N → [...]                      │
└──────────────────────────────────────┘
```

At query time:

```text
Query Vector
      ↓
Vector Index
      ↓
Nearest Vectors
      ↓
Top-K Chunks
```

---

## 16. Exact Search

The simplest approach is to compare the query against every vector.

If:

* **N** = number of vectors
* **d** = embedding dimension

then the naive search is approximately:

**O(Nd)**

For:

```text
N = 1,000,000
d = 1536
```

we have a very large amount of computation per query.

That's why production vector databases use **Approximate Nearest Neighbor (ANN)** indexes.

---

## 17. ANN

Instead of searching every vector:

```text
1,000,000 vectors
        ↓
Search everything
        ↓
Top-K
```

an ANN index tries to efficiently locate promising regions:

```text
1,000,000 vectors
        ↓
ANN Index
        ↓
Candidate vectors
        ↓
Top-K
```

Common ANN techniques include:

* **HNSW**
* **IVF**
* **Product Quantization**
* **DiskANN**

We'll go deep into these later because this is where vector search starts becoming an interesting systems problem.

---

## 18. HNSW Mental Model

HNSW builds a graph over vectors.

Very simplified:

```text
                 A
                / \
               /   \
              B-----C
             /       \
            D---------E
```

Each vector has connections to nearby vectors.

Search starts from an entry point and navigates the graph toward increasingly similar vectors.

Conceptually:

```text
Query
 ↓
Entry Point
 ↓
Nearby candidates
 ↓
Better candidates
 ↓
Even better candidates
 ↓
Top-K
```

Instead of comparing against every vector.

---

## 19. Metadata

Don't store only:

```json
{
  "text": "Employees receive 24 days of paid leave."
}
```

Store useful metadata too:

```json
{
  "text": "Employees receive 24 days of paid leave.",
  "documentId": "handbook-2026",
  "section": "Leave Policy",
  "page": 42,
  "chunkIndex": 17,
  "tokenCount": 183
}
```

This allows us to combine:

```text
Semantic Search
+
Metadata Filtering
+
Keyword Search
+
Reranking
```

instead of relying purely on vector similarity.

---

## 20. Normalization

Sometimes vectors are normalized:

**x̂ = x / ||x||**

Then:

**||x̂|| = 1**

For normalized vectors:

**x̂ · ŷ = cos(x,y)**

So cosine similarity becomes equivalent to dot product.

Whether you should normalize depends on the embedding model and vector database configuration.

**Don't normalize blindly.**

---

## 21. Embedding and Chunking Are Coupled

This is one of the most important ideas.

Retrieval quality isn't simply:

```text
Embedding Quality
```

It depends on several components:

**RetrievalQuality = f(Chunking, Embedding, Index, Query, Reranker)**

For example:

```text
500-token chunks
+
Embedding Model A
```

might perform better than:

```text
1000-token chunks
+
Embedding Model A
```

But another embedding model might change the result.

Therefore:

```text
Chunk
 ↓
Embed
 ↓
Retrieve
 ↓
Evaluate
 ↓
Change
 ↓
Evaluate again
```

is the correct engineering loop.

---

## 22. Don't Assume Bigger Embeddings Are Better

For example:

```text
768 dimensions
```

isn't automatically worse than:

```text
3072 dimensions
```

You have to consider:

* Retrieval quality
* Latency
* Storage
* Index size
* Memory consumption
* Cost
* Domain performance

For N vectors and dimension d, raw vector storage is roughly:

**Storage ≈ N × d × bytes_per_dimension**

For FP32:

**Storage ≈ N × d × 4 bytes**

So increasing dimensionality has a direct storage and memory cost.

---

## 23. Embedding Model Selection

When selecting an embedding model, evaluate:

* **Retrieval quality**
* **Domain-specific performance**
* **Multilingual capability**
* **Context length**
* **Embedding dimension**
* **Latency**
* **Cost**
* **Self-hosting requirements**
* **License**
* **Query/document encoding behavior**

Don't select a model simply because:

```text
"it has the biggest vector."
```

The vector's dimensionality isn't a quality score.

---

## 24. Complete RAG Pipeline So Far

You now have:

```text
                 INGESTION
                     │
                     ▼
                 Document
                     │
                     ▼
                  Parsing
                     │
                     ▼
                 Chunking
                     │
                     ▼
                   Chunks
                     │
                     ▼
                Embeddings
                     │
                     ▼
               Vector Database
                     │
                     │
                     │
                 RETRIEVAL
                     │
                     ▼
                 User Query
                     │
                     ▼
                Query Embedding
                     │
                     ▼
                 Query Vector
                     │
                     ▼
                Vector Search
                     │
                     ▼
                  Top-K
                     │
                     ▼
               Relevant Chunks
```

Then later:

```text
Relevant Chunks
      ↓
Reranking
      ↓
Context Construction
      ↓
LLM
      ↓
Answer
```

---

# 25. The Mental Model

Remember these three layers:

```text
CHUNKING
"What information should I store?"
        ↓
EMBEDDING
"How do I represent that information
 in semantic vector space?"
        ↓
VECTOR SEARCH
"Which stored vectors are closest
 to this query?"
```

Or even simpler:

```text
Document
   ↓
Chunks
   ↓
Vectors
   ↓
Index
   ↓
Query Vector
   ↓
Nearest Vectors
   ↓
Relevant Chunks
```

The most important distinction:

**Embedding ≠ Vector Search**

Embedding performs:

```text
text → vector
```

Vector search performs:

```text
query vector → nearest vectors
```

And **RAG combines both** to turn your document collection into something the LLM can retrieve from intelligently.
