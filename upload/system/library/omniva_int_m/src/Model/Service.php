<?php

/**
 * 
{
    "id": 1,
    "name": "UPS STANDARD",
    "service_code": "S1",
    "image": "https:\/\/tarptautines.mijora.lt\/uploads\/service\/asset\/1\/ups.png",
    "pickup_from_address": true,
    "delivery_to_address": true,
    "parcel_terminal_type": null,
    "service_type": "Economy",
    "test": "test",
    "additional_services": {
        "cod": false,
        "insurance": false,
        "carry_service": false,
        "doc_return": false,
        "own_login": false,
        "fragile": false
    }
}
 * 
 */

namespace Mijora\OmnivaIntOpencart\Model;

use Mijora\OmnivaIntOpencart\Params;

class Service implements \JsonSerializable
{
    const ID = 'id';
    const NAME = 'name';
    const SERVICE_CODE = 'service_code';
    const IMAGE = 'image';
    const PICKUP_FROM_ADDRESS = 'pickup_from_address';
    const DELIVERY_TO_ADDRESS = 'delivery_to_address';
    const PARCEL_TERMINAL_TYPE = 'parcel_terminal_type';
    const SERVICE_TYPE = 'service_type';
    const TEST = 'test';
    const ADDITIONAL_SERVICES = 'additional_services';

    const TYPE_COURIER = 1;
    const TYPE_TERMINAL = 2;

    const TYPE_API_CODE = [
        self::TYPE_COURIER => 'courier',
        self::TYPE_TERMINAL => 'terminal'
    ];

    const TYPE_AVAILABLE = [
        self::TYPE_COURIER,
        self::TYPE_TERMINAL
    ];

    private $data = [];

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function get($key)
    {
        $params = explode('.', $key);
        $obj = $this->data;
        foreach ($params as $param) {
            $obj = $obj->{$param} ?? null;
            if ($obj === null) {
                return null;
            }
        }
        return $obj;
    }

    public function getAdditionalServices()
    {
        return get_object_vars($this->data->{self::ADDITIONAL_SERVICES});
    }

    public function jsonSerialize()
    {
        return $this->data;
    }

    public static function getTypeTranslationString($type)
    {
        if (!in_array($type, self::TYPE_AVAILABLE)) {
            return null;
        }

        return Params::PREFIX . 'service_type_' . (int) $type;
    }

    public static function fromArray($array)
    {
        $result = [];
        foreach ($array as $data) {
            $result[] = new Service($data);
        }

        return $result;
    }
}
