<?php

namespace AmeliaBooking\Domain\ValueObjects\String;

/**
 * Class Status
 *
 * @package AmeliaBooking\Domain\ValueObjects\String
 */
final class Status
{
    const HIDDEN = 'hidden';
    const VISIBLE = 'visible';
    const DISABLED = 'disabled';
    const BLOCKED = 'blocked';
    /**
     * @var string
     */
    private $status;

    /**
     * Status constructor.
     *
     * @param string $status
     */
    public function __construct($status)
    {
        $this->status = $status;
    }

    /**
     * Return the status from the value object
     *
     * @return string
     */
    public function getValue()
    {
        return $this->status;
    }
}
