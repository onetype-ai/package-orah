import onetype from '@onetype/framework';

onetype.AddonReady('orah', (orah) =>
{
	orah.agents = onetype.Addon('orah.agents', (addon) =>
	{
		addon.Field('id', {
			type: 'string',
			required: true,
			description: 'Unique agent id, like project or slack.'
		});

		addon.Field('name', {
			type: 'string',
			description: 'Human readable name shown in the UI.'
		});

		addon.Field('description', {
			type: 'string',
			required: true,
			description: 'One line the orchestrator reads to decide when to call this agent.'
		});

		addon.Field('instructions', {
			type: 'string',
			description: 'System instructions the agent runs with.'
		});

		addon.Field('tools', {
			type: 'array',
			value: [],
			description: 'Ids of the tools this agent may run.'
		});

		addon.Field('model', {
			type: 'string',
			description: 'Model override for this agent. Falls back to the instance model.'
		});
	});
});
