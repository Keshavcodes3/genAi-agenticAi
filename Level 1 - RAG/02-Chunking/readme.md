# Chunking in RAG

Chunking is the **first serious engineering decision in a RAG pipeline**.

You already understand the basic RAG flow:

```text
Documents
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Database
   ↓
Query → Embedding
   ↓
Similarity Search
   ↓
Relevant Chunks
   ↓
LLM
   ↓
Answer
```

The important part is this:

> **We don't embed entire documents. We split them into meaningful pieces so retrieval can find the smallest useful context.**

---

# 1. What Exactly Is Chunking?

Suppose you have a 100-page company handbook.

Inside it:

```text
Page 1: Company Introduction
Page 2: CEO
Page 3: Leave Policy
Page 4: Remote Work
...
Page 80: Security
...
```

If the user asks:

> "Who is the current CEO?"

You don't want retrieval to return the entire 100-page document.

You want something like:

```text
Chunk 17

Leadership

The current CEO of Acme Corp is Sarah Johnson.
She joined the company in 2022...
```

That chunk gets embedded and stored in your vector database.

Then:

```text
Query:
"Who is the current CEO?"

        ↓

Query embedding

        ↓

Vector similarity search

        ↓

Chunk 17
```

That's the fundamental purpose of chunking.

---

# 2. Why Not Just Embed the Entire Document?

Because embeddings represent **semantic meaning**.

Imagine:

```text
Document = 100,000 tokens
```

It contains:

```text
CEO
Leave policy
Engineering architecture
Finance
Security
HR
Legal
...
```

Its embedding becomes a representation of the **whole semantic mixture**.

Now query:

```text
"How many paid leaves do employees get?"
```

The document embedding isn't specifically optimized around the leave-policy section.

You have created a retrieval unit that's far too coarse.

---

# 3. The Core Chunking Trade-off

Chunk size creates a fundamental trade-off:

```text
              Too Small
                 ↓
        Lost contextual meaning
                 ↓
              Retrieval
               quality
                 ↑
              Too Large
                 ↓
       Unnecessary information
                 ↓
          Context pollution
```

More formally, suppose a document is partitioned into chunks:

$$
D = C_1 \cup C_2 \cup ... \cup C_n
$$

Your retrieval system tries to find:

$$
C^* = \arg\max_{C_i} similarity(q, C_i)
$$

The quality of your system therefore depends heavily on whether \(C_i\) represents a **coherent semantic unit**.

---

# 4. The Most Important Principle

Don't think:

> "How many characters should my chunk contain?"

Think:

> **"What is the smallest self-contained piece of information that can answer a question?"**

That's the better mental model.

For example:

```text
Bad chunk:

"The company provides several benefits. Employees receive
health insurance. The company also has offices in..."

```

versus:

```text
Good chunk:

"### Paid Leave

Employees receive 24 days of paid leave per calendar year.
Unused leave can be carried forward up to 12 days."
```

The second chunk has a much stronger semantic identity.

---

# 5. Common Chunking Techniques

There isn't one universal "best" algorithm.

There is a hierarchy.

## 5.1 Fixed-Size Chunking

The simplest approach.

```text
Document
──────────────────────────────────────>

[ 500 tokens ]

               [ 500 tokens ]

                              [ 500 tokens ]
```

Example:

```typescript
function chunkText(text: string, size = 500): string[] {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
}
```

### Advantages

* Extremely simple
* Fast
* Predictable
* Good baseline

### Problems

You can cut sentences in half:

```text
Chunk A:

"The database uses WAL to guarantee durability. Transactions
are committed only after the log record has been flushed to"

Chunk B:

"disk. This means..."
```

Now Chunk B has lost important context.

---

# 6. Sentence-Based Chunking

Instead of blindly cutting every N characters, split on sentences.

```text
Sentence 1
Sentence 2
Sentence 3
Sentence 4
Sentence 5
```

Then group sentences together until the desired size is reached.

Example:

```typescript
function sentenceChunk(
  sentences: string[],
  maxCharacters = 2000
): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (
      current.length + sentence.length > maxCharacters &&
      current.length > 0
    ) {
      chunks.push(current);
      current = "";
    }

    current += sentence + " ";
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}
```

Much better than raw character splitting.

---

# 7. Recursive Character Splitting

This is one of the **best general-purpose baselines**.

Instead of saying:

> "Split every 1000 characters."

we give the algorithm a hierarchy of separators.

For example:

```text
Paragraph
    ↓
Sentence
    ↓
Word
    ↓
Character
```

Conceptually:

```text
["\n\n", "\n", ". ", " ", ""]
```

Meaning:

```text
Try paragraph boundaries first.

If chunks are still too large,
try line boundaries.

If still too large,
try sentence boundaries.

If still too large,
try word boundaries.

Finally,
split characters.
```

This preserves natural structure as much as possible.

---

# 8. Example

Suppose:

```text
# Database Architecture

PostgreSQL uses MVCC for concurrency control.

Each transaction gets a snapshot of the database.

The WAL provides durability by recording changes
before data pages are flushed.

# Replication

PostgreSQL supports streaming replication...
```

A naive splitter might produce:

```text
Chunk 1:
# Database Architecture

PostgreSQL uses MVCC...

Chunk 2:
Each transaction gets a snapshot...

Chunk 3:
The WAL provides durability...
```

But recursive splitting can preserve larger semantic units:

```text
Chunk 1:

# Database Architecture

PostgreSQL uses MVCC for concurrency control.

Each transaction gets a snapshot of the database.

The WAL provides durability by recording changes
before data pages are flushed.
```

Then:

```text
Chunk 2:

# Replication

PostgreSQL supports streaming replication...
```

That's much better for retrieval.

---

# 9. Overlap

Now we hit an important concept.

Suppose:

```text
Chunk A
────────────────────────────
PostgreSQL uses MVCC...

Each transaction gets a snapshot
of the database.
────────────────────────────

Chunk B
────────────────────────────
The snapshot determines which rows
are visible to the transaction.

The WAL provides durability...
────────────────────────────
```

There is a contextual discontinuity.

We can introduce **overlap**:

```text
Chunk A
────────────────────────────
PostgreSQL uses MVCC...

Each transaction gets a snapshot
of the database.
────────────────────────────

Chunk B
────────────────────────────
Each transaction gets a snapshot
of the database.

The snapshot determines which rows
are visible...
────────────────────────────
```

Now:

```text
Chunk size = 500 tokens
Overlap = 50 tokens
```

---

# 10. Why Overlap Exists

Imagine the information boundary:

```text
Sentence A
Sentence B
Sentence C
Sentence D
Sentence E
```

Your splitter creates:

```text
Chunk 1:
A B C

Chunk 2:
D E
```

But suppose:

```text
C → D
```

contains an important relationship.

Without overlap:

```text
C | D
```

the relationship is broken.

With overlap:

```text
Chunk 1:
A B C D

Chunk 2:
C D E
```

Retrieval can recover the relationship.

---

# 11. How Much Overlap?

Don't blindly use 50%.

Typical starting point:

```text
Chunk size: 500–1000 tokens
Overlap:    10–20%
```

For example:

```text
800-token chunk
+
100-token overlap
```

The correct value depends on your document structure.

### Too little

```text
Context gets fragmented
```

### Too much

```text
Duplicate embeddings
       ↓
More storage
       ↓
More retrieval redundancy
       ↓
Higher embedding cost
```

---

# 12. Semantic Chunking

Now we get into more advanced territory.

Instead of:

```text
Every 500 tokens
```

we ask:

> **Where does the meaning of the document change?**

Suppose:

```text
Paragraph A
Paragraph B
Paragraph C
```

Embeddings can be generated for paragraphs:

$$
e_1, e_2, e_3
$$

Then calculate semantic similarity:

$$
sim(e_i,e_{i+1})
$$

If:

$$
sim(e_i,e_{i+1}) \ll threshold
$$

we assume there's a semantic boundary.

Example:

```text
Paragraph 1 → Paragraph 2
similarity = 0.92

Paragraph 2 → Paragraph 3
similarity = 0.89

Paragraph 3 → Paragraph 4
similarity = 0.31   ← boundary
```

So:

```text
Chunk A
────────────
Paragraph 1
Paragraph 2
Paragraph 3
────────────

Chunk B
────────────
Paragraph 4
Paragraph 5
────────────
```

This can produce better semantic units.

---

# 13. Structure-Aware Chunking

For real production systems, this is often more important than fancy semantic algorithms.

Different documents have different structures.

### Markdown

Use:

```text
# Heading
## Heading
### Heading
Paragraph
Code block
List
```

### HTML

Use:

```text
<header>
<section>
<article>
<h1>
<h2>
<p>
```

### Code

Use:

```text
file
  ↓
class
  ↓
method
  ↓
function
```

### PDFs

Use:

```text
page
  ↓
section
  ↓
paragraph
  ↓
table
```

You don't want to randomly split a function in half.

---

# 14. Code Chunking Is Different

Suppose the document contains:

```typescript
class UserService {
  async createUser(data: CreateUserInput) {
    const user = await this.repository.create(data);

    await this.events.publish({
      type: "USER_CREATED",
      userId: user.id
    });

    return user;
  }
}
```

Bad chunking:

```text
class UserService {
  async createUser(...)
```

and:

```text
const user = await this.repository.create(data);

...
```

You destroyed the semantic unit.

Better:

```text
Chunk:

class UserService {
  async createUser(...) {
    ...
  }
}
```

**AST-aware chunking** is therefore preferable for codebases.

---

# 15. Parent-Child Chunking

Here's a more sophisticated architecture.

Suppose:

```text
Parent chunk
────────────────────────────
Database Transactions
────────────────────────────

Child 1
MVCC

Child 2
Isolation levels

Child 3
Write-ahead logging

Child 4
Deadlocks
```

We embed the children:

```text
embedding(child1)
embedding(child2)
embedding(child3)
embedding(child4)
```

But retain:

```text
parent_id
```

When retrieval finds:

```text
Child 3
```

we can fetch the larger parent context:

```text
Database Transactions
+
Write-ahead logging
```

This gives you:

```text
Precise retrieval
        +
Rich context
```

Very useful for sophisticated RAG systems.

---

# 16. Contextual Chunking

Another advanced technique is adding context to each chunk.

Original:

```text
The company introduced this policy in 2024.
```

By itself, this is terrible.

Contextualized:

```text
Document: Acme Employee Handbook
Section: Remote Work Policy

The company introduced this remote-work policy in 2024.
```

Now the embedding has much more information.

This is especially useful when chunks are ambiguous outside their parent section.

---

# 17. Metadata Is Part of Chunking

Don't store only:

```json
{
  "text": "Employees receive 24 days of leave..."
}
```

Store something like:

```json
{
  "text": "Employees receive 24 days of leave...",
  "documentId": "handbook-2026",
  "section": "Leave Policy",
  "page": 42,
  "chunkIndex": 17,
  "parentId": "leave-policy",
  "tokens": 183
}
```

This becomes extremely powerful later.

You can perform:

```text
Vector similarity
+
Metadata filtering
+
Keyword search
+
Reranking
```

instead of relying entirely on embeddings.

---

# 18. The Best General-Purpose Strategy

If you're building your first serious RAG system, I'd use:

```text
              Document
                 │
                 ▼
        Document-aware parser
                 │
                 ▼
        Structure-aware split
                 │
                 ▼
       Recursive chunking
                 │
                 ▼
        Token-based sizing
                 │
                 ▼
          Small overlap
                 │
                 ▼
        Metadata enrichment
                 │
                 ▼
            Embeddings
```

Not:

```text
Document
   ↓
slice(0, 500)
slice(500, 1000)
slice(1000, 1500)
```

😄

---

# 19. Recommended Starting Configuration

For general documents:

| Parameter          |                    Starting point |
| ------------------ | --------------------------------: |
| Chunk size         |                    500–800 tokens |
| Overlap            |                            10–15% |
| Split strategy     |                         Recursive |
| Primary boundaries | Sections → paragraphs → sentences |
| Metadata           |                               Yes |
| Parent/child       |                             Later |
| Semantic chunking  |                             Later |
| Reranking          |                             Later |

But these aren't laws of physics.

The correct chunk size is an **empirical parameter**.

---

# 20. Chunking Should Be Evaluated

This is where RAG becomes engineering rather than "throw embeddings at it."

Suppose you have:

```text
100 questions
```

with known relevant chunks.

Define retrieval recall:

$$
Recall@k =
\frac{
\#\text{queries where relevant chunk appears in top-k}
}{
\#\text{queries}
}
$$

For example:

```text
100 questions

Top-5 retrieved relevant chunk:
87 times
```

Then:

$$
Recall@5 = 0.87
$$

Now test:

```text
300 tokens
500 tokens
800 tokens
1200 tokens
```

You might discover:

```text
300 → Recall@5 = 0.72
500 → Recall@5 = 0.84
800 → Recall@5 = 0.91
1200 → Recall@5 = 0.86
```

Therefore:

```text
800 tokens
```

is better **for your corpus**.

That's the correct way to determine chunk size.

---

# 21. Chunking Failure Modes

## Failure 1: Chunks Too Small

```text
"PostgreSQL uses"

"MVCC"

"for concurrency"

"control."
```

The embedding contains almost no useful semantic context.

---

## Failure 2: Chunks Too Large

```text
CEO
HR
Leave
Security
Database
Finance
Legal
...
```

Retrieval returns enormous irrelevant contexts.

---

## Failure 3: Broken Semantic Boundaries

```text
Chunk A:
The company allows employees to work remotely up to

Chunk B:
three days per week.
```

Terrible.

---

## Failure 4: Missing Metadata

You retrieve:

```text
"Employees receive 24 days..."
```

But don't know:

```text
Which document?
Which section?
Which page?
Which version?
```

Bad production design.

---

## Failure 5: Ignoring Document Structure

A PDF:

```text
Chapter
  ├── Section
  │    ├── Paragraph
  │    └── Table
```

shouldn't necessarily become:

```text
random 700-token slices
```

---

# 22. A Good TypeScript Chunker

Here's the version I'd start with for our project.

```typescript
type Chunk = {
  id: string;
  documentId: string;
  content: string;
  index: number;
  metadata: {
    section?: string;
    page?: number;
    tokenCount: number;
  };
};

type ChunkOptions = {
  maxChars?: number;
  overlapChars?: number;
};

export function chunkText(
  text: string,
  documentId: string,
  options: ChunkOptions = {}
): Chunk[] {
  const {
    maxChars = 4000,
    overlapChars = 500,
  } = options;

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: Chunk[] = [];

  let current = "";
  let index = 0;

  for (const paragraph of paragraphs) {
    if (
      current.length + paragraph.length + 2 <= maxChars
    ) {
      current += current
        ? `\n\n${paragraph}`
        : paragraph;

      continue;
    }

    if (current) {
      chunks.push({
        id: `${documentId}-${index}`,
        documentId,
        content: current,
        index,
        metadata: {
          tokenCount: estimateTokens(current),
        },
      });

      index++;
    }

    const overlap = current.slice(-overlapChars);

    current = `${overlap}\n\n${paragraph}`;
  }

  if (current.trim()) {
    chunks.push({
      id: `${documentId}-${index}`,
      documentId,
      content: current.trim(),
      index,
      metadata: {
        tokenCount: estimateTokens(current),
      },
    });
  }

  return chunks;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
```

This isn't our final production chunker.

It's a **clean baseline**.

---

# 23. One Important Correction

Don't use:

```typescript
text.length / 4
```

as your actual production token counter.

That's merely an approximation.

Real token counts depend on the tokenizer of the model you're using.

For example:

```text
"distributed systems"
```

doesn't necessarily correspond to:

```text
20 characters / 4 = 5 tokens
```

The real tokenizer determines the count.

For production:

```text
text
 ↓
model tokenizer
 ↓
exact token count
```

---

# 24. Our Chunking Architecture

When we actually build the project, I'd structure it roughly like:

```text
src/
├── ingestion/
│   ├── loaders/
│   │   ├── pdf.loader.ts
│   │   ├── markdown.loader.ts
│   │   └── text.loader.ts
│   │
│   ├── parsers/
│   │   └── document.parser.ts
│   │
│   ├── chunking/
│   │   ├── chunker.ts
│   │   ├── recursive-chunker.ts
│   │   ├── semantic-chunker.ts
│   │   └── types.ts
│   │
│   └── pipeline.ts
│
└── ...
```

And the abstraction:

```typescript
interface Chunker {
  chunk(document: Document): Chunk[];
}
```

Then:

```typescript
class RecursiveChunker implements Chunker {
  chunk(document: Document): Chunk[] {
    // ...
  }
}

class SemanticChunker implements Chunker {
  chunk(document: Document): Chunk[] {
    // ...
  }
}
```

Now you can benchmark:

```text
RecursiveChunker
        vs
SemanticChunker
        vs
FixedChunker
```

without rewriting the ingestion pipeline.

---

# 25. What I'd Actually Use

For our learning project, let's progress like this:

```text
LEVEL 1
Fixed-size chunking
        ↓
LEVEL 2
Sentence / paragraph chunking
        ↓
LEVEL 3
Recursive chunking
        ↓
LEVEL 4
Overlap
        ↓
LEVEL 5
Metadata
        ↓
LEVEL 6
Structure-aware chunking
        ↓
LEVEL 7
Semantic chunking
        ↓
LEVEL 8
Parent-child retrieval
        ↓
LEVEL 9
Contextual chunking
        ↓
LEVEL 10
Evaluate everything
```

And **don't jump straight to semantic chunking**.

You want to understand *why* each layer exists.

---

# 26. The Mental Model to Keep

Think of chunking as creating the **addressable memory cells** of your RAG system.

Your original document:

```text
┌─────────────────────────────────────┐
│          HUGE DOCUMENT              │
│                                     │
│ CEO                                 │
│ HR                                  │
│ Leave                               │
│ Engineering                         │
│ Security                            │
│ Finance                             │
│ ...                                 │
└─────────────────────────────────────┘
```

becomes:

```text
┌──────────────┐
│ CEO          │ ← embedding
└──────────────┘

┌──────────────┐
│ Leave Policy │ ← embedding
└──────────────┘

┌──────────────┐
│ Security     │ ← embedding
└──────────────┘

┌──────────────┐
│ Finance      │ ← embedding
└──────────────┘
```

Then:

```text
User Query
    │
    ▼
Embedding
    │
    ▼
Vector Space
    │
    ├── CEO chunk       0.91
    ├── Leave chunk     0.34
    ├── Security chunk  0.27
    └── Finance chunk   0.19
    │
    ▼
Retrieve CEO chunk
```

**That is chunking's entire job:**

> Turn an unstructured document into semantically useful, independently retrievable units without destroying the context required to understand them.

And that's why **"500 characters per chunk" isn't really a chunking strategy**. It's just a slicing strategy. The interesting engineering starts when you make chunk boundaries respect the information structure of the corpus.
