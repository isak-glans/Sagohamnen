<?php
namespace App\Sh_library\Transformers;


class CampaignTransformer extends Transformer {

    public function home($campaign)
    {
        if ( is_object($campaign) ) :
            $campaign = json_decode(json_encode($campaign), true);
        endif;


        //var_dump($campaign);
        return [
            'id'                => $campaign['id'],
            'name'              => $campaign['name'],
            'text'              => $campaign['text'],
            'genre'             => $campaign['genre'],
            'gm_id'             => $campaign['gm_id'],
            'gm_name'           => $campaign['gm_name'],
            'nr_entries'        => $campaign['nr_entries'],
            'nr_players'        => $campaign['nr_players'],
            'created_at'        => $campaign['created_at'],
            'updated_at'        => $campaign['updated_at'],
            'rating'            => $campaign['rating'],
            'status'            => $campaign['status']
        ];
    }
}