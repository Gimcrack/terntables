<?php

class InspireCommandTest extends CommandTest {

    /**
     * The signature of the command to test
     *
     * @var        string
     */
    public $signature = 'inspire';

    /**
     * Test the Inspire Commands
     * @method testCommand
     *
     * @return   void
     */
    public function testCommand()
    {
        dd( $this->command($this->signature) );
    }


}