elements.ItemAdd({
    id: 'orah-chat',
    icon: 'psychology',
    name: 'Orah Chat',
    description: 'Talk to Orah. It answers directly, and when the goal needs the instance it orchestrates the agents — you watch every call as it happens.',
    category: 'Orah',
    metadata: { addon: 'orah' },
    config: {
        background: {
            type: 'number',
            value: 1,
            description: 'Background depth of the panel from 1 to 3. Inner surfaces sit one step above it.'
        },
        agent: {
            type: 'string',
            value: 'orah',
            description: 'Id of the top level agent this conversation talks to.'
        },
        name: {
            type: 'string',
            value: 'Orah',
            description: 'Name shown in the panel header.'
        }
    },
    render: function()
    {
        this.busy = false;

        this.conversation = null;
        this.messages = [];

        const glance = () =>
        {
            requestAnimationFrame(() =>
            {
                const list = this.Element && this.Element.querySelector('.messages');

                list && (list.scrollTop = list.scrollHeight);
            });
        };

        const field = () => this.Element && this.Element.querySelector('textarea');

        this.stage = null;

        const shape = (steps) => steps.map((step, index) => ({
            mode: step.tool,
            agent: step.agent,
            label: Object.values(step.input || {}).map((value) => String(value)).join(' · ') || '—',
            input: JSON.stringify(step.input || {}, null, 2),
            output: step.output === null ? '' : String(step.output || ''),
            state: step.output === null ? 'active' : 'done',
            key: index
        }));

        /* The live steps ride as a normal steps message that keeps getting
           its steps swapped while the run goes — one rendering path for
           running and finished work. */
        this.watching = null;

        const track = (steps) =>
        {
            if(!steps || !steps.length)
            {
                return;
            }

            if(!this.watching)
            {
                this.watching = { id: this.messages.length + 1, role: 'steps', steps: [] };
                this.messages.push(this.watching);
            }

            this.watching.steps = shape(steps);
        };

        const finish = (data) =>
        {
            track(data.steps);

            this.watching = null;

            data.plan && this.messages.push({ id: this.messages.length + 1, role: 'plan', content: data.plan });
            data.reasoning && this.messages.push({ id: this.messages.length + 1, role: 'reasoning', content: data.reasoning });

            this.messages.push({ id: this.messages.length + 1, role: data.state === 'error' ? 'error' : 'assistant', content: data.message });

            this.stage = null;
            this.busy = false;
            this.Update();
            glance();
        };

        this.watch = (conversation) =>
        {
            const poll = setInterval(async () =>
            {
                const { data, message, code } = await $ot.command('orah:chat:status', { conversation }, true);

                if(code !== 200 || !data || data.state === 'gone')
                {
                    clearInterval(poll);
                    this.watching = null;
                    this.messages.push({ id: this.messages.length + 1, role: 'error', content: message || 'The run vanished.' });
                    this.stage = null;
                    this.busy = false;
                    this.Update();

                    return;
                }

                if(data.state === 'done' || data.state === 'error')
                {
                    clearInterval(poll);

                    return finish(data);
                }

                this.stage = data.state === 'routing' ? 'Planning...' : 'Working...';
                track(data.steps);
                this.Update();
                glance();
            }, 700);
        };

        this.send = async () =>
        {
            const prompt = field() ? field().value.trim() : '';

            if(!prompt || this.busy)
            {
                return;
            }

            this.messages.push({ id: this.messages.length + 1, role: 'user', content: prompt });
            field() && (field().value = '');
            this.busy = true;
            this.stage = 'Planning...';
            this.Update();
            glance();

            const { data, message, code } = await $ot.command('orah:chat', { conversation: this.conversation, message: prompt, agent: this.agent }, true);

            if(code !== 200)
            {
                this.messages.push({ id: this.messages.length + 1, role: 'error', content: message });
                this.stage = null;
                this.busy = false;
                this.Update();

                return;
            }

            this.conversation = data.conversation;
            this.watch(data.conversation);
        };

        this.key = ({ event }) =>
        {
            if(event.key === 'Enter' && !event.shiftKey)
            {
                event.preventDefault();
                this.send();
            }
        };

        this.icon = (step) =>
        {
            if(step.state === 'active')
            {
                return 'progress_activity';
            }

            if(step.state === 'failed')
            {
                return 'cancel';
            }

            return step.mode === 'research' ? 'search' : (step.mode === 'note' ? 'bookmark' : 'bolt');
        };

        this.fresh = () =>
        {
            this.conversation = null;
            this.messages = [];
            this.watching = null;
            this.stage = null;
            this.busy = false;
            this.Update();
        };

        this.close = () =>
        {
            $ot.ui.layouts.close('orah');
        };

        return `
            <div :class="'box bg-' + background">
                <div class="head">
                    <div class="tile"><i>psychology</i></div>
                    <div class="titles">
                        <span class="title">{{ name }}</span>
                        <span :class="'status' + (stage ? ' busy' : '')"><em></em>{{ stage ? stage : 'Ready' }}</span>
                    </div>
                    <button class="action" ot-tooltip="New conversation" ot-click="fresh"><i>edit_square</i></button>
                    <button class="action" ot-tooltip="History"><i>history</i></button>
                    <button class="action" ot-click="close"><i>right_panel_close</i></button>
                </div>
                <div class="messages">
                    <div ot-if="!messages.length" class="empty">
                        <div class="mark"><i>psychology</i></div>
                        <span class="lead">Ask anything.</span>
                        <span class="hint">Orah answers directly, or orchestrates the agents when the goal needs the instance.</span>
                    </div>
                    <div ot-for="message in messages" :ot-key="message.id" :class="'entry ' + message.role">
                        <div ot-if="message.role === 'user'" class="message user">{{ message.content }}</div>
                        <details ot-if="message.role === 'plan'" class="reasoning">
                            <summary><i>route</i><span>Plan</span><i class="chevron">expand_more</i></summary>
                            <div class="thought">{{ message.content }}</div>
                        </details>
                        <details ot-if="message.role === 'reasoning'" class="reasoning">
                            <summary><i>neurology</i><span>Reasoning</span><i class="chevron">expand_more</i></summary>
                            <div class="thought">{{ message.content }}</div>
                        </details>
                        <div ot-if="message.role === 'assistant'" class="message assistant">{{ message.content }}</div>
                        <div ot-if="message.role === 'error'" class="message error">{{ message.content }}</div>
                        <div ot-if="message.role === 'steps'" class="steps">
                            <div ot-for="step in message.steps" :ot-key="step.key" :class="'step ' + step.state">
                                <div class="main">
                                    <i class="what">{{ icon(step) }}</i>
                                    <span class="text">
                                        <span class="target">{{ step.agent ? step.agent : 'memory' }}<em>{{ step.mode }}</em></span>
                                        <span class="label">{{ step.label }}</span>
                                    </span>
                                    <i ot-if="step.state === 'done'" class="mark">check</i>
                                </div>
                                <details ot-if="step.output" class="debug">
                                    <summary>data</summary>
                                    <pre class="in">{{ step.input }}</pre>
                                    <pre class="out">{{ step.output }}</pre>
                                </details>
                                <div ot-if="step.activity && step.activity.length" class="activity">
                                    <div ot-for="entry in step.activity.slice(-3)" :ot-key="entry.label" :class="'run ' + entry.state">
                                        <em></em>
                                        <span>{{ entry.label }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ot-if="message.role === 'stats'" class="stats">
                            <div ot-for="stat in message.stats" :ot-key="stat.label" class="stat">
                                <span class="value">{{ stat.value }}</span>
                                <span class="label">{{ stat.label }}</span>
                            </div>
                        </div>
                        <div ot-if="message.role === 'items'" class="card">
                            <div ot-if="message.title" class="name">{{ message.title }}</div>
                            <div ot-for="entry in message.items" :ot-key="entry.label" class="row">
                                <div class="tile"><i>{{ entry.icon }}</i></div>
                                <span class="text">
                                    <span class="label">{{ entry.label }}</span>
                                    <span class="hint">{{ entry.hint }}</span>
                                </span>
                                <span ot-if="entry.badge" :class="'badge ' + (entry.color || '')">{{ entry.badge }}</span>
                            </div>
                        </div>
                        <div ot-if="message.role === 'colors'" class="card">
                            <div ot-if="message.title" class="name">{{ message.title }}</div>
                            <div class="swatches">
                                <div ot-for="color in message.colors" :ot-key="color.label" class="swatch" :ot-tooltip="color.label">
                                    <em :style="'background: ' + color.value"></em>
                                    <span>{{ color.value }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ot-if="busy && !watching" class="message assistant thinking"><span></span><span></span><span></span></div>
                </div>
                <div class="composer">
                    <div class="field">
                        <textarea rows="1" spellcheck="false" placeholder="Ask Orah..." ot-keydown="key"></textarea>
                        <button class="send" ot-click="send"><i>arrow_upward</i></button>
                    </div>
                </div>
            </div>
        `;
    }
});
