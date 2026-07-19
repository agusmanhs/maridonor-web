<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $announcements = Announcement::latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'auth' => [
                'user' => [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role->value,
                ]
            ]
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string', 'in:info,warning,event'],
            'target_audience' => ['required', 'string', 'in:all,donor,staff'],
            'is_pinned' => ['required', 'boolean'],
        ]);

        Announcement::create([
            'author_id' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'target_audience' => $validated['target_audience'],
            'is_pinned' => $validated['is_pinned'],
            'published_at' => now(),
        ]);

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil ditambahkan.');
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string', 'in:info,warning,event'],
            'target_audience' => ['required', 'string', 'in:all,donor,staff'],
            'is_pinned' => ['required', 'boolean'],
        ]);

        $announcement = Announcement::findOrFail($id);
        $announcement->update($validated);

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy($id): RedirectResponse
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil dihapus.');
    }
}
