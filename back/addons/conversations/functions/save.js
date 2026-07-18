import orah from '#orah/addon.js';

orah.conversations.Fn('save', async function(item, messages)
{
	item.Set('messages', JSON.stringify(messages));
	item.Set('updated_at', new Date().toISOString());

	await item.Update();

	this.ItemRemove(item.Get('id'), false);

	return item;
});
