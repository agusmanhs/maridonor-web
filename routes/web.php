<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Welcome', ['title' => 'Maridonor Admin Portal']);
});
