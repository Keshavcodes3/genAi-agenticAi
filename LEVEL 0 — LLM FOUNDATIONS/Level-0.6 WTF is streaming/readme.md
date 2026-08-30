# Streaming in AI Systems

Streaming is one of those things that looks trivial from the frontend:

```TS

"Hel"
"Hello"
"Hello, I"
"Hello, I can"
...

```

But underneath, it is a distributed data-delivery problem.

```


In Mira (an Ai virtual assitant), streaming becomes especially interesting because you don't only want to stream LLM tokens. You potentially want to stream the entire agent execution lifecycle:


```

```

agent started
      ↓
LLM started
      ↓
token
      ↓
token
      ↓
tool requested
      ↓
tool executing
      ↓
tool completed
      ↓
LLM resumed
      ↓
token
      ↓
final response

```

So let's build the concept from the network layer upward.

# 1. What Is Streaming?

Without streaming:

```

Client
  │
  │ request
  ▼
Server
  │
  │ wait...
  │
  │ LLM generates 2,000 tokens
  │
  │ wait...
  ▼
Complete response
```

The user sees nothing for several seconds.

With streaming:

```


Client
  │
  │ request
  ▼
Server
  │
  ├── token 1 ───────► Client
  ├── token 2 ───────► Client
  ├── token 3 ───────► Client
  ├── token 4 ───────► Client
  ├── token 5 ───────► Client
  │
  ...
  │
  └── done ──────────► Client


  ```

> The server doesn't wait for the complete response.

It sends incremental pieces as they become available.

# 2. Streaming Is Not "Faster Generation"

This distinction matters.

Suppose the model needs:

4 seconds to generate a response.

Streaming doesn't necessarily reduce that to:

2 seconds

The model may still take 4 seconds overall.

What changes is:

$$ TTFT = Time\ To\ First\ Token $$

instead of:

$$ TTFR = Time\ To\ Full\ Response $$

Without streaming:

```

request ─────────────── 4s ───────────────► response
```

With streaming:

```
request ── 500ms ──► first token ── ... ──► complete

```

The user perceives progress immediately.

# 3. Two Important Latencies

For AI applications, distinguish:

Time To First Token
$$ TTFT = t_{firstToken} - t_{request} $$

This determines how quickly the UI starts responding.

Time To Last Token
$$ TTLT = t_{lastToken} - t_{request} $$

This determines total generation time.

A good streaming architecture optimizes both independently.

# 4. Why Streaming Matters So Much for Agents

A normal LLM request might produce:

Hello! How can I help you?

But an agent might do:

```

LLM
 ↓
tool call
 ↓
search
 ↓
tool result
 ↓
LLM
 ↓
final response

```

If you only send the final response:

```

"Here is what I found..."

```

the user has no idea what the system is doing.

Instead:

```

Agent started

Searching the web...

Search completed

Analyzing results...

Here is what I found...

Now the agent feels alive because you're streaming events, not merely text.

```

# 5. Token Streaming

The simplest form is token/chunk streaming.

Suppose the model produces:

Hello, I am Mira.

Instead of:

"Hello, I am Mira."

all at once, the model API may provide chunks:

```

"Hello"
","
" I"
" am"
" Mira"
"."
```

The exact chunk boundaries depend on the provider.

Don't assume:

one chunk = one token

A chunk is an implementation-level piece of streamed output.

# 6. Token vs Chunk

These are often confused.

Token

A unit used by the model's tokenizer.

For example, conceptually:

```

"Hello"
" world"
"!"
Chunk
```

A piece of data emitted by the API transport.

A chunk could contain:

```

{
  "delta": "Hello"
}
```

or:

```
{
  "delta": {
    "content": "Hello"
  }
}

```

or several pieces of metadata.

Therefore:

$$ Token \neq Chunk $$

# 7. How LLM Streaming Works Internally

At a high level:

```TS

Prompt
  ↓
Tokenizer
  ↓
Model inference
  ↓
next token
  ↓
decode
  ↓
network stream
  ↓
client
```

The model performs autoregressive generation:

$$ P(x_t | x_{<t}) $$

At each generation step:

```
context
 ↓
model
 ↓
probability distribution
 ↓
select token
 ↓
emit token
 ↓
append token to context
 ↓
repeat

```

Instead of waiting until all tokens are generated:

```

token → network
token → network
token → network
...
```

# 8. Autoregressive Generation

Suppose the answer is:

The sky is blue.

The model effectively generates:

```

The

then:

sky

then:

is

then:

blue

then:
```

.

Conceptually:

$$ x_1 \rightarrow x_2 \rightarrow x_3 \rightarrow ... \rightarrow x_n $$

Streaming exposes this incremental process to the application.

# 9. Server-Side Streaming

In Node.js, the important concept is:

Don't construct one giant response body. Write pieces progressively.

Conceptually:

```TS

res.write("Hello");
res.write(" world");
res.write("!");
res.end();

```

The client receives:

```
Hello
 world
!
```

# 10. The HTTP Connection

Normally:

```JS


HTTP Request
      ↓
HTTP Response
      ↓
body


```

For streaming:

```
HTTP Request
      ↓
HTTP Response
      ↓
chunk
chunk
chunk
chunk
chunk
...
```

The connection stays open while the server produces data.

# 11. Node.js Writable Streams

Node's HTTP response is a writable stream.

Conceptually:

```
res.write(chunk);

```

means:

>"Send this chunk to the response stream."

Then:

res.end();

means:

"No more data."

This is the foundation underneath many streaming implementations.

# 12. Backpressure

Now we reach an important systems concept.

Suppose:

```
Producer:
10,000 chunks/sec

but:

Consumer:
1,000 chunks/sec

The producer can overwhelm the consumer.

That's backpressure.

```

The flow is:

```

Producer
   │
   │ too fast
   ▼
Buffer
   │
   ▼
Consumer

```

If buffers grow indefinitely:

$$ Memory \rightarrow \infty $$

Eventually:

OOM

# 13. Node Backpressure

For writable streams:

```

const canContinue = res.write(chunk);

```

If:

canContinue === false

the writable buffer is full enough that you should respect backpressure.

Conceptually:

```

if (!res.write(chunk)) {
  await once(res, "drain");
}
```

Then continue.

This is classic producer-consumer flow control.

# 14. Streaming to the Browser

The browser can consume a streaming response using the Fetch API.

```RS
const response = await fetch("/api/chat");

const reader = response.body!.getReader();

while (true) {
  const { done, value } = await reader.read();

  if (done) break;

  const text = new TextDecoder().decode(value);

  console.log(text);
}


```

Now the frontend receives data incrementally.

# 15. Why TextDecoder Matters

Network chunks are bytes.

You may receive:

Uint8Array

not strings.

So:

```JS

const decoder = new TextDecoder();

const text = decoder.decode(value, {
  stream: true
});


```

The stream: true option matters because a UTF-8 character can theoretically be split across byte chunks.

For example:

```

chunk 1:
[partial bytes]

chunk 2:
[remaining bytes]

```

You don't want to decode each chunk independently and corrupt the character.

# 16. SSE

One popular mechanism for AI streaming is:

```
Server-Sent Events
```

SSE is designed for:

```


Server → Client

continuous event delivery.

The server sets:

Content-Type: text/event-stream

Then sends events like:


```

data: Hello

data: world

data: !

Each event is separated appropriately according to the SSE protocol.

# 17. SSE Mental Model

```JS
Browser
   │
   │ HTTP connection
   ▼
Server
   │
   ├── event
   ├── event
   ├── event
   ├── event
   └── event


```

It's essentially a long-lived HTTP response carrying events.

# 18. Basic SSE Server

With Express:

```TS

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: Hello\n\n`);

  setTimeout(() => {
    res.write(`data: World\n\n`);
  }, 1000);

  setTimeout(() => {
    res.write(`data: [DONE]\n\n`);
    res.end();
  }, 2000);
});

```

Client:

```TS
const source = new EventSource("/stream");

source.onmessage = (event) => {
  console.log(event.data);
};

```

# 19. SSE Events

You don't have to send only raw text.

You can send structured JSON.

```

event: token
data: {"text":"Hello"}

event: token
data: {"text":" world"}

event: done
data: {}

```

Now the frontend can distinguish event types.

 1. A Better AI Event Protocol

For an agent, define your own event schema.

For example:

```R

type AgentEvent =
  | {
      type: "agent.started";
    }
  | {
      type: "message.delta";
      text: string;
    }
  | {
      type: "tool.started";
      tool: string;
      callId: string;
    }
  | {
      type: "tool.completed";
      tool: string;
      callId: string;
      result?: unknown;
    }
  | {
      type: "agent.completed";
    }
  | {
      type: "agent.error";
      message: string;
    };

```

Now your frontend isn't coupled to a particular LLM provider.

That's a very good architectural boundary.

# 1. Streaming Agent Events

Imagine the user asks:

Find me information about MongoDB indexing.

Your agent could emit:

```

{
  "type": "agent.started"
}

Then:

{
  "type": "tool.started",
  "tool": "search_web",
  "callId": "call_1"
}

Then:

{
  "type": "tool.completed",
  "tool": "search_web",
  "callId": "call_1"
}

Then:

{
  "type": "message.delta",
  "text": "MongoDB indexes..."
}

And finally:

{
  "type": "agent.completed"
}

Now the client gets a complete execution timeline.


```

# 1. Why Not Just Stream Text?

Because an agent is not just text generation.

Consider:
```

LLM
 ↓
search_web
 ↓
database
 ↓
search_web
 ↓
final response

```
If you only stream:

"MongoDB indexes..."

you lose the execution semantics.
```

Structured events give you:

WHAT happened
WHEN it happened
WHICH tool ran
WHICH call it belongs to
WHETHER it succeeded


```
This is much better for:

```

UI
debugging
observability
analytics
retries
audit logs


```


# 20 . Final Mental Model

The whole thing can be reduced to this:

                     LLM
                      │
               generates incrementally
                      │
                      ▼
              Model Stream
                      │
                      ▼
              ┌──────────────┐
              │ Agent Runtime│
              └──────┬───────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        Token       Tool       State
        Event       Event      Event
          │          │          │
          └──────────┼──────────┘
                     ▼
                Event Stream
                     │
                     ▼
                HTTP/SSE
                     │
                     ▼
                  Browser
                     │
                     ▼
                React State
                     │
                     ▼
                    UI


                    ```

                    The deeper connection is beautiful:

LLM inference is incremental.

Streams expose incremental computation.

Agents turn those computations into events.

```


So the "typing effect" you see in ChatGPT-like interfaces is actually the visible tip of a much larger system involving autoregressive inference, asynchronous iteration, network streaming, backpressure, cancellation, event protocols, state machines, and distributed execution.

```