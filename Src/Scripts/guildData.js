const Enmap = require('enmap');

module.exports = { 
    prefix: 'u-',
    logging: {
        modlog: {
            enabled: false,
            channel: null
        },
        msglog: {
            enabled: false,
            channel: null
        },
        nicklog: {
            enabled: false,
            channel: null
        },
        rolelog: {
            enabled: false,
            channel: null
        },
        imagelog: {
            enabled: false,
            channel: null
        },
        serverlog: {
            enabled: false,
            channel: null
        },
        userlog: {
            enabled: false,
            channel: null
        },
        memberlog: {
            enabled: false,
            channel: null
        }
    },
    ignored: {
        users: [],
        roles: [],
        channels: []
    },
    override: {
        users: [],
        roles: [],
        channels: []
    },
    roles: {
        muteRole: null,
        staffRole: null,
        modRole: null,
        adminRole: null
    },
    automod: {
        accountAge: {
            enabled: false,
            minAge: null,
            action: 'TAG_STAFF'
        },
        spam: {
            enabled: false,
            ignored: {
                users: [],
                roles: [],
                channels: []
            },
            msgsThreshold: 5,
            secsThreshold: 3,
            action: {
                warn: true,
                mute: { enabled: true, time: '5m' },
                kick: false,
                ban: { temp: { enabled: false, time: '1d' }, soft: false, hard: false },
                tagStaff: { enabled: false, msg: '{staff}, {user} is spamming chat.' },
                reason: 'Spamming'
            },
            inviteLinks: {
                game: {
                    enabled: false,
                    ignored: {
                        users: [],
                        roles: []
                    },
                    action: {
                        warn: true,
                        mute: { enabled: true, time: '5m' },
                        kick: false,
                        ban: { temp: { enabled: false, time: '1d' }, soft: false, hard: false },
                        tagStaff: { enabled: false, msg: '{staff}, {user} is spamming chat.' },
                        reason: 'Spamming'
                    }
                },
                name: {
                    enabled: false,
                    ignored: {
                        users: [],
                        roles: []
                    },
                    action: {
                        warn: true,
                        mute: { enabled: true, time: '5m' },
                        kick: false,
                        ban: { temp: { enabled: false, time: '1d' }, soft: false, hard: false },
                        tagStaff: { enabled: false, msg: '{staff}, {user} is spamming chat.' },
                        reason: 'Spamming'
                    }
                },
                enabled: false,
                action: {
                    warn: true,
                    mute: { enabled: true, time: '5m' },
                    kick: false,
                    ban: { temp: { enabled: false, time: '1d' }, soft: false, hard: false },
                    tagStaff: { enabled: false, msg: '{staff}, {user} is spamming chat.' },
                    reason: 'Spamming'
                }
            },
            warnPunish: []
        }
    },
    tags: new Enmap({ name: 'tags' }),
    triggers: new Enmap({ name: 'triggers' }),
    publicRoles: [],
    disabledCommands: [],
    modLogNum: 0,
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

/*
Warn Punish Object Example

numExecute: {type:Integer} | Number of warnings required to execute
punishment: {type:String} | The type of punishment to execute
reason: {type:String} | The reason to display while executing

- Example - 
[{
    numExecute: 3,
    punishment: 'KICK',
    reason: '3rd Warning'
}] 
^ Would kick a user that obtains 3 warnings for the reason, '3rd Warning'
Valid Punishments: 'WARN', 'MUTE:[TIME]', 'KICK', 'BAN', 'BAN_TEMP:[TIME]', 'BAN_SOFT', 'BAN_HARD'

Example for 'MUTE:_' and 'BAN_TEMP:_' methods:
[{
    numExecute: 3,
    punishment: 'MUTE:3D',
    reason: '3rd Warning'
}]

- OR - 

[{
    numExecute: 3,
    punishment: 'BAN_TEMP:1W',
    reason: '3rd Warning'
}]
*/