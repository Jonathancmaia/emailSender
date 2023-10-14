<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;
use App\Models\App;
use App\Models\Lead;
use Illuminate\Support\Str;

class AppController extends Controller
{
    function create(){
        return Inertia::render('CreateApp');
    }

    function save(Request $request){

        $request->validate([
            'name' => ['required'],
            'email' => ['required'],
            'phone' => ['required']
        ]);

        $app = new App();
        $app->id = Str::random(32);
        $app->user =  $request->user()->id;
        $app->name = $request->input('name');
        $app->email = $request->input('email');
        $app->phone = $request->input('phone');

        $app->save();

        return Redirect::to('/dashboard');
    }

    function edit($id){

        $app = App::find($id);
        $lead = Lead::where('app', $id)->get();

        return Inertia::render('EditApp', [
            'app' => $app,
            'leads' => $lead
        ]);
    }

    function alter(Request $request){

        $request->validate([
            'id' => ['required'],
            'name' => ['required'],
            'email' => ['required'],
            'phone' => ['required']
        ]);

        $app = App::find($request->input('id'));

        $app->name = $request->input('name');
        $app->email = $request->input('email');
        $app->phone = $request->input('phone');

        $app->save();

        return Redirect::to('/dashboard');
    }
}
