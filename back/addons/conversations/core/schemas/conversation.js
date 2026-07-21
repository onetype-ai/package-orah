onetype.SchemasRegister('orah.conversation', {
	id: {
		type: 'string',
		description: 'Conversation id.'
	},
	title: {
		type: 'string',
		description: 'Title derived from the first message.'
	},
	updated_at: {
		type: 'string',
		description: 'Timestamp of the last message.'
	},
	created_at: {
		type: 'string',
		description: 'Timestamp of when the conversation started.'
	}
});
