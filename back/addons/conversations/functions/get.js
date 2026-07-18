import orah from '#orah/addon.js';

orah.conversations.Fn('get', async function(id)
{
	const row = await this.Find().filter('id', id).one();

	if(!row)
	{
		return null;
	}

	return this.Item(row);
});
