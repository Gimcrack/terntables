<?php

namespace App\Dashboard;

use League\Flysystem\Sftp\SftpAdapter;
use League\Flysystem\Filesystem;
use League\Flysystem\File;
use League\Flysystem\Adapter\Local;


class SFTP {

  /**
   * The SFTP adapter for Flysystem
   * @var [type]
   */
  public $adapter;

  /**
   * The Filesystem instance
   * @var [type]
   */
  public $filesystem;

  /**
   * The connection to use
   * @var [type]
   */
  public $connection;

  /**
   * Construct a new instance of the class
   * @method __construct
   * @param  [type]      $connection [description]
   */
  public function __construct( $connection = null )
  {
     $this->connection = $connection ?: config('remote')['default'];

     $this->adapter = new SftpAdapter( config('remote')['connections'][$this->connection] );
     $this->filesystem = new Filesystem( $this->adapter );
     $this->localfs = new Filesystem( new Local( storage_path( 'sftp' ) ) );
  }

  /**
   * List contents
   * @method ls
   * @param  string $path [description]
   * @return [type]       [description]
   */
  public function ls($path = '.', $recursive = true)
  {
    return $this->filesystem->listContents($path,$recursive);
  }

  /**
   * List only the files
   * @method files
   * @param  string $path      [description]
   * @param  [type] $recursive [description]
   * @return [type]            [description]
   */
  public function files($path = '.', $recursive = true)
  {
    $files = [];

    $contents = $this->ls($path,$recursive);

    foreach($contents as $path)
    {
      if ( $path['type'] === "file" )
      {
        $files[] = $path;
      }
    }
    return $files;
  }

  /**
   * Get a file
   * @method getFile
   * @param  [type]  $path [description]
   * @return [type]        [description]
   */
  public function getFile($path)
  {
    return $this->filesystem->get($path);
  }

  /**
   * Download a file
   * @method get
   * @param  File   $file [description]
   * @return [type]       [description]
   */
  public function get($path)
  {
    $file = $this->getFile($path);
    $contents = $file->read();

    if ( $this->isDownloaded( $path ) )
    {
      $this->localfs->delete($this->connection . DIRECTORY_SEPARATOR . $path);
    }

    $this->localfs->write( $this->connection . DIRECTORY_SEPARATOR . $path, $contents);
  }

  /**
   * Get all files, overwriting existing files
   * @method getAllFiles
   * @return [type]      [description]
   */
  public function getAllFiles()
  {
    return $this->getFiles(true);
  }

  /**
   * Get only new files
   * @method getNewFiles
   * @return [type]      [description]
   */
  public function getNewFiles()
  {
    return $this->getFiles(false);
  }

  /**
   * Get files
   * @method getNewFiles
   * @return [type]      [description]
   */
  private function getFiles($overwrite = false)
  {
    $files = $this->files();
    $downloaded = [];

    foreach($files as $file)
    {
      $path = $file['path'];

      if ( ! $this->isDownloaded($path) || $overwrite )
      {
        $this->get($path);
        $downloaded[] = $path;
      }
    }

    if ( count($downloaded) )
    {
      return "These files were downloaded \n\t" . implode( "\n\t", $downloaded );
    }

    return "No new files";
  }

  /**
   * Has the file been downloaded yet?
   * @method isDownloaded
   * @param  [type]       $path [description]
   * @return boolean            [description]
   */
  private function isDownloaded($path)
  {
    return $this->localfs->has( $this->connection . DIRECTORY_SEPARATOR . $path );
  }

}
