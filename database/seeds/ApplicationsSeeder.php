<?php

use Illuminate\Database\Seeder;
use App\Application;
use App\Person;
use App\Server;

class ApplicationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $app = Application::create(['name' => 'Govern','description' => "Computer-Aided Mass Appraisal system.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Davey Griffith')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id,Person::where('name','Ed Bennett')->first()->id]);
      $app->servers()->attach([Server::where('name','govsql')->first()->id,Server::where('name','govsqltst')->first()->id,Server::where('name','drgovsql')->first()->id,Server::where('name','govapp')->first()->id]);

      $app = Application::create(['name' => 'Logos','description' => "Financial Management, Human Resources",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Davey Griffith')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id,Server::where('name','logos7app')->first()->id,Server::where('name','logos7rpt')->first()->id,Server::where('name','drgovsql')->first()->id,Server::where('name','logos7tst')->first()->id,Server::where('name','logosrpttest')->first()->id,Server::where('name','logossqltest')->first()->id,Server::where('name','logosconfig')->first()->id,Server::where('name','logostest')->first()->id]);

      $app = Application::create(['name' => 'Trim','description' => "Enterprise Document Management Platform.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Jack Horner')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','trim7')->first()->id,Server::where('name','trim7event')->first()->id,Server::where('name','trim7test')->first()->id,Server::where('name','trim7train')->first()->id]);

      $app = Application::create(['name' => 'Abra','description' => "HR Management",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','abra')->first()->id,Server::where('name','abra-app')->first()->id]);

      $app = Application::create(['name' => 'Microsoft SQL Server','description' => "Generic Entry for MS SQL Server",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id,Person::where('name','Ed Bennett')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','govsql')->first()->id,Server::where('name','govsqltst')->first()->id,Server::where('name','logos7sql')->first()->id,Server::where('name','drgovsql')->first()->id,Server::where('name','logossqltest')->first()->id,Server::where('name','drlogos7sql')->first()->id,Server::where('name','drmsb01sql')->first()->id,Server::where('name','msbsqlrpt')->first()->id,Server::where('name','msbsqltst')->first()->id,Server::where('name','sql2012dev')->first()->id,Server::where('name','sqlrpt')->first()->id,Server::where('name','sirsisql')->first()->id,Server::where('name','sirsisqltst')->first()->id,Server::where('name','spsql01tst')->first()->id,Server::where('name','spsql02tst')->first()->id]);

      $app = Application::create(['name' => 'Bomgar','description' => "Remote support tool.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id,Person::where('name','Katie Van Sant')->first()->id]);
      $app->servers()->attach([Server::where('name','bomgar')->first()->id]);

      $app = Application::create(['name' => 'Actions','description' => "Search Legislative Actions",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Jack Horner')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','actions-app')->first()->id,Server::where('name','actions2')->first()->id]);

      $app = Application::create(['name' => 'SANs','description' => "SAN Appliances",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Randy Jones')->first()->id,Person::where('name','Rod Hoskinson')->first()->id]);


      $app = Application::create(['name' => 'iSupport','description' => "Service Desk Management application",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','isupport')->first()->id]);

      $app = Application::create(['name' => 'IT Dashboard','description' => "Online portal for project time-entry and outage tracking. Created using Bootstrap dashboard template. Uses Apache, PHP, Bootstrap, JQuery, MSSQL, HTML5, CSS3, Ajax and SASS.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id,Server::where('name','webdev')->first()->id]);

      $app = Application::create(['name' => 'eSuite','description' => "Online portal for HR/Payroll information. Part of Logos package.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Davey Griffith')->first()->id]);
      $app->servers()->attach([Server::where('name','esuite7')->first()->id]);

      $app = Application::create(['name' => 'ArcGIS','description' => "GIS (Mapping) Software",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','agstst')->first()->id,Server::where('name','soc1tst')->first()->id,Server::where('name','soc2tst')->first()->id,Server::where('name','sdesql10tst')->first()->id,Server::where('name','sdesql10edit')->first()->id,Server::where('name','ags2')->first()->id,Server::where('name','soc3')->first()->id,Server::where('name','soc4')->first()->id,Server::where('name','gisgeoproc')->first()->id,Server::where('name','sdesql10')->first()->id]);

      $app = Application::create(['name' => 'Addressing','description' => "SDE Addressing",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','govsql')->first()->id,Server::where('name','sdesql10tst')->first()->id,Server::where('name','sdesql10edit')->first()->id,Server::where('name','sdesql10')->first()->id]);

      $app = Application::create(['name' => 'Cartegraph','description' => "Road asset management, mapping, etc.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','cartegraph')->first()->id]);

      $app = Application::create(['name' => 'Chameleon','description' => "Animal Care software",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Application::create(['name' => 'DNS','description' => "Domain Names (Linux)",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Jack Horner')->first()->id]);
      $app->servers()->attach([Server::where('name','dsjns1')->first()->id,Server::where('name','dsjns2')->first()->id]);

      $app = Application::create(['name' => 'FTP','description' => "File Transfer (Linux)",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Jack Horner')->first()->id]);
      $app->servers()->attach([Server::where('name','dsjftp')->first()->id]);

      $app = Application::create(['name' => 'Geocortex','description' => "Online map viewer",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','geocortex')->first()->id,Server::where('name','geocortextst')->first()->id]);

      $app = Application::create(['name' => 'Get Photos','description' => "Parcel Photo Grabber",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Ed Bennett')->first()->id]);


      $app = Application::create(['name' => 'Joomla','description' => "Website software",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jack Horner')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','msbwww2')->first()->id,Server::where('name','msbwww1')->first()->id]);

      $app = Application::create(['name' => 'Land Management Doc Browser','description' => "Land Management Document manager",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Ed Bennett')->first()->id]);


      $app = Application::create(['name' => 'MyProperty','description' => "Web Parcel Information System",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Jack Horner')->first()->id,Person::where('name','Ed Bennett')->first()->id]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id,Server::where('name','myPropApp')->first()->id]);

      $app = Application::create(['name' => 'Parcel Build','description' => "Used to create parcels?",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Matt Rykaczewski')->first()->id]);


      $app = Application::create(['name' => 'Reverse Proxy','inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jack Horner')->first()->id,Person::where('name','Matt Rykaczewski')->first()->id]);


      $app = Application::create(['name' => 'WasteWorks','description' => "Solid waste management & ticketing application",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Application::create(['name' => 'Project Board CMS','description' => "Content Management System used to manage information and updates about MSB projects.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','webdev')->first()->id,Server::where('name','webprod')->first()->id]);

      $app = Application::create(['name' => 'AIMS','description' => "Ambulance Billing software",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Davey Griffith')->first()->id]);


      $app = Application::create(['name' => 'Maximum Solutions','description' => "Management software for the ice rink and pools. Software client on each computer connects to the db. No server component.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Application::create(['name' => 'PFD Garnishment','description' => "Annual PFD Garnishment Process. Not really an application, but it's an annual process.",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Matt Rykaczewski')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Application::create(['name' => 'MPulse','description' => "Facilities, Fleet, and EMS management software",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','mpulse')->first()->id]);

      $app = Application::create(['name' => 'Sympro','description' => "Investments / debt / financial planning software",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id,Server::where('name','sympro')->first()->id]);

      $app = Application::create(['name' => 'Solarwinds','description' => "Enterprise network monitoring application",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Randy Jones')->first()->id,Person::where('name','Rod Hoskinson')->first()->id]);


      $app = Application::create(['name' => 'McAfee Enterprise AV','description' => "Enterprise antivirus security software",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Randy Jones')->first()->id,Person::where('name','Rod Hoskinson')->first()->id]);


      $app = Application::create(['name' => 'Sharepoint','description' => "Enterprise collaboration, web publishing and content management platform",'inactive_flag' => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Jack Horner')->first()->id,Person::where('name','Davey Griffith')->first()->id]);
      $app->servers()->attach([Server::where('name','spapp01')->first()->id,Server::where('name','spowa01')->first()->id,Server::where('name','spsql01')->first()->id,Server::where('name','spsql02')->first()->id,Server::where('name','spweb01')->first()->id,Server::where('name','spweb02')->first()->id,Server::where('name','spapp01tst')->first()->id,Server::where('name','spsql01tst')->first()->id,Server::where('name','spsql02tst')->first()->id,Server::where('name','spweb01tst')->first()->id,Server::where('name','spweb02tst')->first()->id]);

    }
}
