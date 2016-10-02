<?php
namespace Sagohamnen\Chronicle;

use Illuminate\Database\Eloquent\Model;
use Sagohamnen\Chronicle\chronicle_repository;
use Sagohamnen\Campaign\campaign_repository;
use Sagohamnen\Chat\Chat_repository;

class Chronicle_BL {

	private $chronicle_rep;
	private $campaign_rep;
	private $campaign_id;

	public function __construct()
	{
		$this->chronicle_rep = new chronicle_repository();
		$this->campaign_rep = new campaign_repository();
	}

	public function chronicle_per_page($campaign_id, $page_nr)
	{
		$campaign = $this->campaign_rep->identify_campaign($campaign_id);
		$chronicles = $this->chronicle_rep->chronicle_per_page($campaign_id, $page_nr);
		return array("campaign" => $campaign, "chronicles" => $chronicles);
	}

	public function have_unread_chronicle($campaign_id, $last_read_chronicle_id)
	{
		$chronicle_rep = new chronicle_repository();
		//$chat_rep = new Chat_repository();
		$last_chronicle_id = $chronicle_rep->last_chronicle_id($campaign_id);
		return $last_chronicle_id > $last_read_chronicle_id ? true: false;
	}
}