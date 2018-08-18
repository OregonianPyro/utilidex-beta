/**
 * @param {object} message The message object.
 * @param {string} error The missing argument, or 'error'.
 */

 module.exports = (message, error) => {
    return message.channel.send(`${message.client.emotes.warn} Missing Argument: \`${error}\``);
 };