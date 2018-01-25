<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Remote Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default connection that will be used for SSH
    | operations. This name should correspond to a connection name below
    | in the server list. Each connection will be manually accessible.
    |
    */

    'default' => 'wftest',

    /*
    |--------------------------------------------------------------------------
    | Remote Server Connections
    |--------------------------------------------------------------------------
    |
    | These are the servers that will be accessible via the SSH task runner
    | facilities of Laravel. This feature radically simplifies executing
    | tasks on your servers, such as deploying out these applications.
    |
    */

    'connections' => [
        'wfprod' => [
            'host'      => 'safetrans.wellsfargo.com',
            'port'      => 22,
            'username'  => 'xae6goo9',
            'privateKey'=> 'C:\SSH\dsjts1_private_key.ppk',
            'keyphrase' => '',
            'timeout'   => 10,
        ],

        'wftest' => [
            'host'      => 'safetransvalidate.wellsfargo.com',
            'port'      => 22,
            'username'  => 'ytz7znw6',
            'privateKey'=> 'C:\SSH\dsjts1_private_key_test.ppk',
            'keyphrase' => '',
            'timeout'   => 10,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Remote Server Groups
    |--------------------------------------------------------------------------
    |
    | Here you may list connections under a single group name, which allows
    | you to easily access all of the servers at once using a short name
    | that is extremely easy to remember, such as "web" or "database".
    |
    */

    'groups' => [
        'web' => ['production'],
    ],

];
