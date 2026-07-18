import onetype from '@onetype/framework';

onetype.AddonReady('orah', (orah) =>
{
	orah.tools = onetype.Addon('orah.tools', (addon) =>
	{
		addon.Field('id', {
			type: 'string',
			required: true,
			description: 'Unique tool id, like project:count or slack:send.'
		});

		addon.Field('name', {
			type: 'string',
			description: 'Human readable name shown in the UI.'
		});

		addon.Field('description', {
			type: 'string',
			required: true,
			description: 'What the tool does — the model reads this to decide when to use it.'
		});

		addon.Field('input', {
			type: 'object',
			value: {},
			description: 'Input fields the tool accepts: { field: { type, description, required } }.'
		});

		addon.Field('command', {
			type: 'string',
			description: 'Command id to run with the tool input. Runs direct, skipping the condition.'
		});

		addon.Field('callback', {
			type: 'function',
			description: 'Function to run instead of a command. Receives the input, returns the result.'
		});
	});
});
