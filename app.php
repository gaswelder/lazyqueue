<?php
require 'vendor/autoload.php';

use havana\App;
use havana\request;
use havana\response;

$app = new App(__DIR__);

function getData($name)
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

function setData($name, $data)
{
	$path = __DIR__ . '/data/' . $name;
	file_put_contents($path, json_encode($data));
}

$app->get('/lists/{.+}', function ($name) {
	$data = getData($name);
	return $data;
});

$app->post('/lists/{.+}', function ($name) {
	$data = json_decode(request::body(), true);
	if (!isset($data['version'])) {
		return response::make(response::STATUS_BADREQ)->setContent('Missing `version` field');
	}
	$old = getData($name);
	if ($old['version'] >= $data['version']) {
		return response::make(409)->setContent("The given version ($data[version]) is not bigger that the saved version ($data[version])");
	}
	setData($name, $data);
});

$app->get('/', function () {
	return file_get_contents(__DIR__ . '/frontend/index.html');
});

$app->run();
