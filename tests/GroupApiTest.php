<?php

class GroupApiTest extends ApiTest {


  public function __construct()
  {
    $this->model_class = "App\\Group";
    $this->model_short = 'Group';
    $this->friendly_identifier = 'name';


    parent::__construct();
  }

  // Group Tests

  // Group does not have any mass updatable fields
  public function testUpdateMultipleModels() {}

  /**
   * Add a group to a user. Success Condition.
   * @return [type] [description]
   */
  public function testAddAGroupToAUser()
  {
    // create a user
    $user = $this->createUser();
    $user_id  = $user->id;

    // create a group
    $group = $this->createGroup()->checkoutToMe();
    $group_id = $group->id;

    // make the update and verify
    $this->patch("/Group/{$group_id}", [ "users" => [ $user_id => [ "primary_flag" => 1, "comment" => "test"] ] ], $this->headers)
         ->seeJsonSuccess()
         ->seeInDatabase('group_user',["comment" => "test", "primary_flag" => 1, "user_id" => $user_id, "group_id" => $group_id])
         ->seeStatusCode(200);
  }

  /**
   * Add a role to a group. Success Condition.
   * @return [type] [description]
   */
  public function testAddAGroupToARole()
  {
    // create a group
    $role = $this->createRole();
    $role_id = $role->id;

    // crate a group
    $group = $this->createGroup()->checkoutToMe();
    $group_id = $group->id;

    // make the update and verify
    $this->patch("/Group/{$group_id}", [ "roles" => [ $role_id => [ "comment" => "test comment"] ] ], $this->headers)
         ->seeJsonSuccess()
         ->seeInDatabase('group_role',["comment" => "test comment", "role_id" => $role_id, "group_id" => $group_id])
         ->seeStatusCode(200);
  }


}
