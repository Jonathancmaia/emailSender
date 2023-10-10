<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class CheckHost
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowedTokens = Config::get('app.whitelist');
        $currentToken = $request->header("Token");

        $allowToken = RateLimiter::attempt(
            'allow-token:'.$currentToken,
            $perMinute = 10,
            function (){}
        );
        
        if ($allowToken){
                Config::set('currentToken', $currentToken);

                if (!array_key_exists(Config::get('currentToken'), $allowedTokens)) {
                    return response()->json(['message' => 'Token ('.Config::get('currentToken').') not authorized.'], 403);
                } else {
                    return $next($request);
                }
        } else {
            return response()->json(['message' => 'Too many requests sents on token ('.$currentToken.')'], 403);
        }
    }
}
