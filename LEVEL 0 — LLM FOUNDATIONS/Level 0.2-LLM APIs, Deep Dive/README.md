# 1. The Most Important Mental Model

There are several different things that people casually call "the LLM":
```

                 AI ecosystem
                      │
        ┌─────────────┴─────────────┐
        │                           │
   Model itself                Infrastructure
        │                           │
 Transformer weights          GPU servers
 Tokenizer                    batching
 Architecture                 KV cache
                               scheduling
        │
        ▼
   Inference server
        │
        ▼
      HTTP API
        │
        ▼
       SDK
        │
        ▼
 Your TypeScript application
 ```
```

As a TS developer, you normally interact with the API, not directly with the model.
```

For example:

```TS
const response = await client.responses.create({
  model: "some-model",
  input: "Explain PostgreSQL replication",
});

```
You are effectively saying:

```
"Hey inference service, run this model against this input and give me the generated result."
```

# 2. What Is Inference?

You have probably heard:

training
<br/>
inference

They are fundamentally different.

Training

The model's parameters change.
```

dataset
   ↓
tokens
   ↓
model
   ↓
prediction
   ↓
loss
   ↓
gradients
   ↓
update weights
   ↓
repeat billions/trillions of times

```
Eventually you get:

```
W

where W represents billions of learned parameters.

```
Inference

The parameters are already fixed.
```

input
  ↓
model(W)
  ↓
output
```

No learning is happening.

When you send:

"Explain Raft"

the provider isn't teaching the model Raft.

It's executing the already-trained model.

<b>That execution is called inference.</b>
# 3. What Actually Exists Behind the API?

Suppose you use a provider.

Conceptually:
```

Your Node.js process
        │
        │ HTTPS
        ▼
┌─────────────────────────────┐
│ Provider API gateway        │
├─────────────────────────────┤
│ Authentication              │
│ Rate limiting               │
│ Request validation          │
│ Usage accounting            │
│ Routing                     │
└──────────────┬──────────────┘
               │
               ▼
       Inference scheduler
               │
               ▼
        GPU infrastructure
               │
               ▼
          Model runtime
               │
               ▼
          Transformer

```
There may be many additional layers in reality:

```
load balancer
gateway
quota system
scheduler
model router
GPU worker
KV-cache manager
batching engine
serialization layer
observability
billing
```

You don't normally see those.

The API gives you an abstraction over them.

# 4. API vs SDK

This distinction is mandatory knowledge.

<i>API</i>

An API is the interface exposed by the provider.

Usually HTTP.

Conceptually:

POST /v1/...

with:

Authorization: Bearer ...
Content-Type: application/json

and:

```TS
{
  "model": "...",
  "input": "..."
}
```
SDK

<b>The SDK is a TypeScript/JavaScript library that makes that API easier to consume.</b>
Instead of:

```TS
await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

```
you get:

await client.responses.create(payload);

The SDK is not the AI.

Think:
```

SDK
 ↓
HTTP
 ↓
API
 ↓
inference infrastructure
 ↓
model
```


# 5. Why HTTP?

Because distributed systems.

Your application might run:

Delhi

while the model infrastructure might run somewhere else entirely.

You can't normally do:

import Transformer from "provider";

and execute their gigantic model locally.

Instead:
```

Your process
      │
      │ TCP/TLS
      ▼
Internet
      │
      ▼
Provider infrastructure

```
HTTP gives us:
```

authentication
request/response semantics
streaming
status codes
retries
proxies
observability
language independence

```
This means the same model can be accessed from:

```
TypeScript
Python
Go
Rust
Java
curl
```

because underneath, they're all speaking the API protocol.

# 6. API Key Authentication

Typically:

```TS
const client = new Provider({
  apiKey: process.env.PROVIDER_API_KEY,
});
```

The SDK eventually sends something like:
```TS

Authorization: Bearer sk-...

The API gateway checks:

Is this credential valid?
        │
        ├── no → 401
        │
        └── yes
             ↓
         continue
Critical backend rule

Never expose provider API keys to the browser.

Bad:

React browser
   ↓
Provider API
   ↑
API key embedded in JS

Anyone can inspect it.

Instead:

Browser
   │
   │ HTTPS
   ▼
Your backend
   │
   │ API key stored server-side
   ▼
LLM provider

For a Next.js app:

Browser
   ↓
/api/chat
   ↓
server
   ↓
LLM API

This is standard secret-boundary design.

7. What Does the Request Actually Contain?

At the application level, you typically specify things like:

{
  model: "...",
  input: "...",
  temperature: ...,
  max_output_tokens: ...,
  tools: [...],
  response_format: ...,
}

Not every provider supports exactly the same fields.

But conceptually:

Request
├── model
├── input/context
├── generation controls
├── tools
├── output constraints
└── metadata


```
Let's understand each.
# 8. Model

This tells the provider which model to execute.

```
{
  model: "some-model"
}

```
Think:
```

Provider
│
├── fast-small-model
├── reasoning-model
├── vision-model
├── embedding-model
└── etc.
```
```
Provider 
│
├── fast-small-model
├── reasoning-model
├── vision-model
├── embedding-model
└── etc.

```
The model determines things like:
```

capabilities
context window
latency
cost
modalities
reasoning behavior
output limits
```

So your application architecture should not hard-code assumptions that every model behaves identically.

# 9. Input

At the simplest level:

```TS
{
  input: "Explain Redis"
}
```

But modern APIs can accept richer structures.

Conceptually:
```TS

[
  {
    role: "system",
    content: "You are a backend engineering assistant."
  },
  {
    role: "user",
    content: "Explain Redis."
  }
]
```

The important thing:

The model ultimately operates on tokens.

Your structured messages are an API-level representation.

Eventually:
```

messages
   ↓
provider's request processing
   ↓
tokenization / serialization
   ↓
token sequence
   ↓
Transformer
```

So when you're manipulating messages, you're ultimately constructing the model's context.

# 10. Context

Suppose your conversation is:
```

User:
My database uses PostgreSQL.

Assistant:
Okay.

User:
What database am I using?


```
The final request needs enough context to establish:

PostgreSQL

The model doesn't have magical persistent memory of your application.

If you don't provide the relevant information, the model generally doesn't have access to it.

Your backend often constructs:
```

const messages = [
  systemMessage,
  ...conversationHistory,
  currentUserMessage,
];


```
Then:

messages
   ↓
tokens
   ↓
model

This is why context management becomes a huge engineering problem.

# 11. Context Window

Suppose a model supports some maximum number of tokens.

Conceptually:
```

┌──────────────────────────────────────────┐
│             Context Window               │
│                                          │
│ system instructions                      │
│ conversation history                     │
│ retrieved documents                      │
│ tool results                             │
│ current request                          │
│                                          │
│                  ↓                       │
│              generation                  │
└──────────────────────────────────────────┘

```
Your application must manage this.

For an agent, for example:
```

system prompt
+
conversation
+
RAG results
+
tool results
+
current request
```

can grow extremely quickly.

Therefore:

```
context engineering

is a genuine backend/application architecture concern.

```
# 12. Output

The model produces tokens.

Conceptually:
```

input tokens
     ↓
Transformer
     ↓
logits
     ↓
sampling
     ↓
token
     ↓
token
     ↓
token
     ↓
...

```
The API collects or streams those generated tokens.

Eventually you might get:

response.output_text

or a provider-specific response structure.

Important distinction:

model output

is not necessarily just:

string

Modern APIs can expose:

text
tool calls
structured output
citations
usage
metadata
reasoning-related fields
finish reason

depending on provider/API.

# 13. Why Does Generation Take Time?

This connects directly to your token knowledge.

Suppose output is:

"Redis is an in-memory data store."

The model conceptually generates:
```

Redis
 ↓
is
 ↓
an
 ↓
in-memory
 ↓
data
 ↓
store
 ↓
.
```

Each step requires computation.

So latency has multiple components.

A simplified model:

$$ T_{total} = T_{network} + T_{queue} + T_{prefill} + T_{decode} $$

Where:

```
Network

Your request travels to the provider.

Queue

Your request may wait for inference capacity.

Prefill

The provider processes your input/context.

Decode

The model generates output tokens.

```
# 14. TTFT vs Total Latency

This is VERY important for AI applications.

TTFT

Time To First Token
```

request
   ↓
████████████
first token
Total latency
request
   ↓
████████████████████████
complete response

```
Suppose:

TTFT = 700ms
generation = 4s

The user might see:

```
0.7s → response begins appearing
4.7s → response finished

```
Streaming makes the UX feel dramatically better because you expose the first token immediately.

# 15. Streaming

Without streaming:
```

Client
  │
  │ request
  ▼
Provider
  │
  │ generates entire answer
  │
  ▼
Client

With streaming:

Client
  │
  │ request
  ▼
Provider
  │
  ├── token/event ──→ Client
  ├── token/event ──→ Client
  ├── token/event ──→ Client
  ├── token/event ──→ Client
  └── ...

This is usually implemented using a streaming HTTP mechanism such as SSE or another event-streaming protocol depending on the API.

Your frontend can progressively render:

R
Re
Redis
Redis is
Redis is an
Redis is an in-memory
...
```
# 16. Streaming Is Not Just a UI Trick

It affects your architecture.

Imagine your backend:
```

Browser
   ↓
Node.js
   ↓
LLM
```

If the LLM streams, your Node server needs to correctly propagate that stream:

```
LLM
 ↓
Node.js
 ↓
Browser

```
You need to think about:

```
backpressure
connection cancellation
client disconnects
timeouts
buffering
partial output
error events
cleanup
proxy behavior

```
This is where your backend knowledge becomes directly useful.

# 17. Temperature

You already know the conceptual model.

The model generates logits:

```
token       logit
-----------------
A            8.2
B            7.1
C            3.4
D            1.1

```
Temperature changes how the logits become probabilities.

Conceptually:
```

low temperature
     ↓
sharp distribution
     ↓
predictable choices

while:

high temperature
     ↓
flatter distribution
     ↓
more variation

```
It doesn't add intelligence.

It changes sampling behavior.

# 18. Token Limits

Suppose your request contains:

20,000 input tokens

and you allow:

4,000 output tokens

Then your total model workload can be substantial.

Your application needs to understand:
```

input tokens
+
output tokens
=
usage
```

Exact billing rules depend on the provider/model.

But from an engineering perspective:

```
tokens
   ↓
cost
   ↓
latency
   ↓
capacity
```

This is why token awareness matters.

# 19. Why max_output_tokens Exists

<h2>
Without a limit, a generation could theoretically continue until the model reaches some stopping condition or provider constraint.
</h2>
You often want:

max_output_tokens: 1000

because your application might know:

>"I only need a short answer."

This protects against:

```
unnecessary cost
long latency
runaway generations
oversized responses
```
# 20. Stop Conditions

Generation eventually needs to terminate.

Possible conceptual reasons:

```
STOP
MAX_TOKENS
TOOL_CALL
ERROR
CONTENT_FILTER
etc.
```

The exact values differ across APIs.

Your backend should not blindly assume:

every response = successful final text

A model response can represent another action.

For example:

```
User
 ↓
LLM
 ↓
tool call
```

not:
```

LLM
 ↓
text

```
This becomes critical later.

# 21. Structured Outputs

Suppose you're building:

email classifier

You don't want:

"The email appears to be related to billing..."

You want:
```

{
  "category": "billing",
  "priority": "high",
  "confidence": 0.94
}
```

Your architecture becomes:
```

User input
   ↓
LLM
   ↓
structured output
   ↓
schema validation
   ↓
TypeScript object
   ↓
business logic
```

> This is where Zod + TypeScript becomes extremely useful.

Conceptually:
```

const ResultSchema = z.object({
  category: z.enum(["billing", "technical", "sales"]),
  priority: z.enum(["low", "medium", "high"]),
});
```

Then:
```

LLM output
   ↓
validation
   ↓
trusted application object

```
Important:

Never treat model-generated data as inherently trustworthy merely because it looks like JSON.

LLM output crosses a trust boundary.

# 22. Tool Calling

Now we hit one of the most important concepts in modern GenAI.

Suppose:
```

User:
What's my account balance?

The LLM doesn't inherently have:

database.getBalance()

```
Instead, you provide a tool definition.

Conceptually:
```

{
  name: "getAccountBalance",
  description: "Get the user's current account balance",
  parameters: {
    ...
  }
}

```
Then:

```
User
 ↓
LLM
 ↓
tool call request
 ↓
your TypeScript server
 ↓
execute function
 ↓
database
 ↓
tool result
 ↓
LLM
 ↓
final response

```
This is the fundamental agent loop.

# 23. The Crucial Insight About Tool Calling

The LLM does not execute your function.

This distinction is huge.

The model produces something conceptually like:

```TS
{
  "tool": "getAccountBalance",
  "arguments": {
    "userId": "123"
  }
}
```

Your application receives that.

Then your code decides whether to execute it.

```
if (toolCall.name === "getAccountBalance") {
  const result = await getAccountBalance(userId);
}
```

Therefore:

```
LLM = decision generation
Your application = authority/execution

```
This separation becomes critical for security.

# 24. Why This Matters for Agents

An agent isn't some mystical new kind of model.

A simple agent can be:
```


while (!done) {
    response = await llm(...);

    if (response.toolCall) {
        result = await executeTool(response.toolCall);
        messages.push(result);
        continue;
    }

    return response;
}
```

Conceptually:

             ┌──────────────┐
             │     User     │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │     LLM      │
             └──────┬───────┘
                    ↓
             ┌──────┴───────┐
             │              │
          final text      tool call
             │              │
             ↓              ↓
           User          Your code
                            ↓
                          Tool
                            ↓
                         Result
                            ↓
                           LLM

That's the foundation.

# 25. Errors

Your LLM API is a distributed dependency.

Therefore:

It will fail.

Possible failures:
```

401 Unauthorized
403 Forbidden
429 Rate Limited
400 Invalid Request
408 Timeout
5xx Provider Failure
network failure
connection reset
stream interruption
context overflow
model unavailable
```

Treat the provider exactly like any other external dependency.

Bad:

const response = await llm.generate();

with no error strategy.

Better architecture:
```

request
 ↓
timeout
 ↓
retry policy
 ↓
fallback?
 ↓
observability
 ↓
response
```

#
# 26. Retry Is Not Always Safe

This is where distributed systems knowledge matters.

Suppose you're doing:

LLM → tool call → charge credit card

You cannot blindly retry every operation.

For pure inference:

generate()

retrying is generally much safer.

But for side effects:

```
chargeCard()
sendEmail()
deleteUser()
createOrder()

```

> you need idempotency and authorization semantics.

The LLM should never become your transaction manager.

Your application remains authoritative.

# 27. Rate Limiting

```
Imagine:

1000 users
   ↓
your API
   ↓
LLM provider

If every user can generate unlimited requests:

traffic
   ↓
provider
   ↓
429

```
So you need your own rate limits.

For example:
```

user → 20 requests/minute
IP → 100 requests/minute
tenant → 10k requests/hour
```

And potentially provider-aware concurrency limits.

This becomes:
```

Client
 ↓
Your rate limiter
 ↓
Queue / concurrency limiter
 ↓
LLM API


```
28. Cost

Suppose your application generates:

10 million input tokens
+
2 million output tokens

Your bill depends on the model/provider's pricing.

Therefore you should track:
```

request
├── model
├── input tokens
├── output tokens
├── latency
├── success/failure
└── estimated cost

```

A production AI system should have observability around these.

Think of LLM usage as a resource:

$$ \text{Cost} = \sum_i ( I_i C_{in} + O_i C_{out} ) $$

where:
```

\(I_i\) = input tokens
\(O_i\) = output tokens
\(C_{in}\) = input-token price
\(C_{out}\) = output-token price

```
Exact billing models vary, but the engineering principle remains.

# 29. Model Routing

Suppose your application has:

simple classification
complex reasoning
summarization
code generation
embeddings

You don't necessarily want one giant expensive model for everything.

You can build:

                     Request
                        ↓
                   Classifier
                        ↓
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
        cheap          fast         powerful
        model          model          model

For example:
```


simple task → cheap model
complex task → reasoning model
embedding → embedding model
vision → multimodal model

```
This is model routing.

It becomes a real backend optimization problem.

# 30. Provider Abstraction

Suppose you directly write:

>const client = new OpenAI(...);

everywhere in your codebase.

Six months later:

```
OpenAI
Anthropic
Gemini
local model
fallback provider

```
Now your application is tightly coupled.

Instead, define your own abstraction:

```TS
interface LLM {
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  stream(request: GenerateRequest): AsyncIterable<LLMEvent>;
}

```


Then:
```
             LLM interface
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
   Provider A  Provider B  Provider C
```
Your business logic doesn't need to care which provider is underneath.

But don't over-abstract prematurely. Provider APIs have meaningful differences, especially around tools, reasoning, multimodality, caching, and structured outputs.

# 31. Your Backend Architecture

For a serious application:

                 Browser
                    │
                    │ HTTPS
                    ▼
             ┌──────────────┐
             │ API Gateway  │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ AI Service   │
             ├──────────────┤
             │ auth         │
             │ rate limit   │
             │ validation   │
             │ context      │
             │ orchestration│
             └──────┬───────┘
                    │
           ┌────────┼─────────┐
           ↓        ↓         ↓
         Cache     RAG      Tools
           │        │         │
           │        ↓         ↓
           │    Vector DB   Services
           │
           └────────┬────────┘
                    ↓
              Model Router
                    ↓
             LLM Provider

That is much closer to the engineering you'll eventually build.
