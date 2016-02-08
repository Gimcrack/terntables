<?php

class RoleApiTest extends ApiTest {


  public function __construct()
  {
    $this->model_class = "App\\Role";
    $this->model_short = 'Role';
    $this->friendly_identifier = 'name';


    parent::__construct();
  }

  // Role Tests

  // Role does not have any mass updatable fields
  public function testUpdateMultipleModels() {}

  /**
   * Add a role to a group. Success Condition.
   * @return [type] [description]
   */
  public function testAddARoleToAGroup()
  {
    // create a group
    $role = $this->createRole()->checkoutToMe();
    $role_id = $role->id;

    // crate a group
    $group = $this->createGroup();
    $group_id = $group->id;

    // make the update and verify
    $this->patch("/Role/{$role_id}", [ "groups" => [ $group_id => [ "comment" => "test"] ] ], $this->headers)
         ->seeJsonSuccess()
         ->seeInDatabase('group_role',["comment" => "test", "role_id" => $role_id, "group_id" => $group_id])
         ->seeStatusCode(200);
  }


}
