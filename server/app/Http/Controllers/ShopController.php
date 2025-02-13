<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Shop;
use App\Models\Review;
use App\Models\ShopImage;

class ShopController extends Controller
{
    public function index()
    {
        $status = request('status');

        // $shops = Shop::all();
        $shops = Shop::with('reviews')->get();

        // 新着のレビューを取得
        $newReviews = Review::with('shop', 'user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Home', [
            'shops' => $shops,
            'newReviews' => $newReviews,
            'status' => $status,
        ]);
    }

    public function detail($id)
    {
        $shop = Shop::with('shopImages')->findOrFail($id);

        // クエリパラメーターからステータスを取得
        $status = request('status');

        // レビューを取得
        $reviews = Review::with('user')
            ->where('shop_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Shop/Detail', [
            'shop' => $shop,
            'reviews' => $reviews,
            'status' => $status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Shop/Create');
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return to_route('login');
        }
        
        $status = 'error';
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string',
            'description' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $shopModel = new Shop();
    
            $shop = $shopModel->saveShop([
                'name' => $request->name,
                'location' => $request->location,
                'description' => $request->description,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
            
            if ($request->file('images')) {
                $images = $request->file('images');
                foreach ($images as $image)
                    // 拡張子を取得
                    $extension = $image->getClientOriginalExtension();
                    $random = Str::random(16);
                    $fileName= $shop->id . '_' . $random . '.' . $extension;
                    $shopImageModel = new ShopImage();
                    $shopImageModel->saveImage([
                        'shop_id' => $shop->id,
                        'file_name' => $fileName,
                        'file_path' => 'storage/shop_images/' . $fileName,
                        'file_type' => $image->getClientMimeType(),
                        'file_size' => $image->getSize(),
                        'file_extension' => $extension,
                        'file_mime' => $image->getClientMimeType(),
                        'file_original_name' => $image->getClientOriginalName(),
                        'file_original_path' => $image->getPathname(),
                    ]);
                    $image->storeAs('public/shop_images', $fileName);
                }
                DB::commit();
                if ($shop) {
                    $status = 'shop_created';
                }
        } catch(\Exception $e) {
            $message = $e->getMessage();
            Log::error($message);
            DB::rollBack();
            throw $e;
        }

        return to_route('shop.index', [
            'status' => $status,
        ]);
    }

    public function edit($id)
    {
        $shop = Shop::with('shopImages')->findOrFail($id);

        return Inertia::render('Shop/Edit', [
            'shop' => $shop,
        ]);
    }

    public function update(Request $request)
    {
        $status = 'error';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string',
            'description' => 'required|string',
        ]);

        
        DB::beginTransaction();
        try {
            $shopModel = new Shop();
            $shop = $shopModel->updateShop([
                'id' => $request->id,
                'name' => $request->name,
                'location' => $request->location,
                'description' => $request->description,
                'updated_by' => Auth::id(),
            ]);
            if ($request->existingImages) {
                $existingImages = $request->existingImages;
                $existingImageIds = array_column($existingImages, 'id');
                $arrayShopImageIds = DB::table('shop_images')->where('shop_id', $shop->id)->get(['id'])->toArray();
                $shopImageIds = array_column($arrayShopImageIds, 'id');
                $deleteImageIds = array_diff($shopImageIds, $existingImageIds);

                if (count($deleteImageIds) > 0) {
                    DB::table('shop_images')->whereIn('id', $deleteImageIds)->delete();
                }
            }
    
            if ($request->file('images')) {
                $images = $request->file('images');
                foreach ($images as $image) {
                    $extension = $image->getClientOriginalExtension();
                    $random = Str::random(16);
                    $fileName = $shop->id . '_' . $random . '.' . $extension;
                    $shopImageModel = new ShopImage();
                    $shopImageModel->saveImage([
                        'shop_id' => $shop->id,
                        'file_name' => $fileName,
                        'file_path' => 'storage/shop_images/' . $fileName,
                        'file_type' => $image->getClientMimeType(),
                        'file_size' => $image->getSize(),
                        'file_extension' => $extension,
                        'file_mime' => $image->getClientMimeType(),
                        'file_original_name' => $image->getClientOriginalName(),
                        'file_original_path' => $image->getPathname(),
                    ]);
                    $image->storeAs('public/shop_images', $fileName);
                }
            }
            DB::commit();
            $status = 'shop_updated';
        } catch(\Exception $e) {
            $message = $e->getMessage();
            Log::error($message);
            DB::rollBack();
            throw $e;
        }

        return to_route('shop.index', [
            'id' => $shop->id,
            'status' => $status,
        ]);
    }

    public function destroy($id)
    {
        $status = 'error';

        $shop = Shop::findOrFail($id);

        DB::beginTransaction();
        try {
            $shop->delete();
            $shopImageIds = ShopImage::where('shop_id', $id)->get(['id']);
            if ($shopImageIds->count() > 0) {
                $shopImageIds = $shopImageIds->toArray();
                $shopImageIds = array_column($shopImageIds, 'id');
            }
            DB::whereIn($shopImages)->delete();
            DB::commit();
            $status = 'shop_deleted';
        } catch(\Exception $e) {
            $message = $e->getMessage();
            Log::error($message);
            DB::rollBack();
            throw $e;
        }

        return to_route('shop.index', [
            'status' => $status,
        ]);
    }

}
