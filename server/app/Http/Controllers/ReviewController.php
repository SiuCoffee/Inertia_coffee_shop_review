<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function create($id)
    {
        $shop = Shop::findOrFail($id);

        return Inertia::render('Review/Create', [
            'shop' => $shop,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $status = 'error';

        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string|max:255',
        ]);

        $reviewModel = new Review();
        $review = $reviewModel->saveReview([
            'shop_id' => $request->shop_id,
            'user_id' => $user->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        if($review) {
            $status = 'review_success';
        }

        return redirect()->route('shop.detail', [
            'id' => $request->shop_id,
            'status' => $status,
        ]);
    }

    public function edit($id)
    {
        $review = Review::with('shop')->findOrFail($id);

        return Inertia::render('Review/Edit', [
            'review' => $review,
        ]);
    }

    public function update(Request $request)
    {
        $status = 'error';

        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string|max:255',
        ]);

        $reviewModel = new Review();
        $review = $reviewModel->updateReview($request);

        if ($review) {
            $status = 'review_updated';
        }

        return to_route('shop.detail', [
            'id' => $review->shop_id,
            'status' => $status,
        ]);
    }

    public function destroy($id)
    {
        $status = 'error';

        $review = Review::findOrFail($id);
        if ($review) {
            $review->delete();
            $status = 'review_deleted';
        }

        return to_route('shop.detail', [
            'id' => $review->shop_id,
            'status' => $status,
        ]);
    }
}
