import orah from '#orah/addon.js';

orah.notes.Fn('list', async function(agent = null)
{
    const find = this.Find();

    if(agent)
    {
        find.filter('agent', agent);
    }

    return await find.sort('id', 'asc').limit(200).plain();
});
