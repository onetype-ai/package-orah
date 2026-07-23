import orah from '#orah/addon.js';

orah.notes.Fn('add', async function(content, agent = null)
{
    const item = this.Item({ content, agent });

    await item.Create();

    this.ItemRemove(item.Get('id'), false);

    onetype.emitters.fire('orah.notes.add', { content, agent });

    return item;
});
