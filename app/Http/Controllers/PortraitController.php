<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Sagohamnen\Portrait\Portrait;
use Sagohamnen\Tag\Tag;
use Sagohamnen\Portrait\Portrait_BL;

class PortraitController extends ApiController
{
    protected $portrait_BL;

    public function __construct()
    {
        $this->portrait_BL = new Portrait_BL();
    }

    public function index(Request $request)
    {
    	$nr_results = 0;
        $images_per_page = 10;
    	$result;
    	try {
    		$tag = $request->input('tag');
            $page_nr = $request->input('page_nr');
            $skip = ($page_nr - 1) * $images_per_page;
            $take = $images_per_page;

            // OBS read about use here:
            // https://laracasts.com/discuss/channels/eloquent/constraining-eager-loads-php-warning-missing-argument-2-for-closure-on-line-1

    		if ($tag == "") :
                // Search wihtout tag.
    			$nr_results = Portrait::with('tag')->where('status',1)->limit(10)->count();
                $result = Portrait::with('tag')->where('status', 1)->skip($skip)->take($take)->get();
    			//$result = Portrait::with('tag')->where('type',1)->skip($skip)->take($take)->get();
		    else :
                // Search by tag.
		    	$nr_results = Portrait::whereHas('tag', function($query) use($tag) {
		    		$query->where('word', $tag );
		    	})->where('status',1)->count();
		    	$result = Portrait::whereHas('tag', function($query) use($tag)  {
		    		$query->where('word', $tag );
		    	})->where('status',1)->skip($skip)->take($take)->get();
    		endif;
    		return $this->respond( array('nr_results' => $nr_results, 'images_per_page' =>$images_per_page,  'result' => $result) );
    	} catch (Exception $e)
    	{
    		return $this->respondInternalError();
    	}

    }

    public function apa()
    {
    	$tag = "";
        $page_nr = 1;
        $skip = ($page_nr - 1) * 10;
        $take = 10;

    	$result = Portrait::whereHas('tag', function($query) {
                    $query->where('word', 'man');
                })->where('type',1)->skip($skip)->take($take)->get();

    	/*$posts = Post::whereHas('comments', function ($query) {
		    $query->where('content', 'like', 'foo%');
		})->get();*/

    	/*$result = Tag::with(['portraits' => function($query) {
	    		$query->where('type',1);
	    	}])->get();*/

    	/*$result = Media::select('url')->with(['tags' => function($query) {
    			$query->where('word', "=", 'man');
    		}])->where('type', 1)->get();*/
    	return $this->respond($result);
    }

    public function portraits()
    {
        sleep(5);
        // Return all portraits with tags as a json file.
        try {
            $data = $this->portrait_BL->portraits_with_tags();

            // Transform result to thin.
            $result = new \StdClass;
            $portraits =  array();
            foreach($data as $row) {
                $obj            = new \StdClass;
                $obj->id        = $row->id;
                $obj->medium    = $row->medium;
                $obj->thumbnail = $row->thumbnail;
                $obj->tags      = array();
                foreach($row->tags as $tag){
                    array_push($obj->tags, $tag->word);
                }
                array_push($portraits, $obj);
            }
            $result->portraits = $portraits;

            return $this->respond($result);
        } catch (Exception $e)
        {
            return $this->respondInternalError($e);
        }

    }

}
