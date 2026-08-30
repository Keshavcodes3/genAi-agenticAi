# 🧠 GenAI Learning Lab

<h2>Read. Build. Break. Understand. Repeat.</h2>

A living repository of everything I'm learning while diving into Generative AI.
```


Not a course.
Not a polished textbook.
Not an attempt to pretend I know everything.

Just notes, experiments, code, mistakes, rabbit holes, and things that finally clicked.
```
<br>

✦ Why this exists
```

I got tired of following tutorials where everything works perfectly, but the moment I change one thing, I have no idea what's actually happening.

So I'm trying a different approach:
```
<br>

```TS


Read Docs
    ↓
Read Articles / Papers
    ↓
Ask Questions
    ↓
Build Something
    ↓
Break Something
    ↓
Figure Out Why
    ↓
Write It Down
    ↓
Repeat


```

<br>

The goal isn't to memorize APIs.

The goal is to understand the systems and ideas behind them.

<br>

🗺️ Learning Path

The repository is organized roughly by increasing complexity.
```


┌─────────────────────────┐
│  00 · Foundations       │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  01 · LLM Applications  │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  02 · Memory & RAG      │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  03 · Agents            │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  04 · Frameworks        │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  05 · Production        │
└─────────────────────────┘


```
<br>

# 00 · Foundations

Understanding the basic pieces before throwing frameworks at them.

```JS
What is Generative AI?
LLMs
Tokens
Tokenization
Context windows
Prompts
System / User / Assistant messages
Model parameters
Temperature
Structured outputs
Embeddings
Vector similarity
Probability & sampling


```
<br>

```TS


01 · Working With LLMs

Moving from theory to actually interacting with models.

Model APIs
Message-based APIs
Streaming
Structured responses
Function / Tool Calling
Context management
Token usage
Retries
Error handling
Rate limits
Model configuration

```
<br>

02 · AI Applications
```

Building actual applications around models.

Chat systems
Conversation history
Short-term memory
Persistent memory
RAG
Vector databases
Retrieval pipelines
Prompt construction
Context engineering
Message persistence
AI application architecture


```
<br>

```

03 · Agents

Where things start getting interesting.

What an agent actually is
Agent loops
Tool selection
Tool execution
Agent state
Agent memory
Multi-step tasks
Observations
Planning
Tool errors
Termination
Human-in-the-loop
Agent orchestration
```


```


A simple mental model
             ┌───────────┐
             │   User    │
             └─────┬─────┘
                   │
                   ▼
             ┌───────────┐
             │    LLM    │
             └─────┬─────┘
                   │
          "I need a tool"
                   │
                   ▼
             ┌───────────┐
             │   Tool    │
             └─────┬─────┘
                   │
                   ▼
              Tool Result
                   │
                   ▼
             ┌───────────┐
             │    LLM    │
             └─────┬─────┘
                   │
                   ▼
             Final Response

```

The interesting question isn't just what happens.

It's:

Who controls each step, where is the state, and what happens when something fails?

<br>

# 04 · Frameworks

Learning the abstractions without becoming dependent on them.

Currently exploring:
```

LangChain
LangGraph
Model SDKs
AI SDKs
Vector databases
Tooling abstractions

```
The goal isn't:

> "How do I use LangChain?"

It's:

> "What is LangChain doing for me?"

And eventually:

"Could I implement the core idea myself?"

<br>

# 05 · Production AI Architecture

Eventually, the rabbit hole leads here.
```

Backend
AI backend architecture
Chat service design
Message persistence
Conversation state
Context management
Streaming
Server-Sent Events
WebSockets
Token streaming
Backpressure
Connection lifecycle
Partial responses
Infrastructure
Redis
Queues
Background workers
Caching
Rate limiting
Concurrency
Retries
Idempotency
Distributed Systems
Failure handling
Timeouts
Consistency
State ownership
Event-driven architecture
Observability
Model routing
Cost control

```
<br>

# 🧪 Building While Learning

This isn't going to be a collection of theoretical notes.

I'll build things along the way.
```


LLM API
   │
   ▼
 Chat
   │
   ▼
Streaming
   │
   ▼
 Memory
   │
   ▼
 Tools
   │
   ▼
 Agent
   │
   ▼
 RAG
   │
   ▼
Production AI Backend

```

One of the projects I'm building alongside this learning process is Maira, a conversational AI project.

The project acts as a laboratory.

Whenever I learn something new, I try to find somewhere to apply it.

<br>

📚 Notes & Articles

The documentation will roughly follow the same structure:
```

docs/
│
├── 00-foundations/
│
├── 01-llm-applications/
│
├── 02-memory-and-rag/
├── 03-agents/
├── 04-frameworks/
└── 05-production/
```

A typical topic might look like:
```

Concept
   ↓
Mental Model
   ↓
Architecture
   ↓
Code
   ↓
Internal Mechanics
   ↓
Experiment
   ↓
What I Got Wrong

Some notes will be short.

Some will go unnecessarily deep.


```
That's intentional.

<br>

# 🔬 The Level of Understanding I'm After

I'm particularly interested in the gap between:

"I know how to call the API."

and:

"I understand what happens when I call the API."

For example:

await model.invoke(messages);

That's the easy part.

I want to understand the machinery around it:
```


Application
     │
     ▼
    SDK
     │
     ▼
Request Construction
     │
     ▼
    HTTP
     │
     ▼
 Model Server
     │
     ▼
  Inference
     │
     ▼
  Response
     │
     ▼
 SDK Parsing
     │
     ▼
Application

And then keep drilling down.


```

<br>

```

Questions I want to be able to answer
What is serialized?
Where does context live?
Who owns state?
What happens during streaming?
What happens if the request dies halfway through?
What happens if a tool fails?
What happens if two requests modify the same conversation concurrently?
What does the framework abstract away?
What would the system look like without the framework?

```
<br>

# ⚠️ This Repository Will Be Wrong Sometimes

This is a learning repository, not an authoritative GenAI textbook.

I will misunderstand things.

Some explanations will be incomplete.

Some code will be questionable.

Some experiments will completely explode.

That's okay.

When I learn something better, I'll update it.

The mistakes are part of the record.

The commit history is part of the learning process.

<br>

🛠️ Stack

Most experiments will probably involve:
```

Technology	Purpose
TypeScript	Application code
Node.js	Runtime
Express	Backend experiments
MongoDB	Persistence experiments
PostgreSQL	Relational persistence
Redis	Caching / state / queues
LangChain	LLM abstractions
LangGraph	Agent orchestration
LLM APIs	Model interaction
Vector DBs	Retrieval
```

The stack will change.

The concepts matter more than the libraries.

<br>

📖 How I'm Learning

My primary resources are:
```

Official documentation
Engineering blogs
Technical articles
Research papers
Source code
Experiments
GPT
Building actual projects
```

I'm deliberately trying to rely less on step-by-step tutorials.

Not because tutorials are bad.

I just want to become comfortable with the harder loop:
```

Read
  ↓
Question
  ↓
Implement
  ↓
Debug
  ↓
Understand
  ↓
Document

```
<br>

🎯 The Goal

> I'm not trying to become an "AI expert" overnight.

The goal is much simpler:
```TS


Understand enough to build these systems properly.

Eventually, I want to be able to look at an AI system and ask:

What is the state?

Where is the state stored?

How does context flow?

Who controls execution?

What gets persisted?

What gets cached?

What gets streamed?

What happens concurrently?

What happens when the model is slow?

What happens when a tool fails?

What happens when the process crashes?

What happens when the network disappears?

What does this abstraction hide?

Can I implement the core idea myself?

That's the level of understanding I'm aiming for.


```
<br>

🚧 Status
```RS

Learning in public.

Building in public.

Breaking things in public.

This repository will keep changing as I learn.

There won't be a final version.

That's kind of the point.

```
<br>

⭐ Philosophy
Don't just use the abstraction.
Understand the abstraction.

Don't just follow the tutorial.
Build the thing.

Don't hide the mistakes.
Document them.

Don't optimize for looking knowledgeable.
Optimize for actually understanding.

Keep digging.

<br>

<div align="center">

This repo is the dump.
The understanding comes from the digging.

</div>