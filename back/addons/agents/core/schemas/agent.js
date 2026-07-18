import onetype from '@onetype/framework';

onetype.DataSchema('orah.agent', {
	id: {
		type: 'string',
		description: 'Unique agent id.'
	},
	name: {
		type: 'string',
		description: 'Human readable name.'
	},
	description: {
		type: 'string',
		description: 'One line the orchestrator reads to decide when to call this agent.'
	},
	instructions: {
		type: 'string',
		description: 'System instructions the agent runs with.'
	},
	tools: {
		type: 'array',
		description: 'Ids of the tools this agent may run.'
	}
});
