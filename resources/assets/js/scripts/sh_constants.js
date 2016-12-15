sagohamnenApp.constant('config', {
    charStatusArchived              :0,
    charStatusApplying              :1,
    charStatusPlaying               :2,
    charStatusNpc                   :3,
    charStatusDeleted               :4,
    charStatusBlocked               :5,
    campaginArchived                :0,
    campaginActive                  :1,

    rpgChatStyleMessage				:0,
    rpgChatStyleDie					:1,

    maxChroniclesInRow              :10,

    // How many chats the user can do
    // before he/she is considered spamming.
    chatSpamNr                     :30,
    // The max length of a chat entry.
    chatMaxLength                   :500,

    dicesMaxNr                      :100,
    dicesTypes                      :[4,6,8,10,12,20,100],
    dicesModMax                     :1000,
    dicesModMin                     :-1000,
    dicesDescriptionMaxLength       :250,
});