<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\SendMessage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Config;

class MailSender extends Controller
{
    private $data;

    public function __construct(Request $request)
    {
        $this->data = $request;
    }

    public function sendEmail()
    {
        //Send email
        $email = Config::get('app.whitelist')[Config::get('currentHost')][0];

        if (Mail::to($email)->send(new SendMessage($this->data))){

            //if has a phone number, send to whatsapp
            if(isset(Config::get('app.whitelist')[Config::get('currentHost')][1])){
                $phone = Config::get('app.whitelist')[Config::get('currentHost')][1];
                return $phone;
            } else {
                return response()->json(['message' => 'Success on sending email.'], 200);
            }
        } else {
            return response()->json(['message' => 'Failed on sending email.'], 403);
        }
    }
}
