<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();

        //empty table first
        //User::truncate();

        /**
         * Groups
         *
         * Super Administrators - 1
         * Administrators - 2
         * AD Users - 3
         * IT - 4
         * Managers - 5
         * BIT - 6
         * GIS - 7
         * SD - 8
         * TI - 9
         */

        $superadmin_groups  = [1,3,4,6];
        $bi_groups          = [3,4,6];
        $gis_groups         = [3,4,7];
        $sd_groups          = [3,4,8];
        $ti_groups          = [3,4,9];

        // BIT
        User::create(['people_id' => 1, 'username' => 'jeremy', 'email' => 'jeremy.bloomstrom@gmail.com', 'password' => bcrypt('P@ssw0rd'), 'comment' => 'main username', 'primary_flag' => 1])
          ->groups()->attach($superadmin_groups);
        User::create(['people_id' => 1, 'username' => 'jeremyadmin', 'email' => 'jeremyadmin@matsugov.us', 'password' => bcrypt('P@ssw0rd')])
          ->groups()->attach($superadmin_groups);
        User::create(['people_id' => 1, 'username' => 'jb30111', 'email' => 'jeremy.bloomstrom@matsugov.us', 'password' => bcrypt('P@ssw0rd')])
          ->groups()->attach($superadmin_groups);
        User::create(['people_id' => 12, 'username' => 'jackadmin', 'email' => 'Jack.Horner@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($superadmin_groups);
        User::create(['people_id' => 12, 'username' => 'jh03625', 'email' => 'Jack.Horner@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($superadmin_groups);
        User::create(['people_id' => 6, 'username' => 'eb30136', 'email' => 'ed.bennett@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 6, 'username' => 'edadmin', 'email' => 'ed.bennett@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 8, 'username' => 'elizabethadmin', 'email' => 'elizabeth.grigsby@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 8, 'username' => 'eg30023', 'email' => 'elizabeth.grigsby@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 17, 'username' => 'mc02716', 'email' => 'Margaret.Cosmah@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 17, 'username' => 'margaretadmin', 'email' => 'Margaret.Cosmah@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 19, 'username' => 'mattadmin', 'email' => 'matt.rykaczewski@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 19, 'username' => 'mr06156', 'email' => 'matt.rykaczewski@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 13, 'username' => 'jasonadmin', 'email' => 'jason.bailey@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);
        User::create(['people_id' => 13, 'username' => 'jb30554', 'email' => 'jason.bailey@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($bi_groups);

        // Managers
        User::create(['people_id' => 10, 'username' => 'ew30223', 'email' => 'Eric.Wyatt@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5]);
        User::create(['people_id' => 10, 'username' => 'ericadmin2', 'email' => 'Eric.Wyatt@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5]);
        User::create(['people_id' => 4, 'username' => 'daveyadmin', 'email' => 'davey.griffith@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5,6]);
        User::create(['people_id' => 4, 'username' => 'dg05265', 'email' => 'davey.griffith@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5,6]);
        User::create(['people_id' => 22, 'username' => 'sh05042', 'email' => 'Susan.Howard@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5,7]);
        User::create(['people_id' => 22, 'username' => 'susanadmin', 'email' => 'Susan.Howard@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5,7]);
        User::create(['people_id' => 9, 'username' => 'eg03723', 'email' => 'Eric.Goudey@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5,7]);
        User::create(['people_id' => 9, 'username' => 'ericadmin', 'email' => 'Eric.Goudey@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5,7]);
        User::create(['people_id' => 7, 'username' => 'dc30510', 'email' => 'Dan.Cappel@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach([3,4,5,8,9]);

        // GIS
        User::create(['people_id' => 23, 'username' => 'sg05129', 'email' => 'Susie.Gibson@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 23, 'username' => 'susieadmin', 'email' => 'Susie.Gibson@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 24, 'username' => 'willadmin', 'email' => 'Will.Sands@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 24, 'username' => 'ws01470', 'email' => 'Will.Sands@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 2, 'username' => 'ab06417', 'email' => 'Amber.Barnaby@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 3, 'username' => 'cg04587', 'email' => 'Carla.Goers@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 3, 'username' => 'carlaadmin', 'email' => 'Carla.Goers@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 11, 'username' => 'hk04126', 'email' => 'Heather.Kelley@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 11, 'username' => 'heatheradmin', 'email' => 'Heather.Kelley@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 15, 'username' => 'kk06405', 'email' => 'Kenneth.Kleewein@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 15, 'username' => 'kennyadmin', 'email' => 'Kenneth.Kleewein@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 16, 'username' => 'lj02939', 'email' => 'Leah.Jones@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);
        User::create(['people_id' => 16, 'username' => 'leahadmin', 'email' => 'Leah.Jones@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($gis_groups);


        // SD
        User::create(['people_id' => 5, 'username' => 'ap04176', 'email' => 'andrew.paquette@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 5, 'username' => 'drewadmin', 'email' => 'andrew.paquette@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 14, 'username' => 'kv04391', 'email' => 'Katie.VanSant@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 14, 'username' => 'katieadmin', 'email' => 'Katie.VanSant@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 25, 'username' => 'zackadmin', 'email' => 'Zach.McRae@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 25, 'username' => 'zm05089', 'email' => 'Zach.McRae@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 26, 'username' => 'nv30463', 'email' => 'Nicole.Vasquez@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 26, 'username' => 'nicoleadmin', 'email' => 'Nicole.Vasquez@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 27, 'username' => 'kateadmin', 'email' => 'Katie.Richardson@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);
        User::create(['people_id' => 27, 'username' => 'kr30462', 'email' => 'Katie.Richardson@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($sd_groups);

        // TI
        User::create(['people_id' => 20, 'username' => 'rj02311', 'email' => 'randy.jones@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($ti_groups);
        User::create(['people_id' => 20, 'username' => 'randyadmin', 'email' => 'randy.jones@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($ti_groups);
        User::create(['people_id' => 21, 'username' => 'rodadmin', 'email' => 'Rod.Hoskinson@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($ti_groups);
        User::create(['people_id' => 21, 'username' => 'rh03728', 'email' => 'Rod.Hoskinson@matsugov.us', 'password' => bcrypt('Matanuska1')])
          ->groups()->attach($ti_groups);

    }
}
