<?php

use Illuminate\Database\Seeder;
use App\Database;
use App\Person;
use App\Server;
use App\Application;

class DatabasesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $app = Database::create(["name" => "LogosDB",'description' => "Logos Production DB","rpo" => "15 min","rto" => "15 min","dr_strategy" => "mirrored. synchronous. drlogos7sql","ha_strategy" => "n/a","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Davey Griffith')->first()->id]);
      $app->applications()->attach([Application::where('name','Logos')->first()->id]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "govern_prod",'description' => "Govern production database","rpo" => "15 min","rto" => "15 min","dr_strategy" => "mirrored, synchronous, drgovsql","ha_strategy" => "n/a","upgrade_readiness" => "Vendor Approved : Unknown
      Vendor Assist : Unknown
      Upgrade Advisor :  Yes
      Issues :
       Error : SQL Mail Has Been Discontinued. This affects usp_DiskFreeSpaceAlert.
       Mitigation : Rewrite the USP to use DB Mail instead

       Warning: Several views contain remote references to smalldatetime columns. Under compatibility level 110, remote smalldatetime columns are now returned to local servers as smalldatetime columns instead of as datetime columns. This may make the view unable to accept updates.
       Mitigation: Keep DBCL at 100 or change the datatype of the remote columns to datetime.

       Warning : The DB Mirroring feature is deprecated and will be removed in a future release.
       Mitigation : Implement another DR strategy.","server_id" => Server::where('name','govsql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Davey Griffith')->first()->id,Person::where('name','Ed Bennett')->first()->id]);
      $app->applications()->attach([Application::where('name','Govern')->first()->id]);
      $app->servers()->attach([Server::where('name','govsql')->first()->id]);

      $app = Database::create(["name" => "TrimProduction",'description' => "Trim Production database","rpo" => "15 min","rto" => "1 hour","dr_strategy" => "mirrored, synchronous, drmsb01sql","ha_strategy" => "n/a","upgrade_readiness" => "Vendor Approved : Yes
      Vendor Assist : N/A
      Upgrade Advisor :  Yes
      Issues :
       Warning: DB Mirroring will be deprecated in a future version
       Mitigation: Implement another DR strategy","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Davey Griffith')->first()->id]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MSBDATA",'description' => "Govern Reporting Database","server_id" => Server::where('name','msbsqlrpt')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Matt Rykaczewski')->first()->id,Person::where('name','Davey Griffith')->first()->id,Person::where('name','Ed Bennett')->first()->id]);
      $app->applications()->attach([Application::where('name','Govern')->first()->id]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id]);

      $app = Database::create(["name" => "eSuiteDB",'description' => "eSuite Production DB","rpo" => "15 min","rto" => "1 hour","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id,Person::where('name','Davey Griffith')->first()->id]);
      $app->applications()->attach([Application::where('name','eSuite')->first()->id]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "Monitor",'description' => "Disk space reporting db.","server_id" => Server::where('name','govsql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','govsql')->first()->id]);

      $app = Database::create(["name" => "LogosMigrate",'description' => "Logos Upgrade migration db","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "LogosConfig",'description' => "Logos Upgrade Config DB","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 1,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->applications()->attach([Application::where('name','Logos')->first()->id]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "TrimTrain",'description' => "Trim Training Database","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "TrimDevelopment",'description' => "Trim Testing Database","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "wasteworks",'description' => "WasteWorks Production DB","rpo" => "15 min","rto" => "1 hour","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Davey Griffith')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id,Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','WasteWorks')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "AbraHRMS_Live",'description' => "Abra Production Database","rpo" => "15 min","rto" => "1 hour","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Davey Griffith')->first()->id,Person::where('name','Elizabeth Grigsby')->first()->id,Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','Abra')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "AbraEmployeeSelfService",'description' => "Abra Employee Self Service Database","rpo" => "15 min","rto" => "1 hour","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id,Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','Abra')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "AbraHRMS_Sample",'description' => "Abra Test Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Abra')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Actions",'description' => "Search Actions Database","rpo" => "1 hour","rto" => "1 hour","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Davey Griffith')->first()->id,Person::where('name','Jack Horner')->first()->id,Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','Actions')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Aimwin",'description' => "Ambulance Billing Database","rpo" => "1 hour","rto" => "1 hour","upgrade_readiness" => "Vendor Approved : Yes
      Vendor Assist : N/A
      Upgrade Advisor : No, incompatible with DBCL 80
      Issues :
       Error : The db is at DBCL 80 which is incompatible with SQL Server 2012.
       Mitigation : The vendor stated that the DBCL can be changed to 100 without a problem.","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Davey Griffith')->first()->id]);
      $app->applications()->attach([Application::where('name','AIMS')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Aimwin_Archive",'description' => "Ambulance Billing Archive Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','AIMS')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Animal",'description' => "Chameleon (Animal Care) Database","upgrade_readiness" => "Vendor Approved : Yes
      Vendor Assist : Vendor will be providing updated views to make the db compatible with DBCL 90.
      Upgrade Advisor : No, incompatible with DBCL 80
      Issues :
       Error : The db is at DBCL 80 which is incompatible with SQL Server 2012. Several views contain unsupported non-ANSI joins which do not work with DBCL > 80.
       Mitigation : The vendor will be providing updated views that will allow DBCL 90. This will allow us to migrate to 2012.

      The updated views and instructions are in the project folder.","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id,Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','Chameleon')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "BITDEV",'description' => "BIT Development Db","server_id" => Server::where('name','msbsqlrpt')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id]);

      $app = Database::create(["name" => "ElectionsDB_2011copy",'description' => "ElectionsDB_2011copy","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Elections_2006_May",'description' => "Elections_2006_May","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Elections_2006_Oct",'description' => "Elections_2006_Oct","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Elections_2007_Oct",'description' => "Elections_2007_Oct","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Elections_2008_Oct",'description' => "Elections_2008_Oct","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Elections_2009_Mar",'description' => "Elections_2009_Mar","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Logos_DW",'description' => "Logos Analytics Database","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Logos')->first()->id]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "ProjectBoardProd",'description' => "Project Board Production Database","rpo" => "1 day","rto" => "1 day","dr_strategy" => "n/a","ha_strategy" => "n/a","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','Project Board CMS')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "Monitor",'description' => "Disk Space monitoring db","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "ReportServer",'description' => "Logos Report Server Database","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Logos')->first()->id]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "ReportServerTempDB",'description' => "ReportServerTempDB","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "LogosRuntimeServices",'description' => "Logos Runtime Services Database","server_id" => Server::where('name','logos7sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Logos')->first()->id]);
      $app->servers()->attach([Server::where('name','logos7sql')->first()->id]);

      $app = Database::create(["name" => "Kodak_TRIM",'description' => "Microfilm Archive Trim Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Davey Griffith')->first()->id,Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MEdat2011",'description' => "Max Solutions Ice Rink Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->applications()->attach([Application::where('name','Maximum Solutions')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MEdat2011_Palmer",'description' => "Max Solutions Palmer Pool Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->applications()->attach([Application::where('name','Maximum Solutions')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MEdat2011_Wasilla",'description' => "Max Solutions Wasilla Pool Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->applications()->attach([Application::where('name','Maximum Solutions')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "ReportServerTempDB",'description' => "ReportServerTempDB","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "ReportServer",'description' => "Reporting Services Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cAsset",'description' => "iSupport Asset Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupport",'description' => "iSupport Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Elizabeth Grigsby')->first()->id]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupport_Archive",'description' => "iSupport Archive Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupport_Bomgar",'description' => "iSupport Bomgar Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupport_Workflow",'description' => "iSupport Workflow Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupportReporting",'description' => "iSupport Reporting Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "SolarWinds",'description' => "SolarWinds Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Solarwinds')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "TRIM_DEV",'description' => "Trim Development Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSurvey",'description' => "iSupport Survey Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MpulseAdmin",'description' => "MPulse Administration Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','MPulse')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MPulse_Test",'description' => "MPulse Test Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','MPulse')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MPulse_Facilities",'description' => "MPulse Facilities Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','MPulse')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MPulse_Fleet",'description' => "MPulse Fleet Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','MPulse')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MPulse_EMS",'description' => "MPulse EMS Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','MPulse')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "PFD",'description' => "PFD Garnishment Database","upgrade_readiness" => "Vendor Approved : N/A
      Vendor Assist : N/A
      Upgrade Advisor :  Yes
      Issues :
       Warning: UD CLR Objects may function differently in DBCL110.
       Mitigation: Keep DBCL at 100.","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','PFD Garnishment')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "PFD_Test",'description' => "PFD Garnishment Testing Database","upgrade_readiness" => "Vendor Approved : N/A
      Vendor Assist : N/A
      Upgrade Advisor :  Yes
      Issues :
       Warning: UD CLR Objects may function differently in DBCL110.
       Mitigation: Keep DBCL at 100.","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','PFD Garnishment')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "ProjectBoardTest",'description' => "Project Board CMS Development Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Project Board CMS')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "OutageTracker",'description' => "OutageTracker","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MSB_Elections",'description' => "Elections Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MSB_Elections_Test",'description' => "Elections Test Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "ePO4_MCAFEE-APP",'description' => "McAfee AV Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Randy Jones')->first()->id,Person::where('name','Rod Hoskinson')->first()->id]);
      $app->applications()->attach([Application::where('name','McAfee Enterprise AV')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cartegraph_SQL_db01",'description' => "Cartegraph Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Matt Rykaczewski')->first()->id]);
      $app->applications()->attach([Application::where('name','Cartegraph')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MSB_LandManagementDocBrowser",'description' => "Land Management Document Browser Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Land Management Doc Browser')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "TrimDeploy",'description' => "Trim Deployment Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "TRIM_Upgrade",'description' => "Trim Upgrade Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MPulse_Facilities_restored",'description' => "MPulse_Facilities_restored","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MPulse_EMS_restored",'description' => "MPulse_EMS_restored","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "MPulse_Fleet_restored",'description' => "MPulse_Fleet_restored","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "SYMPRO_Matanuska",'description' => "Sympro Production Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Sympro')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "TRIM_reporting",'description' => "Trim Reporting Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','Trim')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "ReportServer",'description' => "Reporting Services Database","server_id" => Server::where('name','msbsqlrpt')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id]);

      $app = Database::create(["name" => "ReportServerTempDB",'description' => "ReportServerTempDB","server_id" => Server::where('name','msbsqlrpt')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id]);

      $app = Database::create(["name" => "OutageTrackerDev",'description' => "IT Dashboard Development Database","server_id" => Server::where('name','msbsqlrpt')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','IT Dashboard')->first()->id]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id]);

      $app = Database::create(["name" => "OutageTracker",'description' => "IT Dashboard Production Database","server_id" => Server::where('name','msbsqlrpt')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->people()->attach([Person::where('name','Jeremy Bloomstrom')->first()->id]);
      $app->applications()->attach([Application::where('name','IT Dashboard')->first()->id]);
      $app->servers()->attach([Server::where('name','msbsqlrpt')->first()->id]);

      $app = Database::create(["name" => "cSupport_Image_Store",'description' => "iSupport Image Store Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 1,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupport_Archive_Purchase",'description' => "iSupport Archive Purchase Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupport_Archive_Change",'description' => "iSupport Archive Change Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "cSupport_Archive_Problem",'description' => "iSupport Archive Problem Database","server_id" => Server::where('name','msb01sql')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->applications()->attach([Application::where('name','iSupport')->first()->id]);
      $app->servers()->attach([Server::where('name','msb01sql')->first()->id]);

      $app = Database::create(["name" => "ReportServerTempDB",'description' => "ReportServerTempDB","server_id" => Server::where('name','sdesql10edit')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','sdesql10edit')->first()->id]);

      $app = Database::create(["name" => "ReportServerTempDB",'description' => "ReportServerTempDB","server_id" => Server::where('name','sdesql10')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 1,]);
      $app->servers()->attach([Server::where('name','sdesql10')->first()->id]);

      $app = Database::create(["name" => "ReportServer",'description' => "Report Server Db","server_id" => Server::where('name','sdesql10')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->servers()->attach([Server::where('name','sdesql10')->first()->id]);

      $app = Database::create(["name" => "MATSU_CAMA_GIS",'description' => "GIS Cama DB","server_id" => Server::where('name','sdesql10')->first()->id,"inactive_flag" => 0,"production_flag" => 0,"ignore_flag" => 0,]);
      $app->servers()->attach([Server::where('name','sdesql10')->first()->id]);
    }
}
