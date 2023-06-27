<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class logincontroller extends Controller
{
    public function getcountry()
    {
        try {
            $countries = DB::select('SELECT * FROM countries');
            return response()->json($countries);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getstate($country_id) {
        $data = DB::table('states')->where('country_id', $country_id)->get();
        return $data;
    }
}
