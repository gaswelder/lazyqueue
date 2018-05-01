<?php
require 'vendor/autoload.php';

use havana\App;
use havana\request;

$app = new App(__DIR__);

$app->get('/lists/{.+}', function ($name) {
	$path = __DIR__ . '/data/' . $name;
	if (!file_exists($path)) {
		return [];
	}
	return json_decode(file_get_contents($path));
});

$app->post('/lists/{.+}', function ($name) {
	$data = json_decode(request::body(), true);
	$path = __DIR__ . '/data/' . $name;
	file_put_contents($path, json_encode($data));
});

$app->get('/', function () {
	return file_get_contents(__DIR__ . '/frontend/index.html');
});

$app->run();
