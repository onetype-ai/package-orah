import commands from 'addon-commands';
import orah from '#orah/addon.js';

commands.Item({
    id: 'orah:chat',
    exposed: true,
    method: 'POST',
    endpoint: '/api/orah/chat',
    description: 'Sends a message to Orah and returns immediately. The work runs in the background — poll orah:chat:status for live steps and the reply.',
    metadata: { addon: 'orah.conversations' },
    condition: function()
    {
        if(!this.http || !this.http.state.user)
        {
            return 'Sign in to talk to Orah.';
        }
    },
    in: {
        conversation: {
            type: 'string',
            description: 'Conversation to continue, empty to start a new one.'
        },
        message: {
            type: 'string',
            required: true,
            description: 'What the user wrote.'
        },
        agent: {
            type: 'string',
            value: 'orah',
            description: 'Id of the top level agent this conversation talks to.'
        }
    },
    out: {
        conversation: {
            type: 'string',
            description: 'Id of the conversation the work runs under — poll orah:chat:status with it.'
        }
    },
    callback: async function(properties, resolve)
    {
        const item = properties.conversation
            ? await orah.conversations.Fn('get', properties.conversation)
            : await orah.conversations.Fn('create', properties.message, this);

        if(!item)
        {
            return resolve(null, null, 404);
        }

        /* Live progress, polled by orah:chat:status. The trace array is
           shared with the run — steps land in it the moment a tool starts
           and get their output the moment it ends. */
        orah.chats = orah.chats || {};

        const progress = {
            state: 'routing',
            steps: [],
            message: null,
            reasoning: null,
            plan: null
        };

        orah.chats[item.Get('id')] = progress;

        const context = this;

        /* Detached on purpose — the request returns now, the work goes on. */
        (async () =>
        {
            const messages = JSON.parse(item.Get('messages') || '[]');

            /* The router pass — one toolless call that turns the raw message
               into a precise delegation brief before the executor sees it.
               Small models execute well but decompose poorly mid-loop, so the
               decomposition runs alone. Best effort: on failure the raw
               message goes through untouched. */
            let briefed = properties.message;

            messages.push({ role: 'user', text: briefed });

            progress.state = 'working';
            context._trace = progress.steps;

            try
            {
                const result = await $ot.agents.run({
                    agent: properties.agent,
                    mode: 'conversation',
                    messages,
                    context,
                    caller: properties.agent
                });

                await orah.conversations.Fn('save', item, result.messages);

                progress.message = result.text;
                progress.reasoning = result.reasoning || null;
                progress.state = 'done';
            }
            catch(error)
            {
                progress.message = error.message || 'The run failed.';
                progress.state = 'error';
            }

            /* Nobody polls forever — sweep the record after ten minutes. */
            setTimeout(() => { delete orah.chats[item.Get('id')]; }, 600000);
        })();

        resolve({ conversation: item.Get('id') }, 'Working on it.');
    }
});
