<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AppController;
use App\Http\Controllers\LeadController;
use App\Models\App;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', ['apps' => App::where('user', auth()->user()->id)->get()]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/create-app', [AppController::class, 'create'])->name('create-app');
    Route::get('/edit-app/{id}', [AppController::class, 'edit'])->name('edit-app');
    Route::post('/create-app', [AppController::class, 'save'])->name('save-app');
    Route::post('/alter-app', [AppController::class, 'alter'])->name('alter-app');
    Route::post('/delete-app', [AppController::class, 'delete'])->name('delete-app');
    
    Route::get('/delete-lead/{id}', [LeadController::class, 'delete'])->name('delete-lead');
    Route::post('/step-lead', [LeadController::class, 'step'])->name('step-lead');
});

require __DIR__.'/auth.php';
