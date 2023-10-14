<?php

namespace App\Http\Controllers;

use App\Mail\SendMessage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Config;
use ApiBrasil\Service;
use App\Http\Controllers\LeadController;
use App\Models\App;

class MailSender extends Controller
{

    public function sendLead($currentToken, $data)
    {

        //Send email
        $app = App::find($currentToken);

        //Save lead
        $leadController = new LeadController();

        if ($leadController->save($currentToken, $data->all())){

            //Send to e-mail
            if (Mail::to($app->email)->send(new SendMessage($data))){

                //if has a phone number, send to whatsapp
                if(isset($app->phone)){

                    //message to string
                    $dataString = "";
                    
                    foreach($data->all() as $key=>$value){
                        $dataString .= $key . ': ' . $value . "\n";
                    }

                    //send message whatsapp method
                    $whatsapp = Service::WhatsApp("sendText", [
                        "Bearer" => "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BsYXRhZm9ybWEuYXBpYnJhc2lsLmNvbS5ici9zb2NpYWwvZ29vZ2xlL2NhbGxiYWNrIiwiaWF0IjoxNjkxMTAwODYxLCJleHAiOjE3MjI2MzY4NjEsIm5iZiI6MTY5MTEwMDg2MSwianRpIjoiOGZQTk1JVG9TaXozU01HZCIsInN1YiI6IjQ0MTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.IMWDnM8B9l-ICaoqQBrz83iOovjuUCpPM6R6_E6AlEM",
                        "SecretKey" => "e3b0e4b8-7670-47b6-8543-47f869ccc90e",
                        "PublicToken" => "117c183e-fc58-4a08-b941-f7911e528f5d", 
                        "DeviceToken" => "7f88764e-f736-48cd-acea-9539fd9b260a",
                        "body" => [
                            "number" => $app->phone,
                            "text" => $dataString
                        ]
                    ]);

                    if(!$whatsapp->error){
                        return response()->json(['message' => 'Success on sending email and whatsapp.'], 200);
                    } else {
                        return response()->json(['message' => 'Failed on sending whatsapp.'], 200);
                    }

                } else {
                    return response()->json(['message' => 'Success on sending email.'], 200);
                }
            } else {
                return response()->json(['message' => 'Failed on sending email.'], 403);
            }
        } else {
            return response()->json(['message' => 'Failed on saving lead.'], 403);
        }       
    }
}
