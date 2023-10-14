<?php

namespace App\Http\Controllers;
use App\Models\Lead;

use Illuminate\Http\Request;

class LeadController extends Controller
{
    function save($app, $data){

        $lead = new Lead();
        $lead->app =  $app;
        $lead->data = json_encode($data);

        $lead->save();

        return response('Success.', 200);
    }
}
