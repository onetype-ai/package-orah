# Instructions — where we are and what comes next

Written 2026-07-18, at the point where we paused. The chat WORKS end to end:
conversations persist, Orah delegates through the agents package and the panel
draws every tool call in the chain. We stopped to think the system through.

## What this package is

The conversational product on top of the `agents` engine (depends on it).
Orah holds the memory and the face — the intelligence lives in agents.

- **Orah is just an agent** — declared in `back/items/agents/orah.js` into the
  agents registry. No tools of its own; it holds the globals (`agents:list`,
  `agents:run` + the temporary test ones). Its instructions carry the
  personality AND the humility rule: never refuse because you are unsure — ask
  the likely agent through research first; only report impossible after an
  agent said so.
- **`orah.conversations`** — table, messages stored as the client-normalized
  JSON (user/assistant/tool roles, tool calls included). `Fn('get')` returns
  the item straight from `Find().one()` — do NOT re-wrap it in `Item()`,
  that loses the id (learned the hard way). `Fn('save')` updates and removes
  from the registry.
- **`orah:chat`** (POST /api/orah/chat) — create/continue a conversation, run
  `$ot.agents.run({ agent: 'orah', mode: 'conversation', context: this })`,
  opens `this._trace = []` so the whole delegation tree comes back, resolves
  `{ conversation, message, steps }`.
- **`orah.notes`** — table + add/list + emitter, NOT wired into the brain yet.
  The plan: a `note` tool so Orah saves what it learns, notes injected into
  its system prompt.
- **Front `e-orah-chat`** (hash `e-a7160a5`) — right panel layout `orah`,
  navbar toggle, left-edge resize persisted in `ui.orah.width`, `background`
  config 1–3 (inner surfaces ride `--above/--edge` = bg+1). Steps cards show
  agent + tool badge + input per row. The composer textarea is UNCONTROLLED —
  binding it to state re-renders per keystroke and eats letters.
  Demo blocks for generic results (stats/items/colors) still render from the
  old mock — real data shape for them is future work.

## Next, in rough order

1. **Live trace** — steps appear only after the reply completes. The agreed
   direction is the runner/daemon model (message row → runner works → front
   polls/subscribes), which also unblocks long tasks surviving refreshes.
   Streaming SSE client code exists in git history (commit `8a40c04`).
2. **History view** — the history button is dead; `orah:conversations:many/one`
   already exist, needs a list + reopen flow (messages are stored normalized,
   map them to the panel shapes).
3. **Notes into the brain** — the `note` tool + notes in the system prompt,
   scoped per user eventually.
4. **Provider/model picker** — let the user pick provider + model in the panel
   header (`agents:providers:many` exists; executor accepts a model override).
5. **Generic result blocks** — let agents return typed data (items/stats/colors)
   that the panel renders as cards instead of text.
6. **Conversation ownership** — user_id is stored; many/one commands filter by
   it, but the chat command does not verify continuation ownership yet.
