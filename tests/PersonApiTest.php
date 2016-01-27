<?php


class PersonApiTest extends ApiTest {

  public $headers;

  public function __construct()
  {
    $this->headers = [
      'accept' => 'application/json',
    ];

  }

  // Person Tests

  /// Read Tests

  /**
   * Get people. Success Condition.
   * @method testGetPeople
   * @return [type]        [description]
   */
  public function testGetPeople()
  {
      factory(App\Person::class,3)->create();

      $this->get('/Person', $this->headers)
           //->dump()
           ->seeJsonContains(["to" => 3])
           ->seeStatusCode(200);
  }

  /**
   * Get a person record. Success Condition
   * @method testGetPerson
   * @return [type]        [description]
   */
  public function testGetPerson()
  {
     $name = factory(App\Person::class)->create()->name;

     $this->get('/Person/1', $this->headers)
          //->dump()
          ->seeJsonContains(["name" => $name])
          ->seeStatusCode(200);
  }

  /**
   * Get a fake person. Failure Condition.
   * @method testGetAFakePerson
   * @return [type]             [description]
   */
  public function testGetAFakePerson()
  {
    $this->get('/Person/101011', $this->headers)
         //->dump()
         ->seeJsonError()
         ->seeStatusCode(404);
  }

  /// Create Tests

  /**
   * Create a person. Success Condition.
   * @method testCreatePerson
   * @return [type]           [description]
   */
  public function testCreatePerson()
  {
    $name = factory(App\Person::class)->make()->name;

    $postVars = [
      'name' => $name
    ];

    $this->post('/Person',$postVars, $this->headers)
         //->dump()
         ->seeJsonSuccess()
         ->seeInDatabase('people',['name' => $name])
         ->seeStatusCode(201);
  }

  /**
   * Create a person while not logged in. Failure Condition.
   * @method testCreatePersonWhileNotLoggedIn
   * @return [type]                           [description]
   */
  public function testCreatePersonWhileNotLoggedIn()
  {
    // logout first
    Auth::logout();

    $name = factory(App\Person::class)->make()->name;

    $postVars = [
      'name' => $name
    ];

    $this->post('/Person',$postVars, $this->headers)
         //->dump()
         ->seeJsonError()
         ->notSeeInDatabase('people',['name' => $name])
         ->seeStatusCode(403);
  }

  /// Update Tests

  /**
   * Test updating a person record. Success Condition.
   * @method testUpdatePerson
   * @return [type]           [description]
   */
  public function testUpdatePerson() {
    // create a person
    $person = factory(App\Person::class)->create();

    // verify the person
    $this->get("/Person/1", $this->headers)
         ->seeJsonContains(["name" => $person->name])
         ->seeStatusCode(200);

   // checkout the person
   $this->get("/Person/1/_checkout", $this->headers)
        ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
        ->seeStatusCode(200);

    // make a new name
    $newName = factory(App\Person::class)->make()->name;

    // make the update and verify
    $this->patch("/Person/1",["name" => $newName], $this->headers)
         //->dump()
         ->seeJsonSuccess()
         ->seeInDatabase('people',['name' => $newName])
         ->seeStatusCode(200);
  }

  /**
   * Test update multiple people. Success Condition.
   * @method testUpdateMultiplePeople
   * @return [type]                   [description]
   */
  public function testUpdateMultiplePeople()
  {
    // Person does not have any mass updatable fields

    // // create persons
    // $persons = factory(App\Person::class, 5)->create();
    //
    // // make a new name
    // $newName = factory(App\Person::class)->make()->name;
    //
    // $this->patch("/Person/_massUpdate", [ 'ids' => [1,3,5], 'changes' => ['name' => $newName] ], $this->headers)
    //      ->seeJsonSuccess()
    //      ->seeStatusCode(200);
  }

  /**
   * Test updating a fake person. Failure Condition.
   * @method testUpdateFakePerson
   * @return [type]               [description]
   */
  public function testUpdateFakePerson()
  {
    // make a new name
    $newName = factory(App\Person::class)->make()->name;

    $this->patch("/Person/11283712",["name" => $newName], $this->headers)
         ->seeJsonError()
         ->seeStatusCode(404);
        //  ->dump();
  }

  /**
   * Test updating a person while not logged in. Failure Condition.
   * @method testUpdatePersonWhileNotLoggedIn
   * @return [type]                           [description]
   */
  public function testUpdatePersonWhileNotLoggedIn() {
    Auth::logout();

    // create a person
    $person = factory(App\Person::class)->create();

    // make a new name
    $newName = factory(App\Person::class)->make()->name;

    // make the update and verify
    $this->patch("/Person/1",["name" => $newName], $this->headers)
         //->dump()
         ->seeJsonError()
         ->notSeeInDatabase('people',['name' => $newName])
         ->seeStatusCode(403);
  }

  /**
   * Test updating a person without checking it out. Failure Condition.
   * @method testUpdatePersonWithoutCheckingItOut
   * @return [type]                               [description]
   */
  public function testUpdatePersonWithoutCheckingItOut() {
    // create a person
    $person = factory(App\Person::class)->create();

    // verify the person
    $this->get("/Person/1", $this->headers)
         ->seeJsonContains(["name" => $person->name])
         ->seeStatusCode(200);

    // make a new name
    $newName = factory(App\Person::class)->make()->name;

    // attempt the update and verify it fails
    $this->patch("/Person/1",["name" => $newName], $this->headers)
         //->dump()
         ->seeJsonError()
         ->notSeeInDatabase('people',['name' => $newName])
         ->seeStatusCode(405);
  }

  /**
   * Test updating a person without checking it out. Failure Condition.
   * @method testUpdatePersonWithoutCheckingItOut
   * @return [type]                               [description]
   */
  public function testUpdatePersonCheckedOutToSomeoneElse() {
    // create a person
    $person = factory(App\Person::class)->create()->checkoutToId(2);

    // make a new name
    $newName = factory(App\Person::class)->make()->name;

    // attempt the update and verify it fails
    $this->patch("/Person/1",["name" => $newName], $this->headers)
         ->seeJsonContains(["message" => "Error performing action. Someone else has checked out that record."])
         ->seeJsonError()
         ->notSeeInDatabase('people',['name' => $newName])
         ->seeStatusCode(409);
  }

  /**
   * Delete a person. Success Condition.
   * @method testDeletePerson
   * @return [type]           [description]
   */
  public function testDeletePerson()
  {
    // create a person
    $person = factory(App\Person::class)->create();

    // verify the person
    $this->get("/Person/1", $this->headers)
         ->seeJsonContains(["name" => $person->name])
         ->seeStatusCode(200);

    // delete
    $this->delete("/Person/1", [], $this->headers)
         ->seeJsonSuccess()
         ->notSeeInDatabase('people', ['name' => $person->name])
         ->seeStatusCode(200);

    // attempt to delete same person again. verify fails.
    $this->delete("/Person/1", [], $this->headers)
         ->seeJsonError()
         ->seeStatusCode(404);
  }

  /**
   * Delete a fake person. Failure Condition.
   * @method testDeleteFakePerson
   * @return [type]               [description]
   */
  public function testDeleteFakePerson()
  {
    // delete
    $this->delete("/Person/1123123", [], $this->headers)
         ->seeJsonError()
         ->seeStatusCode(404);
  }

  /**
   * Delete a person who is checked out to someone else. Failure Condition.
   * @method testDeleteAPersonWhoIsCheckedOutToSomeoneElse
   * @return [type]               [description]
   */
  public function testDeleteAPersonWhoIsCheckedOutToSomeoneElse()
  {
    // create a person
    $person = factory(App\Person::class)->create()->checkoutToId(2);

    // delete
    $this->delete("/Person/1", [], $this->headers)
         ->seeJsonError()
         ->seeStatusCode(409);
  }

  /**
   * Delete a person while not logged in. Failure Condition.
   * @method testDeletePersonWhileNotLoggedIn
   * @return [type]                           [description]
   */
  public function testDeletePersonWhileNotLoggedIn()
  {
    // create a person
    $person = factory(App\Person::class)->create();

    Auth::logout();

    // verify the person
    $this->delete("/Person/1", [], $this->headers)
         ->seeJsonError()
         ->seeStatusCode(403);
  }

  /**
   * Delete multiple people. Success Condition.
   * @method testDeleteMultiplePeople
   * @return [type]                   [description]
   */
  public function testDeleteMultiplePeople()
  {
    // create persons
    $person = factory(App\Person::class, 5)->create();

    $this->delete("/Person", [ 'ids' => [1,3,5] ], $this->headers )
         ->seeJsonSuccess()
         ->seeJsonContains(['count' => 3])
         ->seeStatusCode(200);

  }

  public function testCheckoutPerson()
  {
    // create a person
    $person = factory(App\Person::class)->create();

    // checkout the person
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    // checkout the person again
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);
  }


  public function testCheckoutAFakePerson()
  {
    // checkout the fake person
    $this->get("/Person/191823/_checkout", $this->headers)
         ->seeJsonError()
         ->seeStatusCode(404);

  }


  public function testCheckoutAPersonWhileNotLoggedIn()
  {
    Auth::logout();

    // create a person
    $person = factory(App\Person::class)->create();

    // checkout the person
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonError()
         ->seeStatusCode(403);

  }

  public function testCheckoutAPersonWhoIsAlreadyCheckedOut()
  {
    // create a person
    $user = Auth::user();
    $person = factory(App\Person::class)->create();

    $otherUser = factory(App\User::class)->create();
    $otherUser->groups()->attach([1]); // make sure they have permission to checkout a record

    // checkout the person
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    Auth::logout();
    Auth::loginUsingId(2);

    // try to checkout ther person again
    $this
         ->get("/Person/1/_checkout", $this->headers)
         ->seeJsonContains(["message" => "That record is checked out by : {$user->username}"])
         ->seeStatusCode(410);
  }

  public function testCheckinAPerson()
  {
    // create a person
    $person = factory(App\Person::class)->create();

    // checkout the person
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    // checkin the person
    $this->get("/Person/1/_checkin", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked In.'])
         ->seeStatusCode(200);
  }

  public function testCheckinAPersonWhoIsAlreadyCheckedIn()
  {
    // create a person
    $person = factory(App\Person::class)->create();

    // checkout the person
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    // checkin the person
    $this->get("/Person/1/_checkin", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked In.'])
         ->seeStatusCode(200);

     // checkin the person
     $this->get("/Person/1/_checkin", $this->headers)
          ->seeJsonError()
          ->seeJsonContains(["message" => 'That record is already checked in'])
          ->seeStatusCode(410);
  }


  public function testCheckinMultiplePersonsAtOnce()
  {
    // create a person
    $persons = factory(App\Person::class, 3)->create();

    // checkout the person
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    // checkout the person
    $this->get("/Person/2/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    // checkout the person
    $this->get("/Person/3/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

   $this->get("/Person/_checkinAll", $this->headers)
        ->seeJsonSuccess()
        ->seeJsonContains(["message" => 'All Person records checked in.', "count" => 3])
        ->seeStatusCode(200);
  }

  public function testCheckinEverythingAtOnce()
  {
    // create a person
    $persons = factory(App\Person::class, 3)->create();

    // checkout the person
    $this->get("/Person/1/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    // checkout the person
    $this->get("/Person/2/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

    // checkout the person
    $this->get("/Person/3/_checkout", $this->headers)
         ->seeJsonSuccess()
         ->seeJsonContains(["message" => 'Record Checked Out For Editing.'])
         ->seeStatusCode(200);

   $this->get("_checkinAll", $this->headers)
        ->seeJsonSuccess()
        ->seeJsonContains(["message" => 'All records checked in.', "count" => 3])
        ->seeStatusCode(200);
  }

}
