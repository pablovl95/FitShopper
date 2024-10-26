<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php

ablancodev_get_categories();

function ablancodev_get_categories() {
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, 'https://tienda.mercadona.es/api/categories/'); 
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
   curl_setopt($ch, CURLOPT_HEADER, 0); 
   $data = curl_exec($ch); 
   curl_close($ch); 

   if ( $data ) {
      $categorias = json_decode($data);
      
      if ( isset($categorias->results) ) {
         echo '<ul>';
         foreach ( $categorias->results as $category ) {
            echo '<li>ID ' . $category->id . ': ' . $category->name . '</li>';

            // Llamamos a dicha categoría para ver si tiene más niveles
            ablancodev_get_category($category->id);
         }
         echo '</ul>';
      }
   }
}

function ablancodev_get_category( $category_id ) {
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, 'https://tienda.mercadona.es/api/categories/' . $category_id); 
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
   curl_setopt($ch, CURLOPT_HEADER, 0); 
   $data = curl_exec($ch); 
   curl_close($ch); 
   if ( $data ) {
      echo '<ul>';
      $category = json_decode($data);
      if ( isset($category->categories) ) {
         foreach ( $category->categories as $cat_info ) {
            echo '<li>ID ' . $cat_info->id . ': ' . $cat_info->name . '</li>';

            // Llamamos a dicha categoría para ver si tiene más niveles
            ablancodev_get_category($cat_info->id);
         }
      }
      echo '</ul>';
   }
}
?>
</body>
</html>