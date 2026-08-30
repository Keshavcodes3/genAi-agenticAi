
# 💕 Mira

An AI companion that doesn't just talk, but acts.

```

Mira is a conversational AI application inspired by products like ChatGPT, but with one important difference

Mira isn't limited to generating text. She can use tools to interact with external systems, remember things about the user, search for information, and perform actions.

The project is intentionally being built from the primitives upward, without relying on agent frameworks initially.
```

🎯 Why I'm Building Mira

Most AI tutorials stop here:

```

User
 ↓
LLM
 ↓
Text
```

That's useful, but it doesn't explain what makes modern AI applications interesting.

Real applications look more like:

```

User
 ↓
LLM
 ↓
Decision
 ↓
Tool
 ↓
External System
 ↓
Result
 ↓
LLM
 ↓
Response
```

> So instead of learning tool calling theoretically, I wanted to build something where tool calling is fundamental to the product.

Hence:

Mira.

# 🧠 The Core Concept

Mira is fundamentally an LLM-driven agent runtime.

The LLM is responsible for deciding:

> "What should I do next?"

The application is responsible for:

> "Actually doing it."

That distinction is the heart of the project.

For example:

```

User:
"What's the weather today? Should I take an umbrella?"

                    ↓

                 Mira / LLM

                    ↓

          "I need weather data."

                    ↓

             get_weather()

                    ↓

             Weather API

                    ↓

          { temp: 27, rain: 80% }

                    ↓

                 LLM

                    ↓

        "Yes. Take an umbrella."

```

The model doesn't execute get_weather().

It generates a structured tool request.

Our backend receives that request, executes the actual function, gives the result back to the model, and lets the model continue.

<b>🏗️ High-Level Architecture </b>

The initial architecture is intentionally simple:

                         ┌─────────────┐
                         │    User     │
                         └──────┬──────┘
                                │
                                ▼
                         ┌─────────────┐
                         │  Chat UI    │
                         └──────┬──────┘
                                │
                                ▼
                         ┌─────────────┐
                         │ Chat API    │
                         └──────┬──────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │    Agent Runtime     │
                    │                      │
                    │  Context             │
                    │  Agent Loop          │
                    │  Tool Execution      │
                    │  State               │
                    └──────────┬───────────┘
                               │
                               ▼
                         ┌─────────────┐
                         │     LLM     │
                         └──────┬──────┘
                                │
                         tool request
                                │
                                ▼
                       ┌────────────────┐
                       │ Tool Registry  │
                       └───────┬────────┘
                               │
             ┌─────────────────┼──────────────────┐
             ▼                 ▼                  ▼
        🌤 Weather          🔎 Search          🧠 Memory
             │                 │                  │
             ▼                 ▼                  ▼
        External API       Web/API            Database

       
>🧰 Mira's Tools

Mira's capabilities are exposed through tools.

For example:

```
Weather
get_weather({
  location: "Delhi"
})
Web Search
search_web({
  query: "best movies released this month"
})
Memory
save_memory({
  fact: "User likes backend engineering"
})
Reminders
create_reminder({
  text: "Study distributed systems",
  time: "20:00"
})

```

The interesting part is that we don't manually decide which function to call.

The LLM chooses.

🔄 The Agent Loop

This is the central mechanism of Mira.

Conceptually:

        ┌──────────────┐
        │     User     │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │     LLM      │
        └──────┬───────┘
               │
          ┌────┴────┐
          │         │
       answer    tool call
          │         │
          │         ▼
          │    Tool Executor
          │         │
          │         ▼
          │    Tool Result
          │         │
          │         └─────────┐
          │                   │
          └──────────────► LLM
                              │
                              ▼
                           Answer

In pseudocode:
```

while (true) {
  const response = await llm(context);

  if (response.type === "final") {
    return response;
  }

  const result = await executeTool(response.toolCall);

  context.add(response);
  context.add(result);
}
```

That tiny loop is the engine behind Mira.

🤔 Why This Is Interesting

Tool calling introduces a boundary between two very different worlds.

Probabilistic world
LLM

"Given this context,
what should happen next?"

The model produces a probabilistic prediction.

Deterministic world
Application

"Execute this function with these arguments."

Your TypeScript runtime performs an actual operation.

So Mira becomes a bridge:

        Probabilistic
             │
             ▼
           LLM
             │
      structured intent
             │
             ▼
     deterministic runtime
             │
             ▼
       external world

That's the deeper engineering problem we're exploring.

🧩 What We'll Eventually Add

Mira starts small, but the architecture will evolve.
```


Phase 1: Conversation
Chat
+
LLM
Phase 2: Tool Calling
Chat
+
LLM
+
Tool Registry
+
Agent Loop
Phase 3: Real-Time UX
Streaming
+
Tool execution events
+
Live UI state

For example:

Mira

"Let me check..."

┌─────────────────────────┐
│ 🌤 Checking weather... ✓│
└─────────────────────────┘

"It's going to rain tonight."
Phase 4: Memory
Conversation
      │
      ▼
Memory extraction
      │
      ▼
PostgreSQL

Mira can remember useful facts without replaying the entire conversation forever.

Phase 5: Search + Grounding
LLM
 │
 ├── Search
 ├── Fetch pages
 └── Extract information
          │
          ▼
        Context
          │
          ▼
         LLM
Phase 6: Multimodality

Eventually:

Text
Voice
Images
Files


```
all become inputs to the same agent runtime.

🔐 And Then Things Get Serious

Once Mira can act, we have to deal with problems that don't exist in a simple chatbot.

Suppose we eventually expose:

send_message()
delete_file()
create_event()
purchase_product()
send_email()

We can't simply trust:

LLM → execute()

We'll need:
```

LLM
 ↓
Tool Request
 ↓
Validation
 ↓
Authorization
 ↓
Policy
 ↓
Human Approval?
 ↓
Execution
 ↓
Audit Log
```

Now we're dealing with:
```

authorization
sandboxing
prompt injection
tool poisoning
idempotency
retries
timeouts
auditability
state persistence
failure recovery
```

Which makes Mira a surprisingly good playground for production agent architecture.

🧠 What I'm Actually Learning

The project isn't really about an AI girlfriend.

It's a vehicle for understanding:
```

LLMs
 ↓
LLM APIs
 ↓
Structured outputs
 ↓
Tool calling
 ↓
Agent loops
 ↓
Context management
 ↓
Memory
 ↓
RAG
 ↓
Streaming
 ↓
Concurrency
 ↓
Fault tolerance
 ↓
Agent security
 ↓
Production architecture

```

And eventually:

                 AI Application
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
         LLM         Memory        Tools
          │            │            │
          ▼            ▼            ▼
       Inference    Storage      Execution
          │            │            │
          └────────────┼────────────┘
                       ▼
                 Agent Runtime
