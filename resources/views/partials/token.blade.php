<?php
$encrypter = app('Illuminate\Encryption\Encrypter');
$encrypted_token = $encrypter->encrypt(csrf_token());
?>
<meta name="csrf-token" content="{{ $encrypted_token }}">
