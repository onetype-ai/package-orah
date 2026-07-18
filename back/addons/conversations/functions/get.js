import orah from '#orah/addon.js';

orah.conversations.Fn('get', async function(id)
{
	return await this.Find().filter('id', id).one();
});
