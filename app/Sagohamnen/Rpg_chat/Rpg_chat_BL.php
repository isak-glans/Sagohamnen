<?php
namespace Sagohamnen\Rpg_chat;
use Sagohamnen\Rpg_chat\Rpg_chat_repository;
use App\User;
use Carbon\Carbon;

class Rpg_chat_BL
{
	protected $rep;

	public function __construct()
	{
		$this->rep = new Rpg_chat_repository();
	}

	public function get_latest($campaign_id)
	{
		$dateBack = Carbon::now()->subDays(4);
		$latest_chats = $this->rep->chats_time_back($campaign_id, $dateBack);
		return $this->convertChatResult($latest_chats);
	}

	public function get_newest($campaign_id, $last_read_id)
	{
		$result = $this->rep->chats_id_back($campaign_id, $last_read_id);
		$newest_chats = new \StdClass;

		// If no new chat found.
		if (count($result) == 0) {
			$newest_chats->last_chat_id = $last_read_id;
			return $newest_chats;
		}

		$result_obj = $this->convertChatResult($result);
		$highest_id = 0;

		foreach($result_obj as $row)
		{
			if ($row->id > $highest_id) $highest_id = $row->id;
		}

		$newest_chats->last_chat_id = $highest_id;
		$newest_chats->chats = $result_obj;

		return $newest_chats;
	}

	private function convertChatResult($data)
	{
		$result = array();
		if( count($data) > 0) {
			foreach($data as $row)
			{
				$one_chat = new \StdClass;
				$one_chat->id = $row->id;
				//$one_chat->name = $row->user->name;
				$one_chat->user_id = $row->user_id;
				$one_chat->text = $row->text;
				$created = Carbon::parse( $row->created_at );
				$one_chat->date = $created->format('Y-m-d H:i');
				$one_chat->type = $row->type;
				array_push($result, $one_chat);
			}
		} else $result = null;

		return $result;
	}

	public function have_unread_chat($campaign_id, $last_read_chat)
	{
		$chat_rep = new Rpg_chat_repository();
		$last_chat_id = $chat_rep->last_chat_id($campaign_id);
		return $last_chat_id > $last_read_chat ? true: false;
	}

	public function store($data)
	{
		return $this->rep->store($data->campaign_id, $data->user_id, $data->text, $data->type);
	}

}
