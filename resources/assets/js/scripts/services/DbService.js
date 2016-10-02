angular.module('ShApp')

.factory('DbService', function($http) {

    return {
        // get all the comments
        getCampaigns : function() {
            var url = './api/campaign';
            return $http.get(url);
        },

        getCampaign : function(id){
            var url = './api/campaign/' + id;
            return $http.get(url);
        },

        identifyCampaign : function(campaignId) {
            var url = './api/identify_campaign/' + campaignId;
            return $http.get(url);
        },

        updateCampaign : function(changedData){
            var url = './api/campaign/' + changedData.id ;
            //var url = './api/campaigns/' + id + '/edit';
            //return $http.post(url, $.param(changedData));
            return $http.put(url, changedData);
        },

        applyToCampaign : function(campaignId, userId){
            var url = "./api/apply_to_campaign/" + campaignId ;
            return $http.get(url);
        },

        saveApplication : function(campaignId){
            var url = "./api/save_application/" + campaignId ;
            return $http.get(url);
        },

        getUser : function(id) {
            var url = './api/user/' + id;
            return $http.get(url);
        },

        updateUser : function(changedData){
            var url = "./api/user/" + changedData.id;
            return $http.put(url, changedData);
        },

        chroniclesPerPage : function(campaign_id, pageNr){
            var url = "./api/campaign/" + campaign_id + "/page/" + pageNr;
            return $http.get(url);
        },

        searchPortrait : function(tag, pageNr){
            var url = "./api/portraits";
            return $http.post(url, {'tag' : tag, 'page_nr' : pageNr });
        }

    }

});