<?php


drupal_add_js(drupal_get_path('theme', 'usmw') . '/usmw.js', array(
  'type' => 'file',
  'group' => JS_THEME,
));


/*
function usmw_preprocess_page(&$vars)
{
    
    //$vars['footer'] = 'test';
    
    //echo '3421';
    
}
*/


function usmw_form_alter(&$form, &$form_state, $form_id) {
    
  if ($form_id == 'search_block_form') {
   
   $form['actions']['submit']['#value'] = t(''); //hide text
   
   
  }
   
}


?>