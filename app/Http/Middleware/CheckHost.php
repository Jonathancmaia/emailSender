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

        $currentHost = $request->header('X-Forwarded-Host');

        if (!array_key_exists($currentHost, $allowedHosts)) {
            return response()->json(['message' => 'Host ('.$currentHost.') not authorized.'], 403);
        }

        return $next($request);
    }
}
