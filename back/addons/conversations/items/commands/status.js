import commands from '@onetype/framework/commands';
import orah from '#orah/addon.js';

commands.Item({
	id: 'orah:chat:status',
	exposed: true,
	method: 'GET',
	endpoint: '/api/orah/chat/:conversation/status',
	description: 'Returns the live progress of a running orah:chat — the plan, every step with its state, and the reply once done.',
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
			required: true,
			description: 'Conversation id the chat runs under.'
		}
	},
	out: {
		state: {
			type: 'string',
			description: 'routing while the plan is written, working while agents run, done or error at the end, gone when nothing runs.'
		},
		plan: {
			type: 'string',
			description: 'The routed plan, once the router finished. Null before that and when routing was skipped.'
		},
		steps: {
			type: 'array',
			each: {
				type: 'object'
			},
			description: 'Every tool call so far — agent, tool, input, and output once the call finished. A null output means it runs right now.'
		},
		message: {
			type: 'string',
			description: 'The reply of Orah, set when state is done. The failure text when state is error.'
		},
		reasoning: {
			type: 'string',
			description: 'The thinking of the model behind the reply, empty when the model does not reason.'
		}
	},
	callback: async function(properties, resolve)
	{
		const progress = orah.chats && orah.chats[properties.conversation];

		if(!progress)
		{
			return resolve({ state: 'gone', plan: null, steps: [], message: null, reasoning: null });
		}

		resolve({
			state: progress.state,
			plan: progress.plan,
			steps: progress.steps,
			message: progress.message,
			reasoning: progress.reasoning
		});
	}
});
