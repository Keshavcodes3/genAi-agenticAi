# AI Agents, Tool Calling & Beyond

### A practical deep-dive from first principles to production architecture

> **The core idea:** An LLM does not become an agent merely because it can generate text.
> An agent appears when an LLM is placed inside a **feedback loop** where it can observe state, choose actions, execute tools, inspect results, and continue reasoning.

---

# 1. Start Here: What Is an LLM Actually Doing?

At the lowest useful level, an LLM takes context and predicts the next tokens.

Conceptually:

$$
P(x_{t+1}\mid x_1,x_2,\dots,x_t)
$$

You give it:

```text
System:
You are Mira.

User:
What's 2 + 2?
```

and it generates:

```text
4
```

The important thing is:

**the model itself isn't running your backend.**

It doesn't directly:

* query MongoDB
* call your weather API
* send an email
* read your filesystem
* execute JavaScript
* modify your database

It only produces output.

That output can *request* that your application perform an action.

This distinction is the foundation of tool calling.

---

# 2. Chatbot vs Tool-Using System vs Agent

These three are often mixed together.

## Simple chatbot

```text
User
 ↓
LLM
 ↓
Text
```

Example:

```text
User: What's the capital of India?

LLM: New Delhi.
```

Nothing external happens.

---

## Tool-using LLM

```text
User
 ↓
LLM
 ↓
Tool request
 ↓
Application executes tool
 ↓
Tool result
 ↓
LLM
 ↓
Answer
```

Example:

```text
User:
What's the weather in Delhi?
```

The model might produce:

```json
{
  "tool": "get_weather",
  "arguments": {
    "city": "Delhi"
  }
}
```

Your backend executes it.

---

## Agent

An agent goes one step further.

The model can repeatedly decide:

```text
What should I do next?
```

So:

```text
User
 ↓
LLM
 ↓
Decision
 ↓
Tool
 ↓
Observation
 ↓
LLM
 ↓
Decision
 ↓
Tool
 ↓
Observation
 ↓
LLM
 ↓
Final answer
```

The loop is the important part.

---

# 3. The Simplest Definition of an Agent

A practical definition:

> **An agent is an LLM-driven control loop that observes state, chooses actions, executes those actions, receives results, and continues until a stopping condition is reached.**

We can model it as:

$$
S_t \rightarrow LLM \rightarrow A_t \rightarrow Environment \rightarrow O_{t+1}
$$

Where:

* \(S_t\) = current state
* \(A_t\) = action
* Environment = tools/external systems
* \(O_{t+1}\) = observation/result

Then the cycle repeats.

---

# 4. The Agent Loop

Here's the entire concept:

```text
                 ┌───────────────┐
                 │     User      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     State     │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │      LLM      │
                 └───────┬───────┘
                         │
                  What should I do?
                         │
                ┌────────┴────────┐
                │                 │
             Final              Tool
                │                 │
                ▼                 ▼
             Answer          Execute Tool
                                  │
                                  ▼
                            Tool Result
                                  │
                                  ▼
                               State
                                  │
                                  └──────► LLM
```

That's an agent.

The fancy frameworks are abstractions around this basic mechanism.

---

# 5. Tool Calling

Now let's understand the interesting part.

Suppose you define this tool:

```typescript
const getWeatherTool = {
  name: "get_weather",

  description: "Get the current weather for a city.",

  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string"
      }
    },
    required: ["city"]
  }
};
```

You're essentially telling the model:

> "You have access to an operation called `get_weather`. If you need weather information, request it using this structure."

Notice something important.

You're **not giving the LLM the function itself**.

You're giving it a **description of the function**.

---

# 6. The Model Doesn't Execute the Function

Suppose your actual backend has:

```typescript
async function getWeather(city: string) {
  const response = await fetch(
    `https://weather-api.example.com/${city}`
  );

  return response.json();
}
```

The LLM does not execute this.

Instead, it generates something like:

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "Delhi"
  }
}
```

That's all.

Your application receives that structure and says:

```typescript
const result = await getWeather("Delhi");
```

So:

$$
\boxed{
LLM \rightarrow Intent
}
$$

and:

$$
\boxed{
Application \rightarrow Execution
}
$$

This distinction is incredibly important.

---

# 7. Why Is This Called "Tool Calling"?

Because the model is effectively saying:

```text
"I want to call this capability."
```

It isn't literally performing the call.

Think of it like a very intelligent employee who writes:

```text
CALL:
database.searchUsers({
    name: "Keshav"
})
```

Then your backend executes the request.

The employee proposes the action.

The system performs the action.

---

# 8. Tool Calling Step by Step

Suppose the user asks:

```text
What's the weather in Delhi?
```

### Step 1: Backend receives request

```http
POST /chat
```

```json
{
  "message": "What's the weather in Delhi?"
}
```

---

### Step 2: Backend constructs model input

```typescript
const messages = [
  {
    role: "system",
    content: "You are Mira."
  },
  {
    role: "user",
    content: "What's the weather in Delhi?"
  }
];
```

And sends the tool definition too:

```typescript
const tools = [
  getWeatherTool
];
```

---

### Step 3: Model reasons

Internally, the model determines that it needs external information.

Conceptually:

```text
Question requires current weather
        ↓
I have get_weather
        ↓
Use get_weather
        ↓
city = Delhi
```

The internal reasoning itself isn't something your backend needs to reproduce.

The model outputs a structured tool request.

---

### Step 4: Model returns tool call

Something conceptually like:

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_123",
      "name": "get_weather",
      "arguments": {
        "city": "Delhi"
      }
    }
  ]
}
```

---

# 9. Your Backend Takes Over

Your application receives:

```typescript
response.tool_calls
```

Then:

```typescript
for (const call of response.tool_calls) {
  const tool = tools[call.name];

  const args = JSON.parse(call.arguments);

  const result = await tool.execute(args);
}
```

A simple registry:

```typescript
const tools = {
  get_weather: getWeatherTool,
  search_web: searchWebTool,
  save_memory: saveMemoryTool
};
```

Then:

```typescript
const tool = tools[call.name];

if (!tool) {
  throw new Error("Unknown tool");
}

const result = await tool.execute(args);
```

Now the actual external operation occurs.

---

# 10. Tool Results Go Back to the Model

Suppose:

```typescript
getWeather("Delhi")
```

returns:

```json
{
  "temperature": 31,
  "condition": "Clear"
}
```

Your backend adds that result to the conversation:

```json
{
  "role": "tool",
  "tool_call_id": "call_123",
  "content": "{\"temperature\":31,\"condition\":\"Clear\"}"
}
```

Then you call the model again.

Now the model sees:

```text
User:
What's the weather in Delhi?

Assistant:
[requested get_weather]

Tool:
Temperature: 31°C
Condition: Clear
```

It can generate:

```text
It's currently 31°C in Delhi with clear skies.
```

---

# 11. The Entire Flow

So the complete process is:

```text
USER
 │
 │ "What's the weather?"
 ▼
BACKEND
 │
 │ messages + tool definitions
 ▼
LLM
 │
 │ tool_call(get_weather, {city:"Delhi"})
 ▼
BACKEND
 │
 │ validate
 ▼
TOOL
 │
 │ API request
 ▼
WEATHER API
 │
 │ 31°C
 ▼
BACKEND
 │
 │ tool result
 ▼
LLM
 │
 │ final response
 ▼
BACKEND
 │
 ▼
USER
```

This is the core mechanism behind modern tool-using AI systems.

---

# 12. Why Give the Model Tool Schemas?

Because the model needs to know:

* what tools exist
* what they do
* what arguments they accept
* which arguments are required
* what type each argument has

For example:

```typescript
const searchTool = {
  name: "search",

  description:
    "Search the web for current information.",

  parameters: {
    type: "object",

    properties: {
      query: {
        type: "string",
        description: "Search query"
      }
    },

    required: ["query"]
  }
};
```

The schema acts as a contract.

---

# 13. Tool Calling Is Basically RPC

This is a useful backend analogy.

Traditional RPC:

```text
Client
   │
   │ call("getUser", { id: 42 })
   ▼
Server
   │
   ▼
Function
```

LLM tool calling:

```text
LLM
   │
   │ call("get_user", { id: 42 })
   ▼
Agent Runtime
   │
   ▼
Function
```

So you can think of tool calling as:

> **LLM-generated RPC requests.**

The difference is that the caller is probabilistic.

That's why validation is essential.

---

# 14. Never Trust Tool Arguments

Suppose your tool expects:

```typescript
{
  userId: string
}
```

The model might output:

```json
{
  "userId": 123
}
```

or:

```json
{
  "user": "someone"
}
```

or even malformed JSON.

So the execution pipeline should be:

```text
LLM
 ↓
Parse
 ↓
Schema validation
 ↓
Authorization
 ↓
Business validation
 ↓
Execution
```

With Zod:

```typescript
const schema = z.object({
  userId: z.string()
});

const args = schema.parse(rawArguments);
```

The LLM should be treated exactly like an untrusted client.

---

# 15. Tool Registry

As the number of tools grows, don't write:

```typescript
if (toolName === "weather") {
  ...
}

if (toolName === "search") {
  ...
}

if (toolName === "memory") {
  ...
}
```

Create a registry.

```typescript
interface Tool {
  name: string;
  description: string;

  execute(args: unknown): Promise<unknown>;
}
```

Then:

```typescript
const registry = new Map<string, Tool>();

registry.set("get_weather", weatherTool);
registry.set("search_web", searchTool);
registry.set("save_memory", memoryTool);
```

Execution:

```typescript
const tool = registry.get(call.name);

if (!tool) {
  throw new Error(`Unknown tool: ${call.name}`);
}

const result = await tool.execute(args);
```

Now adding tools becomes modular.

---

# 16. Tool Architecture

A production tool can look like:

```typescript
interface Tool<TArgs, TResult> {
  name: string;

  description: string;

  schema: ZodSchema<TArgs>;

  execute(
    args: TArgs,
    context: ToolContext
  ): Promise<TResult>;
}
```

And:

```typescript
interface ToolContext {
  userId: string;
  chatId: string;
  requestId: string;
}
```

Now the tool doesn't need to figure out who the user is.

The runtime already knows.

---

# 17. Tool Execution Pipeline

A robust runtime might look like:

```text
                Tool Call
                    │
                    ▼
             Is tool registered?
                    │
                    ▼
              Parse arguments
                    │
                    ▼
             Validate schema
                    │
                    ▼
              Check permission
                    │
                    ▼
             Business validation
                    │
                    ▼
                 Execute
                    │
                    ▼
              Validate result
                    │
                    ▼
             Record telemetry
                    │
                    ▼
              Return result
```

This is much closer to production architecture.

---

# 18. Tools Can Be Read or Write Operations

### Read-only

```text
search_web
get_weather
get_user_profile
search_memory
```

These generally have fewer risks.

### Side-effecting

```text
send_email
delete_file
create_payment
update_database
publish_post
```

These need much stronger controls.

A useful principle:

$$
Risk(tool) \propto
Impact(tool) \times
Autonomy(tool)
$$

The more destructive the tool and the more freedom the agent has, the more safeguards you need.

---

# 19. Tool Calling vs Function Calling

You'll see both terms.

Historically, APIs often called this **function calling**.

The newer terminology is generally **tool calling**, because a capability doesn't necessarily have to be a simple local function.

A tool could represent:

```text
HTTP API
database query
browser
code interpreter
search engine
filesystem
queue
another agent
```

The abstraction is broader:

$$
Tool = External\ Capability
$$

---

# 20. Multiple Tool Calls

The model may request several operations.

For example:

```text
User:
Compare the weather in Delhi and Mumbai.
```

The model could request:

```json
[
  {
    "name": "get_weather",
    "arguments": {
      "city": "Delhi"
    }
  },
  {
    "name": "get_weather",
    "arguments": {
      "city": "Mumbai"
    }
  }
]
```

If the calls are independent, you can execute them concurrently.

```typescript
const results = await Promise.all(
  calls.map(call => executeTool(call))
);
```

This changes latency from roughly:

$$
T_{sequential}
=
T_1 + T_2
$$

to:

$$
T_{parallel}
\approx
\max(T_1,T_2)
$$

assuming the operations are independent and your infrastructure supports concurrency.

---

# 21. But Don't Parallelize Everything

Suppose the model requests:

```text
create_user
delete_user
```

Those operations may conflict.

Or:

```text
create_payment
send_receipt
```

where the second depends on the first.

Then you need ordering:

```text
create_payment
      ↓
payment_id
      ↓
send_receipt(payment_id)
```

So the runtime needs to understand dependencies.

This is where agents start becoming workflow engines.

---

# 22. Agent Loop Code

A minimal agent can be written without a framework.

```typescript
async function runAgent(input: string) {
  const messages = [
    {
      role: "system",
      content: "You are Mira."
    },
    {
      role: "user",
      content: input
    }
  ];

  for (let i = 0; i < 8; i++) {
    const response = await model.generate({
      messages,
      tools
    });

    if (!response.tool_calls?.length) {
      return response.content;
    }

    messages.push(response.message);

    for (const call of response.tool_calls) {
      const result = await executeTool(call);

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result)
      });
    }
  }

  throw new Error("Maximum agent iterations exceeded");
}
```

That tiny loop captures the essential idea.

---

# 23. Why the Loop Exists

Imagine:

```text
User:
Find the best laptop under ₹100,000 and tell me which has the best battery life.
```

One tool isn't enough.

The agent might do:

```text
LLM
 ↓
search_products()
 ↓
results
 ↓
LLM
 ↓
get_product_specs()
 ↓
results
 ↓
LLM
 ↓
compare_products()
 ↓
results
 ↓
LLM
 ↓
final answer
```

The model is effectively navigating a state space.

---

# 24. Agent State

The runtime should maintain state.

```typescript
interface AgentState {
  userId: string;
  chatId: string;

  messages: Message[];

  memories: Memory[];

  toolResults: ToolResult[];

  iteration: number;

  status:
    | "running"
    | "completed"
    | "failed";
}
```

Then:

```text
State
 ↓
LLM
 ↓
Action
 ↓
State'
```

Formally:

$$
S_{t+1}=F(S_t,A_t,O_t)
$$

This state-machine perspective becomes extremely useful later.

---

# 25. Agent = Policy + Environment

A nice theoretical model is:

```text
Agent
  │
  │ chooses action
  ▼
Environment
  │
  │ returns observation
  ▼
Agent
```

The LLM acts like a policy:

$$
\pi(a|s)
$$

meaning:

> given state \(s\), what action \(a\) should I take?

The environment is your:

* database
* APIs
* browser
* filesystem
* tools
* application state

The tool result becomes the next observation.

---

# 26. ReAct

A classic agent pattern is often described as:

```text
Reason
 ↓
Act
 ↓
Observe
 ↓
Reason
 ↓
Act
 ↓
Observe
```

Conceptually:

```text
Question
 ↓
Reason about required information
 ↓
Call tool
 ↓
Observe result
 ↓
Reason about next action
 ↓
Call another tool
 ↓
Observe
 ↓
Answer
```

Modern tool APIs make this structured instead of requiring the model to literally output:

```text
Thought:
...
Action:
...
```

The underlying control loop remains similar.

---

# 27. Planning

An agent doesn't always need a large explicit plan.

Sometimes it can operate reactively:

```text
Do one useful action
 ↓
Observe
 ↓
Decide next action
```

This is **reactive planning**.

Another approach:

```text
Goal
 ↓
Generate plan
 ↓
Execute plan
 ↓
Verify
```

Example:

```text
Goal:
Deploy application.

Plan:
1. Run tests
2. Build
3. Build Docker image
4. Push image
5. Deploy
6. Verify health
```

The trade-off:

| Reactive               | Explicit planning        |
| ---------------------- | ------------------------ |
| simpler                | more structured          |
| adapts dynamically     | predictable              |
| fewer planning tokens  | planning overhead        |
| easier for small tasks | useful for complex tasks |

---

# 28. Agent vs Workflow

This distinction matters enormously.

A workflow:

```text
A → B → C → D
```

You control the path.

An agent:

```text
A
 ↓
LLM decides
 ├── B
 ├── C
 └── D
```

The model influences the path.

Therefore:

$$
Workflow:
next = F(state)
$$

while:

$$
Agent:
next = F(state, model(state))
$$

The second is much harder to predict and test.

---

# 29. Don't Use Agents Everywhere

If the workflow is deterministic:

```text
validate payment
 ↓
charge card
 ↓
send receipt
```

you don't need an agent.

Use normal code.

If the task requires flexible decisions:

```text
Understand user request
 ↓
decide which sources to use
 ↓
search
 ↓
inspect results
 ↓
decide whether more research is needed
```

an agent becomes useful.

A good rule:

> **Use deterministic code for deterministic business logic. Use agents where decision-making genuinely benefits from model flexibility.**

---

# 30. Persistent Memory

Now connect this to Mira.

The LLM is stateless.

Suppose:

```text
Monday:
User: I love Go.
```

Friday:

```text
User: What language am I learning?
```

The model won't magically know.

Your application must retrieve memory.

```text
MongoDB
   │
   │
memory:
"user is learning Go"
   │
   ▼
Context Builder
   │
   ▼
LLM
```

So memory is externalized state.

---

# 31. Memory Pipeline

A useful architecture:

```text
User message
     │
     ▼
Memory extraction
     │
     ▼
Determine importance
     │
     ▼
Normalize
     │
     ▼
Deduplicate
     │
     ▼
Persist
```

Later:

```text
New query
     │
     ▼
Memory retrieval
     │
     ▼
Rank relevant memories
     │
     ▼
Inject into context
     │
     ▼
LLM
```

---

# 32. Memory Isn't Conversation History

Conversation history:

```text
Chat A
 ├── Message 1
 ├── Message 2
 └── Message 3
```

Memory:

```text
User
 ├── prefers TypeScript
 ├── learning distributed systems
 ├── building Mira
 └── likes backend architecture
```

History answers:

> "What happened?"

Memory answers:

> "What should the system continue knowing?"

That's a very different abstraction.

---

# 33. Memory as State Compression

A conversation could contain:

```text
50,000 tokens
```

But the useful persistent knowledge might be:

```text
User is learning distributed systems.
User prefers TypeScript.
User is building AI applications.
```

So memory is effectively a compressed representation:

$$
H \rightarrow M(H)
$$

where:

* \(H\) = history
* \(M(H)\) = persistent semantic state

The goal isn't perfect compression.

The goal is preserving information useful for future interactions.

---

# 34. Context Engineering

Now everything comes together.

The LLM receives something like:

```text
SYSTEM
You are Mira...

MEMORY
User is learning distributed systems.
User prefers TypeScript.

SUMMARY
The user is building an AI agent.

RECENT HISTORY
...

TOOLS
get_weather
search_web
save_memory

CURRENT MESSAGE
How should I structure the agent?
```

This entire object is **context engineering**.

A useful abstraction:

$$
Context =
System
+
History
+
Memory
+
Tools
+
State
+
CurrentInput
$$

The model's output quality depends heavily on this construction.

---

# 35. Context Window Is a Budget

Suppose the model allows:

```text
128k tokens
```

You cannot blindly fill it.

More context isn't automatically better.

You want:

$$
tokens(context) \le B
$$

while maximizing useful information:

$$
\max relevance(context)
$$

This is an optimization problem.

That's why real agent systems need:

* history truncation
* summarization
* memory retrieval
* relevance ranking
* tool-result pruning

---

# 36. Tool Results Also Consume Context

Suppose you search the web and receive:

```text
100 pages
```

Dumping everything into the context is terrible.

Instead:

```text
Search
 ↓
retrieve
 ↓
filter
 ↓
rank
 ↓
summarize
 ↓
LLM
```

Tool design therefore isn't just about execution.

It is also about **controlling information flow into the context window**.

---

# 37. Tool Result Design

Bad tool:

```json
{
  "raw_html": "...500,000 characters..."
}
```

Better:

```json
{
  "title": "...",
  "price": 999,
  "rating": 4.7,
  "availability": true
}
```

Tools should return information optimized for downstream reasoning.

A tool is therefore both:

$$
Capability + Information\ Interface
$$

---

# 38. Tool Errors

Tools fail.

For example:

```text
Weather API
 ↓
500 Internal Server Error
```

Don't crash the entire agent immediately.

Return a structured error:

```json
{
  "success": false,
  "error": {
    "code": "WEATHER_API_UNAVAILABLE",
    "message": "Weather service is temporarily unavailable."
  }
}
```

Then the model can decide:

```text
Try another tool
```

or:

```text
Tell the user the information isn't available.
```

---

# 39. Retry Logic

Not every error deserves a retry.

Example:

```text
timeout → retry
503 → retry
invalid arguments → don't retry blindly
403 → don't retry
404 → probably don't retry
```

A useful classification:

```typescript
type ToolError =
  | { type: "transient"; message: string }
  | { type: "validation"; message: string }
  | { type: "permission"; message: string }
  | { type: "permanent"; message: string };
```

Now your runtime can make better decisions.

---

# 40. Agent Loops Need Limits

Never implement:

```typescript
while (true) {
  ...
}
```

without safeguards.

Use:

```typescript
const MAX_ITERATIONS = 8;
```

Also consider:

```text
maximum tool calls
maximum execution time
maximum token budget
maximum cost
maximum recursion depth
```

Because an agent can theoretically keep doing:

```text
LLM
 ↓
tool
 ↓
LLM
 ↓
tool
 ↓
LLM
 ↓
tool
 ↓
...
```

---

# 41. Timeouts

Every external operation needs a timeout.

```typescript
const controller = new AbortController();

const timeout = setTimeout(
  () => controller.abort(),
  5000
);

try {
  return await fetch(url, {
    signal: controller.signal
  });
} finally {
  clearTimeout(timeout);
}
```

Otherwise one tool can hold the entire agent hostage.

---

# 42. Idempotency

This becomes extremely important for write tools.

Suppose:

```text
send_email()
```

executes successfully.

But the response gets lost.

The runtime retries.

Now:

```text
Email sent
Email sent again
```

Bad.

Use an idempotency key:

```typescript
await sendEmail({
  idempotencyKey: "agent-call-123",
  ...
});
```

Then repeated execution can safely return the same result.

---

# 43. Authorization

The LLM should never decide whether it has permission.

Suppose the user asks:

```text
Delete account 42.
```

The model produces:

```json
{
  "name": "delete_account",
  "arguments": {
    "accountId": "42"
  }
}
```

The backend must still check:

```typescript
if (account.ownerId !== user.id) {
  throw new ForbiddenError();
}
```

The model proposes.

The backend enforces.

$$
\boxed{
LLM \neq Authorization
}
$$

---

# 44. The Security Boundary

Think of the agent architecture as:

```text
           UNTRUSTED
              │
              ▼
             LLM
              │
        proposed action
              │
              ▼
       SECURITY BOUNDARY
              │
       ┌──────┼───────┐
       ▼      ▼       ▼
   validate  auth   limits
       │      │       │
       └──────┼───────┘
              ▼
          Tool Runtime
              │
              ▼
           Database
```

The database remains the source of truth.

---

# 45. Tool Sandboxing

Some tools are particularly dangerous:

```text
execute_code
execute_sql
filesystem
shell
browser automation
```

These should not execute directly inside your primary application process.

A stronger architecture:

```text
Agent
 ↓
Tool Runtime
 ↓
Sandbox
 ↓
Isolated Worker
```

For example:

```text
Docker container
VM
isolated process
restricted runtime
```

with:

* CPU limits
* memory limits
* network restrictions
* filesystem restrictions
* execution timeout

---

# 46. Agent Memory + Tools

Now Mira becomes interesting.

Suppose the user says:

```text
I'm learning Rust now.
```

The model could call:

```text
save_memory
```

Tool:

```typescript
const saveMemoryTool = {
  name: "save_memory",

  schema: z.object({
    key: z.string(),
    value: z.string()
  }),

  async execute(args, context) {
    return memoryRepository.upsert({
      userId: context.userId,
      key: args.key,
      value: args.value
    });
  }
};
```

Now the LLM has a capability to modify persistent state.

---

# 47. Memory Retrieval as a Tool

You could also provide:

```typescript
search_memory
```

```json
{
  "query": "What programming languages is the user learning?"
}
```

Runtime:

```text
search_memory
 ↓
MongoDB/vector DB
 ↓
relevant memories
 ↓
LLM
```

This creates a form of **externalized cognition**.

The model doesn't need to remember everything internally.

It can query its environment.

---

# 48. Agentic Memory

This gives you:

```text
LLM
 │
 ├── remember()
 │
 ├── search_memory()
 │
 └── forget()
```

The model can interact with memory like a database.

Conceptually:

$$
Memory_{t+1}
=
Update(Memory_t, Action_t)
$$

This is more powerful than simply attaching the entire memory database to every prompt.

---

# 49. Beyond Single-Agent Systems

Eventually you can have:

```text
                Supervisor
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Researcher   Coder      Reviewer
        │           │           │
        └───────────┼───────────┘
                    ▼
                  Result
```

This is a **multi-agent system**.

But be careful.

Multiple agents aren't automatically better.

They introduce:

* communication overhead
* synchronization
* duplicated context
* higher cost
* harder debugging
* failure propagation

You should use multiple agents when decomposition genuinely improves the problem.

---

# 50. Agents Can Be Hierarchical

For example:

```text
Manager Agent
     │
     ├── Research Agent
     │      ├── Search
     │      └── Summarize
     │
     ├── Coding Agent
     │      └── Code tools
     │
     └── Review Agent
            └── Test
```

The manager decides which specialized agent should act.

This starts looking like distributed systems.

And that's not accidental.

---

# 51. Agent-to-Agent Communication

Agents can communicate through structured messages:

```typescript
interface AgentMessage {
  from: string;
  to: string;

  type:
    | "task"
    | "result"
    | "error";

  payload: unknown;
}
```

For example:

```text
Supervisor
   ↓
"Research this API"
   ↓
Research Agent
   ↓
"Found three relevant endpoints"
   ↓
Supervisor
```

You now have:

```text
routing
state
messages
timeouts
retries
```

The same primitives appear in distributed systems.

---

# 52. Durable Agents

A normal agent exists in memory:

```text
request
 ↓
agent
 ↓
response
```

But complex tasks may take minutes or hours.

You need durable state:

```text
Agent
 ↓
checkpoint
 ↓
database
 ↓
worker
 ↓
resume
```

For example:

```text
Step 1 completed
Step 2 waiting
Step 3 pending
```

If the worker crashes:

```text
worker dies
 ↓
new worker
 ↓
load checkpoint
 ↓
resume step 2
```

Now you're building a **durable workflow engine**.

---

# 53. Agents + Queues

Long-running agent jobs shouldn't always live inside an HTTP request.

Instead:

```text
POST /agent/task
       │
       ▼
    API Server
       │
       ▼
     Queue
       │
       ▼
   Agent Worker
       │
       ├── LLM
       ├── Tools
       └── DB
```

Using something like Redis + BullMQ:

```text
API
 ↓
Queue
 ↓
Worker
 ↓
Agent
```

This gives you:

* retries
* backpressure
* concurrency control
* delayed jobs
* worker scaling

---

# 54. Streaming

Agent responses don't have to wait until everything completes.

You can stream:

```text
LLM token
 ↓
client
```

and potentially expose events:

```text
agent.started
tool.called
tool.completed
agent.thinking
agent.completed
```

For example:

```json
{
  "type": "tool.started",
  "tool": "search_web"
}
```

then:

```json
{
  "type": "tool.completed",
  "tool": "search_web"
}
```

This creates a much better user experience and also gives observability.

---

# 55. Observability

Once you have agents, normal request logs aren't enough.

You want traces like:

```text
Request 123
│
├── LLM call #1
│   ├── input tokens: 1200
│   ├── output tokens: 80
│   └── latency: 820ms
│
├── Tool: search_web
│   └── latency: 430ms
│
├── LLM call #2
│   ├── input tokens: 2500
│   ├── output tokens: 300
│   └── latency: 1.2s
│
└── Final response
```

You want to answer:

> Why did this agent take 8 seconds and spend 12k tokens?

Without tracing, good luck. 🫠

---

# 56. Agent Cost

Suppose one request performs:

```text
LLM call #1 = $0.01
LLM call #2 = $0.01
LLM call #3 = $0.01

Tools = $0.002
```

Total:

$$
Cost = 3(0.01)+0.002 = \$0.032
$$

At:

```text
1,000,000 requests
```

that's:

$$
\$32,000
$$

Agent loops multiply model costs.

Therefore production systems need:

* maximum iterations
* model routing
* caching
* prompt compression
* context pruning
* cheap models for simple steps

---

# 57. Model Routing

Not every task requires your strongest model.

For example:

```text
classification → small model
memory extraction → small model
simple response → cheap model
complex planning → powerful model
```

Architecture:

```text
                  Router
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Small      Medium     Large
```

This is analogous to query routing in distributed systems.

---

# 58. Caching

Some operations don't need repeated inference.

For example:

```text
"What is the capital of India?"
```

can potentially be cached.

More interestingly, tool results can sometimes be cached:

```text
get_weather(Delhi)
```

for a short TTL.

But caching agent outputs requires caution because:

```text
context
+
memory
+
tools
+
time
```

can affect the answer.

Caching must respect the semantic validity window.

---

# 59. Concurrency

An agent can execute independent tools concurrently.

```typescript
const results = await Promise.all(
  toolCalls.map(executeTool)
);
```

But the runtime needs to understand:

```text
Independent:
A ─┐
   ├── parallel
B ─┘

Dependent:
A
↓
B
↓
C
```

This is essentially a dependency graph.

For complex agents:

$$
G=(V,E)
$$

where:

* \(V\) = actions
* \(E\) = dependencies

Then execution can follow a topological ordering.

---

# 60. Agent Graphs

This leads naturally to graph-based orchestration.

Instead of:

```text
while (...)
```

you can represent:

```text
START
  ↓
Planner
  ↓
Research
  ↓
Reviewer
  ↓
Decision
 ├── retry research
 └── final
```

Graphically:

```text
          ┌─────────────┐
          │   Planner   │
          └──────┬──────┘
                 ▼
          ┌─────────────┐
          │  Research   │
          └──────┬──────┘
                 ▼
          ┌─────────────┐
          │   Review    │
          └──────┬──────┘
                 ▼
              Valid?
             /     \
           no       yes
           │         │
           ▼         ▼
       Research    Final
```

Now agent orchestration starts resembling a workflow/state-machine engine.

---

# 61. Human-in-the-Loop

For dangerous actions:

```text
LLM
 ↓
delete_database()
 ↓
PAUSE
 ↓
Human approval
 ↓
Execute
```

Example:

```typescript
if (tool.requiresApproval) {
  await requestApproval(toolCall);
}
```

The agent becomes semi-autonomous rather than fully autonomous.

This is often the correct production design.

---

# 62. The Agent Runtime Is the Real Product

The more advanced you go, the less the architecture is:

```text
LLM + prompt
```

and more:

```text
                Agent Runtime
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
    Context        State         Policy
       │             │             │
       └─────────────┼─────────────┘
                     ▼
                    LLM
                     │
                     ▼
                Action Router
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        Tools      Memory     Agents
          │          │          │
          └──────────┼──────────┘
                     ▼
                 Environment
```

The LLM is one component.

The runtime orchestrates everything.

---

# 63. A More Production-Ready Agent Interface

You could design:

```typescript
interface Agent {
  run(input: AgentInput): Promise<AgentResult>;
}
```

```typescript
interface AgentInput {
  userId: string;
  chatId: string;
  message: string;
}
```

```typescript
interface AgentResult {
  content: string;

  toolCalls: ToolCall[];

  usage: {
    inputTokens: number;
    outputTokens: number;
  };

  iterations: number;
}
```

Internally:

```typescript
class AgentRuntime {
  constructor(
    private model: Model,
    private memory: MemoryService,
    private tools: ToolRegistry,
    private context: ContextBuilder
  ) {}

  async run(input: AgentInput) {
    const state = await this.context.initialize(input);

    for (let i = 0; i < 8; i++) {
      const response =
        await this.model.generate({
          messages: state.messages,
          tools: this.tools.definitions()
        });

      if (!response.tool_calls?.length) {
        return response;
      }

      state.messages.push(response.message);

      for (const call of response.tool_calls) {
        const result =
          await this.tools.execute(call, {
            userId: input.userId,
            chatId: input.chatId
          });

        state.messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result)
        });
      }
    }

    throw new Error("Agent exceeded iteration limit");
  }
}
```

This is already a real architecture.

---

# 64. What Frameworks Add

Once you understand this manually, frameworks make much more sense.

They can provide:

```text
Model abstraction
Tool abstraction
Agent loop
Memory
Retrieval
Streaming
Tracing
Retries
Graph orchestration
Structured output
Callbacks
State persistence
```

Instead of manually writing:

```typescript
for (let i = 0; i < MAX; i++) {
   ...
}
```

the framework gives you an abstraction over that runtime.

But underneath:

$$
Framework
\approx
Orchestration + Abstractions + Infrastructure
$$

It isn't creating intelligence from nowhere.

---

# 65. The Deepest Mental Model

You can now think about an AI system as five layers.

## Layer 1: Model

```text
LLM
```

Does:

```text
language
reasoning
prediction
classification
generation
```

---

## Layer 2: Context

```text
system prompt
history
memory
tool definitions
retrieved information
state
```

Answers:

> What does the model know right now?

---

## Layer 3: Actions

```text
tools
APIs
database
browser
filesystem
other agents
```

Answers:

> What can the model ask the system to do?

---

## Layer 4: Runtime

```text
agent loop
state machine
orchestration
retry
timeout
permissions
concurrency
```

Answers:

> How does the system actually execute decisions?

---

## Layer 5: Infrastructure

```text
MongoDB
Redis
queues
workers
observability
authentication
load balancing
```

Answers:

> How does the system survive production?

---

# 66. The Full Architecture

Put all five together:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │     API     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     AUTH    │
                    └──────┬──────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  AGENT RUNTIME   │
                  └────────┬─────────┘
                           │
            ┌──────────────┼───────────────┐
            │              │               │
            ▼              ▼               ▼
        CONTEXT          STATE           POLICY
            │              │               │
            └──────────────┼───────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     LLM     │
                    └──────┬──────┘
                           │
                      tool call
                           │
                           ▼
                  ┌────────────────┐
                  │  TOOL ROUTER   │
                  └───────┬────────┘
                          │
             ┌────────────┼─────────────┐
             ▼            ▼             ▼
          Search        Memory        Database
             │            │             │
             ▼            ▼             ▼
          External      Vector       Application
           APIs          Store         State
             │            │             │
             └────────────┼─────────────┘
                          │
                          ▼
                     TOOL RESULT
                          │
                          ▼
                         LLM
                          │
                          ▼
                    FINAL RESPONSE
```

---

# 67. What "Beyond Agents" Actually Means

Once you've understood basic agents, the next question isn't:

> "How do I make an even smarter agent?"

It's:

> **"How do I build a reliable computational system around probabilistic decision-making?"**

That leads into:

```text
Tool Calling
      ↓
Agent Loops
      ↓
Memory
      ↓
Planning
      ↓
State Machines
      ↓
Graph Orchestration
      ↓
Durable Execution
      ↓
Multi-Agent Systems
      ↓
Distributed Agent Infrastructure
```

And eventually:

```text
LLM inference
KV cache
token economics
model routing
GPU scheduling
distributed inference
retrieval systems
vector indexes
event-driven architecture
```

That's where AI engineering starts intersecting heavily with systems engineering.

---

# 68. The Key Invariants

If you're building this professionally, keep these invariants in your head.

### Identity

$$
ToolContext.userId = AuthenticatedUser.id
$$

Never trust the model for identity.

### Authorization

$$
RequestedAction \subseteq AllowedCapabilities(user)
$$

### Context

$$
tokens(Context) \le ContextBudget
$$

### Agent termination

$$
iterations \le MAX\_ITERATIONS
$$

### Tool validation

$$
arguments \models ToolSchema
$$

### Persistence

Every meaningful state transition should have a durable representation if recovery matters.

### Side effects

For non-idempotent operations:

$$
same\ operation\ +\ same\ key
\Rightarrow
same\ effect
$$

These invariants matter more than whatever fancy prompt you use.

---

# 69. The Final Mental Model

If you strip away all the terminology:

```text
             ┌─────────────────┐
             │      LLM        │
             │                 │
             │ "What next?"    │
             └────────┬────────┘
                      │
                proposed action
                      │
                      ▼
             ┌─────────────────┐
             │ Agent Runtime   │
             │                 │
             │ validate        │
             │ authorize       │
             │ execute         │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │   Environment   │
             │                 │
             │ DB / API / Web  │
             │ Memory / Tools  │
             └────────┬────────┘
                      │
                   result
                      │
                      ▼
             ┌─────────────────┐
             │      LLM        │
             │                 │
             │ "Now what?"     │
             └─────────────────┘
```

And the loop continues until:

```text
LLM says:
"I have enough information."
```

or your runtime decides:

```text
stop
```

---

# 70. The One Diagram to Remember

```text
                    ┌───────────────┐
                    │     USER      │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    CONTEXT    │
                    │               │
                    │ history       │
                    │ memory        │
                    │ state         │
                    │ tools         │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │      LLM      │
                    │               │
                    │ decide next   │
                    │ action        │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
              final                  tool
                 │                     │
                 ▼                     ▼
              ANSWER             TOOL RUNTIME
                                       │
                               ┌───────┼────────┐
                               ▼       ▼        ▼
                              API     DB      MEMORY
                               │       │        │
                               └───────┼────────┘
                                       ▼
                                    RESULT
                                       │
                                       ▼
                                      LLM
                                       │
                                       └───────►
```

**That's the whole game.**

The LLM doesn't magically become an autonomous computer.

You construct a loop around it where:

$$
\boxed{
Observe
\rightarrow
Decide
\rightarrow
Act
\rightarrow
Observe
\rightarrow
Decide
\rightarrow
...
}
$$

**Tool calling** gives the model actions.

**Memory** gives it persistent state.

**Context engineering** gives it the right information.

**Agent loops** give it iterative behavior.

**Workflows/graphs** give you control over complex execution.

**Queues and durable state** make it survive production.

**Authorization and validation** keep it from wrecking your database.

And **distributed infrastructure** turns the toy agent into an actual system.

That is the conceptual ladder from **"I called an LLM API" → "I built an agent" → "I engineered an AI runtime."**
