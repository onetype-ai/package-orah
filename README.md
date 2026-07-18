# Orah

**The mind of the instance.** A conversational orchestrator that plans across specialized agents — each agent isolated with its own instructions and tools, reached only through research and task calls.

Orah is the one you talk to. It holds no knowledge of the instance itself — it holds a catalog of agents and decides who to call, in what order, to reach the goal. Agents never see each other and never talk to the user; they receive a question or an instruction, run their tools, and report back.

## How it works

- **Orah** chats with the user and orchestrates. It sees the agents only as `id | description` lines.
- An **agent** is called two ways: `research` — a precise question that expects a factual answer, or `task` — an instruction that expects a report of what was done.
- A **tool** is what an agent runs to actually do things — a command executed direct, or a plain callback. Agents list the tool ids they may use.
- **Conversations** are stored with their full history, tool calls included.
- **Notes** are what Orah learns along the way and carries into future conversations.

## Declaring agents and tools

Packages ship their own agents. Install a package — Orah knows something new.

```js
onetype.AddonReady('orah.agents', (agents) =>
{
	agents.Item({
		id: 'slack',
		name: 'Slack',
		description: 'Sends messages and manages channels in the connected Slack workspace.',
		instructions: 'You operate the Slack workspace of this instance...',
		tools: ['slack:send', 'slack:channels']
	});
});

onetype.AddonReady('orah.tools', (tools) =>
{
	tools.Item({
		id: 'slack:send',
		description: 'Sends a message to a channel.',
		input: {
			channel: { type: 'string', required: true, description: 'Channel id or name.' },
			text: { type: 'string', required: true, description: 'The message.' }
		},
		command: 'connect:actions:run'
	});
});
```

A tool runs either a `command` (direct, skipping its condition) or a `callback` function receiving the input.

## Model access

Configured through the vault, standard endpoint pattern — works with Claude, OpenAI or any compatible API:

| Key | What it is |
| --- | --- |
| `ORAH_ENDPOINT` | Base URL of the model API |
| `ORAH_API_KEY` | Key for that API, stored as a secret |
| `ORAH_MODEL` | Model id to run |

## Commands

| Command | What it does |
| --- | --- |
| `orah:agents:many` | Lists every registered agent |
| `orah:tools:many` | Lists every registered tool |
| `orah:conversations:many` | Lists the conversations of the signed in user |
| `orah:conversations:one` | Reads one conversation with its full history |
| `orah:notes:many` | Lists everything Orah has learned |

## Emitters

- `orah.notes.add` — fires after Orah saves something it learned
