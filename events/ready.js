class Ready {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run() {
        await this.client.guilds.forEach(g => {
            console.log(this.chalk.bgBlack.green(`Loaded data for '${g.name}' (${g.id})`));
        });
        const time = this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
        console.log(this.chalk.bgBlack.greenBright.inverse(`[ READY ] ${this.client.user.tag} has connected on ${time}\``));
        this.client.ready = true;
        //unmutes any muted user on restart, so they aren't stuck muted.
        this.client.guilds.forEach(g => {
            this.client.mutes.delete(g.id);
            this.client.mutes.set(g.id, []);
            g.members.forEach(m => {
                const { mute_role } = this.client.settings.get(g.id);
                if (!m.roles.has(mute_role)) return;
                m.removeRole(mute_role, 'Bot Restarted - Removing Muted Role from User.');
                console.log(this.chalk.bgGreen(`Successfully Removed the Muted Role for ${m.user.tag} in '${g.name}'`));
            });
        });
    };
};

module.exports = Ready;
