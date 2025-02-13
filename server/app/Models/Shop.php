<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\ShopImage;
use App\Models\Review;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
        'created_by',
        'updated_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shopImages()
    {
        return $this->hasMany(ShopImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function saveShop($data)
    {
        $this->name = $data['name'];
        $this->location = $data['location'];
        $this->description = $data['description'];
        $this->created_by = $data['created_by'];
        $this->updated_by = $data['updated_by'];
        $this->save();

        return $this;
    }

    public function updateShop($data)
    {
        $shop = $this->findOrFail($data['id']);
        $shop->name = $data['name'];
        $shop->location = $data['location'];
        $shop->description = $data['description'];
        $shop->updated_by = $data['updated_by'];
        $shop->save();

        return $shop;
    }
}
