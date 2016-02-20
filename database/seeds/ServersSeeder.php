<?php

use Illuminate\Database\Seeder;
use App\Server;
use App\Person;

class ServersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * ags2
     * *
     * @return void
     */


    public function run()
    {
      // production sql servers - bi
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'msb01sql','description' => 'Hosts many of the smaller SQL databases.','cname' => 'chameleon, dsj01sql','ip' => '10.100.8.18','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'govsql','description' => 'Hosts Govern SQL Production Database','cname' => 'governsql','ip' => '10.100.8.78','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'logos7sql','description' => 'Hosts Logos Production SQL DB.      ','ip' => '10.100.8.66','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'msb02sqla','ip' => '10.100.8.14','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'msb02sqlb','ip' => '10.100.8.15','inactive_flag' => 0,'production_flag' => 1]);

      // production sql servers - gis
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'sdesql10edit','description' => 'SDESQL10EDIT','ip' => '10.100.8.142','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2014-07-31']);
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'sdesql10','ip' => '10.100.8.149','inactive_flag' => 0,'production_flag' => 1]);

      // production report servers
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'logos7rpt','description' => 'Logos Reporting Server  ','ip' => '10.100.8.67','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'msbsqlrpt','description' => 'Reporting server for govern  ','ip' => '10.100.8.74','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);

      // dr sql servers
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'drgovsql','description' => 'Govern DB Replication Target.  ','ip' => '10.126.1.46','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'drlogos7sql','description' => '  ','ip' => '10.126.1.44','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'drmsb01sql','description' => '  ','ip' => '10.126.1.45','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);

      // production app servers -- bi
      Server::create(['operating_system_id' => 3, 'group_id' => 6, 'name' => 'abra-app','description' => 'Hosts the Abra application  ','ip' => '10.100.8.33','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2014-09-11']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'actions2','description' => 'Secondary actions server?  ','ip' => '10.100.8.69','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-07-23']);
      Server::create(['operating_system_id' => 3, 'group_id' => 6, 'name' => 'actions-app','description' => 'Hosts the Actions Application.','cname' => 'actions, elections','ip' => '10.100.8.38','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-07-23']);
      Server::create(['operating_system_id' => 3, 'group_id' => 6, 'name' => 'aims-app','description' => 'Ambulance Billing Server. Hosts the aims application.    ','ip' => '10.100.8.42','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-07-23']);
      Server::create(['operating_system_id' => 4, 'group_id' => 6, 'name' => 'bomgar','description' => 'Elizabeth Grigsby, Rod Hoskinson','ip' => '172.17.1.50','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'esuite7','description' => 'Hosts the esuite application.  ','ip' => '10.100.8.51','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-02-26']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'govapp','description' => 'Govern App Server. Contractor access and multimedia storage.  ','ip' => '10.100.8.72','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'isupport','description' => 'Service Desk Management  ','ip' => '10.100.8.58','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-10-08']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'logos7app','description' => 'Hosts Logos7 Production Application.  ','ip' => '10.100.8.65','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'mpulse','description' => 'Hosts the Mpulse app  ','ip' => '10.100.8.85','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-10-08']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'sympro','description' => 'Hosts the sympro app','ip' => '10.100.8.59','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-10-08']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'trim7','description' => 'Main Trim Workgroup Server','cname' => 'trim-app','ip' => '10.100.8.53','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'trim7event','description' => '  ','ip' => '10.100.8.44','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'rmapp01', 'description' => 'HP Records Manager Primary App Server', 'ip' => '10.100.8.12','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'rmapp02', 'description' => 'HP Records Manager Secondary App Server', 'ip' => '10.100.8.13','inactive_flag' => 0,'production_flag' => 1]);

      // production app servers -- gis
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'cartegraph','description' => '  ','ip' => '10.100.8.77','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-10-08']);

      // production app servers -- ti
      Server::create(['operating_system_id' => 2, 'group_id' => 9, 'name' => 'commander','description' => 'Facility commander server','ip' => '10.100.8.19','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-11-09']);

      // production web servers
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'webprod', 'description' => 'Production Web Server', 'ip' => '10.100.8.96','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 4, 'group_id' => 6, 'name' => 'myPropApp','description' => 'myProperty Web Server','ip' => '172.17.1.23','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 4, 'group_id' => 6, 'name' => 'msbwww2','description' => 'Primary Web Server','cname' => 'www','ip' => '172.17.1.36','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 4, 'group_id' => 6, 'name' => 'msbwww1','description' => 'Secondary Web Server','cname' => 'ww2','ip' => '172.17.1.35','inactive_flag' => 0,'production_flag' => 1]);

      // production gis servers
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'ags2','description' => 'ArcGIS 10 Web Server','cname' => 'ags','ip' => '10.100.8.79','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2014-09-11']);
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'gis102ags','ip' => '10.100.8.133','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'gis102geoproc','ip' => '10.100.8.134','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-08-27']);
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'gis102licmgr','ip' => '10.100.8.135','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'gis102web','ip' => '10.100.8.136','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'gis102sde','ip' => '10.100.8.137','inactive_flag' => 0,'production_flag' => 1]);

      // production sharepoint servers
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spapp01','description' => 'Sharepoint Primary Application Server','ip' => '10.100.8.158','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spowa01','description' => 'Sharepoint Office Web Apps Server','ip' => '10.100.8.161','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spsql01','description' => 'Sharepoint SQL Production Server','ip' => '10.100.8.159','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spsql02','description' => 'Sharepoint Production SQL Server Secondary','ip' => '10.100.8.160','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spweb01','description' => 'Sharepoint Production Web Server 1','ip' => '10.100.8.162','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spweb02','description' => 'Sharepoint Production Web Server 2','ip' => '10.100.8.163','inactive_flag' => 0,'production_flag' => 1]);

      // terminal servers
      Server::create(['operating_system_id' => 3, 'group_id' => 9, 'name' => 'tserver1','description' => 'Terminal Server  ','ip' => '10.100.8.36','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-08-13']);


      // other production servers
      Server::create(['operating_system_id' => 2, 'group_id' => 9, 'name' => 'dsjlicmgr','description' => 'License Manager Server','ip' => '10.100.8.49','inactive_flag' => 0,'production_flag' => 1,'last_windows_update' => '2015-08-27']);
      Server::create(['operating_system_id' => 2, 'group_id' => 9, 'name' => 'dsjns1','description' => 'DNS Server','cname' => 'ns1','ip' => '172.17.1.20','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 2, 'group_id' => 9, 'name' => 'dsjns2','description' => 'DNS Server','cname' => 'ns2','ip' => '172.17.1.21','inactive_flag' => 0,'production_flag' => 1]);
      Server::create(['operating_system_id' => 2, 'group_id' => 9, 'name' => 'dsjftp','description' => 'FTP Server','cname' => 'ftp','ip' => '172.17.1.12','inactive_flag' => 0,'production_flag' => 1]);

      // test sql servers - bi
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'govsqltst','description' => 'Govern Test SQL DB Server','cname' => 'governtst','ip' => '10.100.8.121','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'logossqltest','description' => 'Replacement server for logossqltst.  ','ip' => '10.100.8.131','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'msbsqltst','description' => 'SQL test server','ip' => '10.100.8.107','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'sql2012dev','description' => 'SQL 2012 Development server','ip' => '10.100.8.123','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);

      // test sql servers - gis
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'sdesql10tst','description' => 'ArcGIS 10 Test Edit Server','ip' => '10.100.8.129','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2014-07-31']);

      // test report servers
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'logosrpttest','description' => 'New logos reporting server to replace logosrpttst  ','ip' => '10.100.8.130','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'sqlrpt','description' => '  ','ip' => '10.100.8.17','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'msbrpttst','description' => '  ','ip' => '10.100.8.124','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-01-15']);

      // test app server
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'logostest','description' => 'Logos NextGen test server','ip' => '10.100.8.119','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'isupptst','description' => 'iSupport testing server','ip' => '10.100.8.125','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-10-15']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'trim7train','description' => 'Trim training server','ip' => '10.100.8.54','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'trim7test','ip' => '10.100.8.41','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-09-24']);

      // test web servers
      Server::create(['operating_system_id' => 2, 'group_id' => 6, 'name' => 'webdev','description' => 'Web development server','ip' => '10.100.8.73','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-10-08']);

      // test gis servers
      Server::create(['operating_system_id' => 2, 'group_id' => 7, 'name' => 'gis102agstst','ip' => '10.100.8.132','inactive_flag' => 0,'production_flag' => 0,'last_windows_update' => '2015-08-26']);

      // test sharepoint servers
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spapp01tst','description' => 'Sharepoint Test Application Server 1','ip' => '10.100.8.166','inactive_flag' => 0,'production_flag' => 0]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spsql01tst','description' => 'Sharepoint Test SQL Server 1','ip' => '10.100.8.167','inactive_flag' => 0,'production_flag' => 0]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spsql02tst','description' => 'Sharepoint Test SQL Server 2','ip' => '10.100.8.168','inactive_flag' => 0,'production_flag' => 0]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spweb01tst','description' => 'Sharepoint Test Web Server 2','ip' => '10.100.8.164','inactive_flag' => 0,'production_flag' => 0]);
      Server::create(['operating_system_id' => 1, 'group_id' => 6, 'name' => 'spweb02tst','description' => 'Sharepoint Test Web Server 2','ip' => '10.100.8.165','inactive_flag' => 0,'production_flag' => 0]);
    }
}
