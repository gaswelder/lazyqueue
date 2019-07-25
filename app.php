<?php
require 'vendor/autoload.php';

use havana\App;
use havana\request;
use havana\response;

$app = new App(__DIR__);

interface Storage
{
	function read($name);
	function write($name, $data);
}

class FileStorage implements Storage
{
	function write($name, $data)
	{
		$path = __DIR__ . '/data/' . $name;
		file_put_contents($path, json_encode($data));
	}

	function read($name)
	{
		$path = __DIR__ . '/data/' . $name;
		if (!file_exists($path)) {
			return ['version' => 0, 'list' => []];
		}
		$data = json_decode(file_get_contents($path), true);
		if (!isset($data['version'])) {
			$data = [
				'version' => 0,
				'list' => $data
			];
		}
		return $data;
	}
}

class Lists
{
	private $storage;

	function __construct($storage)
	{
		$this->storage = $storage;
	}

	function get($name)
	{
		return $this->storage->read($name);
	}

	function put($name)
	{
		$data = json_decode(request::body(), true);
		if (!isset($data['version'])) {
			return response::make(response::STATUS_BADREQ)->setContent('Missing `version` field');
		}
		$old = $this->storage->read($name);
		if ($old['version'] >= $data['version']) {
			return response::make(409)->setContent("The given version ($data[version]) is not greater than the saved version ($data[version])");
		}
		$this->storage->write($name, $data);
	}
}

$storage = new FileStorage();

$app->mount('/lists', '{.+}', new Lists($storage));
$app->get('/', function () {
	return file_get_contents(__DIR__ . '/frontend/index.html');
});

$app->run();
