<?php

namespace App;

class WindowsUpdateDetail extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'update_details';

  /**
   * The column that identifies the model
   * @return [type] [description]
   */
  public function identifiableName()
  {
      return 'Update_' . $this->update_id . '_Server_' . $this->server_id;
  }

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'update_id',
      'server_id',
      'eula_accepted',
      'downloaded_flag',
      'hidden_flag',
      'installed_flag',
      'mandatory_flag',
      'max_download_size',
      'min_download_size',
      'approved_flag',
  ];
}
