module.exports = (message, key) => {
    const client = message.client;
    let output;
    for (let i = 0; i < client.tags.get(message.guild.id).length; i++) {
        if (client.tags.get(message.guild.id)[i].key !== key) return output = false;
        if (client.tags.get(message.guild.id)[i].key === key) return output = client.tags.get(message.guild.id)[i].val;
    };
    return output;
};