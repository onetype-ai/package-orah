import commands from '@onetype/framework/commands';
import orah from '#orah/addon.js';

commands.Item({
	id: 'orah:chat',
	exposed: true,
	method: 'POST',
	endpoint: '/api/orah/chat',
	description: 'Sends a message to Orah and returns its reply. Starts a new conversation unless one is given.',
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
		}
	},
	out: {
		conversation: {
			type: 'string',
			description: 'Id of the conversation the reply belongs to.'
		},
		message: {
			type: 'string',
			description: 'The reply of Orah.'
		},
		steps: {
			type: 'array',
			each: {
				type: 'object'
			},
			description: 'Tool calls Orah made along the way, with tool, input and output.'
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

		const messages = JSON.parse(item.Get('messages') || '[]');

		messages.push({ role: 'user', text: properties.message });

		const result = await $ot.agents.run({
			agent: 'orah',
			mode: 'conversation',
			messages,
			context: this,
			caller: 'orah'
		});

		await orah.conversations.Fn('save', item, result.messages);

		resolve({ conversation: item.Get('id'), message: result.text, steps: result.steps }, 'Orah replied.');
	}
});
