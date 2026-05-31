<?php

function tatainet_theme_setup() {
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'tatainet_theme_setup');