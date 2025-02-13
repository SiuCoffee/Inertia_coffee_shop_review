FROM php:8.3-fpm

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN apt-get update && apt-get install -y \
    gcc make git unzip curl gnupg openssl \
    libpng-dev libjpeg-dev libfreetype6-dev nodejs npm \
    && docker-php-ext-install pdo_mysql mysqli opcache \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY docker/server/php.ini /usr/local/etc/php/

EXPOSE 9000

CMD ["php-fpm"]
