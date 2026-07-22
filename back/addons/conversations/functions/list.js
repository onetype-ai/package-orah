import orah from '#orah/addon.js';

orah.conversations.Fn('list', async function(user = null)
{
    const find = this.Find();

    if(user)
    {
        find.filter('user_id', user);
    }

    return await find.sort('updated_at', 'desc').limit(100).plain();
});
