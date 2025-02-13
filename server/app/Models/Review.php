<?php

namespace App\Models;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'user_id',
        'rating',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function saveReview($data)
    {
        $this->shop_id = $data['shop_id'];
        $this->user_id = $data['user_id'];
        $this->rating = $data['rating'];
        $this->comment = $data['comment'];
        $this->save();

        return $this;
    }

    public function updateReview(Request $request)
    {
        $review = $this->findOrFail($request->review_id);
        $review->rating = $request->rating;
        $review->comment = $request->comment;
        $review->save();

        return $review;
    }
}
