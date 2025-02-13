<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopImage extends Model
{
    protected $fillable = [
        'shop_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'file_extension',
        'file_mime',
        'file_original_name',
        'file_original_path',
        'thumbnail_id',
    ];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function saveImage($data)
    {
        $this->shop_id = $data['shop_id'];
        $this->file_name = $data['file_name'];
        $this->file_path = $data['file_path'];
        $this->file_type = $data['file_type'];
        $this->file_size = $data['file_size'];
        $this->file_extension = $data['file_extension'];
        $this->file_mime = $data['file_mime'];
        $this->file_original_name = $data['file_original_name'];
        $this->file_original_path = $data['file_original_path'];

        $this->save();

        return $this;
    }
}
