# 📚 LEVEL 1 — RAG

>01 — WTF IS RAG?

From absolute scratch → production mental model

```

Goal: By the end of this chapter, you should understand why RAG exists, what problem it solves, how the pipeline works, what each component does, what can go wrong, and how modern RAG systems are architected.
```

```

We will not dive deeply into chunking, embeddings, vector DB internals, or retrieval algorithms yet. Those are the next chapters. Here we build the mental model that makes all of them make sense.

```

# 0. The one-sentence definition

```
RAG (Retrieval-Augmented Generation) is an architecture where an AI system retrieves relevant external information and gives that information to an LLM before generating its answer.
```

```
RAG (Retrieval-Augmented Generation) is an architecture where an AI system retrieves relevant external information and gives that information to an LLM before generating its answer.
```

In its simplest form:

```

User Question
      ↓
Retrieve relevant information
      ↓
Give information to LLM
      ↓
Generate answer

```

Or mathematically:

$$ \boxed{ Answer = LLM(Query + RetrievedContext) } $$

That's the entire idea.

Everything else is engineering around making those three things work well.

# 1. Why the hell do we need RAG?

Let's start with the actual problem.

Suppose you have an LLM.

```
User
  ↓
LLM
  ↓
Answer
```

You ask:

>Who was the first person to walk on the Moon?

Easy.

The model has likely learned this during training.

But now ask:

```

According to my company's 2026 employee handbook, how many days of parental leave do employees receive?
```

Different problem.

The answer exists inside:

company-handbook.pdf

The model doesn't automatically have access to that file.

So:

```
                  ┌───────────────┐
                  │ Company Docs  │
                  └───────┬───────┘
                          │
                          ?
                          │
User ───────→ LLM ────────┘
                │
                ↓
           "I don't know"
```

We need a mechanism that can fetch the relevant information.

That's where RAG enters.

```

User
 │
 │ "How many parental leave days?"
 ▼
RAG
 │
 │ searches company documents
 ▼
Relevant information
 │
 ▼
LLM
 │
 ▼
"Employees receive X days..."
```

# 2. The fundamental distinction

This is the most important concept in this entire chapter.

An LLM has:

Parametric knowledge

Knowledge encoded inside its learned parameters.

Think:

```


Model
 │
 ├── weights
 ├── neural network
 └── learned representations


```

During training, the model learns patterns from enormous amounts of data.

That knowledge becomes part of the model parameters.

We can roughly represent the model as:

$$ P(y|x;\theta) $$

where:

\(x\) = input
</br>
\(y\) = output
</br>
\(theta\) = learned model parameters

But your application's knowledge is often not inside \(\theta\).

# 3. External knowledge

Your application might have:

```

📄 PDFs
📄 Markdown
📄 Notion pages
📄 GitHub repositories
📄 Database records
📄 Customer tickets
📄 Product documentation
📄 Internal APIs
📄 Websites
📄 Emails
```

This is external knowledge.

RAG connects the model to that knowledge.

```

             MODEL
               │
               │
               ▼
        ┌─────────────┐
        │     LLM     │
        └──────┬──────┘
               │
               │
               ▼
        ┌─────────────┐
        │     RAG     │
        └──────┬──────┘
               │
               ▼
       External Knowledge
```

# 4. RAG vs training

This distinction causes a lot of confusion.

Suppose you have:

knowledge.txt

and want the model to answer questions from it.

You have two broad strategies.

Strategy A: Train/fine-tune the model

You modify the model's learned parameters.

```
Data
 ↓
Training
 ↓
Model parameters
 ↓
LLM

```

Strategy B: RAG

You leave the model alone.

Instead:

```

Data
 ↓
Index
 ↓
Search
 ↓
Relevant data
 ↓
LLM context
```

So RAG doesn't fundamentally teach the model new knowledge.

It retrieves knowledge when needed.

# 5. A useful analogy

Imagine an extremely intelligent student.

The student knows thousands of things.

But you give them access to a giant library.

You ask:

"What does chapter 17 of our company's architecture document say about database failover?"

The student doesn't memorize the entire library.

Instead:

```

Question
   ↓
Find relevant book
   ↓
Find relevant page
   ↓
Read it
   ↓
Answer
```

The student = LLM

The librarian/search system = retrieval

The books = knowledge base

The pages given to the student = context

The final explanation = generation

That's RAG.

# 6. What does "Retrieval-Augmented Generation" actually mean?

Break the name apart.

Retrieval

> Find relevant information.

```

Question
   ↓
Search knowledge
   ↓
Relevant chunks
```

> Augmented

Add the retrieved information to the model's input.

```

Question
+
Retrieved information
Generation
```

```
Question
+
Retrieved information
Generation
```

The LLM generates the answer.

```

Question
+
Context
 ↓
LLM
 ↓
Answer

```

Therefore:

```


R
↓
Retrieve

A
↓
Augment

G
↓
Generate


```

# 7. Basic RAG architecture

The simplest possible RAG system:

```

                    KNOWLEDGE BASE
                          │
                          │
                    ┌─────▼─────┐
                    │ Retrieval │
                    └─────┬─────┘
                          │
                          │ relevant information
                          ▼
User Question ──────→ Context
                          │
                          ▼
                       ┌─────┐
                       │ LLM │
                       └──┬──┘
                          │
                          ▼
                        Answer

```

But there's a missing piece.

How does the retrieval system actually search the knowledge?

That's what the rest of your RAG curriculum teaches.

# 8. The complete RAG lifecycle

A real RAG system has two major paths.

<h2>Path A: Indexing</h2>

Prepare your knowledge for searching.

```

Documents
   ↓
Load
   ↓
Parse
   ↓
Clean
   ↓
Chunk
   ↓
Embed
   ↓
Index
   ↓
Database
```

This usually happens before users ask questions.

<h2>Path B: Query</h2>

When the user asks something:

```

User Query
   ↓
Query processing
   ↓
Retrieval
   ↓
Ranking/filtering
   ↓
Context construction
   ↓
LLM
   ↓
Answer

```

This happens at runtime.

# 1. The complete picture

Put both together:

```TS


OFFLINE / INGESTION
===================

Documents
   │
   ▼
Loader
   │
   ▼
Parser
   │
   ▼
Cleaner
   │
   ▼
Chunker
   │
   ▼
Embedding Model
   │
   ▼
Index
   │
   ▼
Knowledge Store
   │
   │
   │
   │             ONLINE / QUERY
   │             ===============
   │
   └──────────────┐
                  │
User Query ───────┤
                  ▼
             Query Processing
                  │
                  ▼
              Retrieval
                  │
                  ▼
          Relevant Documents
                  │
                  ▼
          Ranking / Filtering
                  │
                  ▼
        Context Construction
                  │
                  ▼
                 LLM
                  │
                  ▼
                Answer

This diagram is worth remembering.


```

# 1. Why indexing exists

Imagine you have:

1,000,000 documents

You can't efficiently read all of them every time a user asks a question.

Instead, we prepare the data beforehand.

This is indexing.

Think about Google.

When you search:

distributed systems consistency

Google doesn't open every webpage on Earth and start reading.

It has already built indexes.

RAG systems work similarly.

# 1. What happens during ingestion?

Suppose you upload:

> architecture.pdf

The system might do:

```

PDF
 ↓
extract text
 ↓
clean text
 ↓
split into chunks
 ↓
convert chunks into embeddings
 ↓
store them

```

For example:

```


PDF
 │
 ├── Page 1
 ├── Page 2
 ├── Page 3
 └── ...

 ```

becomes:

```

Chunk 1
Chunk 2
Chunk 3
Chunk 4
...
Chunk 500



````

Each chunk can then be indexed.

# 1. Why not store the entire document?

Suppose:

company.pdf

contains 500 pages.

User asks:

"How does authentication work?"

Giving the entire PDF to the LLM is wasteful.

Instead, we want:

```

500 pages
    ↓
search
    ↓
5 relevant chunks
    ↓
LLM

That's much more efficient.
```

# 1. Why chunking exists

Documents are too large and too coarse.

So we split them.

Example:

```

Document
│
├── Chunk 1
│   "Authentication uses JWT..."
│
├── Chunk 2
│   "Access tokens expire..."
│
├── Chunk 3
│   "Refresh tokens are rotated..."
│
├── Chunk 4
│   "Passwords are hashed..."
│
└── Chunk 5
    "Sessions are invalidated..."


```

Now retrieval can target a specific piece.

We'll go deep into this in:

# 02-Chunking

# 14. Why embeddings exist

Computers don't naturally understand semantic similarity the way humans do.

Consider:

> Query:
"How can I get my money back?"

Document:

"Customers may request a refund within 30 days."

Different words.

But humans understand they're related.

An embedding model converts text into numerical representations.

Conceptually:

```


"How can I get my money back?"
             ↓
       [0.12, -0.82, ...]


```

```
"Customers may request a refund..."
             ↓
       [0.15, -0.77, ...]
```

Similar meanings tend to produce vectors that are close according to some similarity function.

We'll deeply study this in:

# 03-Embeddings

<h3>15. Why vector databases exist</h3>

Imagine:

10 million chunks

Each chunk has an embedding.

You need to find the chunks most similar to a query.

A vector database/index can store these vectors and support efficient similarity search.

Conceptually:

```

Chunk 1 → vector
Chunk 2 → vector
Chunk 3 → vector
...
Chunk 10,000,000 → vector
```

Query:

```

Question
 ↓
query vector
 ↓
search index
 ↓
top K similar chunks

```

Examples of technologies you'll encounter include:

```

PostgreSQL + pgvector
Qdrant
Weaviate
Milvus
Pinecone
Elasticsearch/OpenSearch
Redis vector search

```

But remember:

## Vector database ≠ RAG

It's only one possible component.

 > 1. RAG doesn't necessarily require a vector database

This is important.

RAG simply means:

```

retrieve external information
+
give it to the model


```

Retrieval could come from:

```

Vector search
query
 ↓
embedding
 ↓
vector search
Keyword search
query
 ↓
BM25
 ↓
documents
SQL
"What is user's subscription?"
 ↓
SELECT ...
Graph database
Entity
 ↓
Relationships
 ↓
Relevant nodes
API
"What is today's stock price?"
 ↓
API
 ↓
current data
Web search
query
 ↓
search engine
 ↓
web pages

```

Therefore:

$$ \boxed{ RAG = Retrieval + Generation } $$

not:

$$ RAG = VectorDatabase + LLM $$

# 17. Similarity search

Suppose we have:

```

Query:
"How do I reset my password?"

```

Knowledge base:

```
Chunk A:
"How to configure PostgreSQL"

Chunk B:
"Password reset requires email verification"

Chunk C:
"How to deploy Redis"

Chunk D:
"Password recovery tokens expire after 15 minutes"


```

A good retrieval system should return:

```

Chunk B
Chunk D
```

rather than:

```

Chunk A
Chunk C
```

This is retrieval quality.

We'll study similarity/search deeply in:

# 05-Similarity-Search

## 18. What is retrieval?

Retrieval is simply:

Given a query, find the pieces of information that are most useful for answering it.

Formally:

$$ R(q,D) \rightarrow C $$

where:

\(q\) = query </br>
\(D\) = knowledge corpus</br>
\(C\) = selected context</br>

Example:

$$ R(q,D)=\{d_7,d_{42},d_{81}\} $$

Meaning:

Out of the entire knowledge base, these three pieces appear relevant.

## 1. Top-K retrieval

Usually we don't retrieve everything.

We retrieve:

$$ TopK(q) $$

For example:

Top 5

or:

Top 10

So:

```

1,000,000 chunks
       ↓
query
       ↓
retrieve
       ↓
top 10
       ↓
LLM
```

Why?

> Because context is limited and irrelevant information is harmful.

## 1. Retrieval isn't just "find the closest vector"

Modern retrieval can involve multiple stages.

For example:

```

Query
 ↓
Candidate retrieval
 ↓
100 candidates
 ↓
Reranking
 ↓
10 best documents
 ↓
Filtering
 ↓
5 final chunks

```

This is much closer to production RAG.

## 1. Context

After retrieval, we have something like:

```

Chunk 17:
"Refund requests must be submitted within 30 days."

Chunk 83:
"Refunds are processed within 5 business days."

Chunk 120:
"Refund requests must be submitted through the billing portal."

```

These become the model's context.

The LLM now receives something conceptually like:

```

SYSTEM:
Answer using the provided context.

CONTEXT:

[Chunk 17]
Refund requests must be submitted within 30 days.

[Chunk 83]
Refunds are processed within 5 business days.

[Chunk 120]
Refund requests must be submitted through the billing portal.

USER:
How can I request a refund?


```

Now the model has the evidence required to answer.

# 1. Context construction

Simply retrieving documents isn't enough.

We have to decide:

```

Which chunks?
In what order?
How much text?
Should duplicate chunks be removed?
Should metadata be included?
Should sources be attached?
Should neighboring chunks be included?
Should documents be compressed?
How should the prompt be structured?

```

That's context construction.

Conceptually:

$$ C = f(d_1,d_2,\dots,d_k,q) $$

where \(C\) is the final context sent to the LLM.

We'll study this in:

# 07-Context-Construction

## 23. The LLM's job in RAG

The LLM isn't necessarily responsible for finding the information.

Its job is primarily:

```

Retrieved evidence
       +
User question
       ↓
Reason
       ↓
Generate answer

```

This distinction is extremely useful.

Think of the system as:

```

Retriever
    ↓
"Here are potentially relevant facts."
```

LLM
    ↓
"I'll use these facts to formulate an answer."

## 24. RAG is basically a pipeline

At the highest level:

$$ D \rightarrow Index(D) $$

then:

$$ q \rightarrow Retrieve(q,D) \rightarrow Context \rightarrow LLM \rightarrow Answer $$

More explicitly:

$$ \boxed{ Answer = G(q, C) } $$

where:

$$ C=R(q,D) $$

Therefore:

$$ \boxed{ Answer=G(q,R(q,D)) } $$

This equation is probably the cleanest mathematical abstraction of basic RAG.

## 1. Why RAG can reduce hallucination

Suppose the model doesn't know something.

Without RAG:

```

Question
 ↓
LLM
 ↓
Maybe invent something
```

With RAG:

```

Question
 ↓
Retrieve evidence
 ↓
LLM
 ↓
Answer based on evidence
```

For example:

```JS

CONTEXT:

The refund period is 30 days.

QUESTION:

How long is the refund period?

The model has a concrete source.

But here's the important caveat:

RAG does not magically eliminate hallucinations.

The model can still:

misunderstand the retrieved text
ignore the context
combine unrelated information
invent unsupported details
retrieve the wrong documents
answer when evidence is insufficient

So RAG can improve grounding, but it is not a hallucination cure.
```

# 1. The RAG failure chain

This is extremely important.

Suppose the final answer is wrong.

Don't immediately blame the LLM.

The failure could be anywhere:

```

Bad source
   ↓
Bad parsing
   ↓
Bad chunking
   ↓
Bad embedding
   ↓
Bad retrieval
   ↓
Bad ranking
   ↓
Bad context construction
   ↓
Bad generation


```

For example:

User asks:

> "What's the refund deadline?"

But retrieval returns:

"Refunds are processed within 5 days."

The LLM answers:

"You have 5 days to request a refund."

The model may have generated a perfectly grammatical answer from bad context.

That's a retrieval problem.

# 1. RAG is an information retrieval problem too

This is where RAG becomes much more interesting.

A naive view:

RAG = LLM application

A better view:

```
RAG =

Information Retrieval
+
Context Engineering
+
LLM Generation
```

And in sophisticated systems:

```

RAG =
Data ingestion
+
Information retrieval
+
Ranking
+
Filtering
+
Context construction
+
LLM reasoning
+
Evaluation
+
Observability
```

This is why production RAG is much harder than:

```
const chain = retriever.pipe(model);
```

# 1. RAG vs normal LLM application

Normal LLM

```
User
 ↓
Prompt
 ↓
LLM
 ↓
Answer

```

RAG

```
User
 ↓
Query
 ↓
Retriever
 ↓
Relevant knowledge
 ↓
Prompt construction
 ↓
LLM
 ↓
Answer
```

The extra machinery gives the model access to external knowledge.

## 1. RAG vs fine-tuning

This deserves a clean comparison.

```

Problem RAG Fine-tuning
Give model private documents ✅ Usually poor fit
Frequently changing knowledge ✅ ❌
Current database information ✅ ❌
Teach new response style Limited ✅
Teach new behavior Limited ✅
Source citations Natural Not inherent
Easy knowledge updates ✅ ❌
Requires retrieval ✅ ❌
Changes model weights ❌ ✅
```

Example:

"Answer questions using our company docs"

Use:

RAG

```

"Always produce our company's specific JSON style"

```

Could use:

```

structured prompting
+
possibly fine-tuning
"Answer using latest company docs while maintaining a specialized behavior"

```

Potentially:

```

Fine-tuned model
        +
       RAG
```

# 30. RAG vs long context

Modern LLMs can accept very large contexts.

So you might ask:

> "Why do we need retrieval if the model can accept 1 million tokens?"

Because:

$$ \text{Large context} \neq \text{relevant context} $$

Imagine:

1,000,000 tokens

but only:

2,000 tokens

actually matter.

Retrieval tries to reduce:

$$ 1,000,000 \rightarrow 2,000 $$

or perhaps:

$$ 1,000,000 \rightarrow 20,000 $$

before generation.

Long context and RAG aren't mutually exclusive.

```
A strong system may use:

Retrieval
   ↓
Large context
   ↓
LLM

```

## 31. RAG is not necessarily one retrieval step

A simple system:

```

Question
 ↓
Retrieve
 ↓
LLM

```

A more advanced system:

```

Question
 ↓
Query rewriting
 ↓
Multiple searches
 ↓
Merge results
 ↓
Rerank
 ↓
Filter
 ↓
Context construction
 ↓
LLM
```

And even more advanced:

```
User

 ↓
Planner
 ↓
Search strategy
 ├── Vector search
 ├── Keyword search
 ├── SQL
 ├── Graph
 └── Web
 ↓
Merge
 ↓
Rerank
 ↓
Reason
 ↓
Answer
```

This is where Agentic RAG starts appearing.

# 1. Static vs dynamic knowledge

One major reason RAG is useful is freshness.

Suppose your database says:

User balance = ₹8,430

You don't want to retrain an LLM every time the balance changes.

Instead:

```

User asks
 ↓
Database query
 ↓
Current value
 ↓
LLM
```

This is retrieval.

The model doesn't need to memorize the value.

## 1. RAG and private data

Imagine:

```

Company
├── HR docs
├── Engineering docs
├── Financial docs
├── Customer data
└── Internal APIs

```

You don't necessarily want to bake all of that into model weights.

```

RAG allows:

External private data
        ↓
Access-controlled retrieval
        ↓
Relevant information
        ↓
LLM
```

This also introduces an important production concern:

>Authorization

You must never assume:

"If the retriever can find it, the user can see it."

For example:

```

Employee A
    ↓
query
    ↓
retriever
    ↓
CEO compensation document
```

That's a security bug.

Retrieval must respect permissions.

A useful invariant:

$$ RetrievedDocs(u,q) \subseteq AuthorizedDocs(u) $$

In words:

Every document retrieved for user \(u\) must be accessible to user \(u\).

> This becomes critical in multi-tenant RAG systems.

## 1. Metadata

Chunks shouldn't just be raw text.

A production chunk might contain:

```JSon
{
  "text": "Refund requests must be submitted...",
  "documentId": "doc_123",
  "tenantId": "company_42",
  "source": "employee-handbook.pdf",
  "page": 47,
  "section": "Refund Policy",
  "createdAt": "...",
  "permissions": ["finance", "admin"]
}

```

Why?

Because retrieval may need filters like:

```

tenantId = currentTenant

or:

department = engineering

or:

documentType = policy

```

This is called metadata filtering.

## 1. Multi-tenancy

Imagine your SaaS has:

```

Company A
Company B
Company C
```

Each company uploads documents.

You cannot let:

```

Company A query
       ↓
retrieve Company B documents
```

So your retrieval system needs isolation.

Conceptually:

$$ D_A \cap D_B = \varnothing $$

from the perspective of authorized retrieval.

Or:

```

query
 ↓
tenant filter
 ↓
search
 ↓
results

```

Not:

```

query
 ↓
search everything
 ↓
filter afterward
```

The latter can create serious security problems depending on the architecture.

 1. The two pipelines you should memorize
Ingestion

```
              KNOWLEDGE
                  │
                  ▼
              Documents
                  │
                  ▼
                Parse
                  │
                  ▼
                Clean
                  │
                  ▼
               Chunk
                  │
                  ▼
              Embed
                  │
                  ▼
               Index
                  │
                  ▼
           Searchable Store
Query
               USER
                 │
                 ▼
               Query
                 │
                 ▼
         Query Processing
                 │
                 ▼
             Retrieve
                 │
                 ▼
              Rerank
                 │
                 ▼
              Filter
                 │
                 ▼
         Context Construction
                 │
                 ▼
                LLM
                 │
                 ▼
              Answer

```

## 2. What exactly gets stored?

A common misconception is:

"The vector database stores the knowledge."

Usually the system stores something closer to:

```

Chunk
+
Embedding
+
Metadata
```

Conceptually:

```

┌────────────────────────────────────┐
│ Record                             │
├────────────────────────────────────┤
│ id                                 │
│ text                               │
│ embedding                          │
│ documentId                         │
│ tenantId                           │
│ page                               │
│ section                            │
│ permissions                        │
│ source                             │
└────────────────────────────────────┘


```

The exact architecture varies.

You might store text separately:

```

Postgres
   │
   └── canonical document/chunk

Vector Index
   │
   └── embedding + chunk ID

```

Then:

```

vector search
     ↓
chunk IDs
     ↓
database lookup
     ↓
actual text
```

This separation can be useful at scale.

## 1. What does the model actually see?

This is another crucial mental model.

The LLM generally does not see:

```
Vector:
[0.12, -0.83, 0.44, ...]

```

That's primarily for retrieval.

The model eventually receives text or multimodal content.

So:

```

Text
 ↓
Embedding
 ↓
Search
 ↓
Relevant chunk
 ↓
TEXT
 ↓
LLM
```

The vector is a retrieval representation.

The text is the evidence supplied to the model.

# 1. The boundary between retrieval and generation

Think of this boundary:

```

          RETRIEVAL WORLD
────────────────────────────────
documents
chunking
embeddings
indexes
search
ranking
metadata
filters

────────────────────────────────
          CONTEXT
────────────────────────────────
          GENERATION WORLD
prompt
LLM
reasoning
answer
citations

````

This separation is extremely useful when debugging.

```

If the correct document wasn't retrieved:

Retrieval problem.

If the correct document was retrieved but the model misunderstood it:

Generation/context problem.
```

### 1. The three fundamental RAG questions

Almost every RAG system can be reduced to three questions.

```
Question 1

Did we retrieve the right information?

Retrieval quality.

Question 2

Did we give the model the right information in the right form?

Context quality.

Question 3

Did the model generate the correct answer from that information?
Generation quality.
```

Therefore:

$$ \boxed{ RAG\ Quality = Retrieval \times Context \times Generation } $$

Not literally a universal production metric, but an excellent mental model.

If any stage is terrible:
```

Excellent LLM × Terrible retrieval = Terrible RAG
```
