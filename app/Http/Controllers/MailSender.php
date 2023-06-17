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
    private $host;

    public function __construct(Request $request)
    {
        $this->data = $request;
        $this->host = $request->getHost();
    }

    public function sendEmail()
    {
        
        $email = Config::get('app.whitelist')[$this->host];

        if (Mail::to($email)->send(new SendMessage($this->data))){
            return response()->json(['message' => 'Success.'], 200);
        } else {
            return response()->json(['message' => 'Failed.'], 403);
        }
    }
}