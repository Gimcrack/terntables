<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

abstract class ApiTest extends TestCase
{
    use DatabaseTransactions;
    //use WithoutMiddleware;

    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = '/api/v1';

    /**
     * The headers to send with the api request.
     * @var [type]
     */
    public $headers;


    /**
     * The class of the model to test: e.g. App\Person.
     * @var [type]
     */
    public $model_class;

    /**
     * The short version of the model name: e.g. Person
     * @var [type]
     */
    public $model_short;

    /**
     * The
     * @var [type]
     */
    public $db_table;
    public $test_dummy;
    public $friendly_identifier = 'name';
    public $mass_update_changes = [];
    public $newName = null;

    public $error_messages = [];


    public function __construct()
    {
      $this->headers = [
        'accept' => 'application/json',
      ];

      $this->error_messages = [
        'update_checked_out'    => "Error performing update operation.",
        'delete_checked_out'    => "Error performing delete operation.",
        'checkout_checked_out'  => "Error performing checkout operation.",
        'checkin_checked_out'   => "Error performing checkin operation.",
        'checkin_checked_in'    => "Error performing checkin operation."
      ];

      $this->db_table = $this->getTable();
    }

    public function setUp() {
      parent::setUp();


      Auth::loginUsingId(1);

      $this->test_dummy = factory($this->model_class)->make();
      $this->test_dummy_attributes = $this->test_dummy->toArray();
      unset($this->test_dummy_attributes['updated_at_for_humans']);
      unset($this->test_dummy_attributes['identifiable_name']);
    }


    /**
     * get the database table of the model
     * @method getTable
     * @return [type]   [description]
     */
    public function getTable()
    {
      $class = $this->model_class;
      return (new $class)->getTable();
    }

    /// Read Tests

    /**
     * Get models. Success Condition.
     * @method testGetModels
     * @return [type]        [description]
     */
    public function testGetModels()
    {
        factory($this->model_class,3)->create();

        $class = $this->model_class;

        $count = (int)$class::count();

        $this->get("/{$this->model_short}", $this->headers)
             ->seeJsonContains(["to" => $count])
             ->seeStatusCode(200);
    }

    /**
     * Get a Model record. Success Condition
     * @method testGetModel
     * @return [type]        [description]
     */
    public function testGetModel()
    {
       $this->test_dummy->save();
       $id = $this->test_dummy->id;

       $this->get("/{$this->model_short}/{$id}", $this->headers)
            ->seeJsonContainsTestDummyAttributes()
            ->seeStatusCode(200);
    }

    /**
     * Get a fake Model. Failure Condition.
     * @method testGetAFakeModel
     * @return [type]             [description]
     */
    public function testGetAFakeModel()
    {
      $this->get("/{$this->model_short}/101011", $this->headers)
           //->dump()
           ->seeJsonError()
           ->seeStatusCode(404);
    }

    /// Create Tests

    /**
     * Create a Model. Success Condition.
     * @method testCreateModel
     * @return [type]           [description]
     */
    public function testCreateModel()
    {
      $attributes = $this->test_dummy_attributes;

      $this->post("/{$this->model_short}", $attributes , $this->headers)
           ->seeJsonSuccess()
           ->seeTestDummyInDatabase()
           ->seeStatusCode(201);
    }

    /**
     * Create a Model while not logged in. Failure Condition.
     * @method testCreateModelWhileNotLoggedIn
     * @return [type]                           [description]
     */
    public function testCreateModelWhileNotLoggedIn()
    {
      // logout first
      Auth::logout();

      $attributes = $this->test_dummy_attributes;

      $this->post("/{$this->model_short}",$attributes, $this->headers)
           ->seeJsonError()
           ->notSeeTestDummyInDatabase()
           ->seeStatusCode(403);
    }

    /// Update Tests

    /**
     * Test updating a Model record. Success Condition.
     * @method testUpdateModel
     * @return [type]           [description]
     */
    public function testUpdateModel() {
      $attributes = $this->test_dummy_attributes;
      $name = $this->friendly_identifier;

      // create a Model
      $this->test_dummy->save();
      $this->test_dummy->checkoutToMe();
      $id = $this->test_dummy->id;

      // make the update and verify
      $this->patch("/{$this->model_short}/{$id}", $this->getNewNameArray(), $this->headers)
           ->seeJsonSuccess()
           ->seeChangesInDatabase()
           ->seeStatusCode(200);
    }

    /**
     * Test update multiple Models. Success Condition.
     * @method testUpdateMultipleModels
     * @return [type]                   [description]
     */
    public function testUpdateMultipleModels()
    {
      // create models
      $models = factory($this->model_class, 5)->create();

      $this->patch("/{$this->model_short}/_massUpdate", $this->getMassUpdateChanges(), $this->headers)
           ->seeJsonSuccess()
           ->seeStatusCode(200);
    }

    /**
     * Test updating a fake model. Failure Condition.
     * @method testUpdateFakeModel
     * @return [type]               [description]
     */
    public function testUpdateFakeModel()
    {

      $this->patch("/{$this->model_short}/11283712", $this->getNewNameArray(), $this->headers)
           ->seeJsonError()
           ->notSeeChangesInDatabase()
           ->seeStatusCode(404);
    }

    /**
     * Test updating a model while not logged in. Failure Condition.
     * @method testUpdateModelWhileNotLoggedIn
     * @return [type]                           [description]
     */
    public function testUpdateModelWhileNotLoggedIn() {
      // logout first
      Auth::logout();

      // create a model
      $model = $this->test_dummy->save();
      $id = $this->test_dummy->id;

      // make the update and verify
      $this->patch("/{$this->model_short}/{$id}", $this->getNewNameArray(), $this->headers)
           ->seeJsonError()
           ->notSeeChangesInDatabase()
           ->seeStatusCode(403);
    }


    /**
     * Test updating a model without checking it out. Failure Condition.
     * @method testUpdateModelWithoutCheckingItOut
     * @return [type]                               [description]
     */
    public function testUpdateModelWithoutCheckingItOut() {
      $name = $this->friendly_identifier;

      // create a model
      $this->test_dummy->save();
      $id = $this->test_dummy->id;

      // verify the model
      $this->get("/{$this->model_short}/{$id}", $this->headers)
           ->seeJsonContainsNameArray()
           ->seeTestDummyInDatabase()
           ->seeStatusCode(200);

      // attempt the update and verify it fails
      $this->patch("/{$this->model_short}/{$id}", $this->getNewNameArray(), $this->headers)
           ->seeJsonError()
           ->notSeeChangesInDatabase()
           ->seeStatusCode(405);
    }

    /**
     * Test updating a model checked out to someone else. Failure Condition.
     * @method testUpdateModelWithoutCheckingItOut
     * @return [type]                               [description]
     */
    public function testUpdateModelCheckedOutToSomeoneElse() {
      // create a JohnDoe user
      $this->createUser();

      // create a model and check it out to JohnDoe
      $this->test_dummy->save();
      $this->test_dummy->checkoutToId(2);
      $id = $this->test_dummy->id;

      // attempt the update and verify it fails
      $this->patch("/{$this->model_short}/{$id}", $this->getNewNameArray(), $this->headers)
           ->seeJsonContains(["message" => $this->error_messages['update_checked_out'] ])
           ->seeJsonError()
           ->notSeeChangesInDatabase()
           ->seeStatusCode(409);
    }

    // Delete Tests

    /**
     * Delete a model. Success Condition.
     * @method testDeleteModel
     * @return [type]           [description]
     */
    public function testDeleteModel()
    {
      // create a model
      $this->test_dummy->save();
      $id = $this->test_dummy->id;

      // verify the model
      $this->get("/{$this->model_short}/{$id}", $this->headers)
           ->seeJsonContainsTestDummyAttributes()
           ->seeTestDummyInDatabase()
           ->seeStatusCode(200);

      // delete
      $this->delete("/{$this->model_short}/{$id}", [], $this->headers)
           ->seeJsonSuccess()
           ->notSeeTestDummyInDatabase()
           ->seeStatusCode(200);

      // attempt to delete same model again. verify fails.
      $this->delete("/{$this->model_short}/{$id}", [], $this->headers)
           ->seeJsonError()
           ->seeStatusCode(404);
    }

    /**
     * Delete a fake model. Failure Condition.
     * @method testDeleteFakeModel
     * @return [type]               [description]
     */
    public function testDeleteFakeModel()
    {
      // delete
      $this->delete("/{$this->model_short}/1123123", [], $this->headers)
           ->seeJsonError()
           ->seeStatusCode(404);
    }

    /**
     * Delete a model which is checked out to someone else. Failure Condition.
     * @method testDeleteAModelWhichIsCheckedOutToSomeoneElse
     * @return [type]               [description]
     */
    public function testDeleteAModelWhichIsCheckedOutToSomeoneElse()
    {
      // create a JohnDoe user
      $this->createUser();

      // create a model and check it out to JohnDoe
      $this->test_dummy->save();
      $this->test_dummy->checkoutToId(2);
      $id = $this->test_dummy->id;

      // delete
      $this->delete("/{$this->model_short}/{$id}", [], $this->headers)
           ->seeJsonContains(['message' => $this->error_messages['delete_checked_out'] ])
           ->seeJsonError()
           ->seeStatusCode(409);
    }

    /**
     * Delete a model while not logged in. Failure Condition.
     * @method testDeleteModelWhileNotLoggedIn
     * @return [type]                           [description]
     */
    public function testDeleteModelWhileNotLoggedIn()
    {
      // create a model
      $this->test_dummy->save();
      $id = $this->test_dummy->id;

      Auth::logout();

      // verify the model
      $this->delete("/{$this->model_short}/{$id}", [], $this->headers)
           ->seeJsonError()
           ->seeStatusCode(403);
    }

    /**
     * Delete multiple models. Success Condition.
     * @method testDeleteMultipleModels
     * @return [type]                   [description]
     */
    public function testDeleteMultipleModels()
    {
      // create models
      factory($this->model_class, 5)->create();

      $this->delete("/{$this->model_short}", [ 'ids' => [1,3,5] ], $this->headers )
           ->seeJsonSuccess()
           ->seeJsonContains(['count' => "3"])
           ->seeStatusCode(200);
    }

    /**
     * Delete multiple models. Some of which are checked out. Failure Condition.
     * @method testDeleteMultipleModelsSomeOfWhichAreCheckedOut
     * @return [type]                                           [description]
     */
    public function testDeleteMultipleModelsSomeOfWhichAreCheckedOut()
    {
      $class = $this->model_class;

      // create a JohnDoe user
      $this->createUser();

      // create models
      factory($this->model_class, 5)->create();

      $class::find(1)->checkoutToId(2);
      $class::find(2)->checkoutToId(2);
      $class::find(3)->checkoutToId(2);

      $this->delete("/{$this->model_short}", [ 'ids' => [1,2,3,4,5] ], $this->headers)
         //->dump()
           ->seeJsonError()
           ->seeStatusCode(409);

    }


    // checkout tests

    /**
     * Checkout a model. Success Condition.
     * @method testCheckoutModel
     * @return [type]            [description]
     */
    public function testCheckoutModel()
    {
      // create a model
      $this->test_dummy->save();
      $id = $this->test_dummy->id;

      // checkout the model
      $this->get("/{$this->model_short}/{$id}/_checkout", $this->headers)
           ->seeJsonSuccessfulCheckout()
           ->seeStatusCode(200);

      // checkout the model again
      $this->get("/{$this->model_short}/{$id}/_checkout", $this->headers)
           ->seeJsonSuccessfulCheckout()
           ->seeStatusCode(200);
    }

    /**
     * Checkout a fake model. Failure Condition.
     * @method testCheckoutAFakeModel
     * @return [type]                 [description]
     */
    public function testCheckoutAFakeModel()
    {
      // checkout the fake person
      $this->get("/{$this->model_short}/191823/_checkout", $this->headers)
           ->seeJsonError()
           ->seeStatusCode(404);
    }

    /**
     * Checkout a model while not logged in. Failure Condition.
     * @method testCheckoutAModelWhileNotLoggedIn
     * @return [type]                             [description]
     */
    public function testCheckoutAModelWhileNotLoggedIn()
    {
      Auth::logout();

      // create a model
      $this->test_dummy->save();
      $id = $this->test_dummy->id;

      // attempt to checkout the model. verify failure
      $this->get("/{$this->model_short}/{$id}/_checkout", $this->headers)
           ->seeJsonError()
           ->seeStatusCode(403);
    }

    /**
     * Checkout a model which is already checked out. Failure Condition.
     * @method testCheckoutAModelWhichIsAlreadyCheckedOut
     * @return [type]                                   [description]
     */
    public function testCheckoutAModelWhichIsAlreadyCheckedOut()
    {
      // create a JohnDoe user
      $this->createUser();

      // create a model
      $this->test_dummy->save();
      $this->test_dummy->checkoutToId(2); // checkout to JohnDoe
      $id = $this->test_dummy->id;

      // try to checkout the same record
      $this->get("/{$this->model_short}/{$id}/_checkout", $this->headers)
           ->seeJsonContains(["message" => $this->error_messages['checkout_checked_out']])
           ->seeStatusCode(409);
    }


    // checkin tests

    /**
     * Checkin a model. Success Condition.
     * @method testCheckinAModel
     * @return [type]            [description]
     */
    public function testCheckinAModel()
    {
      // create a model
      $this->test_dummy->save();
      $this->test_dummy->checkoutToMe();
      $id = $this->test_dummy->id;

      // checkin the person
      $this->get("/{$this->model_short}/{$id}/_checkin", $this->headers)
           ->seeJsonSuccess()
           ->seeJsonSuccessfulCheckin()
           ->seeStatusCode(200);
    }

    /**
     * Checkin a model which is checked out by someone else. Failure Condition.
     * @method testCheckinAModelWhichIsCheckedOutBySomeoneElse
     * @return [type]                                        [description]
     */
    public function testCheckinAModelWhichIsCheckedOutBySomeoneElse()
    {
      //create the JohnDoe user
      $this->createUser();

      // create a model
      $this->test_dummy->save();
      $this->test_dummy->checkoutToId(2); // checkout to JohnDoe
      $id = $this->test_dummy->id;

      // checkin the person
      $this->get("/{$this->model_short}/{$id}/_checkin", $this->headers)
           ->seeJsonError()
           ->seeJsonContains(["message" => $this->error_messages['checkin_checked_out']])
           ->seeStatusCode(409);

    }

    /**
     * Checkin a model which is already checked in. Failure Condition
     * @method testCheckinAModelWhichIsAlreadyCheckedIn
     * @return [type]                                   [description]
     */
    public function testCheckinAModelWhichIsAlreadyCheckedIn()
    {
      // create a model
      $this->test_dummy->save();
      $this->test_dummy->checkoutToId(1); // checkout to me
      $id = $this->test_dummy->id;

      $this->test_dummy->checkin(); // check it in.

      // attempt to check it in again.
      $this->get("/{$this->model_short}/{$id}/_checkin", $this->headers)
           ->seeJsonError()
           ->seeJsonContains(["message" => $this->error_messages['checkin_checked_in']])
           ->seeStatusCode(405);
    }

    /**
     * Checkin multiple models at once
     * @method testCheckinMultipleModelsAtOnce
     * @return [type]                          [description]
     */
    public function testCheckinMultipleModelsAtOnce()
    {
      $class = $this->model_class;

      // create models
      factory($this->model_class, 3)->create();

      $class::find(1)->checkoutToMe();
      $class::find(2)->checkoutToMe();
      $class::find(3)->checkoutToMe();

      $this->get("/{$this->model_short}/_checkinAll", $this->headers)
           ->seeJsonSuccess()
           ->seeJsonContains(["message" => "All {$this->model_short} records checked in.", "count" => 3])
           ->seeStatusCode(200);
    }

    /**
     * Checkin everything at once.
     * @method testCheckinEverythingAtOnce
     * @return [type]                      [description]
     */
    public function testCheckinEverythingAtOnce()
    {
      $class = $this->model_class;

      // create models
      factory($this->model_class, 3)->create();

      $class::find(1)->checkoutToMe();
      $class::find(2)->checkoutToMe();
      $class::find(3)->checkoutToMe();

      $this->get("_checkinAll", $this->headers)
           ->seeJsonSuccess()
           ->seeJsonContains(["message" => 'All records checked in.', "count" => 3])
           ->seeStatusCode(200);
    }

    // -- helpers --

    /**
     * Get a new name for testing
     * @method getNewName
     * @return [type]     [description]
     */
    public function getNewName()
    {
      $name = $this->friendly_identifier;
      $this->newName = $this->newName ?: factory($this->model_class)->make()->toArray()[$name];

      return $this->newName;
    }

    /**
     * Get the name record of the test dummy
     * @method getDummyName
     * @return [type]  [description]
     */
    public function getDummyName()
    {
      $name = $this->friendly_identifier;
      return $this->test_dummy_attributes[$name];
    }

    /**
     * Get a key value pair with the friendly identifier and the name
     * @method getNewNameArray
     * @return [type]          [description]
     */
    public function getDummyNameArray()
    {
      return [ $this->friendly_identifier => $this->getDummyName() ];
    }

    /**
     * Get a key value pair with the friendly identifier and the new name
     * @method getNewNameArray
     * @return [type]          [description]
     */
    public function getNewNameArray()
    {
      return [ $this->friendly_identifier => $this->getNewName() ];
    }

    /**
     * See that the operation was successful
     * @method seeJsonSuccess
     * @return [type]         [description]
     */
    public function seeJsonSuccess()
    {
      return $this->seeJsonContains(["errors" => false]);
    }

    /**
     * See Json Successful Checkout
     * @method seeJsonSuccessfulCheckout
     * @return [type]                    [description]
     */
    public function seeJsonSuccessfulCheckout()
    {
      return $this->seeJsonContains(["message" => 'Record Checked Out For Editing.']);
    }

    /**
     * See Json Successful Checkin
     * @method seeJsonSuccessfulCheckout
     * @return [type]                    [description]
     */
    public function seeJsonSuccessfulCheckin()
    {
      return $this->seeJsonContains(["message" => 'Record Checked In.']);
    }

    /**
     * See that there was an error performing the operation
     * @method seeJsonError
     * @return [type]       [description]
     */
    public function seeJsonError()
    {
      return $this->seeJsonContains(["errors" => true]);
    }

    /**
     * See that the test dummy attributes appear in the JSON result
     * @method seeJsonContainsTestDummyAttributes
     * @return [type]                             [description]
     */
    public function seeJsonContainsTestDummyAttributes()
    {
      return $this->seeJsonContains( $this->test_dummy_attributes );
    }

    /**
     * See Json Contains The Name Array
     * @method seeJsonContainsNameArray
     * @return [type]                   [description]
     */
    public function seeJsonContainsNameArray()
    {
      return $this->seeJsonContains( $this->getDummyNameArray() );
    }


    /**
     * See the updated values in the database
     * @method seeChangesInDatabase
     * @return [type]               [description]
     */
    public function seeChangesInDatabase()
    {
      return $this->seeInDatabase($this->db_table, $this->getNewNameArray());
    }

    /**
     * Not see the updated values in the database
     * @method seeChangesInDatabase
     * @return [type]               [description]
     */
    public function notSeeChangesInDatabase()
    {
      return $this->notSeeInDatabase($this->db_table, $this->getNewNameArray());
    }

    /**
     * See the test dummy record in the database
     * @method seeTestDummyInDatabase
     * @return [type]                 [description]
     */
    public function seeTestDummyInDatabase()
    {
      return $this->seeInDatabase( $this->db_table, $this->test_dummy_attributes );
    }

    /**
     * Dont see the teset dummy record in the database
     * @method notSeeTestDummyInDatabase
     * @return [type]                    [description]
     */
    public function notSeeTestDummyInDatabase()
    {
      return $this->notSeeInDatabase( $this->db_table, $this->test_dummy_attributes );
    }

    /**
     * Get mass update changes array
     * @method getMassUpdateChanges
     * @return [type]               [description]
     */
    public function getMassUpdateChanges()
    {
      return [ 'ids' => [1,3,5], 'changes' => $this->mass_update_changes ];
    }

    /**
     * Create a new user
     * @method createUser
     * @return [type]     [description]
     */
    public function createUser()
    {
      return App\User::create(['username' => 'JohnDoe', 'email' => 'jdoe@email.com', 'password' => 'password']);
    }

    /**
     * Create a new group
     * @method createGroup
     * @return [type]     [description]
     */
    public function createGroup()
    {
      return App\Group::create(['name' => 'Test Group', 'description' => 'Test Group']);
    }

    /**
     * Create a new role
     * @method createRole
     * @return [type]     [description]
     */
    public function createRole()
    {
      return App\Role::create(['name' => 'Test Role', 'description' => 'Test Role']);
    }

}
