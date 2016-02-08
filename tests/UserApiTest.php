<?php

class UserApiTest extends ApiTest {


  public function __construct()
  {
    $this->model_class = "App\\User";
    $this->model_short = 'User';
    $this->friendly_identifier = 'username';

    parent::__construct();
  }

  // Person Tests

  // Person does not have any mass updatable fields
  public function testUpdateMultipleModels() {}

  /**
   * Add a user to a group. Success Condition.
   * @return [type] [description]
   */
  public function testAddAUserToAGroup()
  {
    // create a user
    $user = $this->createUser()->checkoutToMe();
    $user_id  = $user->id;

    // create a group
    $group = $this->createGroup();
    $group_id = $group->id;

    // make the update and verify
    $this->patch("/User/{$user_id}", [ "groups" => [ $group_id => [ "primary_flag" => 1, "comment" => "test"] ] ], $this->headers)
         ->seeJsonSuccess()
         ->seeInDatabase('group_user',["comment" => "test", "primary_flag" => 1, "user_id" => $user_id, "group_id" => $group_id])
         ->seeStatusCode(200);
  }
}
