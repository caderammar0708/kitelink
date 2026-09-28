<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of client users.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');

        $query = User::where('role', 'client')
            ->withCount('bookings');

        if ($status === 'active') {
            $query->where('is_suspended', false);
        } elseif ($status === 'suspended') {
            $query->where('is_suspended', true);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $clients = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('admin/Clients', [
            'clients' => $clients,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'counts' => [
                'total' => User::where('role', 'client')->count(),
                'active' => User::where('role', 'client')->where('is_suspended', false)->count(),
                'suspended' => User::where('role', 'client')->where('is_suspended', true)->count(),
            ],
        ]);
    }

    /**
     * Suspend a client user.
     */
    public function suspend(Request $request, User $user): RedirectResponse
    {
        $admin = $request->user();

        $user->is_suspended = true;
        $user->save();

        AdminAction::record($admin, 'suspend', $user, "Suspended client user account {$user->name}");

        return back()->with('success', "Client {$user->name} has been suspended.");
    }

    /**
     * Reactivate a suspended client user.
     */
    public function reactivate(Request $request, User $user): RedirectResponse
    {
        $admin = $request->user();

        $user->is_suspended = false;
        $user->save();

        AdminAction::record($admin, 'reactivate', $user, "Reactivated client account {$user->name}");

        return back()->with('success', "Client {$user->name} has been reactivated.");
    }

    /**
     * Soft delete a client user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $admin = $request->user();
        $userName = $user->name;

        AdminAction::record($admin, 'delete', $user, "Deleted client account {$userName}");

        $user->delete();

        return back()->with('success', "Client {$userName} was removed.");
    }
}
