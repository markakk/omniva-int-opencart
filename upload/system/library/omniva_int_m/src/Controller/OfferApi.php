<?php

namespace Mijora\OmnivaIntOpencart\Controller;

use Mijora\OmnivaIntOpencart\Helper;
use Mijora\OmnivaIntOpencart\Model\Offer;
use OmnivaApi\Receiver;
use OmnivaApi\Sender;

class OfferApi
{
    public static $token;
    public static $test_mode = false;

    /**
     * @return Offer[]
     */
    public static function getOffers(
        Sender $sender = null,
        Receiver $receiver = null,
        $parcels = [],
        $sort_by = Offer::OFFER_PRIORITY_CHEAPEST
    ) {
        try {
            $api = Helper::getApiInstance();//new API(self::$token, self::$test_mode);

            $offers = $api->getOffers($sender, $receiver, $parcels);
            $offers_array = [];

            foreach ($offers as $offer) {
                $offers_array[] = new Offer($offer);
            }

            Offer::sortByPriority($offers_array, $sort_by);

            return $offers_array;
        } catch (\Throwable $th) {
        } catch (\Exception $th) {
        }

        return [];
    }
}
