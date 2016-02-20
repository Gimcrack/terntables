<?php

use Illuminate\Database\Seeder;
use App\Application;
use App\Person;
use App\Server;

class ApplicationsSeeder extends Seeder
{
    public function srv($name) {
      $server = Server::where('name',$name);

      if ( ! $server->count() )
      {
        \Log::info("Server with name {$name} does not exist");
        return null;
      }

      return $server->first()->id;
    }

    public function prs($name)
    {
      $person = Person::where('name',$name);

      if ( ! $person->count() )
      {
        \Log::info("Person with name {$name} does not exist");
        return null;
      }

      return $person->first()->id;

    }


    public function make($atts)
    {
      \Log::info("Creating application with name {$atts['name']}");

      $temp = [
        'name' => $atts['name'],
        'description' => @$atts['description'] ?: '',
        'group_id' => $atts['group_id'],
      ];

      $app = Application::create($temp);

      if ( !empty($atts['people']) ) {
        foreach( $atts['people'] as $person => $details ) {
          if ( $this->prs($person) ) {
            $person = $this->prs($person);
            $app->people()->attach([$person => [ 'contact_type' => $details ?: 'Primary']]);
          }
        }
      }

      if ( !empty($atts['servers']) ) {
        foreach( $atts['servers'] as $server => $details ) {
          if ( $this->srv($server) ) {
            $server = $this->srv($server);
            $app->servers()->attach([$server => [ 'server_type' => $details ?: 'Primary Application Server' ]]);
          }
        }
      }
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      $applications = [
        [
          'name' => 'Govern',
          'group_id' => 6,
          'description' => "Computer-Aided Mass Appraisal system.",
          'people' => [
            'Ed Bennett' => 'Primary',
            'Jeremy Bloomstrom' => 'Secondary',
            'Matt Rykaczewski' => 'Secondary',
            'Elizabeth Grigsby' => 'Secondary',
            'Davey Griffith' => 'Other',
          ],
          'servers' => [
            'govsql'  =>  'Primary Database Server',
            'govsqltst'  =>  'Test Database Server',
            'drgovsql'  =>  'Primary DR Server',
            'govapp'  =>  'Primary Application Server',
          ]
        ],

        [
          'name' => 'Logos',
          'group_id' => 6,
          'description' => "Financial Management, Human Resources",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
            'Davey Griffith' => 'Other',
          ],
          'servers' => [
            'logos7sql' => 'Primary Database Server',
            'logos7app' => 'Primary Application Server',
            'logos7rpt' => 'Primary Report Server',
            'drgovsql' => 'Primary DR Server',
            'logosrpttest' => 'Test Report Server',
            'logossqltest' => 'Test Database Server',
            'logostest' => 'Test Application Server'
          ]
        ],

        [
          'name' => 'Trim',
          'group_id' => 6,
          'description' => "Enterprise Document Management Platform.",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
            'Davey Griffith' => 'Other',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'trim7' => 'Primary Application Server',
            'trim7event' => 'Secondary Application Server',
            'trim7test' => 'Test Application Server',
            'trim7train' => 'Test Application Server'
          ]
        ],

        [
          'name' => 'HP Records Manager',
          'group_id' => 6,
          'description' => "Enterprise Document Management Platform.",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
            'Davey Griffith' => 'Other',
          ],
          'servers' => [
            'msb02sqla' => 'Primary Database Server',
            'msb02sqlb' => 'Secondary Database Server',
            'rmapp01' => 'Primary Application Server',
            'rmapp02' => 'Secondary Application Server',
          ]
        ],

        [
          'name' => 'Abra',
          'group_id' => 6,
          'description' => "HR Management Platform.",
          'people' => [
            'Elizabeth Grigsby' => 'Primary',
            'Jeremy Bloomstrom' => 'Secondary',
            'Davey Griffith' => 'Other',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'abra-app' => 'Primary Application Server',
          ]
        ],

        [
          'name' => 'Microsoft SQL Server',
          'group_id' => 6,
          'description' => "Relational Database Platform.",
          'people' => [
            'Elizabeth Grigsby' => 'Primary',
            'Jeremy Bloomstrom' => 'Primary',
            'Matt Rykaczewski' => 'Primary',
            'Ed Bennett' => 'Primary',
            'Davey Griffith' => 'Other',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'msb02sqla' => 'Primary Database Server',
            'msb02sqlb' => 'Secondary Database Server',
            'govsql' => 'Primary Database Server',
            'govsqltst' => 'Test Database Server',
            'logos7sql' => 'Primary Database Server',
            'drgovsql' => 'Primary DR Server',
            'logossqltest' => 'Test Database Server',
            'drlogos7sql' => 'Primary DR Server',
            'drmsb01sql' => 'Primary DR Server',
            'msbsqlrpt' => 'Primary Report Server',
            'msbsqltst' => 'Test Database Server',
            'sql2012dev' => 'Test Database Server',
            'sqlrpt' => 'Primary Report Server',
            'spsql01tst' => 'Test Database Server',
            'spsql02tst' => 'Test Database Server',
            'spsql01' => 'Primary Database Server',
            'spsql02' => 'Secondary Database Server',
          ]
        ],

        [
          'name' => 'Bomgar',
          'group_id' => 6,
          'description' => "Remote Support Tool.",
          'people' => [
            'Elizabeth Grigsby' => 'Primary',
            'Katie Van Sant' => 'Secondary',
          ],
          'servers' => [
            'bomgar' => 'Primary Application Server',
          ]
        ],

        [
          'name' => 'iSupport',
          'group_id' => 6,
          'description' => "Service Desk Ticketing Tool.",
          'people' => [
            'Elizabeth Grigsby' => 'Primary',
            'Katie Van Sant' => 'Secondary',
            'Jeremy Bloomstrom' => 'Secondary',
          ],
          'servers' => [
            'isupport' => 'Primary Application Server',
            'msb01sql' => 'Primary Database Server',
          ]
        ],

        [
          'name' => 'IT Dashboard',
          'group_id' => 6,
          'description' => "Web application for Outage and IT Asset Tracking.",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Jack Horner' => 'Primary',
          ],
          'servers' => [
            'webdev' => 'Test Web Server',
            'webprod' => 'Primary Web Server',
            'msbsqlrpt' => 'Primary Database Server',
            'msbsqltst' => 'Test Database Server',
          ]
        ],

        [
          'name' => 'Actions',
          'group_id' => 6,
          'description' => "Search Legislative Actions.",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Jack Horner' => 'Secondary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'actions-app' => 'Primary Application Server',
            'actions2' => 'Primary Application Server',
          ]
        ],

        [
          'name' => 'eSuite',
          'group_id' => 6,
          'description' => "Online portal for HR/Payroll information. Part of Logos package.",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Davey Griffith' => 'Secondary',
          ],
          'servers' => [
            'logos7sql' => 'Primary Database Server',
            'esuite7' => 'Primary Application Server',
          ]
        ],

        [
          'name' => 'ArcGIS',
          'group_id' => 7,
          'description' => "GIS Mapping Software",
          'people' => [
            'Matt Rykaczewski' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
          ],
          'servers' => [
            'gis102ags' => 'Primary Application Server',
            'gis102agstst' => 'Test Application Server',
          ]
        ],

        [
          'name' => 'Addressing',
          'group_id' => 6,
          'description' => "SDE Addressing",
          'people' => [
            'Matt Rykaczewski' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
          ],
          'servers' => [
            'govsql' => 'Primary Database Server',
          ]
        ],

        [
          'name' => 'Cartegraph',
          'group_id' => 7,
          'description' => "Road asset management, mapping, etc.",
          'people' => [
            'Matt Rykaczewski' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'cartegraph' => 'Primary Application Server',
          ]
        ],

        [
          'name' => 'Chameleon',
          'group_id' => 6,
          'description' => "Animal Care Software",
          'people' => [
            'Jeremy Bloomstrom' => 'Secondary',
            'Elizabeth Grigsby' => 'Primary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
          ]
        ],

        [
          'name' => 'DNS',
          'group_id' => 6,
          'description' => "Domain Names (Linux)",
          'people' => [
            'Jeremy Bloomstrom' => 'Secondary',
            'Jack Horner' => 'Primary',
          ],
          'servers' => [
            'dsjns1' => 'Other',
            'dsjns2' => 'Other',
          ]
        ],

        [
          'name' => 'FTP',
          'group_id' => 6,
          'description' => "File Transfer (Linux)",
          'people' => [
            'Jeremy Bloomstrom' => 'Secondary',
            'Jack Horner' => 'Primary',
          ],
          'servers' => [
            'dsjftp' => 'Other',
          ]
        ],

        [
          'name' => 'Geocortex',
          'group_id' => 6,
          'description' => "Online map viewer",
          'people' => [
            'Matt Rykaczewski' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
          ],
        ],

        [
          'name' => 'SANs',
          'group_id' => 9,
          'description' => "SAN Appliances",
          'people' => [
            'Randy Jones' => 'Primary',
            'Rod Hoskinson' => 'Primary',
          ],
        ],

        [
          'name' => 'Get Photos',
          'group_id' => 6,
          'description' => "Parcel Photo Grabber",
          'people' => [
            'Ed Bennett' => 'Primary',
            'Jeremy Bloomstrom' => 'Secondary',
          ],
        ],

        [
          'name' => 'Joomla',
          'group_id' => 6,
          'description' => "Website CMS software",
          'people' => [
            'Jack Horner' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary'
          ],
          'servers' => [
            'msbwww2' => 'Secondary Web Server',
            'msbwww1' => 'Primary Web Server'
          ]
        ],

        [
          'name' => 'Land Management Doc Browser',
          'group_id' => 6,
          'description' => "Land Management Document manager",
          'people' => [
            'Ed Bennett' => 'Primary'
          ]
        ],

        [
          'name' => 'MyProperty',
          'group_id' => 6,
          'description' => "Web Parcel Information System",
          'people' => [
            'Jeremy Bloomstrom' => 'Secondary',
            'Jack Horner' => 'Primary',
            'Ed Bennett' => 'Secondary'
          ],
          'servers' => [
            'msbsqlrpt' => 'Primary Database Server',
            'myPropApp' => 'Primary Application Server'
          ]
        ],

        [
          'name' => 'Parcel Build',
          'group_id' => 7,
          'description' => "Used to create parcels?",
          'people' => [
            'Matt Rykaczewski' => 'Primary'
          ]
        ],

        [
          'name' => 'Reverse Proxy',
          'group_id' => 6,
          'people' => [
            'Jack Horner' => 'Primary',
            'Matt Rykaczewski' => 'Secondary',
          ]
        ],

        [
          'name' => 'WasteWorks',
          'group_id' => 6,
          'description' => "Solid waste management & ticketing application",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Elizabeth Grigsby' => 'Secondary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
          ],
        ],

        [
          'name' => 'Project Board CMS',
          'group_id' => 6,
          'description' => "Content Management System used to manage information and updates about MSB projects.",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'webdev' => 'Test Web Server',
            'webprod' => 'Primary Web Server',
          ],
        ],

        [
          'name' => 'AIMS',
          'group_id' => 6,
          'description' => "Ambulance Billing software",
          'people' => [
            'Davey Griffith' => 'Primary',
          ],
          'servers' => [
            'aims-app' => 'Primary Application Server',
            'msb01sql' => 'Primary Database Server'
          ],
        ],

        [
          'name' => 'Maximum Solutions',
          'group_id' => 6,
          'description' => "Management software for the ice rink and pools. Software client on each computer connects to the db. No server component.",
          'people' => [
            'Elizabeth Grigsby' => 'Primary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
          ],
        ],

        [
          'name' => 'PFD Garnishment',
          'group_id' => 6,
          'description' => "Annual PFD Garnishment Process. Not really an application, but it's an annual process.",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Matt Rykaczewski' => 'Secondary'
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'webdev' => 'Test Web Server',
            'msbsqltst' => 'Test Database Server',
            'webprod' => 'Primary Web Server',
          ],
        ],

        [
          'name' => 'MPulse',
          'group_id' => 6,
          'description' => "Facilities, Fleet, and EMS management/ticketing software",
          'people' => [
            'Jeremy Bloomstrom' => 'Secondary',
            'Elizabeth Grigsby' => 'Primary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'mpulse' => 'Primary Application Server',
          ],
        ],

        [
          'name' => 'Sympro',
          'group_id' => 6,
          'description' => "Investments / debt / financial planning software",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server',
            'sympro' => 'Primary Application Server',
          ],
        ],

        [
          'name' => 'Solarwinds',
          'group_id' => 9,
          'description' => "Enterprise network monitoring application",
          'people' => [
            'Randy Jones' => 'Primary',
            'Rod Hoskinson' => 'Primary',
          ],
          'servers' => [
            'msb01sql' => 'Primary Database Server'
          ],
        ],

        [
          'name' => 'McAfee Enterprise AV',
          'group_id' => 9,
          'description' => "Enterprise antivirus security software",
          'people' => [
            'Randy Jones' => 'Primary',
            'Rod Hoskinson' => 'Primary',
          ],
        ],

        [
          'name' => 'Sharepoint',
          'group_id' => 6,
          'description' => "Enterprise collaboration, web publishing and content management platform",
          'people' => [
            'Jeremy Bloomstrom' => 'Primary',
            'Jack Horner' => 'Primary',
            'Davey Griffith' => 'Secondary',
          ],
          'servers' => [
            'spapp01' => 'Primary Application Server',
            'spowa01' => 'Secondary Application Server',
            'spsql01' => 'Primary Database Server',
            'spsql02' => 'Secondary Database Server',
            'spweb01' => 'Primary Web Server',
            'spweb02' => 'Secondary Web Server',
            'spapp01tst' => 'Test Application Server',
            'spsql01tst' => 'Test Database Server',
            'spsql02tst' => 'Test Database Server',
            'spweb01tst' => 'Test Web Server',
            'spweb02tst' => 'Test Web Server',
          ],
        ],

      ]; // end applications

      foreach($applications as $app) {
        $this->make($app);
      }
    }
}
