<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;

class CheckHost
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowedHosts = Config::get('app.whitelist');

        if($request->header("x-forwarded-for") !== null){
            Config::set('currentHost', $request->header("x-forwarded-for"));
        } else {
            Config::set('currentHost', $request->getHost());
        }

        if (!array_key_exists(Config::get('currentHost'), $allowedHosts)) {
            return response()->json(['message' => 'Host ('.Config::get('currentHost').') not authorized.'], 403);
        }

        return $next($request);
    }
}
