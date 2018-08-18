module.exports = {
    prefix: 'u!',
    logging: {
        modlog: {
            channel: null,
            enabled: false
        },
        msglog: {
            channel: null,
            enabled: false
        },
        nicklog: {
            channel: null,
            enabled: false
        },
        serverlog: {
            channel: null,
            enabled: false
        }
    },
    mute: {
        role: null,
        default_time: {
            enabled: false,
            time: '1 hour'
        }
    },
    ignored: {
        users: [],
        roles: [],
        channels: []
    },
    automod: {
        spamming: {
            enabled: false,
            ignored: {
                users: [],
                roles: [],
                channels: []
            },
            threshold: {
                message: 5,
                second: 3
            }
        },
        invite_links: {
            nickname_check: false,
            playing_check: false,
            ignored: {
                users: [],
                roles: [],
                channels: []
            }
        },
        warn_punish: false,
        bad_words: {
            enabled: false,
            words: [],
            ignored: {
                users: [],
                roles: [],
                channels: []
            }
        }
    },
    disabled_commands: [],
    welcome_config: {
        enabled: false,
        channel: null,
        type: 'text',
        message: null,
        color: null,
        footer: null
    },
    leave_config: {
        enabled: false,
        channel: null,
        type: 'text',
        message: null,
        color: null,
        footer: null
    }
};