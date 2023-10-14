<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;
use App\Models\App;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use App\Http\Controllers\MailSender;

class CheckHost
{
    public function handle(Request $request, Closure $next): Response
    {

        $currentToken = $request->header("Token");

        $allowToken = RateLimiter::attempt(
            'allow-token:'.$currentToken,
            $perMinute = 10,
            function (){}
        );
        
        if ($allowToken){
                Config::set('currentToken', $currentToken);

                $appExists = App::find($currentToken);

                if (!isset($appExists->id)) {
                    return response()->json(['message' => 'Token ('.Config::get('currentToken').') not authorized.'], 403);
                } else {
                    $mailSenderControler = new MailSender();
                    return $mailSenderControler->sendLead($currentToken, $request);
                }
        } else {
            return response()->json(['message' => 'Too many requests sents on token ('.$currentToken.')'], 403);
        }
    }
}
