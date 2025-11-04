<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('abrazos-del-tiempo/v1', '/generate-image', array(
        'methods' => 'POST',
        'callback' => 'adt_generate_image',
        'permission_callback' => function ($request) {
            return wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest');
        }
    ));
});

function adt_generate_image($request) {
    $params = $request->get_json_params();
    if (empty($params['old_photo']) || empty($params['recent_photo'])) {
        return new WP_Error('missing_params', 'Faltan imágenes.', array('status' => 400));
    }

    $api_key = get_option('adt_gemini_api_key');
    if (!$api_key) {
        return new WP_Error('no_api_key', 'La clave de API no está configurada.', array('status' => 500));
    }

    $name = isset($params['name']) ? sanitize_text_field($params['name']) : '';
    $old_photo = $params['old_photo'];
    $recent_photo = $params['recent_photo'];

    $prompt = "Tarea: Crea una imagen fotorrealista fusionando dos fotografías proporcionadas.
    Foto 1 (antigua): Una foto de una persona cuando era niño/a.
    Foto 2 (reciente): Una foto de la misma persona de adulto/a.
    Instrucciones:
    1. Coloca de manera realista al adulto de la Foto 2 abrazando tiernamente al niño/a de la Foto 1 en una única escena unificada.
    2. La interacción debe parecer natural, afectuosa y con resonancia emocional.
    3. Reemplaza por completo los fondos originales con un nuevo fondo de un suave degradado azul.
    4. Aplica una iluminación natural y cálida a la escena para unificar a ambos sujetos y crear una atmósfera nostálgica.
    5. La salida debe ser una única imagen en formato PNG.";

    if (!empty($name)) {
        $prompt .= "\n6. En la parte inferior central de la imagen final, agrega el texto '" . $name . "' con una fuente elegante y legible que complemente la imagen.";
    } else {
        $prompt .= "\n6. NO agregues ningún texto a la imagen. La imagen final debe estar limpia de cualquier texto, nombre o palabra.";
    }

    $prompt .= "\n7. Asegúrate de que la composición final sea única y artística, evocando nostalgia y amor propio. Evita la apariencia de un simple 'copiar y pegar'; integra a los sujetos de forma fluida y coherente. El resultado debe ser siempre aleatorio y emotivo.";


    $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=' . $api_key;

    $body = array(
        'contents' => array(
            'parts' => array(
                array('inline_data' => array('mime_type' => $old_photo['mimeType'], 'data' => $old_photo['data'])),
                array('inline_data' => array('mime_type' => $recent_photo['mimeType'], 'data' => $recent_photo['data'])),
                array('text' => $prompt)
            )
        )
    );

    $response = wp_remote_post($api_url, array(
        'method'    => 'POST',
        'headers'   => array('Content-Type' => 'application/json'),
        'body'      => json_encode($body),
        'timeout'   => 60,
    ));

    if (is_wp_error($response)) {
        return new WP_Error('api_error', 'Error de comunicación con la API.', array('status' => 500));
    }

    $response_body = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($response_body['candidates'][0]['content']['parts'][0]['inlineData']['data'])) {
        $image_data = $response_body['candidates'][0]['content']['parts'][0]['inlineData']['data'];
        return new WP_REST_Response(array('success' => true, 'imageData' => $image_data), 200);
    } else {
        return new WP_Error('generation_error', 'No se pudo generar la imagen.', array('status' => 500, 'response' => $response_body));
    }
}
