<?php

namespace Mijora\OmnivaIntOpencart\Controller;

use Mijora\OmnivaIntOpencart\Helper;
use Mijora\OmnivaIntOpencart\Model\Country;
use Mijora\OmnivaIntOpencart\Model\ParcelDefault;
use OmnivaApi\Item;
use OmnivaApi\Parcel;

class ParcelCtrl
{
    const PARCEL_DIMENSIONS = [
        'weight',
        'width',
        'length',
        'height'
    ];

    public static function makeParcelsFromCart($cart_products, $db, $weight_class = null, $length_class = null)
    {
        $product_ids = array_map(function ($product) {
            return (int) $product['product_id'];
        }, $cart_products);

        $result = $db->query('
            SELECT product_id, category_id FROM ' . DB_PREFIX . 'product_to_category 
            WHERE product_id IN (' . implode(', ', $product_ids) . ')
        ');

        $product_categories = [];
        $categories = [];
        if ($result->rows) {
            foreach ($result->rows as $row) {
                $product_id = $row['product_id'];
                $category_id = $row['category_id'];
                if (!isset($product_categories[$product_id])) {
                    $product_categories[$product_id] = [];
                }

                if (!isset($categories[$category_id])) {
                    $categories[$category_id] = $category_id;
                }

                $product_categories[$product_id][] = $row['category_id'];
            }
        }

        foreach ($product_categories as $product_id => $category_ids) {
            $product_categories[$product_id] = ParcelDefault::getMultipleParcelDefault($category_ids, $db);
        }

        $defaults = ParcelDefault::getGlobalDefault($db);

        $kg_weight_class_id = Helper::getWeightClassId($db);
        $cm_length_class_id = Helper::getLengthClassId($db);

        // must have kg setup
        if (!$kg_weight_class_id) {
            return [];
        }

        $parcels = [];
        foreach ($cart_products as $product) {
            if ((int) $product['shipping'] === 0) {
                continue;
            }

            $product_id = $product['product_id'];
            $weight = (float) $product['weight'];
            $width = (float) $product['width'];
            $length = (float) $product['length'];
            $height = (float) $product['height'];

            // make sure weight and legth are in correct units
            if ($weight_class) {
                $weight = (float) $weight_class->convert($weight, $product['weight_class_id'], $kg_weight_class_id);
            }

            if ($length_class) {
                $width = (float) $length_class->convert($width, $product['length_class_id'], $cm_length_class_id);
                $length = (float) $length_class->convert($length, $product['length_class_id'], $cm_length_class_id);
                $height = (float) $length_class->convert($height, $product['length_class_id'], $cm_length_class_id);
            }

            foreach (self::PARCEL_DIMENSIONS as $dimmension) {
                if ($$dimmension > 0) {
                    continue;
                }

                $$dimmension = 0;
                if (isset($product_categories[$product_id])) {
                    foreach ($product_categories[$product_id] as $category_id => $parcel_default) {
                        if ($$dimmension < $parcel_default->$dimmension) {
                            $$dimmension = $parcel_default->$dimmension;
                        }
                    }
                }

                $$dimmension = $$dimmension === 0 ? $defaults->$dimmension : $$dimmension;
            }

            $parcel = (new Parcel())
                ->setAmount((int) $product['quantity'])
                ->setUnitWeight($weight)
                ->setWidth(ceil($width))
                ->setLength(ceil($length))
                ->setHeight(ceil($height));

            for ($i = 0; $i < (int) $product['quantity']; $i++) {
                $parcels[] = $parcel->generateParcel();
            }
        }

        return $parcels;
    }

    public static function getProductsDataByOrder($order_id, $db)
    {
        $product_ids_sql = $db->query(
            '
            SELECT product_id, quantity FROM ' . DB_PREFIX . 'order_product 
            WHERE order_id = ' . (int) $order_id
        );

        if (!$product_ids_sql->rows) {
            return [];
        }

        // product info from order
        $products = [];
        foreach ($product_ids_sql->rows as $row) {
            $product_id = (int) $row['product_id'];
            $products[$product_id] = [
                'product_id' => $product_id,
                'quantity' => $row['quantity']
            ];
        }

        $product_ids = array_keys($products);

        // add in product dimmensions information
        $product_table_cols = ['product_id', 'shipping', 'width', 'height', 'length', 'weight', 'weight_class_id', 'length_class_id'];
        $products_sql = $db->query('
            SELECT ' . implode(', ', $product_table_cols) . ' FROM ' . DB_PREFIX . 'product 
            WHERE product_id IN (' . implode(', ', $product_ids) . ')
        ');

        foreach ($products_sql->rows as $row) {
            $product_id = (int) $row['product_id'];

            if (!isset($products[$product_id])) {
                continue;
            }

            foreach ($product_table_cols as $col) {
                $products[$product_id][$col] = $row[$col];
            }
        }

        return $products;
    }

    public static function makeItemsFromProducts($products, $country)
    {
        $items = [];

        foreach ($products as $product) {
            $item = new Item();
            $item
                ->setDescription($product['name'])
                ->setItemPrice((float) $product['price'])
                ->setItemAmount((int) $product['quantity'])
                ->setCountryId($country->get(Country::ID))
            ;

            $items[] = $item->generateItem();
        }

        return $items;
    }
}
