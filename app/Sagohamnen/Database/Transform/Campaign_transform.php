<?php
namespace Sagohamnen\Database\Transform;

class Campaign_transform {

    public function campaigns($campaigns)
    {
        $result = array();

        foreach( $campaigns as $campaign) :
            array_push( $result, $this->campaign($campaign) );
        endforeach;

        return $result;
    }

    public function campaign($campaign)
    {
        $media_url      = isset( $campaign['media']->url )      ? $campaign['media']->url       : '';
        $media_descr    = isset( $campaign['media']->descr )    ? $campaign['media']->url : '';


        $one_campaign = array (
            'id'                => $campaign['id'],
            'name'              => $campaign['name'],
            'text'              => $campaign['text'],
            'genre'             => $campaign['genre'],
            'gm_id'             => $campaign->gamemaster[0]->id,
            'gm_name'           => $campaign->gamemaster[0]->name,
            'nr_entries'        => $campaign['nr_entries'],
            'nr_players'        => $campaign['nr_players'],
            'max_nr_players'    => $campaign['max_nr_players'],
            'created_at'        => $campaign['created_at'],
            'updated_at'        => $campaign['updated_at'],
            'rating'            => $campaign['rating'],
            'media_url'         => $media_url,
            'media_descr'       => $media_descr,
            'status'            => $campaign['status']
        );

        return $one_campaign;
    }
}