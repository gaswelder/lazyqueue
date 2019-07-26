<?php
require 'vendor/autoload.php';
// require '/home/gas/code/pub/havana/main.php';

use havana\App;
use havana\request;
use havana\response;
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

$app = new App(__DIR__);

class S3KindaStorage implements Storage
{
	private function dir()
	{
		// https://cloud-cube-eu.s3.amazonaws.com/abcdefgh
		return basename(getenv('CLOUDCUBE_URL'));
	}

	private function s3()
	{
		$key_id = getenv('CLOUDCUBE_ACCESS_KEY_ID');
		$key = getenv('CLOUDCUBE_SECRET_ACCESS_KEY');
		return new S3Client([
			'profile' => 'default',
			'version' => 'latest',
			'region' => 'eu-west-1',
			'endpoint' => 'https://s3.amazonaws.com',
			'credentials' => [
				'key'    => $key_id,
				'secret' => $key,
			],
		]);
	}

	function write($name, $data)
	{
		$result = $this->s3()->putObject([
			'Bucket' => 'cloud-cube-eu',
			'Key' => $this->dir() . '/' . $name,
			'Body' => json_encode($data)
		]);
	}

	function read($name)
	{
		$result = $this->s3()->getObject([
			'Bucket' => 'cloud-cube-eu',
			'Key' => $this->dir() . '/' . $name
		]);

		// if (!file_exists($path)) {
		// 	return ['version' => 0, 'list' => []];
		// }
		return json_decode($result['Body']);
	}
}



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
if (getenv('CLOUDCUBE_ACCESS_KEY_ID')) {
	error_log("Using S3 storage");
	$storage = new S3KindaStorage();
} else {
	error_log("Using file storage");
	$storage = new FileStorage();
}

$app->mount('/lists', '{.+}', new Lists($storage));
$app->get('/', function () {
	return file_get_contents(__DIR__ . '/frontend/index.html');
});

$app->run();
