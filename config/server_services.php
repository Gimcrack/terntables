<?php
    
/**
 * Server services config
 */

return [
    
    /**
     * Ignored Services - These services will not be monitored
     * 
     *  Legend:
     *    - Array key corresponds to service name (partial names ok)
     *    -- '*' Means all services
     *    - Array values corresponds to server name (not case sensitive)
     *    -- '*' Means all servers
     */
    'ignored' => [
        
        '*' => [ // ignore all services on these servers
            'gis102agstst',
            'rmapptst'
        ],

        '.NET Framework' => [
            '*'
        ],

        'Remote Registry' => [
            '*'
        ],

        'Software Protection' => [
            '*'
        ],

        'Google Update' => [
            '*'
        ], 

        'Windows Licensing' => [
            '*'
        ], 

        'Windows Update' => [
            '*'
        ], 

        'Shell Hardware Detection' => [
            '*'
        ], 

        'NWS Logos Automated Import' => [
            '*'
        ],

        'Virtual Disk' => [
            '*'
        ],

        'MBAMService' => [
            '*'
        ],

        'Microsoft Exchange Server Extension for Windows Server Backup' => [
            '*'
        ],

        'HP Records Manager Render Service' => [
            '*'
        ],

        'Volume Shadow Copy' => [
            '*'
        ],

        'Web Management Service' => [
            'actions2'
        ],

        'Windows Modules Installer' => [
            '*'
        ],
    ],

    /**
     * Level overrides per service. These services will be 
     * assigned the levels you specify here when they go
     * offline on production servers.
     */
    'levels' => [
        // SQL Server
        'SQL Server (MSSQLSERVER)' => 'alert',
        'SQL Server (COMMVAULT)' => 'alert',
        'SQL Server (SQLEXPRESS)' => 'alert',
        'SQL Server (PRNX_SQLEXP)' => 'alert',
        'SQL Server (ISUITE2)' => 'alert',
        'SQL Server (SPSQL)' => 'alert',
        'SQL Server Agent (COMMVAULT)' => 'alert',
        'SQL Server Agent (MSSQLSERVER)' => 'alert',
        'SQL Server Agent (SPSQL)' => 'alert',
        'SQL Server Analysis Services (MSSQLSERVER)' => 'alert',
        'SQL Server Analysis Services (POWERPIVOT)' => 'alert',
        'SQL Server Analysis Services (SPSQL)' => 'alert',
        'SQL Server Browser' => 'alert',
        'SQL Server Integration Services 10.0' => 'alert',
        'SQL Server Integration Services 11.0' => 'alert',
        'SQL Server Reporting Services (MSSQLSERVER)' => 'alert',
        'SQL Server Reporting Services (SPSQL)' => 'alert',
        'SQL Server VSS Writer' => 'alert',

        // New World ERP
        'New World File Storage Service' => 'alert',
        'New World Logos Approval Service' => 'alert',
        'New World Logos Auditing Service' => 'alert',
        'New World Logos Caching' => 'alert',
        'New World Logos Discovery Proxy' => 'alert',
        'New World Logos NeoGov Applicant Import' => 'alert',
        'New World Logos Notification Service' => 'alert',
        'New World Logos PDF Conversion' => 'alert',
        'New World Logos Revenue Collection' => 'alert',
        'NWSAppService' => 'alert',

        // Other
        'MSB Windows Update Management' => 'alert'    
    ],
];