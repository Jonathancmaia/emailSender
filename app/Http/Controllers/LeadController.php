<?php

namespace App\Http\Controllers;
use App\Models\Lead;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\App;

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
            $appUser = App::find($appKey)->user;

            if($appUser === Auth::user()->id){
                $lead->delete();
                return Redirect::route('edit-app', ['id' => $appKey]);
            } else {
                return Inertia::render('Dashboard', [
                    'apps' => App::where('user', auth()->user()->id)->get(),
                    'error' => "O Lead não pertence ao usuário."
                ]);
            }
        } catch (\Exception $e) {
            return Inertia::render('Dashboard', [
                'apps' => App::where('user', auth()->user()->id)->get(),
                'error' => "Erro ao exluir lead."
            ]);
        }
    }

    function step(Request $request){

        try {
            $lead = Lead::find($request->leadId);
            $appKey = $lead->app;
            $appUser = App::find($appKey)->user;

            if($appUser === Auth::user()->id){
                if ($lead->step !== $request->stepId){
                    $lead->step = $request->stepId;

                    if($lead->save()){
                        $allLeads = Lead::where('app', $lead->app)->get();
                        return response()->json(['leads' => $allLeads]);
                    } else {
                        return response()->json(['message' => 'Erro ao salvar estado do lead.'], 500);
                    }
                }
            } else {
                return Inertia::render('Dashboard', [
                    'apps' => App::where('user', auth()->user()->id)->get(),
                    'error' => "O Lead não pertence ao usuário."
                ]);
            }
        }  catch (\Exception $e) {
           return Inertia::render('Dashboard', [
                'apps' => App::where('user', auth()->user()->id)->get(),
                'error' => "Erro eo mudar estado do lead."
            ]);
        }
    }
}
