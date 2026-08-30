# WTF is an AI Agent? 🤖

The easiest way to understand an AI Agent is to stop thinking of it as a magical new kind of AI.

An agent is basically:

```
An LLM placed inside a loop, given tools, memory/state, and permission to decide what to do next.
```

That sounds almost disappointingly simple.

And it is.

The interesting part is what happens inside that loop.

# 1. First: WTF is an Agent?

Suppose you ask a normal LLM:

```
"What's the weather in Delhi?"
```

A normal LLM can only generate text.
```

User
 ↓
LLM
 ↓
"Currently, the weather is..."

```
>The model isn't actually checking the weather.

>It is predicting a response from its learned parameters.

Now give the model a tool:

```Ts
getWeather(city)
```

Then the system becomes:
```JS

User
   ↓
LLM
   ↓
"I need current weather"
   ↓
getWeather("Delhi")
   ↓
Weather API
   ↓
37°C
   ↓
LLM
   ↓
"Delhi is currently 37°C."


```
That's the beginning of an agentic system.

The crucial difference is:
```

Normal LLM
input → reasoning/generation → output
```
> Agent

```TS

input
  ↓
reason
  ↓
choose action
  ↓
execute action
  ↓
observe result
  ↓
reason again
  ↓
choose next action
  ↓
...
  ↓
final answer
```

That loop is the heart of agents.

# 2. The Most Important Mental Model

Think of an agent as:

             ┌───────────────┐
             │     User      │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │     Agent     │
             │               │
             │   LLM/Brain   │
             └───────┬───────┘
                     ↓
              "What should I do?"
                     ↓
             ┌───────────────┐
             │     Tools     │
             └───────┬───────┘
                     ↓
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       Database     API       Search
          │          │          │
          └──────────┼──────────┘
                     ↓
                 Observation
                     ↓
                 Agent/LLM
                     ↓
              "What's next?"
                     ↓
                    ...

>The LLM isn't necessarily doing everything.

It is primarily doing:

>decision-making over available actions.

# 3. Why Do We Need Agents?

Because an LLM alone is fundamentally limited.

Imagine:
```TS


"Find the cheapest flight from Delhi to Tokyo next month, check my calendar, make sure I don't have meetings, and book it."

```
A normal LLM cannot reliably do this.

Why?

> Because it needs to interact with the outside world.

It needs:

```JS
Flight search
Calendar access
Date calculations
Maybe currency conversion
User preferences
Booking API
Payment system
Confirmation
```

So instead of making the LLM somehow know how to do all of these things, we give it tools.
```JS
LLM
 │
 ├── searchFlights()
 ├── getCalendar()
 ├── calculatePrice()
 ├── bookFlight()
 └── sendEmail()
```

Now the LLM can decide:

```
"I should search flights first."
```

Then:

```
searchFlights(...)
```

Then inspect the result:

```
"Flight A is cheapest."
```

Then:

"I need to check the calendar."

Then:
```

getCalendar(...)
```

Then:

```
"User is free."
```

Then:

```
"I can book it."
```

That's agentic behavior.

# 4. Agent ≠ LLM

This distinction is extremely important.

People often say:

```
"GPT is an agent."
```

Not necessarily.

An LLM is the reasoning/generation engine.

An agent is the system wrapped around the model.

A useful abstraction is:

$$ Agent = Model + Tools + State + Loop + Policy $$

Where:

Model

The LLM.
```

GPT
Gemini
Claude
Mistral
etc.
```

Tools

```

>Things the model can invoke.

search()
database()
calculator()
sendEmail()
createFile()
```

State


>What the system currently knows.
```

conversation
tool results
task progress
user preferences
intermediate results
```

Loop

>The execution mechanism.

```JS
think → act → observe → think → act → ...
```

Policy

Rules controlling what the agent is allowed to do.
```JS

Can read database?
Can send email?
Can delete data?
Need user approval before payment?

```

>This is where production agents become interesting.

# 5. The Simplest Possible Agent

Let's build one conceptually.

Suppose we have:
```TS

const tools = {
  calculator,
  getWeather,
  searchWeb
};
```

And the user says:

```
"What is the weather in Delhi and convert 35°C to Fahrenheit?"
```

The agent receives:

USER:
```
What is the weather in Delhi and convert 35°C to Fahrenheit?
```

The LLM sees:

Available tools:
```JS

getWeather(city)
calculator(expression)
```
The model decides:
```

CALL getWeather
{
  city: "Delhi"
}

```

Your application executes that tool.

It gets:
```

{
  "temperature": 35
}

```

Now the result goes back into the model's context.

The model sees:

User:
What is the weather in Delhi and convert 35°C to Fahrenheit?
```

Tool result:
Delhi = 35°C
```

Available tools:
```
getWeather()
calculator()

```
Then it decides:

CALL calculator
```
{
  expression: "35 * 9/5 + 32"
}
```

Your application executes it.

Result:
```JS

95°F

```

The LLM gets that.

Then:

```JS
FINAL ANSWER:
Delhi is 35°C, which is 95°F.
```

Notice something profound:

> The model never directly executed the function.

Your application executed it.

The model only produced a structured request saying:

```
"I want this tool called with these arguments."
```

> That distinction becomes critical when building agents yourself.

# 6. WTF Actually Happens Behind the Scenes?

Let's go deeper.

Suppose:
```
User:
Find the GitHub repository for LangChain and tell me its stars.
```

Your agent might internally have:
```

messages = [
  system message,
  user message
]

```

The system tells the model:

```
You are an assistant.
```

You have access to these tools:
```JS
searchWeb(query)
getGithubRepository(repo)
```

The model receives all of this.

Then it generates something conceptually like:

```
{
  "tool": "searchWeb",
  "arguments": {
    "query": "LangChain GitHub"
  }
}
```

Your runtime sees:

tool = searchWeb

It executes:

searchWeb("LangChain GitHub")

Suppose the result is:

```
{
  "repository": "langchain-ai/langchain"
}

```
The runtime then appends another message:

TOOL:
langchain-ai/langchain

Now the model gets another turn.

It may decide:
```

{
  "tool": "getGithubRepository",
  "arguments": {
    "repo": "langchain-ai/langchain"
  }
}
```

Again:
```


Application
    ↓
execute tool
    ↓
GitHub API
    ↓
result
    ↓
LLM

```

Eventually:

FINAL:
The LangChain repository has X stars.

# 7. The Agent Loop

This is the single most important piece to understand.

A simplified agent is:
```Js


while (true) {
  const response = await llm(messages, tools);

  if (response.type === "final") {
    return response.content;
  }

  if (response.type === "tool_call") {
    const result = await executeTool(
      response.tool,
      response.arguments
    );

    messages.push(response);
    messages.push(result);
  }
}


```
That's basically the skeleton.

Read it slowly.

```TS
Step 1


Ask model:

llm(messages, tools)
Step 2

Model decides:

FINAL

or:

TOOL CALL
Step 3

If tool call:

executeTool(...)
Step 4

Put result back into context.

Step 5

Ask model again.

Step 6

Repeat.



```
That's an agent.

# 8. Let's Build One From Scratch

Don't start with LangChain.

If you want to actually understand agents, build the primitive version first.

We'll create:

MiniAgent

Its architecture:
```

mini-agent/
│
├── model
│
├── tools
│   ├── calculator
│   └── weather
│
├── tool-registry
│
├── agent-loop
│
└── conversation-state

```

You don't need 50 abstractions.

Start with five things.

# 9. Part 1: Model

You need an LLM.

For example:
```TS

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash"
});


```

The model's job is not:

execute tools

Its job is:

understand → reason → choose
# 10. Part 2: Tools

Let's create:

calculator(expression)

Conceptually:
```TS

function calculator(expression: string) {
  return evaluate(expression);
}

```
And:
```
function getWeather(city: string) {
  return weatherAPI(city);
}
```


Each tool has two things:
```

1. Description
2. Actual implementation

```
For example:
```


Tool name:
calculator

Description:
Perform mathematical calculations.

Input:
expression: string


```
Why does the model need the description?

> Because the model doesn't see your TypeScript implementation.

It needs to understand:

> "What can this tool do?"

# 11. Tool Definition vs Tool Implementation

This distinction is subtle and important.

Suppose your actual code is:
```TS

async function getWeather(city: string) {
   // 50 lines of API logic
}
```

>The LLM doesn't need those 50 lines.

Instead, it gets something like:
```JS

{
  "name": "getWeather",
  "description": "Get the current weather for a city",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string"
      }
    },
    "required": ["city"]
  }
}
```

So:

                 Agent Runtime

        ┌──────────────────────────┐
        │ Actual implementation    │
        │                          │
        │ getWeather(city)         │
        │      ↓                   │
        │ Weather API              │
        └──────────────────────────┘


                 LLM sees

        ┌──────────────────────────┐
        │ Tool schema              │
        │                          │
        │ getWeather(city:string)  │
        └──────────────────────────┘

This is why tool schemas matter enormously.

Bad schema:
```

doStuff(data)

```
Good schema:
```JS

searchUsers({
  query: string,
  limit: number
})
```

>The model can reason much better about explicit interfaces.

# 12. Tool Calling

>Modern models have a mechanism generally called: tool/function calling

You provide:
```

Tools:
calculator
weather
search

```
The model can respond with structured data instead of ordinary prose.

Something conceptually like:
```

{
  "type": "tool_call",
  "name": "calculator",
  "arguments": {
    "expression": "20 * 5"
  }
}

```
Your runtime receives it.

Then:

```
const tool = registry[response.name];


const result = await tool(response.arguments);
```


And that's where your application actually performs the operation.

# 13. The Tool Registry

You need some way to map:
```

"calculator"

to:

calculator()
```

For example:
```JS

const tools = {
  calculator,
  getWeather,
  searchWeb
};

```

Then:
```TS

const tool = tools[toolName];

const result = await tool(arguments);
```

>This is essentially a dispatch table.

Architecturally:
```

LLM
 │
 │ "call calculator"
 ↓
Tool Dispatcher
 │
 │ lookup
 ↓
tools["calculator"]
 │
 ↓
calculator()
```

>This tiny component eventually becomes an important security boundary.

# 14. The Agent Loop in Actual Code

A simplified implementation could look like:
```TS

async function runAgent(userMessage: string) {
  const messages = [
    {
      role: "user",
      content: userMessage
    }
  ];

  while (true) {
    const response = await model.invoke(messages, {
      tools
    });

    if (!response.tool_calls?.length) {
      return response.content;
    }

    messages.push(response);

    for (const call of response.tool_calls) {
      const tool = tools[call.name];

      const result = await tool.invoke(call.args);

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result)
      });
    }
  }
}

```

>Don't focus on the exact LangChain API here.

>Focus on the architecture.

                 ┌─────────────┐
                 │    User     │
                 └──────┬──────┘
                        ↓
                 ┌─────────────┐
                 │    Agent    │
                 └──────┬──────┘
                        ↓
                 ┌─────────────┐
                 │     LLM     │
                 └──────┬──────┘
                        ↓
                 Tool decision
                        ↓
                 ┌─────────────┐
                 │ Dispatcher  │
                 └──────┬──────┘
                        ↓
                    Tool call
                        ↓
                 External world
                        ↓
                    Tool result
                        ↓
                     LLM again
                        ↓
                     ...
# 15. But Wait... Where Is the "Thinking"?

This is where people get confused.

You might imagine:

LLM:
```


Hmm...
First I should search.
Then maybe check the database.
Then I'll calculate...


```
Modern APIs don't necessarily expose the model's internal reasoning.

You should think of the model as producing an action decision, not as something whose hidden chain-of-thought you need to inspect.

For example:
```

Input
 ↓
Model computation
 ↓
Tool call
```

The useful observable artifact is:

```
{
  "tool": "search",
  "arguments": {
    "query": "..."
  }
}

```

>You don't need the model's private reasoning to build the agent.

# 16. Agent = Control Loop

Here's the deeper computer-science interpretation.

An agent is effectively a controller operating over an environment.

Let:

$$ s_t $$

be the current state.

The model observes:

$$ o_t $$

and chooses an action:

$$ a_t = \pi(o_t, s_t) $$

where \(\pi\) is the model/policy.

The environment executes:

$$ s_{t+1} = T(s_t, a_t) $$

and produces a new observation:

$$ o_{t+1} $$

So:

$$ o_t \rightarrow a_t \rightarrow o_{t+1} \rightarrow a_{t+1} \rightarrow o_{t+2} \rightarrow ... $$

This is why the agent loop resembles classical control systems.

The LLM isn't just generating an answer.

It is repeatedly selecting actions based on observations.

# 17. Example: Build a Research Agent

Suppose you ask:

"Research PostgreSQL WAL and explain how crash recovery works."

Your tools:
```

searchWeb()
fetchPage()
extractText()
summarize()
```

The agent could do:
```TS


USER
 │
 ↓
LLM
 │
 ├── searchWeb("PostgreSQL WAL crash recovery")
 │
 ↓
results
 │
 ↓
LLM
 │
 ├── fetchPage(result1)
 │
 ↓
page
 │
 ↓
LLM
 │
 ├── fetchPage(result2)
 │
 ↓
page
 │
 ↓
LLM
 │
 └── final answer

```

>Notice:

The model determines what information it needs next.

That's the important property.

# 18. Why Agents Are Better Than Giant Prompts

You could theoretically put everything into one prompt:

Here is the weather API documentation.

Here is the database schema.

Here is the GitHub API documentation.

Here is the calendar documentation.

Now solve everything.

But this has problems.

Context explosion
$$ Context = Instructions + Data + Tool Docs + History + Results $$

Everything consumes tokens.

No dynamic behavior
```

The system doesn't know ahead of time which tools it needs.

```
Poor external interaction
```
The LLM can't naturally interact with APIs without a runtime.
```

Expensive
```
More context → more tokens → more cost.
```

>Agents allow:

Only retrieve what is necessary.
# 19. Agent vs Workflow

This distinction is huge.

Suppose you have:
```Ts

Upload PDF
 ↓
Extract text
 ↓
Chunk
 ↓
Embed
 ↓
Store

```

>That's a workflow.

>It's deterministic.

A → B → C → D

You don't need an agent.

Now suppose:
```

"Analyze this company's financial situation."

```
You don't know beforehand whether you'll need:

```
searchWeb()
getFinancialStatements()
calculateRatios()
compareCompetitors()
searchNews()

```
The model decides dynamically.

That's where an agent makes sense.
```Ts

Workflow
A → B → C → D
Agent
       ┌──→ Tool A
       │
LLM ───┼──→ Tool B
       │
       ├──→ Tool C
       │
       └──→ Final

```
Use agents where decision paths are dynamic.

Don't use agents just because they're fashionable.

# 20. Agent vs RAG

Since you're learning RAG too, keep these separate.

RAG

RAG answers:
```

"What information should I retrieve?"

Question
 ↓
Retriever
 ↓
Relevant documents
 ↓
LLM
 ↓
Answer
```

Agent

Agent answers:
```

"What should I do next?"

Question
 ↓
LLM
 ↓
Search?
Database?
Calculator?
API?
Another tool?
 ↓
Observation
 ↓
LLM
 ↓
Next action

```
You can combine them:

```Ts

Agent
 │
 ├── searchWeb()
 │
 ├── retrieveFromVectorDB()
 │
 ├── queryPostgres()
 │
 └── calculator()

```
Now the agent has RAG as one of its tools.

# 21. Memory

> Agents often need state.

Imagine:
```

User:
My name is Keshav.

```
Later:

User:
What should I learn next?

The system needs context.

At minimum:

```TS
messages = [
  {
    role: "user",
    content: "My name is Keshav."
  },
  {
    role: "assistant",
    content: "Nice to meet you."
  },
  {
    role: "user",
    content: "What should I learn next?"
  }
];

```
That's conversational state.

But don't automatically call that "memory".

There are several layers.
```JS

Short-term state

Current execution:

tool results
current task
messages
intermediate results
Conversation history
previous messages
Long-term memory

Persisted information:

user preferences
past decisions
important facts
External knowledge
vector database
Postgres
documents
APIs

These are different concepts.
```

# 22. Agent State

A useful state object might be:

```
type AgentState = {
  messages: Message[];
  task: string;
  toolResults: ToolResult[];
  iteration: number;
  status: "running" | "completed" | "failed";
};

```
Then:

                 Agent State
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     Messages      Tools       Iteration
        │            │            │
        └────────────┼────────────┘
                     ↓
                    LLM
                     ↓
                  Action

This becomes especially important when you build persistent agents.

# 23. Why the Agent Can Get Stuck

Suppose:
```JS

LLM → search
LLM → search
LLM → search
LLM → search
...

```
Congratulations.

>You've built an infinite loop. 🎉

So production agents need:

const MAX_ITERATIONS = 10;

Then:
```

if (iteration >= MAX_ITERATIONS) {
  throw new Error("Agent exceeded execution limit");
}
```

Other limits:
```

token budget
execution timeout
tool timeout
maximum tool calls
cost budget
recursion depth
maximum context size

```

24. The Most Important Difference: Agent vs Chatbot

A chatbot:

```

User
 ↓
LLM
 ↓
Response
```

An agent:
```

User
 ↓
LLM
 ↓
Decision
 ↓
Action
 ↓
Observation
 ↓
Decision
 ↓
Action
 ↓
Observation
 ↓
Response
```

The defining property isn't:
```

memory
personality
RAG
LangChain
multiple LLMs

```
The defining property is:

The system can dynamically choose and execute actions based on intermediate observations.

# 25. Your First Agent Project

Since you're trying to understand this rather than just copy a framework, I'd build this progression.

>Level 1: Calculator Agent
```

Tools:

calculator()

User:

Calculate 928 * 37 / 12

```
Understand:
```

LLM
 ↓
tool call
 ↓
dispatcher
 ↓
calculator
 ↓
result
 ↓
LLM
```
Level 2: Multi-tool Agent

Add:
```

calculator()
getTime()

```
Ask:

>"What time is it in Tokyo and what is 30% of 850?"

Now the model must select tools.

>Level 3: Web Agent
```

Tools:

search()
fetchPage()

Ask:

"Research PostgreSQL WAL and summarize it."

Now you'll see the actual agent loop emerge.
```

Level 4: Database Agent
```

Tools:

getUser()
getOrders()
queryAnalytics()

Ask:

"How much did user X spend this month?"

Now you encounter:

SQL safety
authorization
schemas
query validation
database latency
retries
```
Level 5: Persistent Agent
```

Store:

agent state
conversation
task progress
tool results

in Postgres/Redis.

Now your agent survives process restarts.

```
# 26. The Agent's Brain Is Not Just the LLM

Think of the complete system as:
```TS

                 AGENT
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
       LLM       STATE       TOOLS
        │          │          │
        │          │          ├── APIs
        │          │          ├── DB
        │          │          ├── Search
        │          │          └── Code
        │          │
        │          ├── History
        │          ├── Task
        │          └── Results
        │
        ↓
     Decisions
        │
        ↓
      Actions
        │
        ↓
   Observations
        │
        └────────→ LLM
```
```

The agent runtime is the nervous system.

The LLM is the decision-making component.

Tools are the hands.

State is memory.

The environment is the outside world.
````

# 27. The Entire Thing in 30 Lines of Thinking

Forget frameworks for a second.

If you remember only this, you're good:
```

1. Receive task.

2. Give task + available tools to LLM.

3. LLM decides:
      "I can answer"
   OR
      "I need a tool."

4. If it needs a tool:
      execute the tool.

5. Take the tool result.

6. Put the result back into agent state.

7. Ask LLM what to do next.

8. Repeat.

9. Stop when LLM produces final answer.

10. Enforce limits, permissions, validation,
    retries, timeouts and observability in code.

```
Mathematically:

$$ S_t \overset{LLM}{\longrightarrow} A_t \overset{Tool}{\longrightarrow} O_{t+1} \overset{LLM}{\longrightarrow} A_{t+1} \overset{Tool}{\longrightarrow} O_{t+2} \rightarrow \cdots $$

until:

$$ A_t = \text{FINAL} $$
# 39. The WTF Diagram

Keep this one somewhere:
```

                         USER
                          │
                          ▼
                  ┌───────────────┐
                  │  Agent State  │
                  └───────┬───────┘
                          │
                          ▼
                    ┌───────────┐
                    │    LLM    │
                    │           │
                    │ DECIDE    │
                    └─────┬─────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
          ┌───────────┐       ┌──────────┐
          │ TOOL CALL │       │  FINAL   │
          └─────┬─────┘       └────┬─────┘
                │                  │
                ▼                  ▼
        ┌───────────────┐        USER
        │ Tool Runtime  │
        └───────┬───────┘
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
       API      DB     Search
        │       │        │
        └───────┼────────┘
                ▼
          TOOL RESULT
                │
                ▼
          ┌───────────┐
          │   STATE   │
          └─────┬─────┘
                │
                └──────────────► LLM
                                   │
                                   ▼
                              NEXT DECISION

```
That's the beast.

Not magic.

Not a new form of consciousness.

Not necessarily even complicated.

It's a controlled decision-action-observation loop around a language model.

```

Bonus : How to define your tools using langchain best way possible

```

```TS
If you're using LangChain, the cleanest way to understand tool definitions is to treat @tool as the bridge between your TypeScript function and the LLM's tool schema.
```

> The basic LangChain tool

The simplest version:

```TS
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const calculator = tool(
  async ({ expression }) => {
    // actual implementation
    return String(eval(expression));
  },
  {
    name: "calculator",
    description:
      "Evaluate a mathematical expression and return the numeric result.",
    schema: z.object({
      expression: z
        .string()
        .describe(
          "A mathematical expression such as '25 * 4 + 10'."
        ),
    }),
  }
);
```

There are three important pieces:
```JS

tool(
  implementation,
  {
    name,
    description,
    schema
  }
)

```
Think:
```


                 LangChain Tool
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   implementation    description    schema
        │              │              │
   WHAT happens    WHEN/WHY       WHAT input

```


# 2. What LangChain actually gives the LLM

This:
```RS

const calculator = tool(
  async ({ expression }) => {
    return "...";
  },
  {
    name: "calculator",
    description: "Evaluate a mathematical expression.",
    schema: z.object({
      expression: z.string(),
    }),
  }
);
```
doesn't mean Gemini receives your TypeScript function.

Gemini effectively receives something conceptually like:

```
{
  "name": "calculator",
  "description": "Evaluate a mathematical expression.",
  "parameters": {
    "type": "object",
    "properties": {
      "expression": {
        "type": "string"
      }
    },
    "required": ["expression"]
  }
}

```
Your implementation stays on your server.
```

                  Your Backend
                       │
             ┌─────────┴─────────┐
             │                   │
             ↓                   ↓
       Tool Definition       Implementation
             │                   │
             ↓                   ↓
            LLM               Your code
                                 │
                                 ↓
                              API / DB
```

The model sees the left side.

Your backend owns the right side.

# 3. description is extremely important

Don't do:

description: "Get user"

Do:
```


description: `
Retrieve an existing user by their internal user ID.

Use this when you need information about a specific existing user.
This tool only reads user data and does not modify the user.
`
```

You're teaching the agent:
```

WHAT?
    retrieve user

WHEN?
    when information about an existing user is needed

WHAT NOT?
    doesn't modify user
```
4. Schema is where things get really good

With Zod:

```Rs
const getUser = tool(
  async ({ userId }) => {
    return await userService.getUser(userId);
  },
  {
    name: "get_user",

    description: `
    Retrieve an existing user using their internal user ID.
    Use this when you need information about a specific user.
    This tool does not modify user data.
    `,

    schema: z.object({
      userId: z
        .string()
        .uuid()
        .describe(
          "The internal UUID of the user. Do not provide an email or username."
        ),
    }),
  }
);
```

Now you've got:
```

userId
 ↓
must be string
 ↓
must be UUID
 ↓
must represent internal ID

```
That's much stronger than:
```

userId: z.string()
```
5. Multiple parameters

Imagine:

search products

Don't just:
```

schema: z.object({
  query: z.string(),
  limit: z.number(),
})
```

Give each field semantic meaning:
```TS

const searchProducts = tool(
  async ({ query, category, limit }) => {
    return productService.search({
      query,
      category,
      limit,
    });
  },
  {
    name: "search_products",

    description: `
    Search the product catalog.

    Use this when the user wants to find products matching
    a description, category, or keyword.

    This tool only searches products. It does not create,
    update, or purchase products.
    `,

    schema: z.object({
      query: z
        .string()
        .min(1)
        .describe(
          "Keywords or natural-language description of the product to find."
        ),

      category: z
        .enum([
          "electronics",
          "books",
          "clothing",
          "home",
        ])
        .optional()
        .describe(
          "Optional product category used to narrow the search."
        ),

      limit: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(10)
        .describe(
          "Maximum number of products to return. Defaults to 10."
        ),
    }),
  }
);

```
Now the LLM has a much smaller valid action space.

# 6. Why .describe() matters

This:
```

z.string()

tells the model:

"I need a string."

This:

z.string().describe(
  "The user's internal UUID. Do not use their email address."
)

tells it:

"I need a string AND I understand what that string represents."

That distinction is huge.

Use .describe() for semantic meaning, not just type information.

```