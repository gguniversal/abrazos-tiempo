<?php
if (!defined('ABSPATH')) {
    exit;
}

function adt_shortcode() {
    return '<div id="root"></div>';
}
add_shortcode('abrazos_del_tiempo', 'adt_shortcode');

function adt_enqueue_scripts() {
    if (is_singular() && has_shortcode(get_post()->post_content, 'abrazos_del_tiempo')) {
        $plugin_url = plugin_dir_url(__FILE__);

        wp_enqueue_style('adt-styles', $plugin_url . '../assets/css/index.css');
        wp_enqueue_script('adt-script', $plugin_url . '../assets/js/index.js', array(), '1.0', true);

        wp_localize_script('adt-script', 'adt_ajax', array(
            'api_url' => get_rest_url(null, 'abrazos-del-tiempo/v1/generate-image'),
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }
}
add_action('wp_enqueue_scripts', 'adt_enqueue_scripts');
