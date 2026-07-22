import orah from '#orah/addon.js';

orah.conversations.Fn('create', async function(message, context = {})
{
    const item = this.Item({
        title: String(message || 'New conversation').slice(0, 80),
        messages: '[]',
        user_id: context.http?.state?.user?.id || null
    });

    await item.Create();

    return item;
});
