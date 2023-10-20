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

    function step(Request $request){

        try {
            $lead = Lead::find($request->leadId);
            
            if ($lead->step !== $request->stepId){
                $lead->step = $request->stepId;

                if($lead->save()){
                    $allLeads = Lead::where('app', $lead->app)->get();
                    return response()->json(['leads' => $allLeads]);
                } else {
                    return response()->json(['message' => 'Erro ao salvar estado do lead.'], 500);
                }
            }
        }  catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao mudar estado do lead.'], 500);
        }
    }
}
