# WTF is LangChain? 🧠

If you've just learned LLM APIs, the right way to understand LangChain is not:

> “LangChain is a framework for AI apps.”

That's marketing-level knowledge.

The useful mental model is:


```
LangChain is an orchestration/abstraction layer that turns raw model APIs into composable program components: models, prompts, tools, retrievers, parsers, agents, memory/state, and execution graphs.
```

And importantly:
```

LangChain does NOT make the LLM smarter.

It mainly gives your application a structured runtime around the LLM.
```



# 1. First: What problem does LangChain solve?

Suppose you're building an AI application in TypeScript.

Without LangChain:
```TS

const response = await openai.chat.completions.create({
  model: "gpt-5",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant."
    },
    {
      role: "user",
      content: "Explain distributed systems."
    }
  ]
});
console.log(response.choices[0].message.content);
```


That's perfectly fine.

But real applications become more like:
```

User
 │
 ▼
Load conversation
 │
 ▼
Search documents
 │
 ▼
Retrieve relevant chunks
 │
 ▼
Construct prompt
 │
 ▼
Call LLM
 │
 ▼
LLM decides whether to use tool
 │
 ├── yes → execute tool
 │          │
 │          ▼
 │       send result back
 │          │
 │          └────────────┐
 │                       │
 └── no                  │
                         ▼
                    final answer
                         │
                         ▼
                    parse output
                         │
                         ▼
                       User

```
Now you're manually building:

```
prompt construction
model abstraction
tool schemas
tool invocation
retries
streaming
structured output
retrieval
conversation state
tracing
agent loops
message normalization
provider-specific handling
```

That's where an orchestration framework becomes useful.



# 2. The most important mental model

Think of LangChain as a compiler/runtime for LLM workflows.

Your application describes something conceptually like:

````
Prompt
   ↓
Model
   ↓
Parser

```
or:

```
User
 ↓
Retriever
 ↓
Prompt
 ↓
LLM
 ↓
Tool
 ↓
LLM
 ↓
Parser
````

LangChain turns these pieces into executable operations.

So instead of thinking:

>"I'm using LangChain to call GPT."

Think:

```
I'm composing a stateful computation whose nodes happen to include LLM calls."
```
That's much closer to the architecture.




# 3. LangChain is not one thing

Modern LangChain has several conceptual layers.

A useful decomposition is:
```

┌──────────────────────────────────────────────┐
│                  Your App                    │
├──────────────────────────────────────────────┤
│ Agents / high-level orchestration            │
├──────────────────────────────────────────────┤
│ LangGraph / execution + state                 │
├──────────────────────────────────────────────┤
│ LangChain abstractions                        │
│                                              │
│ Models                                       │
│ Prompts                                      │
│ Tools                                        │
│ Retrievers                                   │
│ Documents                                    │
│ Output parsers                               │
├──────────────────────────────────────────────┤
│ Provider integrations                         │
│ OpenAI / Anthropic / Google / etc.            │
├──────────────────────────────────────────────┤
│ HTTP / WebSocket / SDKs                       │
├──────────────────────────────────────────────┤
│ Model provider infrastructure                 │
└──────────────────────────────────────────────┘

```

This distinction matters.



# 4. LangChain doesn't actually talk to GPT "magically"

Suppose:

````
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-5"
});


````
It looks simple.

But conceptually you're constructing an object:

```
ChatOpenAI
    │
    ├── model = "gpt-5"
    ├── apiKey
    ├── temperature
    ├── callbacks
    ├── streaming configuration
    ├── metadata
    └── provider-specific configuration

```
Then:

await model.invoke("Hello");

roughly becomes:
```

invoke()
   │
   ▼
normalize input
   │
   ▼
convert string → message
   │
   ▼
construct provider request
   │
   ▼
OpenAI API request
   │
   ▼
HTTP
   │
   ▼
OpenAI infrastructure
   │
   ▼
model inference
   │
   ▼
HTTP response
   │
   ▼
provider response
   │
   ▼
normalize response
   │
   ▼
AIMessage

```
That's the key.


# 5. Why abstraction over different LLM providers?

Imagine you write:

```
const model = new ChatOpenAI(...);

```
Then later you want Claude.

Without an abstraction:
```

openai.chat.completions.create(...)

```
becomes:
```

anthropic.messages.create(...)

```
and the request/response structures differ.

LangChain attempts to give you:
```

const model = new ChatOpenAI(...);
```

or:
```

const model = new ChatAnthropic(...);
```

while your application can work with a common conceptual interface:

````
await model.invoke(messages);
````

So:
```

                 ┌── OpenAI
                 │
BaseChatModel ───┼── Anthropic
                 │
                 ├── Google
                 │
                 ├── Mistral
                 │
                 └── local model
```
This is classic polymorphism.




# 6. Think interfaces

Conceptually:
```TS

interface ChatModel {
  invoke(
    input: Message[] | string
  ): Promise<AIMessage>;
}
```



Then:
```TS

class OpenAIModel implements ChatModel {
  async invoke(input) {
    // translate generic representation
    // into OpenAI-specific request
  }
}
```

and:
```TS

class AnthropicModel implements ChatModel {
  async invoke(input) {
    // translate generic representation
    // into Anthropic-specific request
  }
}

```
Your application depends on:

ChatModel

rather than:

OpenAI API

That's dependency inversion.



# 7. Messages

Now we get to an important abstraction.

LLMs aren't really receiving:

"hello"

in sophisticated applications.

They receive structured messages:


LangChain represents these conceptually as:

BaseMessage
   │
   ├── HumanMessage
   ├── AIMessage
   ├── SystemMessage
   └── ToolMessage
```TS




[
  {
    role: "system",
    content: "You are a helpful assistant."
  },
  {
    role: "user",
    content: "Explain Raft."
  }
]

```
Why?

Because conversations become structured state.

For example:

```
HumanMessage
      ↓
AIMessage
      ↓
ToolCall
      ↓
ToolMessage
      ↓
AIMessage

```
That's much richer than a string.



# 8. Tool calling

Now we reach the really important part.

Suppose you define:
```TS

const weatherTool = tool(
  async ({ city }) => {
    return getWeather(city);
  },
  {
    name: "get_weather",
    description: "Get weather for a city",
    schema: z.object({
      city: z.string()
    })
  }
);
```

A beginner thinks:

"The LLM executes this function."

No.

The LLM cannot execute your TypeScript function.

The actual process is:

             Your application
                    │
                    ▼
             Tool definition
                    │
                    ▼
             JSON schema
                    │
                    ▼
               LLM request
                    │
                    ▼
                LLM model
                    │
                    ▼
              tool call JSON
                    │
                    ▼
          LangChain runtime
                    │
                    ▼
             Your TS function
                    │
                    ▼
             Tool result
                    │
                    ▼
                LLM again

This distinction is fundamental.

# 9. Tool schema

Your TypeScript:

```
z.object({
  city: z.string()
})
```

can be transformed conceptually into:
```JSON

{
  "type": "object",
  "properties": {
    "city": {
      "type": "string"
    }
  },
  "required": ["city"]
}
```

That schema is sent to the model provider.

The model sees something conceptually like:

Available tool:

```
get_weather

Arguments:
{
  city: string
}
```

The model doesn't see your function implementation.

It sees the interface/schema.

# 10. The LLM decides to call the tool

User:

What's the weather in Delhi?

Model might return:
```

{
  "tool_calls": [
    {
      "name": "get_weather",
      "arguments": {
        "city": "Delhi"
      }
    }
  ]
}
```


LangChain receives this.

Then the runtime performs:

```TS
const result =
  await weatherTool.invoke({
    city: "Delhi"
  });

```
Maybe:

28°C
Sunny

Then LangChain creates a tool message:

ToolMessage:
"28°C, Sunny"