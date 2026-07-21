onetype.AddonReady('agents', (agents) =>
{
	agents.Item({
		id: 'orah',
		name: 'Orah',
		model: 'local/qwen3.5-9b',
		description: 'The conversational mind of the instance. Talks to the user and delegates real work to the other agents.',
		instructions: ''
	});
});
