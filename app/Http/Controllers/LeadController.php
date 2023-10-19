<?php

namespace App\Http\Controllers;
use App\Models\Lead;
use Illuminate\Support\Facades\Redirect;
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

    function delete($id){

        try {
            $lead = Lead::find($id);
            $appKey = $lead->app;
            $lead->delete();
            return Redirect::route('edit-app', ['id' => $appKey]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir o registro'], 500);
        }
    }
}
