# Arquivo: Dockerfile
# Local: competidora-moderna/backend/Dockerfile

# Usamos uma imagem oficial do PHP 8.2 com FPM (FastCGI Process Manager)
FROM php:8.2-fpm-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /var/www

# Instala dependências do sistema e extensões PHP necessárias para o Laravel
RUN apk add --no-cache \
    build-base \
    mysql-client \
    libxml2-dev \
    oniguruma-dev \
    zlib-dev \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    xml \
    zip

# Instala o Composer (gerenciador de dependências do PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Altera o dono do diretório para o usuário do PHP-FPM para evitar problemas de permissão
RUN chown -R www-data:www-data /var/www

# Expõe a porta 9000 para o Nginx se comunicar com o PHP-FPM
EXPOSE 9000
