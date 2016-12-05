angular.module('ShApp')

.factory('RpgChatFactory', ['$resource',
    function($resource) {
        return $resource('/api/rpg_chat/:campaignId', {}, {
        	newestChats : { method : "GET", url : "/api/rpg_update/:campaignId/newest/:chatId/:chronicleId" },
        	storeDices : { method: "POST", url : "/api/rpg/role_dice"}
        });
    }
]);